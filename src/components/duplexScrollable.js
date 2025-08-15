export default function duplexScrollable() {
  const section = document.querySelector("[data-section-duplex-scrollable]");
  if (!section) return;

  const items = section.querySelectorAll("[data-item-duplex-scrollable]");
  if (!items.length) return;

  gsap.set(items[0], { autoAlpha: 1 });

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    if (index !== 0) gsap.set(item, { autoAlpha: 0 });

    ScrollTrigger.create({
      trigger: item,
      start: "top center",
      end: "bottom top",
      onEnter: () => showItem(item, index),
      onEnterBack: () => showItem(item, index),
    });
  });

  function showItem(item, index) {
    const isLast = index === items.length - 1;
    items.forEach((other, i) => {
      if (other !== item && (!isLast || i !== items.length - 1)) {
        gsap.to(other, { autoAlpha: 0, duration: 0.6, ease: "power4.inOut" });
      }
    });
    gsap.to(item, { autoAlpha: 1, duration: 0.6, ease: "power4.inOut" });
  }
}
