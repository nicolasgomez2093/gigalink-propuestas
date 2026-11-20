import {
  ArrowUpRight,
  Building2,
  CircleHelp,
  Cloud,
  Home,
  MapPin,
  MessageCircle,
  Monitor,
  Store,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoUrl } from "@/lib/brand";
import { LOCALITIES } from "@/lib/coverage/catalog";
import { formatPrice, RESIDENTIAL_PLANS } from "@/lib/coverage/pricing";
import { scrollToSection } from "@/lib/navigation";
import { mediaUrl, type Redesign } from "./concepts";

const journey = [
  { icon: MapPin, label: "Consultá tu domicilio", detail: "Ingresá una dirección o usá tu ubicación." },
  { icon: CircleHelp, label: "Contanos qué necesitás", detail: "Elegí el servicio y cómo lo vas a usar." },
  { icon: MessageCircle, label: "Contactá a ventas", detail: "Revisá tu mensaje y envialo por WhatsApp." },
];

const businessUses = [
  { icon: Store, label: "Comercios", detail: "Cobros, pedidos y herramientas de venta." },
  { icon: Monitor, label: "Oficinas", detail: "Reuniones y varios puestos conectados." },
  { icon: Cloud, label: "Empresas", detail: "Aplicaciones en la nube y equipos de trabajo." },
];

function HeroActions({ coverageFirst = false }: { coverageFirst?: boolean }) {
  const primary = coverageFirst ? ["solicitud", "Consultar cobertura"] : ["planes", "Ver planes de Internet"];
  const secondary = coverageFirst ? ["planes", "Ver planes"] : ["solicitud", "Consultar cobertura"];
  return (
    <div className="concept-actions">
      <Button variant="whatsappBlue" size="xl" onClick={() => scrollToSection(primary[0])}>
        {primary[1]}
      </Button>
      <Button variant="outline" size="xl" onClick={() => scrollToSection(secondary[0])}>
        {secondary[1]}
      </Button>
    </div>
  );
}

function SpeedBoard() {
  return (
    <div className="speed-board" aria-label="Velocidades residenciales de Internet">
      <ul>
        {RESIDENTIAL_PLANS.map((plan) => (
          <li key={plan.name}>
            <span>{plan.speed}</span>
            <span>Desde {formatPrice(plan.east)} / mes</span>
          </li>
        ))}
      </ul>
      <p>Tarifas según localidad.</p>
    </div>
  );
}

function LocalBoard() {
  return (
    <div className="local-board">
      <div className="local-board-title"><MapPin aria-hidden="true" /> Localidades con cobertura</div>
      <ul>{LOCALITIES.map((locality) => <li key={locality}>{locality}</li>)}</ul>
      <button type="button" onClick={() => scrollToSection("barrios")}>Ver barrios con cobertura</button>
    </div>
  );
}

function Journey() {
  return (
    <ol className="journey">
      {journey.map(({ icon: Icon, label, detail }) => (
        <li key={label}>
          <Icon aria-hidden="true" />
          <div><strong>{label}</strong><span>{detail}</span></div>
        </li>
      ))}
    </ol>
  );
}

function AudienceCards() {
  return (
    <div className="audience-cards">
      <button type="button" className="audience-home" onClick={() => scrollToSection("planes")}>
        <img src={mediaUrl("hogar")} alt="" width="900" height="600" fetchPriority="high" />
        <span><Home aria-hidden="true" /><strong>Para tu hogar</strong><span>Ver Internet y TV Digital</span></span>
      </button>
      <button type="button" className="audience-business" onClick={() => scrollToSection("empresas")}>
        <Building2 aria-hidden="true" />
        <strong>Para tu negocio</strong><span>Conocé las opciones para empresas</span>
      </button>
    </div>
  );
}

export function RedesignHero({ concept }: { concept: Redesign }) {
  const { id, headline, intro } = concept;
  const image = id === "pulso" || id === "casa" || id === "senal" ? concept.art : null;
  return (
    <section id="inicio" className="concept-hero">
      <div className="concept-shell hero-layout">
        <div className="hero-message">
          <p className="hero-category"><Wifi aria-hidden="true" /> {id === "senal" ? "Internet y TV Digital en Tucumán" : "Fibra óptica en Tucumán"}</p>
          <h1>{headline[0]} <span>{headline[1]}</span></h1>
          <p className="hero-intro">{intro}</p>
          <HeroActions coverageFirst={id === "cerca" || id === "conexion"} />
        </div>
        {image && (
          <div className="hero-image">
            <img src={mediaUrl(image)} alt="" width="900" height="600" fetchPriority="high" />
          </div>
        )}
        {id === "claro" && <SpeedBoard />}
        {id === "cerca" && <LocalBoard />}
        {id === "dos-mundos" && <AudienceCards />}
        {id === "conexion" && <Journey />}
        {id === "senal" && <div className="editorial-mark"><img src={logoUrl} alt="" width="144" height="102" /></div>}
      </div>
    </section>
  );
}

const businessMessage = "Hola Giga Link, quiero consultar por Internet para mi empresa. ¿Me pueden asesorar?";

export function BusinessSection({ concept }: { concept: Redesign }) {
  const photo = concept.id === "casa" || concept.id === "dos-mundos" || concept.id === "senal";
  return (
    <section id="empresas" className="business-section">
      <div className="concept-shell">
        <div className="business-content">
          <div className="business-copy">
            <p className="business-label"><Building2 aria-hidden="true" /> Giga Link Empresas</p>
            <h2>Internet para tu negocio</h2>
            <p>Contanos dónde trabajás y cómo usás Internet. Te orientamos para elegir una conexión acorde a tu actividad.</p>
            <Button asChild variant="whatsappBlue" size="lg">
              <a href={`https://wa.me/5493814092755?text=${encodeURIComponent(businessMessage)}`} target="_blank" rel="noopener noreferrer">
                Consultar por WhatsApp <ArrowUpRight aria-hidden="true" />
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </Button>
          </div>
          {photo && <img className="business-photo" src={mediaUrl("empresas")} alt="" width="900" height="600" loading="lazy" />}
          <ul className="business-uses">
            {businessUses.map(({ icon: Icon, label, detail }) => (
              <li key={label}><Icon aria-hidden="true" /><div><strong>{label}</strong><span>{detail}</span></div></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
