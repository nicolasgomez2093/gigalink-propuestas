import { normalize } from "./catalog";

export function parseAddressQuery(query: string) {
  const address = query
    .split(",")[0]
    .trim()
    .replace(/^(?:calle|avenida|av\.?|pasaje|pje\.?)\s+/i, "")
    .trim();
  const match = address.match(/^(.+?)\s+(?:n[º°.]?\s*)?(\d+[a-z]?)$/i);
  return {
    query: address,
    street: match ? match[1].trim() : address,
    number: match?.[2] || "",
  };
}
function streetKey(value: string) {
  return normalize(
    value.replace(/^(?:calle|avenida|av\.?|pasaje|pje\.?)\s+/i, ""),
  );
}
export function sameStreet(query: string, street: string) {
  return !!streetKey(street) && streetKey(query) === streetKey(street);
}

// The client accepts a nearby reference within the same numbered block.
// Street and municipality must be checked separately before applying this rule.
export function sameNumberedBlock(requested: string, reference: string) {
  if (!/^\d+$/.test(requested) || !/^\d+$/.test(reference)) return false;
  const target = Number(requested),
    other = Number(reference);
  return (
    target > 0 &&
    other > 0 &&
    Math.floor(target / 100) === Math.floor(other / 100)
  );
}
