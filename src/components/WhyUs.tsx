import { Headphones, Cable, CalendarCheck, Wrench } from "lucide-react";

const benefits = [
  {
    Icon: Cable,
    title: "Internet por fibra",
    detail: "Para tu hogar y tu negocio.",
  },
  {
    Icon: Headphones,
    title: "Soporte local",
    detail: "Atención desde Tucumán.",
  },
  {
    Icon: CalendarCheck,
    title: "Instalación coordinada",
    detail: "Acordamos el turno con vos.",
  },
  {
    Icon: Wrench,
    title: "Servicio técnico especializado",
    detail: "Ayuda técnica para tu conexión.",
  },
];

export default function WhyUs() {
  return (
    <section
      id="por-que-gigalink"
      aria-label="Qué ofrece Giga Link"
      className="border-b border-slate-100 bg-white py-5 sm:py-6"
    >
      <div className="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(100%,8.5rem),1fr))] gap-x-4 gap-y-5 px-5 sm:gap-8 sm:px-6 lg:grid-cols-4">
        {benefits.map(({ Icon, title, detail }) => (
          <div
            key={title}
            className="flex items-start gap-2 sm:gap-3 sm:justify-center"
          >
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
              <p className="mt-1 text-xs text-slate-500">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
