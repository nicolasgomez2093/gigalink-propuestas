import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { logoUrl } from "@/lib/brand";
import { concepts, mediaUrl } from "./concepts";

export function Gallery() {
  return (
    <div className="gallery">
      <header className="gallery-header concept-shell">
        <img src={logoUrl} alt="Giga Link" width="144" height="102" />
        <a href="#propuestas">Explorar propuestas</a>
      </header>
      <main id="contenido" className="concept-shell gallery-main">
        <div className="gallery-intro">
          <h1>Elegí la próxima web <span>de Giga Link.</span></h1>
          <p>Compará la versión actual con siete propuestas navegables. Explorá los planes, probá el recorrido de cobertura y compará cómo cada propuesta presenta la oferta para empresas.</p>
        </div>
        <section id="propuestas" aria-label="Propuestas de diseño" className="gallery-grid">
          {concepts.map((concept) => (
            <article key={concept.id} className="gallery-card">
              <a href={`?vista=${concept.id}`} aria-label={`Abrir ${concept.name}`}>
                <div className={`concept-cover cover-${concept.id}`} aria-hidden="true">
                  {concept.art && <img src={mediaUrl(concept.art)} alt="" width="900" height="600" loading="lazy" />}
                  {concept.id === "actual" && <img className="cover-logo" src={logoUrl} alt="" width="144" height="102" />}
                  <span>{concept.headline[0]} <strong>{concept.headline[1]}</strong></span>
                </div>
                <div className="gallery-card-detail">
                  <div><h2>{concept.name}</h2><p>{concept.description}</p></div>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export function GalleryLink() {
  return <a className="gallery-back" href="./"><LayoutGrid aria-hidden="true" /> Galería</a>;
}
