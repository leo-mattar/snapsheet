export default function featurePanel() {
  const featurePanel = document.querySelector("#feature-panel");
  if (!featurePanel) return;

  const navLinks = featurePanel.querySelectorAll(".c-panel-nav-link");
  const panelItems = featurePanel.querySelectorAll(".c-panel-item");
  if (!navLinks.length || !panelItems.length) return;

  const duration = 8000;
  let currentPanelIndex = -1;
  let currentAccordionIndex = -1;
  let accordionAutoPlayTimeout = null;
  let progressStart = null;
  let remainingTime = duration;

  function clearTimers() {
    if (accordionAutoPlayTimeout) {
      clearTimeout(accordionAutoPlayTimeout);
      accordionAutoPlayTimeout = null;
    }
  }

  function setProgressBar(accordionItem, percent, time) {
    const progressLine = accordionItem?.querySelector(
      ".c-panel-ac-progress-line"
    );
    if (!progressLine) return;
    progressLine.style.transition = "none";
    progressLine.style.height = `${percent}%`;
    progressLine.offsetHeight; // force reflow
    progressLine.style.transition = `height ${time}ms linear`;
    progressLine.style.height = "100%";
  }

  function freezeProgress(accordionItem) {
    const progressLine = accordionItem?.querySelector(
      ".c-panel-ac-progress-line"
    );
    if (!progressLine) return;
    const parentHeight = progressLine.parentElement?.clientHeight || 1;
    const computedPx = parseFloat(getComputedStyle(progressLine).height) || 0;
    const pct = (computedPx / parentHeight) * 100;
    progressLine.style.height = `${pct}%`;
    progressLine.style.transition = "none";
  }

  function resetAllNavLinks() {
    navLinks.forEach(link => link.classList.remove("is-active"));
  }

  function resetAllPanelItems() {
    panelItems.forEach(item => item.classList.remove("is-active"));
  }

  function resetAllAccordions(panelItem) {
    const accordions = panelItem.querySelectorAll(".c-panel-ac-item");
    accordions.forEach(accordion => {
      accordion.classList.remove("is-active");
      const progressLine = accordion.querySelector(".c-panel-ac-progress-line");
      if (progressLine) {
        progressLine.style.height = "0%";
        progressLine.style.transition = "none";
      }
    });
  }

  function switchAccordion(panelItem, accordionIndex, time = duration) {
    const accordions = panelItem.querySelectorAll(".c-panel-ac-item");
    if (accordionIndex < 0 || accordionIndex >= accordions.length) return;

    clearTimers();
    resetAllAccordions(panelItem);

    const currentAccordion = accordions[accordionIndex];
    currentAccordion.classList.add("is-active");

    setProgressBar(currentAccordion, 0, time);
    progressStart = Date.now();
    remainingTime = time;
    currentAccordionIndex = accordionIndex;

    accordionAutoPlayTimeout = setTimeout(() => {
      const nextIndex = (accordionIndex + 1) % accordions.length;
      switchAccordion(panelItem, nextIndex);
    }, time);
  }

  function switchPanel(panelIndex) {
    if (
      panelIndex < 0 ||
      panelIndex >= panelItems.length ||
      panelIndex === currentPanelIndex
    )
      return;

    clearTimers();
    resetAllNavLinks();

    const currentPanel = panelItems[currentPanelIndex];
    const newPanel = panelItems[panelIndex];

    navLinks[panelIndex].classList.add("is-active");

    if (currentPanel) {
      currentPanel.style.transition = "opacity 0.5s";
      currentPanel.style.opacity = 0;
      setTimeout(() => {
        currentPanel.classList.remove("is-active");
      }, 500);
    }

    newPanel.classList.add("is-active");
    newPanel.style.opacity = 0;
    requestAnimationFrame(() => {
      newPanel.style.transition = "opacity 0.5s";
      newPanel.style.opacity = 1;
    });

    currentPanelIndex = panelIndex;
    switchAccordion(newPanel, 0);
  }

  navLinks.forEach((link, index) => {
    link.addEventListener("click", e => {
      e.preventDefault();
      switchPanel(index);
    });
  });

  // Accordion toggle click
  panelItems.forEach((panelItem, panelIndex) => {
    const accordions = panelItem.querySelectorAll(".c-panel-ac-item");
    accordions.forEach((accordion, accordionIndex) => {
      const toggle = accordion.querySelector(".c-panel-ac-toggle");
      if (!toggle) return;

      toggle.addEventListener("click", () => {
        if (
          panelIndex === currentPanelIndex &&
          accordionIndex === currentAccordionIndex
        ) {
          if (accordionAutoPlayTimeout) {
            clearTimers();
            if (progressStart) {
              const elapsed = Date.now() - progressStart;
              remainingTime = Math.max(0, remainingTime - elapsed);
            }
            freezeProgress(accordion);
          } else if (remainingTime > 0) {
            const progressLine = accordion.querySelector(
              ".c-panel-ac-progress-line"
            );
            const parentHeight = progressLine.parentElement?.clientHeight || 1;
            const currentPct =
              (parseFloat(getComputedStyle(progressLine).height) /
                parentHeight) *
                100 || 0;
            setProgressBar(accordion, currentPct, remainingTime);
            progressStart = Date.now();
            accordionAutoPlayTimeout = setTimeout(() => {
              const nextIndex = (accordionIndex + 1) % accordions.length;
              switchAccordion(panelItem, nextIndex);
            }, remainingTime);
          }
        } else {
          if (panelIndex !== currentPanelIndex) {
            switchPanel(panelIndex);
          } else {
            switchAccordion(panelItem, accordionIndex);
          }
        }
      });
    });

    // Media controls toggle
    const mediaBtns = panelItem.querySelectorAll(".c-media-controls-btn");
    mediaBtns.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const currentAccordion = accordions[currentAccordionIndex];
        if (!currentAccordion || panelIndex !== currentPanelIndex) return;

        if (accordionAutoPlayTimeout) {
          clearTimers();
          if (progressStart) {
            const elapsed = Date.now() - progressStart;
            remainingTime = Math.max(0, remainingTime - elapsed);
          }
          freezeProgress(currentAccordion);
        } else if (remainingTime > 0) {
          const progressLine = currentAccordion.querySelector(
            ".c-panel-ac-progress-line"
          );
          const parentHeight = progressLine.parentElement?.clientHeight || 1;
          const currentPct =
            (parseFloat(getComputedStyle(progressLine).height) / parentHeight) *
              100 || 0;
          setProgressBar(currentAccordion, currentPct, remainingTime);
          progressStart = Date.now();
          accordionAutoPlayTimeout = setTimeout(() => {
            const nextIndex = (currentAccordionIndex + 1) % accordions.length;
            switchAccordion(panelItem, nextIndex);
          }, remainingTime);
        }
      });
    });
  });

  // IntersectionObserver for in-view autoplay
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const panel = entry.target;
        const accordions = panel.querySelectorAll(".c-panel-ac-item");
        const currentAccordion = accordions[currentAccordionIndex];
        if (!currentAccordion) return;

        if (
          entry.isIntersecting &&
          panel.classList.contains("is-active") &&
          !accordionAutoPlayTimeout
        ) {
          const progressLine = currentAccordion.querySelector(
            ".c-panel-ac-progress-line"
          );
          const parentHeight = progressLine.parentElement?.clientHeight || 1;
          const currentPct =
            (parseFloat(getComputedStyle(progressLine).height) / parentHeight) *
              100 || 0;
          setProgressBar(currentAccordion, currentPct, remainingTime);
          progressStart = Date.now();
          accordionAutoPlayTimeout = setTimeout(() => {
            const nextIndex = (currentAccordionIndex + 1) % accordions.length;
            switchAccordion(panel, nextIndex);
          }, remainingTime);
        } else if (!entry.isIntersecting) {
          if (accordionAutoPlayTimeout) {
            clearTimers();
            const progressLine = currentAccordion.querySelector(
              ".c-panel-ac-progress-line"
            );
            const parentHeight = progressLine.parentElement?.clientHeight || 1;
            const currentPct =
              (parseFloat(getComputedStyle(progressLine).height) /
                parentHeight) *
                100 || 0;
            remainingTime = Math.max(
              0,
              remainingTime - (Date.now() - progressStart)
            );
            progressLine.style.height = `${currentPct}%`;
            progressLine.style.transition = "none";
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  panelItems.forEach(item => observer.observe(item));

  if (navLinks.length > 0) switchPanel(0);
}
