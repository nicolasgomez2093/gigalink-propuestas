import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import { concepts } from "./proposals/concepts";
import { Gallery } from "./proposals/Gallery";
import "./proposals/proposals.css";

const view = new URLSearchParams(window.location.search).get("vista");
const concept = concepts.find(({ id }) => id === view);
if (concept) document.title = `${concept.name} · Giga Link`;

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    {concept ? <Index concept={concept} /> : <Gallery />}
  </TooltipProvider>
);

export default App;
