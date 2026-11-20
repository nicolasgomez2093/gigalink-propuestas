import { logoUrl } from "@/lib/brand";
import { Instagram, Mail } from "lucide-react";
import InformationLink from "./InformationLink";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-6 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="#inicio"
              aria-label="Giga Link, volver al inicio"
              className="inline-flex h-12 w-36 items-center justify-center overflow-hidden rounded focus-visible:ring-2 focus-visible:ring-white"
            >
              <img
                src={logoUrl}
                alt="Giga Link"
                loading="lazy"
                decoding="async"
                width="160"
                height="113"
                className="h-auto w-40 max-w-none shrink-0"
              />
            </a>
            <p className="mt-2 text-xs leading-relaxed">
              Internet por fibra y TV Digital en Tucumán.
            </p>
          </div>
          <nav
            aria-label="Enlaces del pie"
            className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-300"
          >
            <a
              href="#planes"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Planes
            </a>
            <a
              href="#cobertura"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Cobertura
            </a>
            <a
              href="#preguntas"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Preguntas frecuentes
            </a>
            <a
              href="#contacto"
              className="inline-flex min-h-11 items-center hover:text-white"
            >
              Contacto
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="https://www.instagram.com/gigalink.tuc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Giga Link"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:info@gigalink.com.ar"
              aria-label="Enviar email a Giga Link"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 border-t border-slate-800 pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5">
            <InformationLink kind="privacy" />
            <InformationLink kind="conditions" />
          </div>
          <p>© {new Date().getFullYear()} Giga Link.</p>
        </div>
      </div>
    </footer>
  );
}
