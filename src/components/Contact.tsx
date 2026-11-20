import { MessageCircle, Headphones, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section
      id="contacto"
      className="bg-gradient-contact py-10 text-white sm:py-12"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Hablemos</h2>
          <p className="mt-2 text-sm text-blue-100">
            Elegí el equipo que necesitás.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <MessageCircle
                className="h-5 w-5 text-brand-green"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Quiero contratar</h3>
            </div>
            <p className="mb-4 mt-2 text-sm text-blue-100">
              Precios, instalación y consultas sobre el servicio.
            </p>
            <Button
              asChild
              variant="whatsapp"
              className="min-h-11 w-full rounded-xl"
            >
              <a
                href="https://wa.me/5493814092755?text=Hola%20Giga%20Link%2C%20quiero%20consultar%20por%20el%20servicio"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir a ventas por WhatsApp: 381-4092755"
              >
                Hablar con ventas
              </a>
            </Button>
            <p className="mt-3 text-xs text-blue-200">381 409-2755</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <Headphones
                className="h-5 w-5 text-blue-300"
                aria-hidden="true"
              />
              <h3 className="text-lg font-semibold">Ya soy cliente</h3>
            </div>
            <p className="mb-4 mt-2 text-sm text-blue-100">
              Ayuda técnica y consultas sobre tu conexión.
            </p>
            <Button
              asChild
              variant="outline"
              className="min-h-11 w-full rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a
                href="https://wa.me/5493813637606?text=Hola%2C%20necesito%20soporte%20para%20mi%20conexi%C3%B3n%20Giga%20Link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir a soporte técnico por WhatsApp: 381-3637606"
              >
                Pedir soporte
              </a>
            </Button>
            <p className="mt-3 text-xs text-blue-200">
              381 363-7606 · Lun. a sáb., 9:30 a 20:30
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 text-center text-xs leading-relaxed text-blue-200 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
          <a
            href="https://maps.google.com/?q=Eugenio+Mendez+502,+San+Miguel+de+Tucum%C3%A1n"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 underline underline-offset-4 sm:justify-start"
          >
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            Eugenio Méndez 502, San Miguel de Tucumán
          </a>
          <p>Oficina: lun. a sáb., 9 a 13 y 17 a 20:30</p>
        </div>
      </div>
    </section>
  );
}
