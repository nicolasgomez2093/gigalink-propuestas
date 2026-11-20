import {
  RESIDENTIAL_PLANS,
  EQUIPMENT_300_NOTE,
  monthlyQuote,
  formatPrice,
} from "./pricing";
import type { CoverageResult } from "./catalog";
import type { LocatedAddress } from "./geocoding";
export const PLAN_OPTIONS = [
  "Necesito asesoramiento",
  ...RESIDENTIAL_PLANS.map((plan) => plan.requestValue),
  "Empresas y Negocios",
];
export const initialRequest = {
  service: "Internet",
  locality: "San Miguel de Tucumán",
  search: "",
  address: "",
  neighborhood: "",
  property: "Casa",
  floors: "1",
  surface: "",
  currentInternet: "No",
  provider: "",
  problems: [] as string[],
  profile: "Hogar",
  devices: "1 a 5",
  televisions: "1",
  plan: PLAN_OPTIONS[0],
  name: "",
  phone: "",
};
export type ServiceRequest = typeof initialRequest;
export function validLocationQuery(value: string) {
  const query = value.trim();
  return (
    query.length >= 3 &&
    query.length <= 150 &&
    /\p{L}/u.test(query) &&
    !Array.from("<>[]{}%$#").some((symbol) => query.includes(symbol)) &&
    !/[\p{Cc}\u202a-\u202e\u2066-\u2069]/u.test(query) &&
    !/(https?:|www\.)/i.test(query)
  );
}
export function validateStep(
  step: number,
  v: ServiceRequest,
  checked: boolean,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (!validLocationQuery(v.search))
      errors.search = "Ingresá una dirección o un barrio válido.";
    if (!checked)
      errors.search =
        "Consultá la cobertura o elegí continuar con verificación por WhatsApp.";
  }
  if (step === 1) {
    if (!/^\d+$/.test(v.floors) || +v.floors < 1 || +v.floors > 200)
      errors.floors = "Ingresá una cantidad entre 1 y 200.";
    if (v.surface && (!Number.isFinite(+v.surface) || +v.surface <= 0))
      errors.surface = "Ingresá una superficie mayor a cero.";
  }
  if (step === 3) {
    const name = v.name.trim();
    if (
      name.length > 100 ||
      !/^[\p{L}\p{M}]+(?:[ .’'−-][\p{L}\p{M}]+)*\.?$/u.test(name) ||
      !/\p{L}.*\p{L}/u.test(name)
    )
      errors.name = "Ingresá tu nombre y apellido.";
    const validPhone = (p: string) =>
      /^[+\d\s()-]+$/.test(p) &&
      p.replace(/\D/g, "").length >= 8 &&
      p.replace(/\D/g, "").length <= 15 &&
      !/^(\d)\1+$/.test(p.replace(/\D/g, ""));
    if (!validPhone(v.phone))
      errors.phone = "Ingresá un teléfono válido con código de área.";
  }
  return errors;
}
export function whatsappMessage(
  v: ServiceRequest,
  result: CoverageResult,
  location: LocatedAddress | null,
  accuracy?: number,
) {
  const tvOnly = v.service === "Solo TV Digital";
  const quote = monthlyQuote(v);
  const lines = [
    "Hola Giga Link, quiero consultar por una instalación.",
    "",
    "*SERVICIO*",
    `Servicio: ${v.service}`,
    ...(!tvOnly ? [`Plan: ${v.plan}`] : []),
    ...(quote
      ? [
          `Abono mensual de referencia: ${formatPrice(quote.total)} ARS`,
          ...(quote.tv && quote.internet
            ? [
                `Internet: ${formatPrice(quote.internet)} + TV Digital: ${formatPrice(quote.tv)}`,
              ]
            : []),
          `Tarifa para: ${v.locality}`,
          "Instalación y eventuales cambios de equipo: a confirmar con Giga Link.",
          ...(quote.equipment300 ? [EQUIPMENT_300_NOTE] : []),
        ]
      : ["Abono mensual: a confirmar según el plan y las necesidades."]),
    "",
    "*UBICACIÓN*",
    `Localidad: ${v.locality}`,
    ...(v.address.trim()
      ? [`Domicilio: ${v.address.trim()}`]
      : v.neighborhood
        ? ["Calle y altura: a coordinar por WhatsApp"]
        : [
            `Referencia indicada: ${v.search.trim()}`,
            "Calle y altura: a coordinar por WhatsApp",
          ]),
    `Barrio: ${v.neighborhood.trim() || "A verificar"}`,
    `Consulta de cobertura: ${result.title}`,
    `Alcance: ${result.detail}`,
    ...(location
      ? [
          `Ubicación ${["street", "block"].includes(location.precision) ? "aproximada (referencia, no puerta exacta)" : "encontrada"}: ${location.label}`,
          `Mapa: https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
          ...(location.positionSource === "map"
            ? ["Punto de instalación confirmado por la persona en el mapa."]
            : []),
          ...(location.neighborhoodSource === "photon"
            ? ["Barrio estimado a partir de la ubicación con OpenStreetMap."]
            : []),
          ...(accuracy
            ? [
                `Precisión del dispositivo: aproximadamente ${Math.round(accuracy)} m`,
              ]
            : []),
        ]
      : []),
    "",
    "*INMUEBLE*",
    `Tipo: ${v.property}`,
    `Plantas / pisos: ${v.floors}`,
    `Superficie aproximada: ${v.surface ? `${v.surface} m²` : "No indicada"}`,
    `Internet actual: ${v.currentInternet}`,
    ...(v.currentInternet === "Sí"
      ? [
          `Proveedor: ${v.provider.trim() || "No indicado"}`,
          `Problemas: ${v.problems.join(", ") || "Ninguno indicado"}`,
        ]
      : []),
    "",
    "*USO*",
    ...(tvOnly ? [] : [`Perfil: ${v.profile}`, `Dispositivos: ${v.devices}`]),
    ...(v.service !== "Internet" ? [`Televisores: ${v.televisions}`] : []),
    "",
    "*CONTACTO*",
    `Nombre: ${v.name.trim()}`,
    `Teléfono: ${v.phone.trim()}`,
  ];
  return lines.join("\n");
}
