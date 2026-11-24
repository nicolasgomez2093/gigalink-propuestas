import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Plans from "../components/Plans";
import WhyUs from "../components/WhyUs";
import Coverage from "../components/Coverage";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import { GalleryLink } from "../proposals/Gallery";
import { BusinessSection, RedesignHero } from "../proposals/RedesignPage";
import type { Concept } from "../proposals/concepts";
import ProposalContact from "../proposals/ProposalContact";

export default function Index({ concept }: { concept: Concept }) {
  const redesign = concept.id === "actual" ? null : concept;
  const coverageFirst = redesign?.id === "cerca" || redesign?.id === "conexion";
  return (
    <div className="site min-h-screen scroll-smooth" data-concept={redesign?.id}>
      <a
        href="#contenido"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-brand-blue-dark shadow-lg focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Navbar showBusiness={!!redesign} />
      <main id="contenido" tabIndex={-1}>
        {redesign ? <RedesignHero concept={redesign} /> : <Hero />}
        {(!redesign || redesign.id === "casa" || redesign.id === "senal") && <WhyUs />}
        {coverageFirst && <Coverage />}
        <Plans />
        {redesign && redesign.id !== "senal" && <BusinessSection concept={redesign} />}
        {!coverageFirst && <Coverage />}
        {redesign?.id === "senal" && <BusinessSection concept={redesign} />}
        <FAQ />
        {redesign ? <ProposalContact concept={redesign} /> : <Contact />}
      </main>
      <Footer />
      <GalleryLink />
      <FloatingWhatsApp />
    </div>
  );
}
