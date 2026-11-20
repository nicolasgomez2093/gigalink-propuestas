import { ChevronDown } from "lucide-react";
import { formatPrice, TV_MONTHLY_PRICE } from "@/lib/coverage/pricing";

const questions = [
  {
    question: "¿Qué plan me conviene?",
    answer:
      "El de 50 Mbps es una opción para navegar y ver series. El de 100 Mbps ofrece más margen para varios dispositivos y videollamadas. El de 300 Mbps es una alternativa para descargas y uso más intenso. Si no estás seguro, elegí «Necesito asesoramiento» en la consulta y te ayudamos.",
  },
  {
    question: "¿Puedo contratar TV Digital sin Internet?",
    answer: `Sí. TV Digital sola cuesta ${formatPrice(TV_MONTHLY_PRICE)} por mes. También podés agregarla a cualquier plan de Internet por el mismo importe mensual.`,
  },
  {
    question: "¿Cómo sé si tengo cobertura?",
    answer:
      "Ingresá tu calle y altura o el nombre del barrio en la consulta de cobertura. También podés usar tu ubicación si estás en el lugar de instalación. Revisá el punto encontrado en el mapa y confirmalo. La disponibilidad final de instalación se verifica para cada domicilio.",
  },
  {
    question: "¿Cuánto cuesta la instalación?",
    answer:
      "El costo se confirma con nuestro equipo según el domicilio y el servicio. Los costos de instalación y cambios de equipo pueden variar; te informamos las condiciones antes de contratar.",
  },
  {
    question: "¿Qué pasa cuando envío la consulta?",
    answer:
      "Se abre WhatsApp con un mensaje que reúne tus respuestas. Podés revisarlo antes de enviarlo a ventas. Completar el formulario no contrata el servicio ni realiza un cobro.",
  },
];

export default function FAQ() {
  return (
    <section id="preguntas" className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Antes de conectarte
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Respuestas a las dudas más comunes.
          </p>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded py-4 text-left text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 pr-5 text-sm leading-relaxed text-slate-600">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
