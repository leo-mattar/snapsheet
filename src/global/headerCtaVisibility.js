export default function headerCtaVisibility() {
  const elements = document.querySelectorAll("[data-header-cta-visibility]");
  if (!elements.length) return;

  const header = document.querySelector(".c-header");
  const headerCta = document.querySelector(".c-header-cta");

  if (!header && !headerCta) return;

  elements.forEach(element => {
    if (!element) return;

    ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        element.setAttribute("data-header-cta-visibility", "true");
        if (header) header.classList.add("cta-header-active");
        if (headerCta) headerCta.classList.add("is-active");
      },
      onLeave: () => {
        element.removeAttribute("data-header-cta-visibility");
        if (header) header.classList.remove("cta-header-active");
        if (headerCta) headerCta.classList.remove("is-active");
      },
      onEnterBack: () => {
        element.setAttribute("data-header-cta-visibility", "true");
        if (header) header.classList.add("cta-header-active");
        if (headerCta) headerCta.classList.add("is-active");
      },
      onLeaveBack: () => {
        element.removeAttribute("data-header-cta-visibility");
        if (header) header.classList.remove("cta-header-active");
        if (headerCta) headerCta.classList.remove("is-active");
      },
    });
  });
}
