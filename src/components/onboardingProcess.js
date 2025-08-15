export default function onboardingProcess() {
  const items = document.querySelectorAll(".c-ob-item");
  const visuals = document.querySelectorAll(".c-img-contain.ob-visual");
  if (!items.length || !visuals.length) return;

  visuals.forEach((visual, i) => {
    const step = visual.querySelector("[data-onboarding-step]");
    if (step) step.textContent = i + 1;
  });

  let activeIndex = 0;
  let timer = null;

  function setActive(index) {
    activeIndex = index;
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });
    visuals.forEach((visual, i) => {
      visual.classList.toggle("is-active", i === index);
    });
  }

  function nextItem() {
    const nextIndex = (activeIndex + 1) % items.length;
    setActive(nextIndex);
  }

  setActive(0);

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      setActive(index);
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    });
  });

  const container = document.querySelector(".c-section.ob") || document.body;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !timer) {
        timer = setInterval(nextItem, 8000);
      } else if (!entry.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(container);
}
