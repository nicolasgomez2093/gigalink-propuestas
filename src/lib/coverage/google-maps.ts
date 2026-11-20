let loading: Promise<void> | undefined;
export async function loadGoogleMap() {
  if (typeof google !== "undefined" && google.maps?.importLibrary) return;
  if (!loading)
    loading = new Promise<void>((resolve, reject) => {
      const mapsWindow = window as Window & { __gigalinkMapReady?: () => void };
      const script = document.createElement("script");
      const finish = (error?: Error) => {
        clearTimeout(timer);
        delete mapsWindow.__gigalinkMapReady;
        if (error) {
          script.remove();
          reject(error);
        } else resolve();
      };
      const timer = setTimeout(
        () => finish(new Error("No pudimos cargar el mapa.")),
        15000,
      );
      mapsWindow.__gigalinkMapReady = () => finish();
      script.src = `https://maps.googleapis.com/maps/api/js?${new URLSearchParams({ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, language: "es", region: "AR", v: "weekly", loading: "async", callback: "__gigalinkMapReady" })}`;
      script.async = true;
      script.onerror = () => finish(new Error("No pudimos cargar el mapa."));
      document.head.appendChild(script);
    }).catch((error) => {
      loading = undefined;
      throw error;
    });
  return loading;
}
