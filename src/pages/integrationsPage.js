export default function integrationsPage() {
  const page = document.querySelector("[data-page='integrations']");
  if (!page) return;

  const searchInput = document.querySelector(".c-int-hero-search-input");
  const partnerFilterInput = document.querySelector(".c-partner-filter-input");
  const partnersFilterSection = document.querySelector(
    "[data-partners-filter-section]"
  );

  if (!searchInput || !partnerFilterInput || !partnersFilterSection) {
    return;
  }

  let timeoutId;

  function handleScroll() {
    window.lenis.scrollTo(partnersFilterSection, { duration: 2 });
  }

  function transferValue() {
    const searchValue = searchInput.value.trim();
    partnerFilterInput.value = searchValue;
    const inputEvent = new Event("input", { bubbles: true });
    partnerFilterInput.dispatchEvent(inputEvent);
  }

  searchInput.addEventListener("input", () => {
    transferValue();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(handleScroll, 2000);
  });

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      clearTimeout(timeoutId);
      transferValue();
      handleScroll();
    }
  });

  const form = searchInput.closest("form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      clearTimeout(timeoutId);
      transferValue();
      handleScroll();
    });
  }
}
