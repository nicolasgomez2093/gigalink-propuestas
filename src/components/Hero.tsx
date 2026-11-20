import { logoUrl } from "@/lib/brand";
import { scrollToSection } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Pause, Play } from "lucide-react";

const destinations = ["hogar", "negocio", "trabajo", "estudio"];

const Hero = () => {
  const [destination, setDestination] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(
      () => setDestination((index) => (index + 1) % destinations.length),
      3200,
    );
    return () => clearInterval(timer);
  }, [paused, reducedMotion]);
  return (
    <section
      id="inicio"
      data-motion={paused || reducedMotion ? "paused" : "running"}
      className="relative bg-gradient-hero flex items-center overflow-hidden pt-24 pb-8 md:pt-24 md:pb-12"
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-300/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-ping delay-500"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-4 md:mb-5">
            <div className="mb-4 md:mb-5 relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 hidden sm:flex items-center justify-center pointer-events-none"
              >
                <div
                  className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] rounded-full border border-white/10 animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>
                <div
                  className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] rounded-full border border-blue-300/30 animate-spin"
                  style={{
                    animationDuration: "15s",
                    animationDirection: "reverse",
                  }}
                ></div>
              </div>
              <div className="relative">
                <img
                  src={logoUrl}
                  alt="Gigalink - Proveedor de Internet Fibra Óptica Tucumán"
                  fetchPriority="high"
                  decoding="async"
                  width="512"
                  height="512"
                  className="mx-auto h-20 sm:h-40 md:h-56 lg:h-72 xl:h-80 w-auto transform hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: `drop-shadow(0 0 24px rgba(59, 130, 246, 0.55)) drop-shadow(0 0 48px rgba(147, 197, 253, 0.3)) brightness(1.15)`,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-radial from-blue-400/10 via-transparent to-transparent rounded-full blur-xl pointer-events-none"
                ></div>
              </div>
            </div>
            <div className="flex justify-center mb-4 animate-fade-in">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[11px] sm:text-sm text-white">
                <Sparkles
                  className="w-3.5 h-3.5 text-brand-blue-glow flex-shrink-0"
                  aria-hidden="true"
                />
                <span>Internet + TV Digital · Soporte local</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-white animate-fade-in font-bold px-2 leading-[1.1] tracking-tight text-balance">
              Internet y TV Digital para tu{" "}
              <span
                aria-hidden="true"
                className="inline-grid align-bottom text-left"
              >
                {destinations.map((word) => (
                  <span
                    key={word}
                    className="invisible col-start-1 row-start-1"
                  >
                    {word}
                  </span>
                ))}
                <span
                  key={destination}
                  className="col-start-1 row-start-1 bg-gradient-brand bg-clip-text text-transparent motion-safe:animate-fade-in"
                >
                  {destinations[destination]}
                </span>
              </span>
              <span className="sr-only">hogar, negocio, trabajo o estudio</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-5 text-blue-100/90 animate-fade-in px-2 text-pretty">
              Consultá tu cobertura en San Miguel de Tucumán, Banda del Río
              Salí, El Manantial y Alderetes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-0">
            <Button
              onClick={() => scrollToSection("planes")}
              variant="whatsapp"
              size="xl"
              className="w-full sm:w-auto font-semibold hover:scale-[1.03]"
              aria-label="Ver Planes de Internet"
            >
              Ver Planes de Internet
            </Button>
            <Button
              variant="heroGhost"
              size="xl"
              className="w-full sm:w-auto font-semibold"
              onClick={() => scrollToSection("cobertura")}
            >
              Verificar Cobertura
            </Button>
          </div>
        </div>
      </div>
      {!reducedMotion && (
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Reanudar animaciones" : "Pausar animaciones"}
          title={paused ? "Reanudar animaciones" : "Pausar animaciones"}
          className="absolute bottom-2 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-blue-200 hover:bg-white/10"
        >
          {paused ? (
            <Play className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Pause className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      )}
    </section>
  );
};

export default Hero;
