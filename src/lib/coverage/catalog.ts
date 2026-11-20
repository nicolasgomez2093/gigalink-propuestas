// Source: the two coverage screenshots supplied by Giga Link, October 2026.
// Locality overrides: Mercantil = El Manantial; Unión y Progreso = Capital.
// The client confirmed the eastern list covers Banda del Río Salí and Alderetes.
// No per-neighborhood municipal assignment, geographic boundaries or address-level serviceability has been supplied.
export const LOCALITIES = [
  "San Miguel de Tucumán",
  "Banda del Río Salí",
  "El Manantial",
  "Alderetes",
] as const;
export type Locality = (typeof LOCALITIES)[number];
export type Neighborhood = {
  name: string;
  locality: Locality | null;
  aliases?: string[];
  region?: "banda-alderetes";
};
export const EAST_COVERAGE_REGION = {
  label: "Banda del Río Salí y Alderetes",
  localities: ["Banda del Río Salí", "Alderetes"] as readonly Locality[],
};
const capital = [
  "17 de Agosto",
  "2 de Septiembre",
  "2500 Viviendas",
  "72 Viviendas",
  "Alejandro Heredia",
  "Alberdi",
  "Ampliación Elena White",
  "ATE",
  "Autopista Sur",
  "El Salvador",
  "Eucaliptus",
  "Ex Aeropuerto",
  "Juan Pablo I",
  "Lola Mora",
  "Puerto Argentino",
  "San Cayetano",
  "San Martín",
  "Santa Teresita",
  "SEOC",
  "Tiro Federal",
  "Unión y Progreso",
  "Victoria",
  "Sutiaga",
];
const banda = [
  "Zona Centro",
  "23 de Agosto",
  "Santo Cristo",
  "La Milagrosa",
  "Soldado Tucumano",
  "San Miguel",
  "Arcángel",
  "Los Fresnos",
  "260 Viviendas",
  "200 Viviendas",
  "Julio Abraham",
  "San José",
  "Virgen del Rosario",
  "Viluco",
  "La Gaceta",
  "Barrancas del Salí",
  "AGEF",
  "2 de Abril",
  "El Trébol",
  "Nuevo Horizonte",
  "Rosello",
];
export const NEIGHBORHOODS: Neighborhood[] = [
  ...capital.map((name) => ({
    name,
    locality: LOCALITIES[0],
    aliases:
      name === "2500 Viviendas"
        ? ["Manantial Sur", "2.500 Viviendas"]
        : name === "Ampliación Elena White"
          ? ["Amp. Elena White"]
          : name === "Juan Pablo I"
            ? ["Juan Pablo 1"]
            : name === "Eucaliptus"
              ? ["Los Eucaliptus"]
              : undefined,
  })),
  ...banda.map((name) => ({
    name,
    locality: null,
    region: "banda-alderetes" as const,
    aliases: name === "Zona Centro" ? ["Centro"] : undefined,
  })),
  { name: "Mercantil", locality: LOCALITIES[2] },
  { name: "La Tentación", locality: null },
];
export const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(?:barrio|b[º°])\s+/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

function inLocality(neighborhood: Neighborhood, locality: string) {
  if (neighborhood.locality)
    return normalize(neighborhood.locality) === normalize(locality);
  return (
    neighborhood.region === "banda-alderetes" &&
    EAST_COVERAGE_REGION.localities.some(
      (name) => normalize(name) === normalize(locality),
    )
  );
}

export function matchNeighborhood(
  value: string,
  locality?: string,
): Neighborhood | undefined {
  const q = normalize(value);
  if (!q) return undefined;
  return NEIGHBORHOODS.find(
    (n) =>
      (!locality || inLocality(n, locality)) &&
      [n.name, ...(n.aliases || [])].some((name) => normalize(name) === q),
  );
}
export function suggestNeighborhoods(value: string, locality?: string) {
  const q = normalize(value);
  return NEIGHBORHOODS.filter(
    (n) =>
      (!locality || (!n.locality && !n.region) || inLocality(n, locality)) &&
      [n.name, ...(n.aliases || [])].some((name) =>
        normalize(name).includes(q),
      ),
  );
}
export type CoverageResult = {
  status: "neighborhood" | "review";
  title: string;
  detail: string;
  neighborhood?: string;
};
export function neighborhoodCoverage(
  value: string,
  locality?: string,
): CoverageResult {
  const match = matchNeighborhood(value, locality);
  if (match && (match.locality || match.region))
    return {
      status: "neighborhood",
      neighborhood: match.name,
      title: `Llegamos a ${match.name}`,
      detail: match.region
        ? `Este barrio figura en el listado de cobertura de ${EAST_COVERAGE_REGION.label}. Confirmaremos la localidad y la disponibilidad de instalación para tu domicilio por WhatsApp.`
        : "Tenemos cobertura de fibra y TV Digital en este barrio. Confirmaremos disponibilidad de instalación en tu domicilio por WhatsApp.",
    };
  return {
    status: "review",
    neighborhood: match?.name,
    title: "Verifiquemos tu domicilio",
    detail:
      "Todavía no podemos confirmar cobertura en esta ubicación. Continuá con tu consulta para que nuestro equipo la revise.",
  };
}
