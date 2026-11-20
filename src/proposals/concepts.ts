export const concepts = [
  {
    id: "actual",
    name: "Versión actual",
    description: "El sitio vigente, como punto de partida para comparar.",
    headline: ["Internet y TV Digital", "para tu hogar"],
    intro: "",
    art: null,
  },
  {
    id: "pulso",
    name: "Pulso Fibra",
    description: "Un hero oscuro de alto impacto para posicionar la marca como tecnológica.",
    headline: ["La fibra que conecta", "tu día."],
    intro: "Internet por fibra y TV Digital en Tucumán. Elegí entre 50, 100 y 300 Mbps y consultá disponibilidad en tu domicilio.",
    art: "fibra",
  },
  {
    id: "casa",
    name: "En Casa",
    description: "Fotografía cotidiana y mensajes que ayudan a elegir un plan para el hogar.",
    headline: ["Tu casa, mejor", "conectada."],
    intro: "Para trabajar, ver tus series y compartir la conexión. Elegí tu plan de fibra y sumá TV Digital cuando quieras.",
    art: "hogar",
  },
  {
    id: "claro",
    name: "Fibra Clara",
    description: "Una comparación directa para quien entra decidido a ver planes y precios.",
    headline: ["Elegí tu velocidad.", "Conectate por fibra."],
    intro: "Compará los planes residenciales, elegí tu localidad y consultá disponibilidad.",
    art: null,
  },
  {
    id: "cerca",
    name: "Cerca Tuyo",
    description: "Pone la cobertura y el acompañamiento local al principio del recorrido.",
    headline: ["¿La fibra llega", "a tu casa?"],
    intro: "Buscá tu domicilio en Tucumán y averiguá si podés contratar Internet por fibra y TV Digital.",
    art: null,
  },
  {
    id: "dos-mundos",
    name: "Dos Mundos",
    description: "Dos entradas claras para hogar y empresas, con prioridad visual para el hogar.",
    headline: ["Fibra donde", "hacés tu día."],
    intro: "Planes para tu casa y asesoramiento para comercios, oficinas y empresas de Tucumán.",
    art: "hogar",
  },
  {
    id: "conexion",
    name: "Conexión Simple",
    description: "Un recorrido guiado para pasar de la consulta de cobertura a WhatsApp.",
    headline: ["Conectarte", "es simple."],
    intro: "Consultá tu dirección, contanos qué necesitás y prepará tu solicitud para ventas.",
    art: null,
  },
  {
    id: "senal",
    name: "Señal Local",
    description: "Una portada editorial que presenta la oferta residencial y reserva un bloque para empresas.",
    headline: ["Internet por fibra.", "Soporte de acá."],
    intro: "Conectá tu casa en Tucumán con planes de 50, 100 y 300 Mbps y TV Digital opcional.",
    art: "fibra",
  },
  {
    id: "orbita",
    name: "Órbita Digital",
    description: "Nueva propuesta: ecosistema visual de señal, fibra y velocidad.",
    headline: ["Una conexión", "en otra órbita."],
    intro: "Elegí tu velocidad de fibra, sumá TV Digital y conectá los momentos que importan.",
    art: "fibra-red",
  },
  {
    id: "negocio",
    name: "Negocios Conectados",
    description: "Nueva propuesta: foco en comercios y equipos de trabajo, con hogar a un paso.",
    headline: ["Tu negocio no", "se desconecta."],
    intro: "Internet por fibra para cobrar, trabajar y atender a tus clientes en Tucumán.",
    art: "negocio",
  },
  {
    id: "tucuman",
    name: "Conectados Acá",
    description: "Nueva propuesta: cercanía local y cobertura representadas desde Tucumán.",
    headline: ["La fibra de acá.", "Para llegar más lejos."],
    intro: "Atención local, consulta de cobertura y planes para tu hogar y tu negocio.",
    art: "tucuman",
  },
  {
    id: "infinita",
    name: "Fibra Infinita",
    description: "Nueva propuesta: interacción visual por capas y movimiento que acompaña el recorrido.",
    headline: ["Más rápido todo", "lo que conectás."],
    intro: "Descubrí los planes de Internet por fibra y elegí el que acompaña tu día.",
    art: "fibra-red",
  },
] as const;

export type Concept = (typeof concepts)[number];
export type Redesign = Exclude<Concept, { id: "actual" }>;

export const mediaUrl = (name: string) =>
  `${import.meta.env.BASE_URL}propuestas/${name}.webp`;
