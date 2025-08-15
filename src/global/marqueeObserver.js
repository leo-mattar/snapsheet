export default function marqueeObserver() {
  const intersectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const marquees = entry.target.querySelectorAll("[data-marquee-state]");
        marquees.forEach(marquee => {
          marquee.setAttribute(
            "data-marquee-state",
            entry.isIntersecting ? "playing" : "paused"
          );
        });
      });
    },
    { threshold: 0.1 }
  );

  const observed = new WeakSet();

  function observeSection(section) {
    if (!section || observed.has(section)) return;
    if (!section.querySelector("[data-marquee-state]")) return;
    observed.add(section);
    intersectionObserver.observe(section);
  }

  document.querySelectorAll(".c-section").forEach(observeSection);

  const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(".c-section")) {
          observeSection(node);
        } else {
          const marquees = node.matches("[data-marquee-state]")
            ? [node]
            : Array.from(node.querySelectorAll("[data-marquee-state]"));
          marquees.forEach(marquee => {
            const section = marquee.closest(".c-section");
            if (section) observeSection(section);
          });
        }
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
}
