import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function PrivacyDetails() {
  return (
    <>
      <p>
        <strong>Tu consulta:</strong> pedimos domicilio o barrio, preferencias
        del servicio, nombre y teléfono para preparar un mensaje al equipo de
        ventas de Giga Link. No necesitás crear una cuenta.
      </p>
      <p>
        <strong>Búsqueda de ubicación:</strong> lo que escribís en la búsqueda
        se comparte con Google Maps para obtener sugerencias y direcciones. Para
        identificar el barrio, también puede consultarse OpenStreetMap mediante
        Photon. La ubicación del dispositivo se solicita únicamente al tocar
        “Usar mi ubicación actual” y requiere permiso de tu navegador.
      </p>
      <p>
        <strong>Antes de enviar:</strong> las respuestas del formulario
        permanecen en la memoria de esta página; este formulario no las guarda
        en una base de datos. Podés volver a los pasos anteriores para
        editarlas. Al recargar o cerrar la página se pierden.
      </p>
      <p>
        <strong>WhatsApp:</strong> al tocar “Enviar por WhatsApp” se abre
        WhatsApp con un mensaje que incluye tus respuestas y, si lo confirmaste,
        el punto del mapa. Giga Link lo recibe cuando confirmás el envío en
        WhatsApp. Google Maps, OpenStreetMap y WhatsApp procesan las
        interacciones con sus servicios según sus propias políticas.
      </p>
      <p>
        Para consultar sobre los datos que ya enviaste, contactá a ventas de
        Giga Link:{" "}
        <a
          className="font-medium text-brand-blue underline"
          href="https://wa.me/5493814092755"
          target="_blank"
          rel="noopener noreferrer"
        >
          381 409-2755 por WhatsApp
        </a>
        .
      </p>
    </>
  );
}
function ConditionsDetails() {
  return (
    <>
      <p>
        <strong>Es una consulta, no una contratación.</strong> Completar los
        pasos prepara un mensaje para ventas. No confirma una instalación, no
        crea una cuenta y no realiza un cobro.
      </p>
      <p>
        <strong>Precio y condiciones:</strong> solicitá la cotización vigente.
        Antes de contratar, Giga Link debe confirmarte el total mensual, el
        costo de instalación, los impuestos, las promociones y sus plazos, el
        equipamiento y cualquier condición aplicable. Los abonos residenciales
        publicados dependen de la localidad y del servicio elegido. El cambio de
        equipo para clientes actuales que lo necesiten se cotiza por separado.
      </p>
      <p>
        <strong>Cobertura:</strong> la consulta identifica barrios del catálogo
        de Giga Link. La ubicación geográfica y el barrio pueden ser
        aproximados. La disponibilidad técnica de instalación se confirma para
        cada domicilio con nuestro equipo.
      </p>
      <p>
        <strong>Si buscás un barrio:</strong> podés continuar con la consulta;
        la calle y altura quedarán a coordinar por WhatsApp. Para indicar un
        punto más preciso, buscá tu calle y altura.
      </p>
      <p>
        <strong>Instalación:</strong> el turno y los plazos se acuerdan con Giga
        Link según la disponibilidad. Revisá la cotización y las condiciones
        finales antes de aceptar el servicio.
      </p>
    </>
  );
}

export default function InformationLink({
  kind,
}: {
  kind: "privacy" | "conditions" | "request";
}) {
  const title =
    kind === "request"
      ? "Sobre tu consulta"
      : kind === "privacy"
        ? "Privacidad y datos"
        : "Condiciones de la consulta";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="min-h-11 rounded text-xs underline underline-offset-4 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          {title}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Información sobre tus datos y la consulta de servicio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          {kind === "request" && (
            <h3 className="font-semibold text-slate-900">Privacidad y datos</h3>
          )}
          {kind !== "conditions" && <PrivacyDetails />}
          {kind === "request" && (
            <h3 className="border-t pt-4 font-semibold text-slate-900">
              Condiciones de la consulta
            </h3>
          )}
          {kind !== "privacy" && <ConditionsDetails />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
