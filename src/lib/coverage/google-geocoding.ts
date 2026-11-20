import { parseAddressQuery } from "./address-matching";
import type { Locality } from "./catalog";
import type { LocatedAddress } from "./geocoding";

// The demo key supports the v4 REST API. Do not load the legacy JS Geocoder.
export const googleMapsConfigured =
  import.meta.env.VITE_GEOCODING_PROVIDER !== "photon" &&
  !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
type Component = { longText: string; shortText?: string; types: string[] };
export type GoogleResult = {
  formattedAddress: string;
  placeId?: string;
  addressComponents?: Component[];
  location: { latitude: number; longitude: number };
  granularity: string;
  postalAddress?: { locality?: string };
};
export class GoogleGeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleGeocodingError";
  }
}
export function parseGoogleResult(result: GoogleResult): LocatedAddress | null {
  const components = result.addressComponents || [];
  const component = (...types: string[]) => {
    for (const type of types) {
      const match = components.find((c) => c.types.includes(type));
      if (match) return match.longText;
    }
    return "";
  };
  const country = components.find((c) =>
    c.types.includes("country"),
  )?.shortText;
  const { latitude, longitude } = result.location || {};
  if (
    country !== "AR" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -28 ||
    latitude > -26 ||
    longitude < -66.3 ||
    longitude > -64.4
  )
    return null;
  const street = component("route");
  const number = component("street_number");
  const type = result.granularity;
  const precision = !street
    ? "neighborhood"
    : !number || !["ROOFTOP", "RANGE_INTERPOLATED"].includes(type)
      ? "street"
      : type === "RANGE_INTERPOLATED"
        ? "block"
        : "address";
  return {
    label: result.formattedAddress,
    latitude,
    longitude,
    locality:
      component("locality", "postal_town", "administrative_area_level_3") ||
      result.postalAddress?.locality ||
      "",
    neighborhood: component(
      "neighborhood",
      "sublocality_level_1",
      "sublocality",
    ),
    street,
    number,
    precision,
    source: "google",
    placeId: result.placeId,
  };
}
async function geocode(
  path: string,
  signal?: AbortSignal,
): Promise<LocatedAddress[]> {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
  if (!key)
    throw new GoogleGeocodingError(
      "Falta configurar la búsqueda de Google Maps. Podés continuar por WhatsApp.",
    );
  let response: Response;
  try {
    response = await fetch(
      `https://geocode.googleapis.com/v4/geocode/${path}?languageCode=es&regionCode=AR`,
      {
        headers: { "X-Goog-Api-Key": key },
        signal: signal
          ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
          : AbortSignal.timeout(15000),
      },
    );
  } catch {
    throw new GoogleGeocodingError(
      "No pudimos conectar con Google Maps. Intentá nuevamente o continuá por WhatsApp.",
    );
  }
  if (!response.ok) {
    if (response.status === 429)
      throw new GoogleGeocodingError(
        "El buscador alcanzó su límite de consultas. Podés continuar por WhatsApp.",
      );
    if ([401, 403].includes(response.status))
      throw new GoogleGeocodingError(
        "Google Maps no autorizó la consulta. Podés continuar por WhatsApp mientras revisamos la configuración.",
      );
    throw new GoogleGeocodingError(
      "Google Maps no pudo completar la búsqueda. Intentá nuevamente o continuá por WhatsApp.",
    );
  }
  const data = await response.json();
  if (data.results !== undefined && !Array.isArray(data.results))
    throw new GoogleGeocodingError(
      "No pudimos interpretar la dirección. Podés continuar por WhatsApp.",
    );
  return (data.results || [])
    .map(parseGoogleResult)
    .filter(
      (address: LocatedAddress | null): address is LocatedAddress => !!address,
    );
}
export function googleSearch(
  query: string,
  locality: Locality,
  signal?: AbortSignal,
) {
  return geocode(
    `address/${encodeURIComponent(`${query}, ${locality}, Tucumán, Argentina`)}`,
    signal,
  );
}
export function googleReverse(latitude: number, longitude: number) {
  return geocode(`location/${latitude},${longitude}`);
}

