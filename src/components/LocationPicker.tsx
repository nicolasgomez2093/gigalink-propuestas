import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadGoogleMap } from "@/lib/coverage/google-maps";

type Props = {
  latitude: number;
  longitude: number;
  confirmed: boolean;
  confirming: boolean;
  error?: string;
  onMove: (latitude: number, longitude: number) => void;
  onConfirm: () => void;
};
export default function LocationPicker({
  latitude,
  longitude,
  confirmed,
  confirming,
  error,
  onMove,
  onConfirm,
}: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();
  const marker = useRef<google.maps.marker.AdvancedMarkerElement>();
  const callback = useRef(onMove);
  const initial = useRef({ lat: latitude, lng: longitude });
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState("");
  callback.current = onMove;
  useEffect(() => {
    let disposed = false;
    const listeners: google.maps.MapsEventListener[] = [];
    const cleanups: Array<() => void> = [];
    async function init() {
      try {
        await loadGoogleMap();
        const [maps, markers] = (await Promise.all([
          google.maps.importLibrary("maps"),
          google.maps.importLibrary("marker"),
        ])) as [google.maps.MapsLibrary, google.maps.MarkerLibrary];
        if (disposed || !container.current) return;
        const instance = new maps.Map(container.current, {
          center: initial.current,
          zoom: 18,
          mapId: "DEMO_MAP_ID",
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: "cooperative",
          clickableIcons: false,
        });
        map.current = instance;
        marker.current = new markers.AdvancedMarkerElement({
          map: instance,
          position: initial.current,
          gmpDraggable: true,
          title:
            "Lugar de instalación. Arrastrá el marcador o usá el teclado para ajustarlo.",
        });
        listeners.push(
          instance.addListener("click", (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              marker.current!.position = event.latLng;
              callback.current(event.latLng.lat(), event.latLng.lng());
            }
          }),
        );
        const movableMarker = marker.current;
        const onDragEnd = () => {
          const point = movableMarker.position;
          if (!point) return;
          const lat = typeof point.lat === "function" ? point.lat() : point.lat;
          const lng = typeof point.lng === "function" ? point.lng() : point.lng;
          callback.current(lat, lng);
        };
        movableMarker.addEventListener("gmp-dragend", onDragEnd);
        cleanups.push(() =>
          movableMarker.removeEventListener("gmp-dragend", onDragEnd),
        );
        setLoading(false);
      } catch {
        if (!disposed) {
          setLoading(false);
          setMapError(
            "No pudimos cargar el mapa. Podés revisar el punto en Google Maps y confirmar, o continuar con revisión por WhatsApp.",
          );
        }
      }
    }
    void init();
    return () => {
      disposed = true;
      listeners.forEach((listener) => listener.remove());
      cleanups.forEach((cleanup) => cleanup());
      if (marker.current) marker.current.map = null;
      map.current = undefined;
      marker.current = undefined;
    };
  }, []);
  useEffect(() => {
    const position = { lat: latitude, lng: longitude };
    if (marker.current) marker.current.position = position;
    map.current?.panTo(position);
  }, [latitude, longitude]);
  return (
    <div className="space-y-3">
      <div>
        <h4
          id="location-confirmation-title"
          tabIndex={-1}
          className="font-semibold text-gray-900 outline-none"
        >
          Confirmá el lugar de instalación
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">
          Revisá el punto. Si hace falta, arrastrá el marcador o tocá el mapa
          sobre tu casa.
        </p>
      </div>
      <div className="relative overflow-hidden rounded-xl border bg-gray-100">
        <div
          ref={container}
          role="region"
          aria-label="Mapa para confirmar el lugar de instalación"
          className="h-64 w-full sm:h-80"
        />
        {loading && (
          <div
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-50 text-sm text-gray-600"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando mapa…
          </div>
        )}
      </div>
      {mapError && (
        <p role="status" className="text-sm text-amber-900">
          {mapError}
        </p>
      )}
      <Button
        type="button"
        variant={confirmed ? "outline" : "whatsappBlue"}
        disabled={confirming}
        onClick={onConfirm}
        aria-invalid={!!error}
        className="min-h-12 w-full whitespace-normal text-center"
      >
        {confirming ? (
          <Loader2 className="animate-spin" />
        ) : confirmed ? (
          <CheckCircle2 />
        ) : (
          <MapPin />
        )}
        {confirming
          ? "Consultando cobertura…"
          : confirmed
            ? "Ubicación confirmada · volver a consultar"
            : "Confirmar ubicación y consultar cobertura"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
