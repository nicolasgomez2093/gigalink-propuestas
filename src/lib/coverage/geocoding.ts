import {
  googleMapsConfigured,
  googleSearch,
  googleReverse,
} from "./google-geocoding";
import {
  parseAddressQuery,
  sameStreet,
  sameNumberedBlock,
} from "./address-matching";
import {
  LOCALITIES,
  neighborhoodCoverage,
  normalize,
  type CoverageResult,
  type Locality,
} from "./catalog";

export type LocatedAddress = {
  label: string;
  latitude: number;
  longitude: number;
  locality: string;
  neighborhood: string;
  street: string;
  number: string;
  precision?: "address" | "block" | "street" | "neighborhood" | "point";
  source?: "google" | "photon";
  neighborhoodSource?: "photon";
  placeId?: string;
  positionSource?: "search" | "gps" | "map";
};
type Feature = {
  geometry?: { coordinates?: number[] };
  properties?: Record<string, string>;
};
// The public Photon service permits moderate use, with no uptime guarantee.
// Requests happen only on explicit actions; local suggestions never call the API.
// Override this endpoint with a hosted Photon instance for higher traffic.
const endpoint = (
  import.meta.env.VITE_GEOCODING_URL || "https://photon.komoot.io"
).replace(/\/$/, "");
const cache = new Map<string, LocatedAddress[]>();
let pending: Promise<unknown> = Promise.resolve();
let lastRequest = 0;
const inTucuman = (lat: number, lon: number) =>
  lat >= -28 && lat <= -26 && lon >= -66.3 && lon <= -64.4;

