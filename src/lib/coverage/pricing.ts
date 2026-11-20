import { normalize } from "./catalog";

// Residential rates supplied by Giga Link on 22 October 2026, in ARS per month.
export const TV_MONTHLY_PRICE = 15000;
export const EQUIPMENT_300_NOTE =
  "Los 300 Mbps requieren un módem compatible. En instalaciones nuevas se instala un equipo compatible. Si ya sos cliente de Giga Link y tu equipo solo tiene Wi-Fi de 2,4 GHz, debe cambiarse por uno de doble banda. El cambio tiene costo; consultá su valor.";
export const RESIDENTIAL_PLANS = [
  {
    name: "Plan 50",
    speed: "50 Mbps",
    requestValue: "Plan 50 - 50 Mbps",
    general: 18000,
    east: 18000,
    popular: false,
    ideal: "Series en HD y navegación para toda la familia",
  },
  {
    name: "Plan 100",
    speed: "100 Mbps",
    requestValue: "Plan 100 - 100 Mbps",
    general: 22000,
    east: 20000,
    popular: true,
    ideal: "Videos en 4K, trabajo desde casa y varios dispositivos",
  },
  {
    name: "Plan 300",
    speed: "300 Mbps",
    requestValue: "Plan 300 - 300 Mbps",
    general: 25000,
    east: 23000,
    popular: false,
    ideal: "Juegos online, descargas y múltiples usuarios",
  },
] as const;
export function formatPrice(amount: number) {
  return `$${amount.toLocaleString("es-AR")}`;
}
export function pricingZone(locality: string): "general" | "east" | undefined {
  const normalized = normalize(locality);
  if (
    ["Banda del Río Salí", "Alderetes"].some(
      (name) => normalize(name) === normalized,
    )
  )
    return "east";
  if (
    ["San Miguel de Tucumán", "El Manantial"].some(
      (name) => normalize(name) === normalized,
    )
  )
    return "general";
  return undefined;
}
export function monthlyQuote({
  service,
  plan,
  locality,
}: {
  service: string;
  plan: string;
  locality: string;
}) {
  if (service === "Solo TV Digital")
    return {
      internet: 0,
      tv: TV_MONTHLY_PRICE,
      total: TV_MONTHLY_PRICE,
      equipment300: false,
    };
  if (service !== "Internet" && service !== "Internet + TV Digital")
    return null;
  const residential = RESIDENTIAL_PLANS.find(
    (option) => option.requestValue === plan,
  );
  const zone = pricingZone(locality);
  if (!residential || !zone) return null;
  const internet = residential[zone];
  const tv = service === "Internet + TV Digital" ? TV_MONTHLY_PRICE : 0;
  return {
    internet,
    tv,
    total: internet + tv,
    equipment300: residential.name === "Plan 300",
  };
}
