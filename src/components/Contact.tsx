import { Headphones, MapPin, MessageCircle } from "lucide-react";

const channels = [
  {
    label: "Consultar por una instalación",
    detail: "Planes, precios y condiciones para tu domicilio.",
    phone: "381 409-2755",
    number: "5493814092755",
    message: "Hola Giga Link, quiero consultar por planes e instalación en mi domicilio.",
    Icon: MessageCircle,
  },
  {
    label: "Pedir ayuda con mi conexión",
    detail: "Soporte técnico · Lun. a sáb., 9:30 a 20:30",
    phone: "381 363-7606",
    number: "5493813637606",
    message: "Hola Giga Link, necesito soporte para mi conexión.",
    Icon: Headphones,
  },
];

export default function Contact() {
  return (
    <section id="contacto" aria-labelledby="contact-title" className="border-t border-slate-200 bg-slate-50 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-center lg:gap-12 lg:p-10">
          <div>
            <h2 id="contact-title" className="max-w-sm text-3xl font-bold tracking-tight text-brand-blue-dark sm:text-4xl">
              ¿Querés conectarte o necesitás ayuda?
            </h2>
            <p className="mt-3 max-w-sm text-slate-600">
              Escribile por WhatsApp al equipo de ventas o al de soporte técnico.
            </p>
          </div>
          <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
            {channels.map(({ label, detail, phone, number, message, Icon }) => (
              <li key={number}>
                <a
                  href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 p-4 transition-colors hover:bg-blue-50 focus-visible:outline-offset-[-3px] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5"
                >
                  <span className="row-span-2 grid size-10 place-items-center rounded-xl bg-blue-100 text-brand-blue-dark">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-brand-blue-dark">{label}</span>
                  <span className="col-start-2 text-sm text-slate-600 sm:row-start-2">{detail}</span>
                  <span className="col-start-2 text-sm font-medium tabular-nums text-brand-blue-dark sm:col-start-3 sm:row-start-1">{phone}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-1 px-1 text-sm text-slate-600">
          <a
            href="https://maps.google.com/?q=Eugenio+Mendez+502,+San+Miguel+de+Tucum%C3%A1n"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-medium text-brand-blue-dark underline underline-offset-4"
          >
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            Eugenio Méndez 502, San Miguel de Tucumán
          </a>
          <p>Oficina · Lun. a sáb., 9 a 13 y 17 a 20:30</p>
        </div>
      </div>
    </section>
  );
}