function parseFeature(feature: Feature): LocatedAddress | null {
  const [longitude, latitude] = feature.geometry?.coordinates || [];
  const p = feature.properties || {};
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !inTucuman(latitude, longitude) ||
    p.countrycode?.toUpperCase() !== "AR"
  )
    return null;
  const street = p.street || (p.osm_key === "highway" ? p.name : "") || "";
  const neighborhood =
    p.locality ||
    p.district ||
    p.suburb ||
    (p.osm_key === "place" &&
    ["neighbourhood", "suburb", "quarter"].includes(p.osm_value)
      ? p.name
      : "") ||
    "";
  const locality = p.city || p.town || p.village || "";
  const label = [
    ...new Set(
      [
        street ? `${street} ${p.housenumber || ""}`.trim() : p.name,
        neighborhood,
        locality,
        p.state,
      ].filter(Boolean),
    ),
  ].join(", ");
  return {
    label,
    latitude,
    longitude,
    locality,
    neighborhood,
    street,
    number: p.housenumber || "",
    source: "photon",
    precision: street ? (p.housenumber ? "address" : "street") : "neighborhood",
  };
}
async function request(
  path: string,
  params: Record<string, string>,
): Promise<LocatedAddress[]> {
  const url = `${endpoint}/${path}?${new URLSearchParams(params)}`;
  if (cache.has(url)) return cache.get(url)!;
  const job = pending
    .catch(() => undefined)
    .then(async () => {
      if (cache.has(url)) return cache.get(url)!;
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(0, 1200 - (Date.now() - lastRequest))),
      );
      lastRequest = Date.now();
      const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!response.ok)
        throw new Error(
          "El buscador de direcciones no está disponible. Podés completar tu dirección manualmente y continuar.",
        );
      const data = await response.json();
      if (!Array.isArray(data.features))
        throw new Error(
          "No pudimos interpretar la dirección. Podés ingresarla manualmente.",
        );
      const addresses = data.features
        .map(parseFeature)
        .filter((a: LocatedAddress | null): a is LocatedAddress => !!a);
      cache.set(url, addresses);
      return addresses;
    });
  pending = job;
  return job;
}
export async function searchAddress(
  query: string,
  locality: Locality,
): Promise<LocatedAddress[]> {
  const parsed = parseAddressQuery(query);
  const params = {
    limit: "10",
    bbox: "-66.3,-28,-64.4,-26",
    lat: "-26.83",
    lon: "-65.2",
  };
  const lookup = (text: string) =>
    googleMapsConfigured
      ? googleSearch(text, locality)
      : request("api/", {
          ...params,
          q: `${text}, ${locality}, Tucumán, Argentina`,
        });
  if (googleMapsConfigured) {
    // Google resolves abbreviations and alternate street names. Return its local
    // candidates for explicit confirmation instead of applying exact text equality.
    const candidates = await lookup(parsed.query);
    return candidates.filter(
      (address, i, all) =>
        all.findIndex((other) => other.label === address.label) === i,
    );
  }
  const isLocal = (address: LocatedAddress) =>
    normalize(address.locality) === normalize(locality);
  const found = (await lookup(parsed.query)).filter(isLocal);
  const matchingStreet = found.filter((address) =>
    sameStreet(parsed.street, address.street),
  );
  if (!parsed.number) {
    // A neighborhood query can also resolve to a named place without a street.
    return matchingStreet.length
      ? matchingStreet
      : found.filter(
          (address) =>
            !address.street &&
            normalize(address.neighborhood) === normalize(parsed.query),
        );
  }
  const exact = matchingStreet.filter(
    (address) => normalize(address.number) === normalize(parsed.number),
  );
  if (exact.length) {
    const unique = exact.filter(
      (address, i, all) =>
        all.findIndex((other) => other.label === address.label) === i,
    );
    return Promise.all(unique.map(enrichGoogleNeighborhood));
  }
  // A numbered reference on the same street and in the same municipality can
  // identify the requested block, without claiming to locate the exact door.
  const blockReferences = matchingStreet.filter(
    (address) =>
      address.precision !== "street" &&
      sameNumberedBlock(parsed.number, address.number),
  );
  if (blockReferences.length)
    return Promise.all(
      blockReferences.map((address) =>
        enrichGoogleNeighborhood({ ...address, precision: "block" as const }),
      ),
    );
  // Never suggest a different street or silently replace the house number.
  const streets = matchingStreet.filter((address) => !address.number);
  const fallback = streets.length
    ? streets
    : (await lookup(parsed.street)).filter(
        (address) =>
          isLocal(address) && sameStreet(parsed.street, address.street),
      );
  return fallback
    .map((address) => ({
      ...address,
      number: "",
      precision: "street" as const,
      neighborhood: "",
      label: `${address.street}, ${address.locality} · ubicación aproximada de la calle`,
    }))
    .filter(
      (address, i, all) =>
        all.findIndex((other) => sameStreet(other.street, address.street)) ===
        i,
    );
}
// Google may locate the street number without naming a neighborhood. In that
// case ask OSM at that point, preserving Google's address and coordinates. Never
// infer a neighborhood from the center of a whole street or from a distant POI.
async function enrichGoogleNeighborhood(
  address: LocatedAddress,
): Promise<LocatedAddress> {
  if (
    address.source !== "google" ||
    address.neighborhood ||
    !["address", "block", "point"].includes(address.precision)
  )
    return address;
  try {
    const candidates = await request("reverse", {
      lat: String(address.latitude),
      lon: String(address.longitude),
      limit: "1",
    });
    const nearby = candidates[0];
    if (
      !nearby?.neighborhood ||
      normalize(nearby.locality) !== normalize(address.locality)
    )
      return address;
    const latDiff = (nearby.latitude - address.latitude) * 111320;
    const lonDiff =
      (nearby.longitude - address.longitude) *
      111320 *
      Math.cos((address.latitude * Math.PI) / 180);
    if (Math.hypot(latDiff, lonDiff) > 200) return address;
    return {
      ...address,
      neighborhood: nearby.neighborhood,
      neighborhoodSource: "photon",
    };
  } catch {
    // A supplemental neighborhood lookup cannot discard an address Google found.
    return address;
  }
}
export function reverseAddress(latitude: number, longitude: number) {
  if (!inTucuman(latitude, longitude)) return Promise.resolve([]);
  if (googleMapsConfigured)
    return googleReverse(latitude, longitude).then(async (addresses) => {
      if (!addresses.length) return [];
      const first = await enrichGoogleNeighborhood(addresses[0]);
      return [first, ...addresses.slice(1)];
    });
  return request("reverse", {
    lat: String(latitude),
    lon: String(longitude),
    limit: "1",
  });
}
export function detectedLocality(
  address: LocatedAddress,
): Locality | undefined {
  return LOCALITIES.find((l) => normalize(l) === normalize(address.locality));
}
export function locatedCoverage(address: LocatedAddress): CoverageResult {
  if (address.precision === "street")
    return {
      status: "review",
      title: "Encontramos la calle; falta ubicar la altura",
      detail:
        "La ubicación de la calle es aproximada. Conservamos tu domicilio para que Giga Link confirme cobertura en esa altura.",
    };
  const locality = detectedLocality(address);
  // Never assume the selected municipality is the one returned by the geocoder.
  const coverage =
    locality && address.neighborhood
      ? neighborhoodCoverage(address.neighborhood, locality)
      : neighborhoodCoverage("");
  if (
    ["block", "point"].includes(address.precision) &&
    coverage.status === "neighborhood"
  )
    return {
      ...coverage,
      title: "Cobertura disponible en tu zona",
      detail:
        address.precision === "point"
          ? `Identificamos ${coverage.neighborhood} en la ubicación que confirmaste. Tenemos fibra y TV Digital en este barrio; confirmaremos los detalles de instalación por WhatsApp.`
          : `Ubicamos una referencia de tu cuadra en ${coverage.neighborhood}, donde tenemos fibra y TV Digital. La ubicación es aproximada; confirmaremos los detalles de instalación por WhatsApp.`,
    };
  return coverage;
}
