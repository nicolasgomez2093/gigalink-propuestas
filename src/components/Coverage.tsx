import { MapPin } from "lucide-react";
import ContactForm from "./ContactForm";
import { NEIGHBORHOODS, EAST_COVERAGE_REGION } from "@/lib/coverage/catalog";

export default function Coverage() {
  return (
    <section id="cobertura" className="coverage-section py-10 md:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-blue">
            Internet + TV Digital
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Consultá tu cobertura
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
            Ingresá tu domicilio y contanos qué necesitás. Preparamos tu mensaje
            para ventas.
          </p>
        </div>
        <div className="coverage-layout">
          <div className="coverage-form-column mx-auto max-w-3xl">
            <ContactForm />
          </div>
          <div
            id="barrios"
            role="region"
            aria-labelledby="coverage-neighborhoods-title"
            className="mx-auto mt-7 max-w-5xl overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm"
          >
            <div className="flex items-center gap-3 bg-brand-blue-dark px-5 py-4 text-white sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3
                  id="coverage-neighborhoods-title"
                  className="text-lg font-bold"
                >
                  Barrios con cobertura
                </h3>
                <p className="mt-1 text-xs text-blue-100">
                  Internet y TV Digital cerca tuyo.
                </p>
              </div>
            </div>
            <div className="coverage-neighborhood-groups grid gap-5 bg-slate-50/70 p-5 sm:grid-cols-2 sm:p-6">
              {[
                {
                  label: "San Miguel de Tucumán",
                  neighborhoods: NEIGHBORHOODS.filter(
                    (neighborhood) =>
                      neighborhood.locality === "San Miguel de Tucumán",
                  ),
                },
                {
                  label: EAST_COVERAGE_REGION.label,
                  neighborhoods: NEIGHBORHOODS.filter(
                    (neighborhood) => neighborhood.region === "banda-alderetes",
                  ),
                },
                {
                  label: "El Manantial",
                  neighborhoods: NEIGHBORHOODS.filter(
                    (neighborhood) => neighborhood.locality === "El Manantial",
                  ),
                },
              ].map(({ label: locality, neighborhoods }) => {
                return (
                  <div
                    key={locality}
                    className={locality === "El Manantial" ? "sm:col-span-2" : ""}
                  >
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-blue-dark">
                      {locality}
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-brand-blue">
                        {neighborhoods.length}
                      </span>
                    </h4>
                    <ul
                      aria-label={`Barrios de ${locality}`}
                      className="flex flex-wrap gap-1.5"
                    >
                      {neighborhoods.map((neighborhood) => (
                        <li
                          key={neighborhood.name}
                          className="rounded-md border border-slate-200/70 bg-white px-2.5 py-1.5 text-xs leading-relaxed text-slate-600"
                        >
                          {neighborhood.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="space-y-1 border-t border-slate-100 px-5 py-3 text-xs leading-relaxed text-slate-500 sm:px-6">
              <p>
                La disponibilidad de instalación se confirma para cada domicilio.
              </p>
              <p>
                El listado de la zona este agrupa Banda del Río Salí y Alderetes.
                La Tentación: localidad a verificar con nuestro equipo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
