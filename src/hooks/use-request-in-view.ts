import { useEffect, useState } from "react";

/** Keep floating shortcuts from covering the active service request. */
export function useRequestInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = document.getElementById("solicitud");
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        rootMargin: "-64px 0px 0px 0px",
        threshold: 0,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return inView;
}
