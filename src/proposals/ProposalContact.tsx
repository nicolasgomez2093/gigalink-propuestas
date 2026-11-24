import { Headphones, MapPin, MessageCircle } from "lucide-react";
import type { Redesign } from "./concepts";

type Closing = {
  title: string;
  detail: string;
  action: string;
  target: "#solicitud" | "#planes" | "#barrios" | "#empresas" | "ventas";
  layout: "split" | "center" | "rows" | "support";
};

const closings = {
  pulso: {
    title: "Tu próxima conexión empieza en tu dirección",
    detail: "Comprobá si podemos instalar fibra en tu domicilio y prepará tu consulta en el mismo lugar.",
    action: "Consultar mi dirección", target: "#solicitud", layout: "split",
  },
  casa: {
    title: "Encontrá el plan que encaja en tu casa",
    detail: "Compará velocidades según cómo usan Internet en casa y decidí si querés sumar TV Digital.",
    action: "Ver planes para mi casa", target: "#planes", layout: "center",
  },
  claro: {
    title: "¿Ya elegiste velocidad?",
    detail: "Consultá si el plan está disponible en tu dirección y pedí los detalles de instalación.",
    action: "Consultar por mi plan", target: "ventas", layout: "rows",
  },
  cerca: {
    title: "Primero, ubiquemos tu casa",
    detail: "Revisá los barrios con cobertura y consultá por tu dirección para confirmar la instalación.",
    action: "Buscar mi barrio", target: "#barrios", layout: "rows",
  },
  "dos-mundos": {
    title: "Fibra para abrir tu negocio cada día",
    detail: "Contanos dónde trabajás y qué equipos necesitan conexión. Te orientamos según tu actividad.",
    action: "Ver opciones para empresas", target: "#empresas", layout: "split",
  },
  conexion: {
    title: "De tu dirección al pedido",
    detail: "Cargá tu domicilio, elegí lo que necesitás y revisá el mensaje antes de mandarlo por WhatsApp.",
    action: "Preparar mi consulta", target: "#solicitud", layout: "center",
  },
  senal: {
    title: "Soporte técnico de acá",
    detail: "¿Tenés cortes o problemas de Wi-Fi? Escribinos con la dirección donde tenés instalado el servicio.",
    action: "Consultar por una instalación nueva", target: "#solicitud", layout: "support",
  },
  orbita: {
    title: "¿Cuántos dispositivos se conectan en tu casa?",
    detail: "Compará velocidades pensando en el momento en que todos usan la conexión a la vez.",
    action: "Comparar velocidades", target: "#planes", layout: "center",
  },
  negocio: {
    title: "Armemos la conexión de tu negocio",
    detail: "Pasale a ventas la dirección y contale si usás cobros en línea, videollamadas o varios puestos de trabajo.",
    action: "Consultar para mi negocio", target: "ventas", layout: "split",
  },
  tucuman: {
    title: "Tu barrio, tu conexión",
    detail: "Revisá por dónde pasa la fibra de Giga Link en Tucumán. Para confirmar la instalación, consultá por tu domicilio.",
    action: "Ver barrios con cobertura", target: "#barrios", layout: "rows",
  },
  infinita: {
    title: "Elegí cuánto querés conectar",
    detail: "Revisá las tres velocidades y elegí la que acompañe tus juegos, descargas y pantallas.",
    action: "Elegir mi velocidad", target: "#planes", layout: "split",
  },
} satisfies Record<Redesign["id"], Closing>;

const whatsapp = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

const salesLink = (message: string) => whatsapp("5493814092755", message);
const supportLink = whatsapp("5493813637606", "Hola Giga Link, necesito ayuda con mi conexión.");

export default function ProposalContact({ concept }: { concept: Redesign }) {
  const { title, detail, action, target, layout } = closings[concept.id];
  const sales = target === "ventas";
  const supportFirst = layout === "support";
  const salesMessage = concept.id === "negocio"
    ? "Hola Giga Link, quiero consultar por Internet para mi negocio."
    : "Hola Giga Link, quiero consultar por un plan y la instalación en mi domicilio.";
  const external = { target: "_blank", rel: "noopener noreferrer" };
  const newService = (
    <a className={supportFirst ? "closing-link" : "closing-primary"}
      href={sales ? salesLink(salesMessage) : target} {...(sales ? external : {})}>
      {action}
    </a>
  );
  const support = (
    <a className={supportFirst ? "closing-primary" : "closing-link"} href={supportLink} {...external}>
      <Headphones aria-hidden="true" /> {supportFirst ? "Escribir a soporte técnico" : "Ya soy cliente: pedir soporte"}
    </a>
  );

  return (
    <section id="contacto" className="proposal-closing" data-layout={layout} aria-labelledby="closing-title">
      <div className="concept-shell">
        <div className="closing-panel">
          <div className="closing-copy">
            <h2 id="closing-title">{title}</h2>
            <p>{detail}</p>
          </div>
          <div className="closing-actions">
            {supportFirst ? <>{support}{newService}</> : <>{newService}{support}</>}
          </div>
        </div>
        <div className="closing-directory">
          <a href={salesLink(salesMessage)} {...external}><MessageCircle aria-hidden="true" /> Ventas · 381 409-2755</a>
          <div><a href={supportLink} {...external}><Headphones aria-hidden="true" /> Soporte · 381 363-7606</a><span>Lun. a sáb., 9:30 a 20:30</span></div>
          <div>
            <a href="https://maps.google.com/?q=Eugenio+Mendez+502,+San+Miguel+de+Tucum%C3%A1n" {...external}>
              <MapPin aria-hidden="true" /> Eugenio Méndez 502, San Miguel de Tucumán
            </a>
            <span>Oficina · Lun. a sáb., 9 a 13 y 17 a 20:30</span>
          </div>
        </div>
      </div>
    </section>
  );
}
