export default function aboutHeroPanel() {
  const aboutPanel = document.querySelector(".c-section.about-hero");
  if (!aboutPanel) return;

  const navLinks = aboutPanel.querySelectorAll(".c-about-panel-nav-link");
  const panelItems = aboutPanel.querySelectorAll(".c-about-panel-item");
  if (!navLinks.length || !panelItems.length) return;

  const duration = 8000;
  let currentPanelIndex = -1;
  let autoPlayTimeout = null;
  let progressStart = null;
  let remainingTime = duration;

  function clearTimers() {
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout);
      autoPlayTimeout = null;
    }
  }

  function setProgressBar(navLink, percent, time) {
    const progressLine = navLink?.querySelector(".c-about-panel-progress-line");
    if (!progressLine) return;
    progressLine.style.transition = "none";
    progressLine.style.width = `${percent}%`;
    progressLine.offsetWidth; // force reflow
    progressLine.style.transition = `width ${time}ms linear`;
    progressLine.style.width = "100%";
  }

  function freezeProgress(navLink) {
    const progressLine = navLink?.querySelector(".c-about-panel-progress-line");
    if (!progressLine) return;
    const parentWidth = progressLine.parentElement?.clientWidth || 1;
    const computedPx = parseFloat(getComputedStyle(progressLine).width) || 0;
    const pct = (computedPx / parentWidth) * 100;
    progressLine.style.width = `${pct}%`;
    progressLine.style.transition = "none";
  }

  function resetAllNavLinks() {
    navLinks.forEach(link => {
      link.classList.remove("is-active");
      const progressLine = link.querySelector(".c-about-panel-progress-line");
      if (progressLine) {
        progressLine.style.width = "0%";
        progressLine.style.transition = "none";
      }
    });
  }

  function resetAllPanelItems() {
    panelItems.forEach(item => item.classList.remove("is-active"));
  }

  function switchPanel(panelIndex, time = duration) {
    if (
      panelIndex < 0 ||
      panelIndex >= panelItems.length ||
      panelIndex === currentPanelIndex
    )
      return;

    clearTimers();
    resetAllNavLinks();
    resetAllPanelItems();

    const currentNavLink = navLinks[panelIndex];
    const currentPanel = panelItems[panelIndex];

    currentNavLink.classList.add("is-active");
    currentPanel.classList.add("is-active");

    setProgressBar(currentNavLink, 0, time);
    progressStart = Date.now();
    remainingTime = time;
    currentPanelIndex = panelIndex;

    autoPlayTimeout = setTimeout(() => {
      const nextIndex = (panelIndex + 1) % panelItems.length;
      switchPanel(nextIndex);
    }, time);
  }

  // Nav link click handlers
  navLinks.forEach((link, index) => {
    link.addEventListener("click", e => {
      e.preventDefault();

      if (index === currentPanelIndex) {
        // Clicking current panel - toggle play/pause
        if (autoPlayTimeout) {
          clearTimers();
          if (progressStart) {
            const elapsed = Date.now() - progressStart;
            remainingTime = Math.max(0, remainingTime - elapsed);
          }
          freezeProgress(link);
        } else if (remainingTime > 0) {
          // Resume from where we left off
          const progressLine = link.querySelector(
            ".c-about-panel-progress-line"
          );
          const parentWidth = progressLine.parentElement?.clientWidth || 1;
          const currentPct =
            (parseFloat(getComputedStyle(progressLine).width) / parentWidth) *
              100 || 0;
          setProgressBar(link, currentPct, remainingTime);
          progressStart = Date.now();
          autoPlayTimeout = setTimeout(() => {
            const nextIndex = (index + 1) % navLinks.length;
            switchPanel(nextIndex);
          }, remainingTime);
        }
      } else {
        // Switch to different panel
        switchPanel(index);
      }
    });
  });

  // IntersectionObserver for in-view autoplay
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.target !== aboutPanel) return;

        const currentNavLink = navLinks[currentPanelIndex];
        if (!currentNavLink) return;

        if (entry.isIntersecting && !autoPlayTimeout && remainingTime > 0) {
          // Resume autoplay when in view
          const progressLine = currentNavLink.querySelector(
            ".c-about-panel-progress-line"
          );
          const parentWidth = progressLine.parentElement?.clientWidth || 1;
          const currentPct =
            (parseFloat(getComputedStyle(progressLine).width) / parentWidth) *
              100 || 0;
          setProgressBar(currentNavLink, currentPct, remainingTime);
          progressStart = Date.now();
          autoPlayTimeout = setTimeout(() => {
            const nextIndex = (currentPanelIndex + 1) % navLinks.length;
            switchPanel(nextIndex);
          }, remainingTime);
        } else if (!entry.isIntersecting && autoPlayTimeout) {
          // Pause autoplay when out of view
          clearTimers();
          if (progressStart) {
            const elapsed = Date.now() - progressStart;
            remainingTime = Math.max(0, remainingTime - elapsed);
          }
          freezeProgress(currentNavLink);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(aboutPanel);

  // Initialize first panel on load
  if (panelItems.length > 0) {
    switchPanel(0);
  }
}
