import { useRequestInView } from "@/hooks/use-request-in-view";
import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);
  const requestInView = useRequestInView();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () =>
    window.open(
      "https://wa.me/5493814092755?text=Hola,%20quiero%20más%20información%20sobre%20Gigalink",
      "_blank",
    );

  if (!visible || requestInView) return null;

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="whatsapp"
      size="icon"
      aria-label="Contactar por WhatsApp"
      title="WhatsApp"
      className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full p-0 shadow-md transition-colors hover:scale-100 active:scale-100"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
    </Button>
  );
};

export default FloatingWhatsApp;
