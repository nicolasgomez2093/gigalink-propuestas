import { logoUrl } from "@/lib/brand";
import { focusSection, scrollToSection } from "@/lib/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu, MessageCircle } from "lucide-react";

const standardLinks = [
  { id: "planes", label: "Planes" },
  { id: "cobertura", label: "Cobertura" },
  { id: "preguntas", label: "Preguntas frecuentes" },
  { id: "contacto", label: "Contacto" },
];

const businessLink = { id: "empresas", label: "Empresas" };
const proposalLinks = [...standardLinks.slice(0, 2), businessLink, ...standardLinks.slice(2)];

const Navbar = ({ showBusiness = false }: { showBusiness?: boolean }) => {
  const links = showBusiness ? proposalLinks : standardLinks;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const pendingFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [links]);

  const go = (id: string) => {
    const section = scrollToSection(id, !open);
    pendingFocus.current = open ? section : null;
    setOpen(false);
  };

  const whatsapp = () =>
    window.open(
      "https://wa.me/5493814092755?text=Hola,%20quiero%20información%20sobre%20los%20planes%20de%20internet",
      "_blank",
    );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-darker/85 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go("inicio")}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-glow rounded"
          aria-label="Ir al inicio"
        >
          <span className="flex h-[44px] w-[128px] items-center justify-center overflow-hidden">
            <img
              src={logoUrl}
              alt="Giga Link"
              className="h-auto w-[144px] max-w-none shrink-0"
              width="144"
              height="102"
            />
          </span>
        </button>

        <ul className={`hidden ${showBusiness ? "lg:flex" : "md:flex"} items-center gap-1`}>
          {links.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => go(l.id)}
                className={`px-3 py-2 text-sm font-medium rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue-glow ${
                  active === l.id
                    ? "text-white bg-white/10"
                    : "text-gray-200 hover:text-white hover:bg-white/5"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className={`hidden ${showBusiness ? "lg:block" : "md:block"}`}>
          <Button
            onClick={whatsapp}
            variant="whatsapp"
            size="pill"
            aria-label="Contactar por WhatsApp a ventas"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </Button>
        </div>

        <div className={showBusiness ? "lg:hidden" : "md:hidden"}>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menú"
                className="h-11 w-11 text-white hover:bg-white/10"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              onCloseAutoFocus={(event) => {
                if (pendingFocus.current) {
                  event.preventDefault();
                  focusSection(pendingFocus.current);
                  pendingFocus.current = null;
                }
              }}
              className="bg-surface-darker text-white border-white/10 overflow-y-auto"
            >
              <SheetTitle className="text-white">Menú</SheetTitle>
              <SheetDescription className="sr-only">
                Accesos a planes, cobertura, preguntas y contacto.
              </SheetDescription>
              <div className="mt-8 flex flex-col gap-2">
                {links.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => go(l.id)}
                    className="text-left px-3 py-3 rounded hover:bg-white/10 text-base font-medium"
                  >
                    {l.label}
                  </button>
                ))}
                <Button
                  onClick={whatsapp}
                  variant="whatsapp"
                  size="pill"
                  className="mt-4"
                  aria-label="Contactar por WhatsApp a ventas"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
