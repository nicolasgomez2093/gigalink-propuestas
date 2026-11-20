import { preferredScrollBehavior } from "@/lib/navigation";
import MonthlyPrice from "./MonthlyPrice";
import InformationLink from "./InformationLink";
import "./ServiceRequest.css";
import AddressAutocomplete from "./AddressAutocomplete";
import LocationPicker from "./LocationPicker";
import {
  googleSelectedAddress,
  type AddressPrediction,
  googleMapsConfigured,
} from "@/lib/coverage/google-geocoding";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  Loader2,
  LocateFixed,
  MapPin,
  MessageCircle,
  Search,
  Home,
  Building2,
  Store,
  Factory,
  Gamepad2,
  Laptop,
  Sofa,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  LOCALITIES,
  matchNeighborhood,
  neighborhoodCoverage,
  suggestNeighborhoods,
  type CoverageResult,
  type Locality,
} from "@/lib/coverage/catalog";
import {
  detectedLocality,
  locatedCoverage,
  reverseAddress,
  searchAddress,
  type LocatedAddress,
} from "@/lib/coverage/geocoding";
import {
  initialRequest,
  PLAN_OPTIONS,
  validLocationQuery,
  validateStep,
  whatsappMessage,
  type ServiceRequest,
} from "@/lib/coverage/request";

const steps = ["Ubicación", "Inmueble", "Uso", "Contacto"];
const titles = [
  "¿Dónde querés conectarte?",
  "Contanos cómo es el lugar",
  "Una conexión pensada para vos",
  "Revisá y enviá tu consulta",
];
const descriptions = [
  "Buscá tu dirección o barrio, o usá tu ubicación actual.",
  "Estos datos nos ayudan a preparar la instalación.",
  "Elegí cómo vas a usar el servicio para que podamos asesorarte.",
  "Tu mensaje se abrirá en WhatsApp, listo para enviarlo a Giga Link.",
];
const choiceIcons: Record<string, LucideIcon> = {
  Casa: Home,
  Departamento: Building2,
  "Comercio / Local": Store,
  "Empresa / Industria": Factory,
  Hogar: Sofa,
  "Juegos online": Gamepad2,
  "Trabajo / Estudio": Laptop,
  Negocio: BriefcaseBusiness,
};
const choiceDescriptions: Record<string, string> = {
  Casa: "Tu espacio de todos los días",
  Departamento: "En edificio o complejo",
  "Comercio / Local": "Para tu actividad comercial",
  "Empresa / Industria": "Para conectar a tu equipo",
  Hogar: "Series, redes y familia",
  "Juegos online": "Partidas y descargas",
  "Trabajo / Estudio": "Clases y videollamadas",
  Negocio: "Tu actividad, conectada",
};
const selectClass =
  "flex min-h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue disabled:opacity-50";

