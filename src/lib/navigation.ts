export function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function focusSection(section: HTMLElement) {
  const target = section.querySelector<HTMLElement>("h1, h2, h3") || section;
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
}

export function scrollToSection(id: string, moveFocus = true) {
  const section = document.getElementById(id);
  if (!section) return null;
  section.scrollIntoView({
    behavior: preferredScrollBehavior(),
    block: "start",
  });
  if (moveFocus) focusSection(section);
  return section;
}