export type AddressPrediction = {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
  sessionToken: string;
  resolvedAddress?: LocatedAddress;
};
export async function googleAddressSuggestions(
  input: string,
  locality: string,
  sessionToken: string,
  signal?: AbortSignal,
): Promise<AddressPrediction[]> {
  // Numeric addresses also use geocoding: it often recognizes abbreviations
  // that Places predictions omit. Both return place IDs, never string guesses.
  const resolvedPromise = parseAddressQuery(input).number
    ? googleSearch(input, locality as Locality, signal).catch(() => [])
    : Promise.resolve([] as LocatedAddress[]);
  const responsePromise = fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY.trim(),
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({
        input: `${input}, ${locality}, Tucumán`,
        sessionToken,
        languageCode: "es",
        includedRegionCodes: ["ar"],
        locationRestriction: {
          rectangle: {
            low: { latitude: -26.98, longitude: -65.45 },
            high: { latitude: -26.65, longitude: -65.05 },
          },
        },
      }),
      signal: signal
        ? AbortSignal.any([signal, AbortSignal.timeout(12000)])
        : AbortSignal.timeout(12000),
    },
  );
  const [response, resolved] = await Promise.all([
    responsePromise.catch(() => null),
    resolvedPromise,
  ]);
  const direct: AddressPrediction[] = resolved
    .filter((address) => address.placeId && address.street && address.number)
    .slice(0, 2)
    .map((address) => ({
      placeId: address.placeId!,
      text: address.label,
      mainText: `${address.street} ${address.number}`,
      secondaryText: `${address.locality}, Tucumán, Argentina`,
      sessionToken,
      resolvedAddress: address,
    }));
  if (!response?.ok) {
    if (direct.length) return direct;
    throw new GoogleGeocodingError(
      response?.status === 429
        ? "El buscador alcanzó su límite. Podés continuar con una revisión por WhatsApp."
        : "No pudimos cargar las sugerencias. Podés buscar otra vez o pedir una revisión por WhatsApp.",
    );
  }
  const data = await response.json();
  const predicted: AddressPrediction[] = (
    Array.isArray(data.suggestions) ? data.suggestions : []
  ).flatMap(
    (suggestion: {
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      };
    }) => {
      const p = suggestion.placePrediction;
      return p?.placeId && p.text?.text
        ? [
            {
              placeId: p.placeId,
              text: p.text.text,
              mainText: p.structuredFormat?.mainText?.text || p.text.text,
              secondaryText: p.structuredFormat?.secondaryText?.text || "",
              sessionToken,
            },
          ]
        : [];
    },
  );
  return [...direct, ...predicted]
    .filter(
      (option, i, all) =>
        all.findIndex((other) => other.placeId === option.placeId) === i,
    )
    .slice(0, 5);
}
export async function googleSelectedAddress(
  prediction: AddressPrediction,
): Promise<LocatedAddress | null> {
  if (prediction.resolvedAddress?.placeId === prediction.placeId)
    return prediction.resolvedAddress;
  const params = new URLSearchParams({
    languageCode: "es",
    regionCode: "AR",
    sessionToken: prediction.sessionToken,
  });
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(prediction.placeId)}?${params}`,
    {
      headers: {
        "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY.trim(),
        "X-Goog-FieldMask": "id,formattedAddress,addressComponents,location",
      },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new GoogleGeocodingError(
      "No pudimos abrir la dirección elegida. Intentá nuevamente o pedí una revisión por WhatsApp.",
    );
  const place = await response.json();
  const address = parseGoogleResult({ ...place, granularity: "APPROXIMATE" });
  return address
    ? {
        ...address,
        precision:
          address.street && address.number ? "point" : address.precision,
        placeId: prediction.placeId,
      }
    : null;
}