type FieldProps = {
  name: keyof ServiceRequest;
  label: string;
  children: ReactNode;
  error?: string;
  optional?: boolean;
};
function Field({ name, label, children, error, optional }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={`request-${name}`}>
        {label}
        {optional && (
          <span className="ml-1 font-normal text-gray-500">(opcional)</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`error-${name}`} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
function Choices({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "request-choice relative flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm transition-colors focus-within:ring-2 focus-within:ring-brand-blue",
              value === option
                ? "border-brand-blue bg-brand-blue/5 text-brand-blue-dark"
                : "border-gray-200 hover:bg-gray-50",
            )}
          >
            <input
              type="radio"
              aria-label={option}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              name={label}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {choiceIcons[option] &&
              (() => {
                const Icon = choiceIcons[option];
                return (
                  <span className="request-choice-icon">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                );
              })()}
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{option}</span>
              {choiceDescriptions[option] && (
                <span className="mt-1 hidden text-xs font-normal leading-relaxed text-slate-600 sm:block">
                  {choiceDescriptions[option]}
                </span>
              )}
            </span>
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                value === option
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-slate-500 bg-white",
              )}
              aria-hidden="true"
            >
              {value === option && <Check className="h-3 w-3" />}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function Checks({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-brand-blue",
              values.includes(option)
                ? "border-brand-blue/40 bg-blue-50 text-brand-blue-dark"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            )}
          >
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={values.includes(option)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...values, option]
                    : values.filter((v) => v !== option),
                )
              }
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<ServiceRequest>({ ...initialRequest });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<CoverageResult | null>(null);
  const [location, setLocation] = useState<LocatedAddress | null>(null);
  const [candidates, setCandidates] = useState<LocatedAddress[]>([]);
  const [busy, setBusy] = useState<"search" | "gps" | "confirm" | null>(null);
  const [searchError, setSearchError] = useState("");
  const [gpsAccuracy, setGpsAccuracy] = useState<number>();
  const [gpsConfirmed, setGpsConfirmed] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const revision = useRef(0);
  const lastWhatsapp = useRef({ message: "", time: 0 });
  const currentLocality = useRef(values.locality);
  currentLocality.current = values.locality;
  const tvOnly = values.service === "Solo TV Digital";
  const suggestions =
    values.search.trim().length >= 2
      ? suggestNeighborhoods(values.search, values.locality).slice(0, 6)
      : [];

  useEffect(
    () => () => {
      revision.current++;
    },
    [],
  );
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("plan");
    if (preset && PLAN_OPTIONS.includes(preset))
      setValues((v) => ({ ...v, plan: preset }));
    const selectPlan = (event: Event) => {
      const plan = (
        event as CustomEvent<{
          plan: string;
          service: string;
          locality?: string;
        }>
      ).detail;
      if (plan) {
        const locality = LOCALITIES.find((name) => name === plan.locality);
        const changedLocality =
          locality && locality !== currentLocality.current;
        if (changedLocality) invalidate();
        setValues((v) => ({
          ...v,
          plan: plan.plan,
          service: plan.service,
          ...(changedLocality
            ? { locality, search: "", address: "", neighborhood: "" }
            : {}),
        }));
        setStep(0);
        setErrors({});
      }
    };
    window.addEventListener("gigalink:select-plan", selectPlan);
    return () => window.removeEventListener("gigalink:select-plan", selectPlan);
  }, []);

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, gigalinkRequestStep: 0 },
      "",
    );
    function restoreStep(event: PopStateEvent) {
      const next = event.state?.gigalinkRequestStep;
      if (Number.isInteger(next) && next >= 0 && next <= 3) {
        setStep(next);
        setErrors({});
        requestAnimationFrame(() =>
          form.current?.scrollIntoView({ block: "start" }),
        );
      }
    }
    window.addEventListener("popstate", restoreStep);
    return () => window.removeEventListener("popstate", restoreStep);
  }, []);

  function set<K extends keyof ServiceRequest>(
    key: K,
    value: ServiceRequest[K],
  ) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setWhatsappOpened(false);
  }
  function invalidate() {
    revision.current++;
    setResult(null);
    setLocation(null);
    setCandidates([]);
    setSearchError("");
    setBusy(null);
    setGpsAccuracy(undefined);
    setGpsConfirmed(false);
  }
  function changeSearch(value: string) {
    invalidate();
    set("search", value);
    set("address", "");
    set("neighborhood", "");
  }
  function focusLocation() {
    requestAnimationFrame(() => {
      document
        .getElementById("installation-location")
        ?.scrollIntoView({
          behavior: preferredScrollBehavior(),
          block: "start",
        });
      document
        .getElementById("location-confirmation-title")
        ?.focus({ preventScroll: true });
    });
  }
  function acceptAddress(
    address: LocatedAddress,
    gps?: { latitude: number; longitude: number; accuracy: number },
  ) {
    const selected = gps
      ? {
          ...address,
          latitude: gps.latitude,
          longitude: gps.longitude,
          positionSource: "gps" as const,
        }
      : address;
    setLocation(selected);
    setCandidates([]);
    setGpsConfirmed(false);
    setResult(googleMapsConfigured ? null : locatedCoverage(selected));
    setValues((v) => ({
      ...v,
      address:
        ["street", "block"].includes(address.precision) && !gps
          ? v.address
          : [address.street, address.number].filter(Boolean).join(" ") ||
            v.address,
      neighborhood: address.neighborhood,
      locality: detectedLocality(address) || v.locality,
    }));
    if (gps) setGpsAccuracy(gps.accuracy);
    setErrors({});
    if (googleMapsConfigured) focusLocation();
  }
  function selectNeighborhood(name: string) {
    invalidate();
    set("search", name);
    set("address", "");
    set("neighborhood", name);
    setResult(neighborhoodCoverage(name, values.locality));
    setErrors({});
  }
  async function search() {
    if (!values.search.trim()) {
      setErrors({ search: "Ingresá una dirección o un barrio para buscar." });
      return;
    }
    if (!validLocationQuery(values.search)) {
      setErrors({
        search:
          "Escribí una calle y altura o el nombre de un barrio, sin enlaces ni símbolos extraños.",
      });
      return;
    }
    const match =
      matchNeighborhood(values.search, values.locality) ||
      matchNeighborhood(values.search);
    if (match && (!match.locality || match.locality === values.locality)) {
      selectNeighborhood(match.name);
      return;
    }
    const current = ++revision.current;
    setBusy("search");
    setSearchError("");
    setResult(null);
    setLocation(null);
    setCandidates([]);
    setGpsAccuracy(undefined);
    setGpsConfirmed(false);
    set("address", values.search.trim());
    try {
      const found = await searchAddress(
        values.search.trim(),
        values.locality as Locality,
      );
      if (revision.current !== current) return;
      if (found.length === 1) acceptAddress(found[0]);
      else if (found.length > 1) setCandidates(found);
      else
        setSearchError(
          "No encontramos esa calle y altura en la localidad seleccionada. Probá con calle y altura, o buscá por barrio. También podés continuar con una verificación por WhatsApp.",
        );
    } catch (error) {
      if (revision.current === current)
        setSearchError(
          error instanceof Error && error.name === "GoogleGeocodingError"
            ? error.message
            : "No pudimos conectar con el buscador. Podés intentar otra vez o continuar con una verificación por WhatsApp.",
        );
    } finally {
      if (revision.current === current) setBusy(null);
    }
  }
  async function selectPrediction(prediction: AddressPrediction) {
    const current = ++revision.current;
    setBusy("search");
    setResult(null);
    setLocation(null);
    setCandidates([]);
    setSearchError("");
    setGpsAccuracy(undefined);
    setGpsConfirmed(false);
    set("search", prediction.text);
    set("address", prediction.mainText);
    try {
      const address = await googleSelectedAddress(prediction);
      if (revision.current !== current) return;
      if (address) acceptAddress(address);
      else
        setSearchError(
          "Esa ubicación está fuera de nuestra región de búsqueda. Revisá la dirección y la localidad o pedí una revisión por WhatsApp.",
        );
    } catch (error) {
      if (revision.current === current)
        setSearchError(
          error instanceof Error && error.name === "GoogleGeocodingError"
            ? error.message
            : "No pudimos abrir esa dirección. Podés intentar otra vez o pedir una revisión por WhatsApp.",
        );
    } finally {
      if (revision.current === current) setBusy(null);
    }
  }
  function movePoint(latitude: number, longitude: number) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    revision.current++;
    setBusy(null);
    setResult(null);
    setGpsConfirmed(false);
    setGpsAccuracy(undefined);
    setSearchError("");
    setLocation((previous) =>
      previous
        ? {
            ...previous,
            latitude,
            longitude,
            precision: "point",
            positionSource: "map",
            neighborhood: "",
            neighborhoodSource: undefined,
            label: "Ubicación ajustada en el mapa",
          }
        : null,
    );
    set("neighborhood", "");
  }
  async function confirmLocation(advance = false) {
    if (!location) return;
    const current = ++revision.current;
    const selected = location;
    setBusy("confirm");
    setSearchError("");
    setResult(null);
    setErrors({});
    try {
      const addresses = await reverseAddress(
        selected.latitude,
        selected.longitude,
      );
      if (revision.current !== current) return;
      const nearby = addresses[0];
      const confirmed: LocatedAddress = {
        ...selected,
        label:
          selected.positionSource === "map" && nearby
            ? `Ubicación seleccionada cerca de ${nearby.label}`
            : selected.label,
        locality: nearby?.locality || selected.locality,
        neighborhood: nearby?.neighborhood || selected.neighborhood,
        neighborhoodSource:
          nearby?.neighborhoodSource || selected.neighborhoodSource,
        precision: "point",
        source: nearby?.source || selected.source,
      };
      setLocation(confirmed);
      setGpsConfirmed(true);
      setResult(locatedCoverage(confirmed));
      setValues((v) => ({
        ...v,
        neighborhood: confirmed.neighborhood,
        locality: detectedLocality(confirmed) || v.locality,
        address:
          v.address ||
          (nearby
            ? [nearby.street, nearby.number].filter(Boolean).join(" ")
            : ""),
      }));
    } catch {
      if (revision.current !== current) return;
      const confirmed = { ...selected, precision: "point" as const };
      setLocation(confirmed);
      setGpsConfirmed(true);
      setResult(locatedCoverage(confirmed));
      setSearchError(
        "Guardamos el punto que confirmaste. No pudimos completar los datos del barrio; nuestro equipo puede revisar la cobertura por WhatsApp.",
      );
    } finally {
      if (revision.current === current) {
        setBusy(null);
        if (advance) goTo(1);
      }
    }
  }
  async function locate() {
    if (!navigator.geolocation) {
      setSearchError(
        "Tu navegador no permite obtener la ubicación. Ingresá tu dirección o barrio.",
      );
      return;
    }
    const current = ++revision.current;
    setBusy("gps");
    setSearchError("");
    setResult(null);
    setLocation(null);
    setCandidates([]);
    setGpsAccuracy(undefined);
    setGpsConfirmed(false);
    set("address", "");
    let coordinates: GeolocationCoordinates | undefined;
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }),
      );
      if (revision.current !== current) return;
      coordinates = position.coords;
      if (
        coordinates.latitude < -28 ||
        coordinates.latitude > -26 ||
        coordinates.longitude < -66.3 ||
        coordinates.longitude > -64.4
      ) {
        setSearchError(
          "Tu ubicación actual está fuera de nuestra región de búsqueda. Ingresá el domicilio de instalación en Tucumán.",
        );
        return;
      }
      const found = await reverseAddress(
        coordinates.latitude,
        coordinates.longitude,
      );
      if (revision.current !== current) return;
      const address = found[0] || {
        label: "Ubicación compartida desde el dispositivo",
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        locality: "",
        neighborhood: "",
        street: "",
        number: "",
      };
      set("search", address.label);
      acceptAddress(address, coordinates);
    } catch (error) {
      if (revision.current !== current) return;
      if (coordinates) {
        const address = {
          label: "Ubicación compartida desde el dispositivo",
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          locality: "",
          neighborhood: "",
          street: "",
          number: "",
        };
        set("search", address.label);
        acceptAddress(address, coordinates);
        setSearchError(
          "Obtuvimos tu ubicación, pero no su dirección. Confirmá el punto para que podamos revisarlo por WhatsApp.",
        );
      } else {
        const code = (error as GeolocationPositionError).code;
        setSearchError(
          code === 1
            ? "No se habilitó el permiso de ubicación. Podés ingresar tu dirección o barrio."
            : "No pudimos obtener tu ubicación. Intentá nuevamente o ingresá tu dirección.",
        );
      }
    } finally {
      if (revision.current === current) setBusy(null);
    }
  }
  function manualReview() {
    if (values.search.trim() && !validLocationQuery(values.search)) {
      setErrors({
        search:
          "Escribí una dirección o un barrio para que nuestro equipo pueda revisarlo.",
      });
      return;
    }
    invalidate();
    setResult(neighborhoodCoverage(""));
    if (!values.search.trim()) set("search", "Consulta manual de domicilio");
    setErrors({});
  }
  function goTo(next: number) {
    if (next !== step)
      window.history.pushState(
        { ...window.history.state, gigalinkRequestStep: next },
        "",
        "#solicitud",
      );
    setStep(next);
    setErrors({});
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      form.current?.scrollIntoView({
        behavior: preferredScrollBehavior(),
        block: "start",
      });
    });
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    if (submitter?.dataset.doubleClick === "true") return;
    if (step === 0 && !result && !location && values.search.trim()) {
      void search();
      return;
    }
    if (step === 0 && location && !gpsConfirmed && googleMapsConfigured) {
      void confirmLocation(true);
      return;
    }
    const found = validateStep(step, values, !!result);
    if (
      step === 0 &&
      location &&
      !gpsConfirmed &&
      (googleMapsConfigured || gpsAccuracy !== undefined)
    ) {
      found[googleMapsConfigured ? "location" : "gps"] =
        "Confirmá que esta es la ubicación donde querés instalar el servicio.";
      delete found.search;
    }
    if (Object.keys(found).length) {
      setErrors(found);
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    if (step < 3) {
      goTo(step + 1);
      return;
    }
    // Validate earlier steps as well, including changes made through the summary.
    for (let i = 0; i < 3; i++) {
      const previousErrors = validateStep(i, values, !!result);
      if (Object.keys(previousErrors).length) {
        goTo(i);
        setErrors(previousErrors);
        return;
      }
    }
    const message = whatsappMessage(values, result!, location, gpsAccuracy);
    const now = Date.now();
    if (
      lastWhatsapp.current.message === message &&
      now - lastWhatsapp.current.time < 1500
    )
      return;
    lastWhatsapp.current = { message, time: now };
    window.open(
      `https://wa.me/5493814092755?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setWhatsappOpened(true);
  }
  function input(
    name: keyof ServiceRequest,
    label: string,
    options: {
      type?: string;
      placeholder?: string;
      optional?: boolean;
      autoComplete?: string;
      min?: number;
      max?: number;
    } = {},
  ) {
    return (
      <Field
        name={name}
        label={label}
        optional={options.optional}
        error={errors[name]}
      >
        <Input
          id={`request-${name}`}
          name={name}
          value={String(values[name])}
          onChange={(e) => set(name, e.target.value)}
          type={options.type || "text"}
          placeholder={options.placeholder}
          autoComplete={options.autoComplete}
          min={options.min}
          max={options.max}
          maxLength={150}
          className="min-h-11"
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
          required={!options.optional}
        />
      </Field>
    );
  }
  function select(
    name: keyof ServiceRequest,
    label: string,
    options: readonly string[],
  ) {
    return (
      <Field name={name} label={label}>
        <select
          id={`request-${name}`}
          value={String(values[name])}
          className={selectClass}
          onChange={(e) => set(name, e.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>
    );
  }

  return (
    <form
      id="solicitud"
      ref={form}
      onSubmit={submit}
      noValidate
      onClick={(event) => {
        if (event.detail > 1 && (event.target as HTMLElement).closest("button"))
          event.preventDefault();
      }}
      className="service-request scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white text-left"
    >
      <div className="px-5 pt-5 sm:px-8 sm:pt-6">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-brand-blue">{steps[step]}</span>
          <span className="text-slate-500">
            Paso {step + 1} de {steps.length}
          </span>
        </div>
        <div
          role="progressbar"
          aria-label="Progreso de la solicitud"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
          aria-valuetext={`Paso ${step + 1} de ${steps.length}: ${steps[step]}`}
          className="h-1.5 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className="h-full rounded-full bg-brand-blue transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="px-5 py-6 sm:p-8">
        <h3
          ref={heading}
          tabIndex={-1}
          className="text-2xl font-bold tracking-tight text-slate-900 outline-none sm:text-3xl"
        >
          {titles[step]}
        </h3>
        <p className="mb-5 mt-2 text-sm leading-relaxed text-gray-500">
          {descriptions[step]}
        </p>
        <div className="request-step-content space-y-5" key={step}>
          {step === 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {select("service", "¿Qué servicio te interesa?", [
                  "Internet",
                  "Internet + TV Digital",
                  "Solo TV Digital",
                ])}
                <Field name="locality" label="Localidad">
                  <select
                    id="request-locality"
                    className={selectClass}
                    value={values.locality}
                    onChange={(e) => {
                      invalidate();
                      set("locality", e.target.value);
                      set("neighborhood", "");
                    }}
                  >
                    {LOCALITIES.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field
                name="search"
                label="Dirección o barrio"
                error={errors.search}
              >
                <div className="flex items-start gap-2">
                  {googleMapsConfigured ? (
                    <AddressAutocomplete
                      value={values.search}
                      locality={values.locality}
                      disabled={!!busy}
                      invalid={!!errors.search}
                      describedBy={
                        errors.search
                          ? "search-hint error-search"
                          : "search-hint"
                      }
                      onChange={changeSearch}
                      onSelect={(prediction) =>
                        void selectPrediction(prediction)
                      }
                      onSearch={() => void search()}
                    />
                  ) : (
                    <Input
                      id="request-search"
                      className="min-h-11"
                      value={values.search}
                      onChange={(e) => changeSearch(e.target.value)}
                      placeholder="Ej.: Laprida 567 o San Cayetano"
                      maxLength={150}
                      autoComplete="off"
                      aria-invalid={!!errors.search}
                      aria-describedby={
                        errors.search
                          ? "search-hint error-search"
                          : "search-hint"
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (!busy) void search();
                        }
                      }}
                    />
                  )}
                  <Button
                    type="button"
                    variant="whatsappBlue"
                    disabled={!!busy}
                    onClick={() => void search()}
                    className="min-h-11"
                  >
                    {busy === "search" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Search />
                    )}
                    Buscar
                  </Button>
                </div>
                <p id="search-hint" className="text-xs text-gray-500">
                  {googleMapsConfigured
                    ? "Escribí calle y altura o un barrio. Después confirmamos el punto en el mapa."
                    : "Incluí la altura para ubicar mejor tu domicilio."}
                </p>
              </Field>
              {!result && !location && suggestions.length > 0 && (
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Barrios con cobertura que coinciden
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((n) => (
                      <button
                        type="button"
                        key={n.name}
                        onClick={() => selectNeighborhood(n.name)}
                        className="min-h-10 rounded-full border bg-gray-50 px-3 py-2 text-xs text-gray-700 hover:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue"
                      >
                        {n.name}
                        {!n.locality && !n.region
                          ? " · localidad a verificar"
                          : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 w-full border-brand-blue/30 text-brand-blue"
                  onClick={() => void locate()}
                  disabled={!!busy}
                >
                  {busy === "gps" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <LocateFixed />
                  )}
                  Usar mi ubicación actual
                </Button>
                <p className="mt-2 text-center text-xs text-gray-500">
                  Tu navegador te pedirá permiso. Usala si estás en el lugar de
                  instalación.
                </p>
              </div>
              {busy && (
                <p role="status" className="text-sm text-brand-blue">
                  {busy === "gps"
                    ? "Buscando tu ubicación…"
                    : busy === "confirm"
                      ? "Consultando cobertura de la ubicación elegida…"
                      : "Buscando tu dirección…"}
                </p>
              )}
              {searchError && (
                <p
                  role="alert"
                  className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
                >
                  {searchError}
                </p>
              )}
              {candidates.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="mb-2 text-sm font-medium">
                    {candidates.every((a) => a.precision === "block")
                      ? "Encontramos referencias de tu cuadra. Elegí la más cercana:"
                      : "Encontramos estas ubicaciones. Elegí la tuya:"}
                  </legend>
                  {candidates.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => acceptAddress(a)}
                      className="flex min-h-12 w-full items-start gap-2 rounded-xl border p-3 text-left text-sm hover:border-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue"
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                      {a.precision === "block"
                        ? `Referencia en tu cuadra: ${a.label}`
                        : a.label}
                    </button>
                  ))}
                </fieldset>
              )}
              {location && (
                <div
                  id="installation-location"
                  className="scroll-mt-24 rounded-xl border bg-gray-50 p-4 text-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {gpsAccuracy !== undefined
                      ? "Ubicación detectada"
                      : googleMapsConfigured && !gpsConfirmed
                        ? "Ubicación para revisar"
                        : location.precision === "street"
                          ? "Calle encontrada · altura sin confirmar"
                          : location.precision === "block"
                            ? "Ubicación aproximada en tu cuadra"
                            : "Ubicación encontrada"}
                  </p>
                  <p className="mt-1 break-words text-gray-600">
                    {location.label}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Revisá que corresponda al lugar donde querés instalar el
                    servicio.
                  </p>
                  {location.source === "google" && (
                    <p
                      translate="no"
                      className="mt-2 text-xs font-normal text-[#5e5e5e]"
                    >
                      Google Maps
                    </p>
                  )}
                  <a
                    className="mt-2 inline-flex min-h-10 items-center gap-1 font-medium text-brand-blue underline"
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                    Ver ubicación
                  </a>
                  {location.neighborhoodSource === "photon" && (
                    <p className="mt-2 text-xs text-gray-500">
                      Barrio estimado con{" "}
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        © OpenStreetMap
                      </a>
                      .
                    </p>
                  )}
                  {googleMapsConfigured && (
                    <div className="mt-4">
                      <LocationPicker
                        latitude={location.latitude}
                        longitude={location.longitude}
                        confirmed={gpsConfirmed}
                        confirming={busy === "confirm"}
                        error={errors.location}
                        onMove={movePoint}
                        onConfirm={() => void confirmLocation()}
                      />
                    </div>
                  )}
                  {gpsAccuracy !== undefined && !googleMapsConfigured && (
                    <>
                      <p className="mb-3 text-xs text-gray-500">
                        Precisión aproximada: {Math.round(gpsAccuracy)} metros.
                        Revisá la ubicación antes de continuar.
                      </p>
                      <label className="flex cursor-pointer items-start gap-2">
                        <input
                          type="checkbox"
                          checked={gpsConfirmed}
                          onChange={(e) => {
                            setGpsConfirmed(e.target.checked);
                            setErrors({});
                          }}
                          aria-invalid={!!errors.gps}
                          className="mt-1 accent-blue-600"
                        />
                        Quiero instalar el servicio en esta ubicación.
                      </label>
                      {errors.gps && (
                        <p role="alert" className="mt-2 text-red-600">
                          {errors.gps}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
              {result && (
                <div
                  role="status"
                  className={cn(
                    "rounded-xl border p-4",
                    result.status === "neighborhood"
                      ? "border-green-200 bg-green-50"
                      : "border-blue-100 bg-blue-50",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {result.status === "neighborhood" ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                    ) : (
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {result.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {result.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {result && !location && values.neighborhood && (
                <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                  Consultaste un barrio. La calle y altura quedan a coordinar
                  por WhatsApp. Si preferís ubicar tu casa ahora, cambiá la
                  búsqueda por tu calle y altura.
                </p>
              )}
              {!result && !busy && (
                <button
                  type="button"
                  className="min-h-11 text-left text-sm font-medium text-brand-blue underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-blue"
                  onClick={manualReview}
                >
                  No encuentro mi dirección. Quiero que la revisen por WhatsApp.
                </button>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <Choices
                label="Tipo de inmueble"
                options={[
                  "Casa",
                  "Departamento",
                  "Comercio / Local",
                  "Empresa / Industria",
                ]}
                value={values.property}
                onChange={(v) => set("property", v)}
              />
              <div className="grid grid-cols-2 gap-4">
                {input("floors", "Plantas / pisos", {
                  type: "number",
                  min: 1,
                  max: 200,
                })}
                {input("surface", "Superficie (m²)", {
                  type: "number",
                  min: 1,
                  optional: true,
                  placeholder: "Aproximada",
                })}
              </div>
              <Choices
                label="¿Actualmente tenés internet?"
                options={["Sí", "No"]}
                value={values.currentInternet}
                onChange={(v) => set("currentInternet", v)}
              />
              {values.currentInternet === "Sí" && (
                <>
                  {input("provider", "Proveedor actual", {
                    optional: true,
                    placeholder: "Nombre de la empresa",
                  })}
                  <Checks
                    label="¿Qué te gustaría mejorar?"
                    options={[
                      "Cortes / Lentitud",
                      "Atención y soporte",
                      "Precio",
                    ]}
                    values={values.problems}
                    onChange={(v) => set("problems", v)}
                  />
                </>
              )}
            </>
          )}
          {step === 2 && (
            <>
              {!tvOnly && (
                <>
                  <Choices
                    label="¿Para qué vas a usar internet?"
                    options={[
                      "Hogar",
                      "Juegos online",
                      "Trabajo / Estudio",
                      "Negocio",
                    ]}
                    value={values.profile}
                    onChange={(v) => set("profile", v)}
                  />
                  <p className="rounded-xl bg-blue-50 p-3 text-sm text-brand-blue-dark">
                    {
                      {
                        Hogar:
                          "Redes sociales, navegación y series para toda la familia.",
                        "Juegos online":
                          "Juegos online, descargas y una conexión estable.",
                        "Trabajo / Estudio":
                          "Videollamadas, clases y archivos en la nube.",
                        Negocio:
                          "Cobros online, cámaras y herramientas para tu actividad.",
                      }[values.profile]
                    }
                  </p>
                  {select(
                    "devices",
                    "Dispositivos conectados al mismo tiempo",
                    [
                      "1 a 5",
                      "6 a 10",
                      "11 a 20",
                      "Más de 20",
                      "No estoy seguro",
                    ],
                  )}
                  {select("plan", "Plan de interés", PLAN_OPTIONS)}
                </>
              )}
              {values.service !== "Internet" &&
                select("televisions", "¿Cuántos televisores querés conectar?", [
                  "1",
                  "2",
                  "3",
                  "4 o más",
                  "No estoy seguro",
                ])}
              <MonthlyPrice
                service={values.service}
                plan={values.plan}
                locality={values.locality}
              />
            </>
          )}
          {step === 3 && (
            <>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Tu solicitud</h4>
                  <span className="text-xs text-gray-500">
                    Podés editar cada paso
                  </span>
                </div>
                {[
                  {
                    label: "Ubicación",
                    value: [
                      ...new Set(
                        [
                          values.address || values.search,
                          values.neighborhood,
                          values.locality,
                        ].filter(Boolean),
                      ),
                    ].join(" · "),
                    index: 0,
                  },
                  {
                    label: "Inmueble",
                    value: `${values.property} · ${values.floors} planta(s)`,
                    index: 1,
                  },
                  {
                    label: "Servicio y uso",
                    value: `${values.service}${tvOnly ? ` · ${values.televisions} TV` : ` · ${values.plan} · ${values.profile}`}`,
                    index: 2,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-3 border-t py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{row.label}</p>
                      <p className="mt-1 break-words text-sm text-gray-800">
                        {row.value}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo(row.index)}
                      aria-label={`Editar ${row.label.toLowerCase()}`}
                      className="min-h-10 shrink-0 text-xs font-medium text-brand-blue underline"
                    >
                      Editar
                    </button>
                  </div>
                ))}
                <p className="text-xs leading-relaxed text-gray-500">
                  {result?.title}. {result?.detail}
                </p>
              </div>
              <MonthlyPrice
                service={values.service}
                plan={values.plan}
                locality={values.locality}
              />
              {input("name", "Nombre y apellido", {
                autoComplete: "name",
                placeholder: "Tu nombre completo",
              })}
              {input("phone", "Teléfono / WhatsApp", {
                type: "tel",
                autoComplete: "tel",
                placeholder: "Ej.: 381 555 1234",
              })}
            </>
          )}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={() => goTo(step - 1)}
              >
                <ArrowLeft />
                Anterior
              </Button>
            )}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {step === 0 &&
                (googleMapsConfigured ? (
                  <span translate="no" className="font-normal text-[#5e5e5e]">
                    Google Maps
                  </span>
                ) : (
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    © OpenStreetMap
                  </a>
                ))}
              <InformationLink kind="request" />
            </div>
          </div>
          <Button
            type="submit"
            onClick={(event) => {
              event.currentTarget.dataset.doubleClick = String(
                event.detail > 1,
              );
              if (event.detail > 1) event.preventDefault();
            }}
            variant={step === 3 ? "whatsapp" : "whatsappBlue"}
            className="min-h-12 w-full rounded-xl px-7 sm:w-auto"
            disabled={!!busy}
          >
            {step === 3 ? (
              <>
                <MessageCircle />
                Enviar por WhatsApp
              </>
            ) : (
              <>
                {step === 0 && !result
                  ? location && googleMapsConfigured
                    ? "Confirmar ubicación y continuar"
                    : "Buscar mi dirección"
                  : "Continuar"}
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
        {step === 3 && (
          <p className="mt-3 text-center text-xs text-gray-500">
            Se abrirá WhatsApp con tu mensaje. Confirmá el envío allí.
          </p>
        )}
        {whatsappOpened && (
          <p
            role="status"
            className="mt-4 rounded-xl bg-green-50 p-4 text-sm text-green-800"
          >
            Tu mensaje está preparado. Si WhatsApp no se abrió, tocá “Enviar por
            WhatsApp” nuevamente. Tus respuestas siguen acá.
          </p>
        )}
      </div>
    </form>
  );
}
