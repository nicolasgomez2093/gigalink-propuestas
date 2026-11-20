import { scrollToSection } from "@/lib/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Tv, Home, Building2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { LOCALITIES } from "@/lib/coverage/catalog";
import {
  RESIDENTIAL_PLANS,
  TV_MONTHLY_PRICE,
  monthlyQuote,
  formatPrice,
} from "@/lib/coverage/pricing";

const homePlans = RESIDENTIAL_PLANS;
const businessPlans = [
  {
    name: "Negocio 50",
    speed: "50 Mbps",
    ideal: "Comercios, locales y puntos de venta",
  },
  {
    name: "Negocio 100",
    speed: "100 Mbps",
    ideal: "Oficinas y pymes con varios puestos",
  },
  {
    name: "Negocio 300",
    speed: "300 Mbps",
    ideal: "Empresas con alto tráfico y servicios en la nube",
  },
];
const businessFeatures = [
  "Conexión estable para tu negocio",
  "Atención prioritaria",
  "Instalación y asesoramiento técnico",
  "Soluciones a medida",
];

const requestPlan = (plan: string, service: string, locality?: string) => {
  window.dispatchEvent(
    new CustomEvent("gigalink:select-plan", {
      detail: { plan, service, locality },
    }),
  );
  requestAnimationFrame(() => scrollToSection("solicitud"));
};

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="space-y-3 mb-8">
    {items.map((f) => (
      <li key={f} className="flex items-center">
        <Check className="w-5 h-5 text-brand-green mr-3 flex-shrink-0" />
        <span className="text-gray-700">{f}</span>
      </li>
    ))}
  </ul>
);

