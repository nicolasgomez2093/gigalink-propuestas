import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { validLocationQuery } from "@/lib/coverage/request";
import {
  googleAddressSuggestions,
  type AddressPrediction,
} from "@/lib/coverage/google-geocoding";

type Props = {
  value: string;
  locality: string;
  disabled: boolean;
  invalid: boolean;
  describedBy: string;
  onChange: (value: string) => void;
  onSelect: (prediction: AddressPrediction) => void;
  onSearch: () => void;
};
export default function AddressAutocomplete({
  value,
  locality,
  disabled,
  invalid,
  describedBy,
  onChange,
  onSelect,
  onSearch,
}: Props) {
  const listId = useId();
  const [options, setOptions] = useState<AddressPrediction[]>([]);
  const [active, setActive] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const session = useRef("");
  const container = useRef<HTMLDivElement>(null);
  const isOpen =
    focused &&
    !disabled &&
    (loading || !!error || options.length > 0 || searched);
  useEffect(() => {
    if (!validLocationQuery(value) || !focused || disabled) {
      setLoading(false);
      setError("");
      setOptions([]);
      setSearched(false);
      return;
    }
    const controller = new AbortController();
    setOptions([]);
    setError("");
    setSearched(false);
    setActive(-1);
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        session.current ||= crypto.randomUUID();
        const found = await googleAddressSuggestions(
          value.trim(),
          locality,
          session.current,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setOptions(found);
          setSearched(true);
        }
      } catch (error) {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "No pudimos cargar las sugerencias.",
          );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, locality, focused, disabled]);
  useEffect(() => {
    session.current = "";
  }, [locality]);
  function choose(option: AddressPrediction) {
    setFocused(false);
    setOptions([]);
    session.current = "";
    container.current?.querySelector("input")?.blur();
    onSelect(option);
  }
  return (
    <div
      ref={container}
      className="relative min-w-0 flex-1"
      onBlur={(event) => {
        if (!container.current?.contains(event.relatedTarget as Node))
          setFocused(false);
      }}
    >
      <Input
        id="request-search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-activedescendant={
          active >= 0 && isOpen ? `${listId}-${active}` : undefined
        }
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="min-h-11 pr-9"
        value={value}
        onChange={(e) => {
          setFocused(true);
          onChange(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        placeholder="Ej.: Rivadavia 150 o Gral. Paz 500"
        maxLength={150}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => (options.length ? (i + 1) % options.length : -1));
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) =>
              options.length ? (i <= 0 ? options.length - 1 : i - 1) : -1,
            );
          }
          if (e.key === "Escape") {
            e.preventDefault();
            setFocused(false);
          }
          if (e.key === "Enter") {
            e.preventDefault();
            if (disabled) return;
            if (active >= 0 && options[active]) choose(options[active]);
            else {
              setFocused(false);
              onSearch();
            }
          }
        }}
      />
      {loading && focused && !disabled && (
        <Loader2
          aria-hidden
          className="absolute right-3 top-3 h-4 w-4 animate-spin text-brand-blue"
        />
      )}
      {isOpen && (
        <div className="relative left-0 right-0 top-full z-30 mt-2 sm:absolute overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {loading && (
            <p role="status" className="p-3 text-sm text-gray-500">
              Buscando direcciones…
            </p>
          )}
          {!!options.length && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Direcciones sugeridas"
              className="max-h-72 overflow-y-auto"
            >
              {options.map((option, i) => (
                <li
                  key={option.placeId}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={active === i}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setActive(i)}
                  className={`flex min-h-14 w-full cursor-pointer gap-3 p-3 text-left transition-colors ${active === i ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-blue" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-900">
                      {option.mainText}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-gray-600">
                      {option.secondaryText || option.text}
                    </span>
                  </span>
                  <Check
                    className={`mt-1 h-4 w-4 shrink-0 text-brand-blue ${active === i ? "visible" : "invisible"}`}
                    aria-hidden="true"
                  />
                </li>
              ))}
            </ul>
          )}
          {error && (
            <p role="status" className="p-3 text-sm text-amber-900">
              {error}
            </p>
          )}
          {!loading && !error && searched && !options.length && (
            <p role="status" className="p-3 text-sm text-gray-600">
              No encontramos sugerencias. Probá buscar la dirección completa o
              pedí una revisión por WhatsApp.
            </p>
          )}
          <p
            translate="no"
            className="border-t px-3 py-2 text-right text-xs font-normal text-[#5e5e5e]"
          >
            Google Maps
          </p>
        </div>
      )}
    </div>
  );
}
