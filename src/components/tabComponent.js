export default function tabComponent() {
  const tabItems = document.querySelectorAll(".c-tab-list-item");
  const imgContainers = document.querySelectorAll(".c-img-contain.tab-visual");
  if (!tabItems.length || !imgContainers.length) return;

  const duration = 8000;
  let currentIndex = -1;
  const videoLoaded = new WeakSet(); // Track which videos have been loaded

  function loadVideo(video) {
    if (!video || videoLoaded.has(video)) return;
    const sources = video.querySelectorAll("source[data-src]");
    sources.forEach(src => {
      src.src = src.dataset.src;
      src.removeAttribute("data-src");
    });
    video.load();
    videoLoaded.add(video);
  }

  function resetAll() {
    tabItems.forEach(item => {
      item.classList.remove("is-active");
      const progressLine = item.querySelector(".c-tab-progress-line");
      if (progressLine) {
        progressLine.style.animation = "none";
        progressLine.offsetHeight; // restart animation
        progressLine.style.animation = "";
        progressLine.style.animationDuration = `${duration}ms`;
        progressLine.style.animationPlayState = "paused";
      }
    });

    imgContainers.forEach(container => {
      container.classList.remove("is-active");
      const video = container.querySelector(".c-video");
      const btn = container.querySelector(".c-media-controls-btn");
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.classList.remove("is-playing");
        video.classList.add("not-playing");
      }
      if (btn) {
        btn.classList.remove("is-playing");
        btn.classList.add("not-playing");
      }
    });
  }

  function activateTab(index) {
    if (index === currentIndex) return;
    if (index < 0 || index >= tabItems.length) return;

    requestAnimationFrame(() => {
      resetAll();

      const currentTab = tabItems[index];
      const currentContainer = imgContainers[index];
      const progressLine = currentTab.querySelector(".c-tab-progress-line");

      currentTab.classList.add("is-active");
      currentContainer.classList.add("is-active");

      if (progressLine) {
        progressLine.style.animationDuration = `${duration}ms`;
        progressLine.style.animationPlayState = "running";
      }

      const video = currentContainer.querySelector(".c-video");
      const btn = currentContainer.querySelector(".c-media-controls-btn");

      if (video) {
        loadVideo(video);
        video.classList.remove("not-playing");
        video.classList.add("is-playing");
        video.muted = true;
        video.setAttribute("playsinline", "");
        requestAnimationFrame(() => video.play().catch(() => {}));
        if (btn) {
          btn.classList.remove("not-playing");
          btn.classList.add("is-playing");
        }
      }

      currentIndex = index;

      progressLine?.addEventListener(
        "animationend",
        () => activateTab((currentIndex + 1) % tabItems.length),
        { once: true }
      );
    });
  }

  // Play/Pause buttons
  imgContainers.forEach((container, index) => {
    const video = container.querySelector(".c-video");
    const btn = container.querySelector(".c-media-controls-btn");

    if (btn && video) {
      btn.addEventListener("click", () => {
        const progressLine = tabItems[index]?.querySelector(
          ".c-tab-progress-line"
        );

        if (video.paused) {
          if (index !== currentIndex) {
            activateTab(index);
            return;
          }
          requestAnimationFrame(() => video.play().catch(() => {}));
          btn.classList.remove("not-playing");
          btn.classList.add("is-playing");
          if (progressLine) progressLine.style.animationPlayState = "running";
        } else {
          video.pause();
          btn.classList.remove("is-playing");
          btn.classList.add("not-playing");
          if (progressLine) progressLine.style.animationPlayState = "paused";
        }
      });
    }
  });

  // Click navigation
  tabItems.forEach((item, index) => {
    item.addEventListener("click", () => activateTab(index));
  });

  // Start autoplay immediately (no scroll detection)
  activateTab(0);
}