const Plans = () => {
  const [tab, setTab] = useState<"hogar" | "empresas">("hogar");
  const [locality, setLocality] = useState<string>(LOCALITIES[0]);
  const [tvByPlan, setTvByPlan] = useState<Record<string, boolean>>({});
  const { ref, inView } = useInView<HTMLDivElement>();

  const tabBtn = (
    id: "hogar" | "empresas",
    label: string,
    Icon: typeof Home,
  ) => (
    <button
      type="button"
      role="tab"
      id={`plans-tab-${id}`}
      aria-controls={`plans-panel-${id}`}
      onKeyDown={(event) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next =
            event.key === "Home"
              ? "hogar"
              : event.key === "End"
                ? "empresas"
                : id === "hogar"
                  ? "empresas"
                  : "hogar";
          setTab(next);
          document.getElementById(`plans-tab-${next}`)?.focus();
        }
      }}
      aria-selected={tab === id}
      onClick={() => setTab(id)}
      className={cn(
        "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue",
        tab === id
          ? "bg-brand-blue text-white shadow-glow"
          : "text-gray-600 hover:text-gray-900",
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const anim = (i: number) => ({
    className: inView ? "animate-fade-in" : "opacity-0",
    style: inView ? { animationDelay: `${i * 100}ms` } : undefined,
  });

  return (
    <section id="planes" className="py-10 md:py-14 bg-gray-50">
      <div ref={ref} className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-6 md:mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold tracking-wider uppercase mb-3">
            Nuestros planes
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            Planes de Internet
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Elegí la conexión para tu hogar y sumá TV Digital si querés.
            Atención y soporte local en Tucumán.
          </p>
        </div>

        <div className="plans-controls mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <div
            role="tablist"
            aria-label="Tipo de cliente"
            className="inline-flex max-w-full flex-wrap justify-center rounded-full border bg-white p-1 shadow-sm"
          >
            {tabBtn("hogar", "Hogar", Home)}
            {tabBtn("empresas", "Empresas y Negocios", Building2)}
          </div>
          {tab === "hogar" && (
            <div className="flex max-w-full flex-wrap items-center justify-center gap-2 text-sm">
              <label htmlFor="plans-locality" className="text-slate-500">
                Precios para
              </label>
              <select
                id="plans-locality"
                value={locality}
                onChange={(event) => setLocality(event.target.value)}
                className="min-h-11 min-w-0 max-w-full rounded-lg border border-[#8290a5] bg-white px-3 py-2 text-sm font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {LOCALITIES.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {tab === "hogar" ? (
          <div
            role="tabpanel"
            id="plans-panel-hogar"
            aria-labelledby="plans-tab-hogar"
          >
            <div className="residential-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto pt-4">
              {homePlans.map((p, i) => {
                const withTv = !!tvByPlan[p.name];
                const quote = monthlyQuote({
                  service: withTv ? "Internet + TV Digital" : "Internet",
                  plan: p.requestValue,
                  locality,
                })!;
                const label = withTv
                  ? `${p.name} (${p.speed}) + TV Digital`
                  : `${p.name} (${p.speed})`;
                const a = anim(i);
                const switchId = `tv-${p.name.replace(/\s/g, "")}`;
                return (
                  <Card
                    key={p.name}
                    style={a.style}
                    className={cn(
                      "internet-plan relative flex h-full flex-col transition-all duration-300 hover:shadow-elegant",
                      p.popular
                        ? "border-brand-blue border-2 lg:scale-105 shadow-elegant"
                        : "hover:-translate-y-1",
                      a.className,
                    )}
                  >
                    {p.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-action text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-glow whitespace-nowrap">
                          <Star className="w-4 h-4 mr-1" /> Recomendado
                        </div>
                      </div>
                    )}
                    <CardHeader className="plan-header p-4 pb-4 text-center sm:p-6 sm:pb-4">
                      <CardTitle className="plan-name text-2xl font-bold text-gray-800">
                        {p.name}
                      </CardTitle>
                      <div className="plan-speed text-4xl font-bold bg-gradient-action bg-clip-text text-transparent mb-1">
                        {p.speed}
                      </div>
                      <label
                        htmlFor={switchId}
                        className={cn(
                          "plan-tv mt-3 flex flex-wrap items-center justify-center gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors",
                          withTv
                            ? "border-brand-blue bg-brand-blue/10"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                        )}
                      >
                        <span className="flex min-w-0 flex-[1_1_9rem] items-center gap-2 text-left">
                          <Tv className="w-5 h-5 text-brand-blue shrink-0" />
                          <span className="min-w-0 leading-tight">
                            <span className="block text-sm font-semibold text-gray-800">
                              Sumar TV Digital
                            </span>
                            <span className="block text-xs text-gray-500">
                              +{formatPrice(TV_MONTHLY_PRICE)} por mes
                            </span>
                          </span>
                        </span>
                        <Switch
                          id={switchId}
                          className="mx-auto border-brand-green data-[state=unchecked]:bg-green-50 data-[state=checked]:bg-brand-green [&>span]:bg-brand-green data-[state=checked]:[&>span]:bg-white"
                          checked={withTv}
                          onCheckedChange={(v) =>
                            setTvByPlan((s) => ({ ...s, [p.name]: v }))
                          }
                          aria-label={`Sumar TV Digital al ${p.name}`}
                        />
                      </label>
                      <div
                        className="plan-price text-3xl font-bold text-gray-800 mt-3"
                        aria-live="polite"
                      >
                        <span
                          data-testid={`price-${p.name.replace("Plan ", "")}`}
                        >
                          {formatPrice(quote.total)}
                        </span>
                      </div>
                      <div className="plan-term text-gray-600">
                        {withTv
                          ? "por mes · Internet + TV Digital"
                          : "por mes · Internet"}
                      </div>
                      <p className="plan-uses text-sm leading-relaxed text-gray-500 mt-3 min-h-[2.5rem]">
                        {p.ideal}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-6 sm:pt-0">
                      <Button
                        onClick={() =>
                          requestPlan(
                            p.requestValue,
                            withTv ? "Internet + TV Digital" : "Internet",
                            locality,
                          )
                        }
                        variant="whatsappBlue"
                        size="pill"
                        className="mt-auto w-full font-semibold"
                        aria-label={`Solicitar ${label}`}
                      >
                        Elegir este plan
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              <Card
                style={anim(3).style}
                className={cn(
                  "tv-plan relative flex h-full flex-col transition-all duration-300 hover:shadow-elegant hover:-translate-y-1",
                  anim(3).className,
                )}
              >
                <CardHeader className="p-4 pb-4 text-center sm:p-6 sm:pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Solo TV Digital
                  </CardTitle>
                  <div className="flex justify-center mb-1">
                    <Tv className="w-10 h-10 text-brand-blue" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mt-2">
                    {formatPrice(TV_MONTHLY_PRICE)}
                  </div>
                  <div className="text-gray-600">por mes · TV Digital</div>
                  <p className="text-xs text-gray-500 mt-2 min-h-[2rem]">
                    Toda la programación sin contratar internet
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-6 sm:pt-0">
                  <p className="mb-6 text-sm leading-relaxed text-slate-500">
                    TV Digital como servicio independiente, con atención local.
                  </p>
                  <Button
                    onClick={() =>
                      requestPlan(
                        "Necesito asesoramiento",
                        "Solo TV Digital",
                        locality,
                      )
                    }
                    variant="whatsappBlue"
                    size="pill"
                    className="mt-auto w-full font-semibold"
                    aria-label="Solicitar solo TV Digital"
                  >
                    Elegir TV Digital
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="mt-5 text-center text-sm text-slate-600">
              Todos los planes de Internet incluyen conexión por fibra y soporte
              local.
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
              Precios mensuales en pesos argentinos, sujetos a disponibilidad.
              Los costos de instalación y cambios de equipo pueden variar.
            </p>
          </div>
        ) : (
          <div
            role="tabpanel"
            id="plans-panel-empresas"
            aria-labelledby="plans-tab-empresas"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto pt-4"
          >
            {businessPlans.map((p, i) => {
              const a = anim(i);
              return (
                <Card
                  key={p.name}
                  style={a.style}
                  className={cn(
                    "flex h-full flex-col transition-all duration-300 hover:shadow-elegant hover:-translate-y-1",
                    a.className,
                  )}
                >
                  <CardHeader className="p-4 pb-4 text-center sm:p-6 sm:pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {p.name}
                    </CardTitle>
                    <div className="text-4xl font-bold bg-gradient-action bg-clip-text text-transparent mb-2">
                      {p.speed}
                    </div>
                    <p className="text-sm text-gray-500 min-h-[2.5rem]">
                      {p.ideal}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-6 sm:pt-0">
                    <FeatureList items={businessFeatures} />
                    <Button
                      onClick={() =>
                        requestPlan("Empresas y Negocios", "Internet")
                      }
                      variant="whatsappBlue"
                      size="pill"
                      className="mt-auto w-full font-semibold"
                      aria-label={`Solicitar ${p.name} para empresas`}
                    >
                      Consultar
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
