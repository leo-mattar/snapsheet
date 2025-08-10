// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// --- GSAP
gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, SplitText);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

// --------------- CUSTOM EASE ---------------
CustomEase.create("ease-out-1", "0.25, 1, 0.5, 1");
CustomEase.create("ease-out-2", "0.19, 1, 0.22, 1");
CustomEase.create("ease-out-3", "0.175, 0.885, 0.32, 1.275");
CustomEase.create("ease-in-out-1", "0.87, 0, 0.13, 1");
CustomEase.create("ease-in-out-2", "0.86, 0, 0.07, 1");

// --------------- GLOBAL - RELOAD AT THE TOP ---------------
window.addEventListener("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --------------- LENIS ---------------
window.lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add(time => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --------------- PAPER TIGET SIGNATURE ---------------
const pprtgr = [
  "color: #F2F3F3",
  "background: #080808",
  "font-size: 12px",
  "padding-left: 10px",
  "line-height: 2",
  "border-left: 5px solid #ff3c31",
].join(";");
console.info(
  `

%cWebsite by Paper Tiger${" "}
www.papertiger.com${"     "}

`,
  pprtgr
);

// --------------- CURRENT YEAR ---------------
const currentYear = document.querySelector("[current-year]");
if (currentYear) {
  currentYear.innerHTML = new Date().getFullYear();
}

// --- PARALLAX
function parallax() {
  const images = document.querySelectorAll("[parallax]");

  if (images) {
    new Ukiyo(images, {
      scale: 1.2,
      speed: 1.2,
    });
  }
}

// --- FADE
function fade() {
  const cards = document.querySelectorAll("[fade]");

  ScrollTrigger.batch(cards, {
    once: true,
    onEnter: batch => {
      batch.forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
        el.classList.add("revealed");

        // Cleanup
        const cleanup = event => {
          if (
            event.propertyName === "opacity" ||
            event.propertyName === "transform"
          ) {
            el.style.transitionDelay = "";
            el.removeEventListener("transitionend", cleanup);
          }
        };

        el.addEventListener("transitionend", cleanup);
      });
    },
  });
}

// --- VERTICAL LINES
function drawVerticalLine() {
  gsap.set("[draw-vertical-line]", {
    opacity: 1,
    scaleY: 0,
    transformOrigin: "top top",
    width: 2,
  });

  ScrollTrigger.batch("[draw-vertical-line]", {
    once: true,
    onEnter: batch =>
      gsap.to(batch, {
        scaleY: 1,
        delay: 0.2,
        duration: 1.6,
        ease: "ease-out-1",
        stagger: 0.2,
      }),
  });
}

// --- GLOBAL - LINE ANIMATION
function drawLine() {
  gsap.set("[draw-line]", {
    opacity: 1,
    scaleX: 0,
    transformOrigin: "top left",
  });

  ScrollTrigger.batch("[draw-line]", {
    once: true,
    onEnter: batch =>
      gsap.to(batch, {
        scaleX: 1,
        delay: 0.1,
        duration: 1.6,
        ease: "ease-out-1",
        stagger: 0.2,
        markers: true,
      }),
  });
}

// --------------- SOLUTIONS SLIDER ---------------
function solutionsSlider() {
  const sliderThumbEl = document.querySelector(".swiper.so-link");
  if (!sliderThumbEl) return;

  const sliderLinks = new Swiper(sliderThumbEl, {
    slidesPerView: "auto",
    spaceBetween: 8,
    speed: 400,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    simulateTouch: true,
  });

  const sliderMainEl = document.querySelector(".swiper.so-main");
  if (!sliderMainEl) return;

  const sliderMain = new Swiper(sliderMainEl, {
    spaceBetween: 0,
    speed: 600,
    simulateTouch: false,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    thumbs: {
      swiper: sliderLinks,
    },
  });

  const soBg = document.querySelector(".c-swiper-so-bg");
  const thumbSlides = sliderThumbEl.querySelectorAll(".swiper-slide.so-link");

  function moveBgToSlide(slide, index) {
    if (!soBg) return;

    if (sliderMain.realIndex !== index) {
      sliderMain.slideTo(index);
    }

    const state = Flip.getState(soBg);
    slide.appendChild(soBg);
    Flip.from(state, {
      duration: 0.4,
      ease: "ease-in-out",
      targets: soBg,
    });
  }

  thumbSlides.forEach((slide, index) => {
    slide.addEventListener("click", () => moveBgToSlide(slide, index));
  });

  // Trigger first thumb after initialization
  if (thumbSlides.length > 0) {
    setTimeout(() => {
      moveBgToSlide(thumbSlides[0], 0);
    }, 0);
  }
}

// --------------- RESOURCES SLIDER ---------------
function resourcesSlider() {
  const sliderEl = document.querySelector(".swiper.resources");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    navigation: {
      nextEl: "#resources-next",
      prevEl: "#resources-prev",
    },
    pagination: {
      el: ".swiper-pagination.resources",
      type: "progressbar",
    },
  });
}

// --------------- SOLUTIONS TABBER ---------------
function solutionsTabber() {
  const tabber = document.querySelector(".c-tabber-wrap");
  if (!tabber) return;
  const tabs = tabber.querySelectorAll(".c-tabber-item");
  const controls = tabber.querySelectorAll(".c-tabber-controls-item");
  const interval = 6000;
  let currentIndex = 0;
  let autoplayTimer = null;
  let scrollTriggerInstance = null;

  function setActiveTab(index) {
    tabs.forEach((tab, i) => {
      tab.classList.toggle("is-active", i === index);
    });
    controls.forEach((control, i) => {
      const progress = control.querySelector(".c-tabber-controls-progress");
      control.classList.toggle("is-active", i === index);
      gsap.set(progress, { width: "0%" });
      gsap.killTweensOf(progress);
      if (i === index) {
        gsap.to(progress, {
          width: "100%",
          duration: interval / 1000,
          ease: "linear",
        });
      }
    });
    currentIndex = index;
  }

  function nextTab() {
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(nextIndex);
  }

  function startAutoplay() {
    if (!autoplayTimer) {
      setActiveTab(currentIndex);
      autoplayTimer = setInterval(nextTab, interval);
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    controls.forEach(control => {
      const progress = control.querySelector(".c-tabber-controls-progress");
      gsap.killTweensOf(progress);
      gsap.set(progress, { width: "0%" });
    });
  }

  function createScrollTrigger() {
    // Kill existing ScrollTrigger if it exists
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: tabber,
      start: "top 80%",
      end: "bottom 20%",
      onEnter: startAutoplay,
      onEnterBack: startAutoplay,
      onLeave: stopAutoplay,
      onLeaveBack: stopAutoplay,
    });
  }

  function refreshScrollTrigger() {
    // Refresh ScrollTrigger to recalculate positions
    ScrollTrigger.refresh();
  }

  // Manual tab switching
  controls.forEach((control, index) => {
    control.addEventListener("click", () => {
      setActiveTab(index);
      stopAutoplay();
      startAutoplay();
    });
  });

  // Initial setup
  createScrollTrigger();
  setActiveTab(0);

  // Refresh ScrollTrigger after DOM has settled (mobile breakpoint fix)
  setTimeout(() => {
    refreshScrollTrigger();
  }, 150);

  // Also refresh on window resize for responsive breakpoints
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      refreshScrollTrigger();
    }, 150);
  });
}

// --------------- SOLUTIONS TABBER TABLET/MOBILE ADJUSTMENTS ---------------
function solutionsTabberTabletMobile() {
  const tabber = document.querySelector(".c-tabber-wrap");
  if (!tabber) return;

  const tabberItems = tabber.querySelectorAll(".c-tabber-item");
  const controlsItems = tabber.querySelectorAll(".c-tabber-controls-item");

  if (!tabber.dataset.originalPositions) {
    const originalPositions = [];
    controlsItems.forEach((item, index) => {
      originalPositions.push({
        element: item,
        nextSibling: item.nextElementSibling,
        parent: item.parentElement,
      });
    });
    tabber._originalPositions = originalPositions;
    tabber.dataset.originalPositions = "true";
  }

  function moveToMobileLayout() {
    if (tabber.dataset.mobileLayout === "true") return;

    controlsItems.forEach((controlsItem, index) => {
      const correspondingTabberItem = tabberItems[index];
      if (correspondingTabberItem) {
        correspondingTabberItem.parentElement.insertBefore(
          controlsItem,
          correspondingTabberItem
        );
      }
    });

    tabber.dataset.mobileLayout = "true";
  }

  function moveToDesktopLayout() {
    if (tabber.dataset.mobileLayout !== "true") return;

    const originalPositions = tabber._originalPositions;
    originalPositions.forEach(pos => {
      if (pos.nextSibling && pos.nextSibling.parentElement) {
        pos.parent.insertBefore(pos.element, pos.nextSibling);
      } else {
        pos.parent.appendChild(pos.element);
      }
    });

    tabber.dataset.mobileLayout = "false";
  }

  function handleResize() {
    if (window.innerWidth <= 991) {
      moveToMobileLayout();
    } else {
      moveToDesktopLayout();
    }
  }

  handleResize();

  if (!tabber.dataset.resizeListener) {
    window.addEventListener("resize", handleResize);
    tabber.dataset.resizeListener = "true";
  }
}

// --------------- TESTIMONIALS SLIDER ---------------
function teSlider() {
  const sliderEl = document.querySelector(".swiper.te");
  if (!sliderEl) return;

  const sliderSideLeftEl = document.querySelector(".swiper.te-side_lt");
  const sliderSideRightEl = document.querySelector(".swiper.te-side_rt");
  const sliderTitleEl = document.querySelector(".swiper.te-title");
  if (!sliderSideLeftEl || !sliderSideRightEl || !sliderTitleEl) return;

  const sliderSideLeft = new Swiper(sliderSideLeftEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
  });

  const sliderSideRight = new Swiper(sliderSideRightEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
  });

  const sliderTitle = new Swiper(sliderTitleEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    allowTouchMove: false,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      nextEl: "#te-next",
      prevEl: "#te-prev",
    },
    pagination: {
      el: ".swiper-pagination.te",
      type: "progressbar",
    },
    controller: {
      control: [sliderSideLeft, sliderSideRight, sliderTitle],
    },
  });

  sliderSideLeft.controller.control = sliderMain;
  sliderSideRight.controller.control = sliderMain;
  sliderTitle.controller.control = sliderMain;
}

// --------------- VIDEO PLAYER ---------------
function videoPlayer() {
  const videoButtons = document.querySelectorAll(".c-icon.video-btn");

  if (!videoButtons.length) return;

  videoButtons.forEach(button => {
    const videoId = button.getAttribute("data-video");
    const video = document.querySelector(`.c-video[data-video="${videoId}"]`);
    const progressCircle = button.querySelector(".video-progress");

    if (!video || !progressCircle) return;

    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;

    const updateProgress = () => {
      const progress = video.currentTime / video.duration;
      progressCircle.style.strokeDashoffset = `${
        circumference * (1 - progress)
      }`;
    };

    button.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        button.classList.add("is-playing");
        video.addEventListener("timeupdate", updateProgress);
      } else {
        video.pause();
        button.classList.remove("is-playing");
        video.removeEventListener("timeupdate", updateProgress);
      }
    });

    video.addEventListener("ended", () => {
      if (video.loop) {
        progressCircle.style.strokeDashoffset = `${circumference}`;
      }
    });

    if (button.getAttribute("data-autoplay") === "true") {
      video.play();
      button.classList.add("is-playing");
      video.addEventListener("timeupdate", updateProgress);
    }
  });
}

// --------------- HOME HERO PRODUCT SLIDER ---------------
function homeHeroProductsSlider() {
  const sliderEl = document.querySelector(".swiper.hm-hero");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".swiper-btn.hm-hero-next",
      prevEl: ".swiper-btn.hm-hero-prev",
    },
    pagination: {
      el: ".swiper-pagination.hm-hero",
      type: "fraction",
      renderFraction: function (currentClass, totalClass) {
        return `
      <span class="${currentClass}"></span> / <span class="${totalClass}"></span>
    `;
      },
      formatFractionCurrent: function (number) {
        return number < 10 ? "0" + number : number;
      },
      formatFractionTotal: function (number) {
        return number < 10 ? "0" + number : number;
      },
    },
  });
}

// --------------- TABBER ---------------
function featuresTabber() {
  const quotesWrap = document.querySelectorAll(".o-row.tabber");
  if (quotesWrap.length === 0) return;

  quotesWrap.forEach(quote => {
    const tabLinks = quote.querySelectorAll(".c-tabber-link");
    let currentIndex = 0;
    let isAnimating = false;
    let progressBarTween = null;
    let initialLoad = true;

    function animateProgressBar(progressBar) {
      if (progressBarTween) progressBarTween.kill();

      gsap.set(progressBar, { width: "0%" });

      progressBarTween = gsap.to(progressBar, {
        width: "100%",
        duration: 6,
        ease: "none",
        onComplete: () => {
          if (!isAnimating) {
            const nextIndex = (currentIndex + 1) % tabLinks.length;
            changeSlide(nextIndex);
          }
        },
      });
    }

    function changeSlide(index) {
      if (isAnimating) return;

      isAnimating = true;

      if (progressBarTween) progressBarTween.kill();

      tabLinks.forEach((otherLink, i) => {
        const progressBar = otherLink.querySelector(".c-tabber-progress-bar");

        if (i === index) {
          otherLink.classList.add("is-active");

          setTimeout(() => {
            animateProgressBar(progressBar);
            isAnimating = false;
          }, 100);
        } else {
          otherLink.classList.remove("is-active");
          gsap.set(progressBar, { width: "0%" });
        }
      });

      currentIndex = index;
      initialLoad = false;
    }

    tabLinks.forEach((link, index) => {
      link.addEventListener("click", function () {
        changeSlide(index);
      });
    });

    changeSlide(0);
  });
}

// --- ACCORDIONS
function accordions(
  containerSelector = ".c-ac-item",
  questionSelector = ".c-ac-question",
  answerSelector = ".c-ac-answer",
  arrowSelector = ".c-icon.ac-arrow",
  openFirstOnLoad = false,
  arrowRotation = 135
) {
  const accordions = document.querySelectorAll(containerSelector);
  let active = null;
  if (accordions.length === 0) return;
  accordions.forEach((accordion, index) => {
    const question = accordion.querySelector(questionSelector);
    const response = accordion.querySelector(answerSelector);
    const arrow = accordion.querySelector(arrowSelector);
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        ease: "ease-in-out-1",
        duration: 0.8,
      },
    });
    tl.to(response, { height: "auto", opacity: 1 });
    tl.to(arrow, { rotation: arrowRotation }, 0);
    accordion.tl = tl;
    if (openFirstOnLoad && index === 0) {
      tl.play();
      active = accordion;
    }
    question.addEventListener("click", function () {
      if (active === accordion) {
        tl.reverse();
        active = null;
      } else {
        if (active) active.tl.reverse();
        tl.play();
        active = accordion;
      }
    });
  });
}

// --------------- PDT TABBER SLIDER ---------------
function pdtTabberSlider() {
  const sliderEl = document.querySelector(".swiper.pdt-tabber");
  if (!sliderEl) return;

  // Check if there are actual slides
  const slides = sliderEl.querySelectorAll(".swiper-slide");
  if (slides.length === 0) {
    // console.log("⚠️ No slides found - skipping Swiper initialization");
    return;
  }

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    navigation: {
      nextEl: "#pdt-tabber-next",
      prevEl: "#pdt-tabber-prev",
    },
    pagination: {
      el: ".swiper-pagination.pdt-tabber",
      type: "progressbar",
    },
  });
}

// --- PDT TABBER
function pdtTabber() {
  const invisibleTabs = document.querySelectorAll(
    ".c-pdt-tabber-link.w-condition-invisible"
  );
  invisibleTabs.forEach(tab => {
    tab.remove();
  });

  const invisibleTabContent = document.querySelectorAll(
    "[pdt-tabber-name].w-condition-invisible"
  );
  invisibleTabContent.forEach(content => {
    content.remove();
  });

  const tabLinks = document.querySelectorAll(".c-pdt-tabber-link");
  if (tabLinks.length === 0) return;

  const firstTab = tabLinks[0];
  firstTab.classList.add("is-active");

  let firstTabName = firstTab.dataset.tabName;
  if (!firstTabName) {
    firstTabName = firstTab.textContent.toLowerCase().trim();
    switch (firstTabName) {
      case "specifications":
      case "specification":
        firstTabName = "specs";
        break;
      case "downloads":
      case "download":
        firstTabName = "downloads";
        break;
      case "accessories":
      case "accessory":
        firstTabName = "accessories";
        break;
      case "faq":
      case "faqs":
      case "frequently asked questions":
        firstTabName = "faq";
        break;
    }
  }

  const firstTabContent = document.querySelector(
    `[pdt-tabber-name="${firstTabName}"]`
  );
  if (firstTabContent) {
    firstTabContent.classList.add("active-tab");
  }

  tabLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let tabName = this.dataset.tabName;
      if (!tabName) {
        tabName = this.textContent.toLowerCase().trim();
        switch (tabName) {
          case "specifications":
          case "specification":
            tabName = "specs";
            break;
          case "downloads":
          case "download":
            tabName = "downloads";
            break;
          case "accessories":
          case "accessory":
            tabName = "accessories";
            break;
          case "faq":
          case "faqs":
          case "frequently asked questions":
            tabName = "faq";
            break;
        }
      }

      tabLinks.forEach(tab => {
        tab.classList.remove("is-active");
      });

      this.classList.add("is-active");

      const tabberElements = document.querySelectorAll("[pdt-tabber-name]");
      tabberElements.forEach(element => {
        element.classList.remove("active-tab");
      });

      const targetElement = document.querySelector(
        `[pdt-tabber-name="${tabName}"]`
      );
      if (targetElement) {
        targetElement.classList.add("active-tab");
      }
    });
  });
}

// --- FILTER SETTINGS
function filterSettings() {
  const titleElement = document.querySelector("[data-tag-title]");
  const filterGroup = document.querySelector(".c-filter-cta-group");
  const filterResults = document.querySelector(".c-filter-results");

  if (!titleElement || !filterGroup) {
    return;
  }

  const radios = filterGroup.querySelectorAll('input[type="radio"][data-tag]');

  function updateTitle() {
    const checkedRadio = filterGroup.querySelector(
      'input[type="radio"][data-tag]:checked'
    );

    if (checkedRadio) {
      titleElement.textContent = checkedRadio.getAttribute("data-tag");
    } else {
      const defaultText = filterResults
        ? filterResults.getAttribute("data-default-title")
        : null;
      titleElement.textContent = defaultText || "All Products";
    }
  }

  radios.forEach(radio => {
    radio.addEventListener("change", updateTitle);
  });

  setTimeout(updateTitle, 500);
}

// --- PAGINATION SCROLL TO
function paginationScrollTo() {
  if (!document.querySelector("#section-filter")) return;
  let radioTimeout;
  let delegationAttached = false;

  function attachEventDelegation() {
    if (delegationAttached) return;
    delegationAttached = true;

    document.addEventListener("click", e => {
      const paginationBtn = e.target.closest(
        ".c-pagination-page-btn, .c-pagination-btn"
      );

      if (paginationBtn) {
        const filterGrids = document.querySelectorAll(
          ".o-grid.filter-pdt, .c-pagination"
        );
        filterGrids.forEach(grid => {
          grid.classList.add("is-loading");
        });
        setTimeout(() => {
          lenis.scrollTo("#section-filter", { duration: 0.01, lock: false });
          filterGrids.forEach(grid => {
            grid.classList.remove("is-loading");
          });
        }, 325);
      }
    });

    document.addEventListener("change", e => {
      if (e.target.matches('input[type="radio"]')) {
        clearTimeout(radioTimeout);
        const filterGrids = document.querySelectorAll(
          ".o-grid.filter-pdt, .c-pagination"
        );
        filterGrids.forEach(grid => {
          grid.classList.add("is-loading");
        });
        radioTimeout = setTimeout(() => {
          lenis.scrollTo("#section-filter", { duration: 0.01, lock: false });
          filterGrids.forEach(grid => {
            grid.classList.remove("is-loading");
          });
        }, 125);
      }
    });
  }

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      setTimeout(() => {
        attachEventDelegation();
      }, 100);
    },
  ]);
}

// --- HEADER DESKTOP
function headerDesktop() {
  const ddLinks = document.querySelectorAll(".c-dd-link");
  if (!ddLinks.length) return;
  const body = document.querySelector(".c-body");

  function closeAllDropdowns() {
    ddLinks.forEach(link => {
      link.classList.remove("is-active");
    });
    body.classList.remove("header-is-open");
    lenis.start();
  }

  function toggleDropdown(targetLink) {
    const isCurrentlyActive = targetLink.classList.contains("is-active");

    closeAllDropdowns();

    if (!isCurrentlyActive) {
      targetLink.classList.add("is-active");
      body.classList.add("header-is-open");
      lenis.stop();
    }
  }

  ddLinks.forEach(link => {
    const toggle = link.querySelector(".c-dd-toggle");
    toggle.addEventListener("click", () => {
      toggleDropdown(link);
    });
  });

  document.addEventListener("click", e => {
    const isInsideDropdown = e.target.closest(".c-dd-group");
    const isToggle = e.target.closest(".c-dd-toggle");

    if (!isInsideDropdown && !isToggle) {
      closeAllDropdowns();
    }
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeAllDropdowns();
    }
  });
}

// --- HEADER TABBER
function headerTabber() {
  const sideLinks = document.querySelectorAll(".c-dd-side-link");
  const pLists = document.querySelectorAll(".c-dd-p-list");

  if (
    sideLinks.length > 0 &&
    !document.querySelector(".c-dd-side-link.is-active")
  ) {
    sideLinks[0].classList.add("is-active");
    if (pLists[0]) {
      pLists[0].classList.add("is-active");
    }
  }

  sideLinks.forEach((link, index) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      if (this.classList.contains("is-active")) {
        return;
      }

      sideLinks.forEach(l => l.classList.remove("is-active"));
      pLists.forEach(p => p.classList.remove("is-active"));

      this.classList.add("is-active");
      if (pLists[index]) {
        pLists[index].classList.add("is-active");
      }
    });
  });
}

// --- ARTICLE PAGINATION SCROLL TO
function articlePaginationScrollTo() {
  function attachEventDelegation() {
    document.addEventListener("click", e => {
      const paginationBtn = e.target.closest(
        ".c-pagination-page-btn, .c-pagination-btn"
      );

      if (paginationBtn) {
        const gridElement = document.querySelector(".o-grid.blog");

        if (gridElement) {
          gridElement.classList.add("is-loading");
        }

        setTimeout(() => {
          lenis.scrollTo(".c-blog-scroll", {
            duration: 0.01,
            lock: false,
          });

          if (gridElement) {
            gridElement.classList.remove("is-loading");
          }
        }, 125);
      }
    });
  }

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      setTimeout(() => {
        attachEventDelegation();
      }, 100);
    },
  ]);
}

// --- REMOVE EMPTY PARAGRAPHS FROM PRODUCTS
function productsEmptyParagraphs() {
  if (!document || !document.querySelector) return;
  const richTextSelectors = [".t-rich-text.pdt-main", ".t-rich-text.pdt-brief"];

  richTextSelectors.forEach(selector => {
    const richTextElements = document.querySelectorAll(selector);

    richTextElements.forEach(richText => {
      richText.querySelectorAll("p").forEach(p => {
        const text = p.textContent
          .replace(/[\u200B-\u200D\uFEFF]/g, "")
          .replace(/\u00A0/g, "")
          .replace(/\s/g, "")
          .trim();

        if (text === "") {
          p.remove();
        }
      });
    });
  });

  window.productsEmptyParagraphs = productsEmptyParagraphs;
}

// --- INSIGHTS - PREV AND NEXT
function insightsPrevNext() {
  const row = document.querySelector(".o-row.post-related");
  if (!row) return;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      const title = document.querySelector(
        "[fs-list-element='next-item'] .t-display-4"
      );
      title.textContent = "Next";
    },
  ]);
}

// --- HIDE PAGINATION IF NOT ENOUGH ITEMS
function hidePaginationIfSinglePage() {
  const pagination = document.querySelector(".c-pagination");
  if (!pagination) return;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      const pageButtons = pagination.querySelectorAll(".c-pagination-page-btn");

      if (pageButtons.length <= 1) {
        pagination.style.display = "none";
      }
    },
  ]);
}

// --- FAQ PAGE
function faqPage() {
  const page = document.querySelector("[data-page='faq']");
  if (!page) return;

  // All button placement
  const filterList = document.querySelector(".c-faq-filter-list");
  const allBtn = document.querySelector("[data-faq='all-btn']");

  filterList.prepend(allBtn);

  // Categories/topics available
  const topicsItems = document.querySelectorAll(
    `.c-faq-filter-radio-item:not([data-faq='all-btn'])`
  );
  const topicsCountEl = document.querySelector("[data-faq='topics-count']");
  topicsCountEl.textContent = topicsItems.length;

  // Custom title based on the selected filter
  const title = document.querySelector(".c-faq-title .t-display-3");

  function updateTitle() {
    const checkedRadio = document.querySelector(
      ".c-faq-filter-form-block input[type='radio']:checked"
    );
    if (checkedRadio) {
      const label = checkedRadio
        .closest(".c-faq-filter-radio-btn-field")
        .querySelector(".c-faq-filter-radio-label");
      if (title && label) {
        title.textContent = label.textContent;
      }
    }
  }

  updateTitle();

  const radioInputs = document.querySelectorAll(
    ".c-faq-filter-form-block input[type='radio']"
  );
  radioInputs.forEach(radio => {
    radio.addEventListener("change", updateTitle);
  });

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      updateTitle();
    },
  ]);

  // Filter sidebar options
  document.addEventListener("click", function (event) {
    const sideFilterItem = event.target.closest(".c-faq-side-filter-item");

    if (sideFilterItem) {
      const sideItemText = sideFilterItem.textContent.trim();
      const radioLabels = document.querySelectorAll(
        ".c-faq-filter-radio-label"
      );

      radioLabels.forEach(function (radioLabel) {
        if (radioLabel.textContent.trim() === sideItemText) {
          radioLabel.click();

          setTimeout(function () {
            lenis.scrollTo("#section-faq-filters");
          }, 150);

          return;
        }
      });
    }
  });
}

// --- CAREERS PAGE
function careersJobBoard() {
  const formBlock = document.querySelector(".c-jb-filter-form-block");
  if (!formBlock) return;

  const allBtn = document.querySelector(
    ".c-jb-filter-radio-btn-field[data-jb='all-btn']"
  );
  const filterList = document.querySelector(".c-jb-filter-list");

  filterList.prepend(allBtn);
}

// --- RETURN TO TOP
function returnToTop() {
  const returnLink = document.querySelector(".c-return-top");
  if (!returnLink) return;

  const backTopLinks = document.querySelectorAll(".c-return-top");

  returnLink.addEventListener("click", function () {
    gsap.to("body", { opacity: 0, duration: 0.2 });
    setTimeout(() => {
      lenis.scrollTo("body", {
        top: 0,
        duration: 0.1,
        lock: true,
        onComplete: () => {
          gsap.to("body", { opacity: 1, duration: 0.2 });
        },
      });
    }, 300);
  });
}

// --- RESOURCES HUB PAGE
function resourcesHub() {
  const page = document.querySelector("[data-page='resources-hub']");
  if (!page) return;

  // Accordion text
  const buttons = document.querySelectorAll(".c-rh-ac-toggle .c-btn");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const btnText = this.querySelector(".c-btn-txt");

      if (btnText.textContent === "View less") {
        btnText.textContent = "View more";
      } else {
        btnText.textContent = "View less";

        buttons.forEach(otherButton => {
          if (otherButton !== this) {
            const otherBtnText = otherButton.querySelector(".c-btn-txt");
            otherBtnText.textContent = "View more";
          }
        });
      }
    });
  });
}

// --- REQUEST A LAYOUT FORM
function requestLayourForm() {
  const form = document.querySelector(".c-rl-form-block");
  if (!form) return;

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;

    if (!value) return false;

    switch (type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      case "tel":
      case "number":
        const numberRegex = /^\d+$/;
        return numberRegex.test(value.replace(/\s/g, ""));
      case "url":
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      default:
        return value.length >= 2;
    }
  }

  function validateRequiredFields(container, showVisualErrors = false) {
    const requiredFields = container.querySelectorAll(
      ".c-form-input[required]"
    );
    const invalidFields = [];

    requiredFields.forEach(field => {
      if (showVisualErrors) field.classList.remove("error");
      if (!validateField(field)) {
        invalidFields.push(field);
        if (showVisualErrors) field.classList.add("error");
      }
    });

    return invalidFields;
  }

  function showErrorMessage(message) {
    const existingError = form.querySelector(".validation-error");
    if (existingError) existingError.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "validation-error";
    errorDiv.style.cssText =
      "color: red; margin-top: 10px; padding: 10px; background-color: #ffebee; border: 1px solid #f44336; border-radius: 4px;";
    errorDiv.textContent = message;

    form.insertBefore(errorDiv, form.firstChild);
    errorDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function removeErrorMessage() {
    const existingError = form.querySelector(".validation-error");
    if (existingError) existingError.remove();
  }

  function switchToStep(fromStep, toStep) {
    [
      `[data-tab='${fromStep}']`,
      `[data-tab-cta='${fromStep}']`,
      `[data-tab-title='${fromStep}']`,
    ].forEach(selector => {
      const element = form.querySelector(selector);
      if (element) element.classList.remove("is-active");
    });

    [
      `[data-tab='${toStep}']`,
      `[data-tab-cta='${toStep}']`,
      `[data-tab-title='${toStep}']`,
    ].forEach(selector => {
      const element = form.querySelector(selector);
      if (element) element.classList.add("is-active");
    });
  }

  const step1Button = form.querySelector('[data-tab-cta-btn="step-1"]');
  if (step1Button) {
    step1Button.addEventListener("click", function (e) {
      e.preventDefault();

      const contactTab = form.querySelector('[data-tab="contact"]');
      if (!contactTab) return;

      const invalidFields = validateRequiredFields(contactTab, true);

      if (invalidFields.length > 0) {
        const fieldCount = invalidFields.length;
        const message = `Please correct the highlighted fields before proceeding. ${fieldCount} field${
          fieldCount > 1 ? "s need" : " needs"
        } attention.`;
        showErrorMessage(message);
        invalidFields[0].focus();
        return;
      }

      removeErrorMessage();
      switchToStep("contact", "details");

      setTimeout(() => {
        lenis.scrollTo("body", {
          top: 0,
          duration: 0.6,
          lock: true,
        });
      }, 150);
    });
  }

  const step2Button = form.querySelector('[data-tab-cta-btn="step-2"]');
  if (step2Button) {
    step2Button.addEventListener("click", function (e) {
      e.preventDefault();

      const detailsTab = form.querySelector('[data-tab="details"]');
      if (!detailsTab) return;

      const invalidFields = validateRequiredFields(detailsTab, true);

      if (invalidFields.length > 0) {
        const fieldCount = invalidFields.length;
        const message = `Please correct the highlighted fields before proceeding. ${fieldCount} field${
          fieldCount > 1 ? "s need" : " needs"
        } attention.`;
        showErrorMessage(message);
        invalidFields[0].focus();
        return;
      }

      removeErrorMessage();
    });
  }

  form.querySelectorAll(".c-form-input[required]").forEach(input => {
    input.addEventListener("blur", function () {
      if (!validateField(this)) {
        this.classList.add("error");
      } else {
        this.classList.remove("error");
      }
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error") && validateField(this)) {
        this.classList.remove("error");
      }

      const activeTab = form.querySelector("[data-tab].is-active");
      if (activeTab && validateRequiredFields(activeTab).length === 0) {
        removeErrorMessage();
      }
    });
  });

  if (!document.querySelector("#form-validation-styles")) {
    const style = document.createElement("style");
    style.id = "form-validation-styles";
    style.textContent =
      ".c-form-input.error{border-color:#f44336!important;box-shadow:0 0 0 2px rgba(244,67,54,0.2)!important}.validation-error{animation:slideInFromTop 0.3s ease-out}@keyframes slideInFromTop{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}";
    document.head.appendChild(style);
  }

  form.addEventListener("submit", function (e) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            if (
              (node.classList &&
                (node.classList.contains("w-form-done") ||
                  node.classList.contains("success-message"))) ||
              (node.querySelector &&
                (node.querySelector(".w-form-done") ||
                  node.querySelector(".success-message")))
            ) {
              setTimeout(() => {
                lenis.scrollTo("body", {
                  top: 0,
                  duration: 0.6,
                  lock: true,
                });
              }, 150);
              observer.disconnect();
            }
          }
        });

        if (mutation.type === "attributes" && mutation.target.classList) {
          if (
            mutation.target.classList.contains("w-form-done") ||
            mutation.target.classList.contains("success-message") ||
            (mutation.target.style.display !== "none" &&
              (mutation.target.classList.contains("w-form-done") ||
                mutation.target.querySelector(".w-form-done")))
          ) {
            setTimeout(() => {
              lenis.scrollTo("body", {
                top: 0,
                duration: 0.6,
                lock: true,
              });
            }, 150);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    setTimeout(() => {
      observer.disconnect();
    }, 10000);
  });
}

// --- SEARCH PAGE
function searchPage() {
  const searchMain = document.querySelector("#search-main");
  if (!searchMain) return;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      setTimeout(() => {
        const paginationBtns = document.querySelectorAll(
          ".c-pagination-btn, .c-pagination-page-btn"
        );
        paginationBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            lenis.scrollTo("#search-main");
          });
        });
      }, 100);
    },
  ]);
}

// --- HEADER SEARCH
function headerSearch() {
  const searchPage = document.querySelector(".c-search-page");
  if (!searchPage) return;
  const body = document.querySelector(".c-body");
  const headerNav = document.querySelector(".c-header-nav");
  const searchBtn = document.querySelector(".c-search-btn");
  const searchInput = document.querySelector(".c-search-input");
  const searchPageBtn = document.querySelector(".c-search-page .c-btn");
  const faqSearchInput = document.querySelector(".c-faq-search-input");

  function toggleSearchPage() {
    const isOpen = searchPage.classList.contains("is-open");
    if (isOpen) {
      closeSearchPage();
    } else {
      openSearchPage();
    }
  }

  function openSearchPage() {
    lenis.stop();
    searchPage.classList.add("is-open");
    body.classList.add("search-is-open");
    if (headerNav) {
      headerNav.classList.add("is-search-open");
    }
    searchInput.focus();
  }

  function closeSearchPage() {
    lenis.start();
    searchPage.classList.remove("is-open");
    body.classList.remove("search-is-open");
    if (headerNav) {
      headerNav.classList.remove("is-search-open");
    }
  }

  searchBtn.addEventListener("click", toggleSearchPage);

  // Enter key support for search input
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        if (searchPageBtn) {
          searchPageBtn.click();
        }
      }
    });
  }

  // Enter key support for FAQ search input
  if (faqSearchInput) {
    faqSearchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        window.location.href = "/optex-search";
      }
    });
  }

  // Redirect
  if (searchPageBtn) {
    searchPageBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/optex-search";
    });
  }

  // Click outside to close
  document.addEventListener("click", function (event) {
    if (!searchPage.classList.contains("is-open")) return;
    if (
      !searchPage.contains(event.target) &&
      !searchBtn.contains(event.target)
    ) {
      closeSearchPage();
    }
  });

  // Close with ESC key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && searchPage.classList.contains("is-open")) {
      closeSearchPage();
    }
  });

  // Save to sessionStorage in real time
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      sessionStorage.setItem("searchInputValue", searchInput.value);
    });
  }

  // Search page autofill
  const savedValue = sessionStorage.getItem("searchInputValue");
  if (savedValue && faqSearchInput) {
    faqSearchInput.value = savedValue;
    // Dispatch input event to simulate typing
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    faqSearchInput.dispatchEvent(event);
  }
}

// --- FILTER PAGES
function filterPage() {
  const filterGridEl = document.querySelector(".o-grid.filter-pdt");
  if (!filterGridEl) return;

  let filterTimeout = null;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      const [listInstance] = listInstances;

      if (
        listInstance.hooks &&
        listInstance.hooks.afterRender &&
        listInstance.hooks.afterRender.callbacks
      ) {
        listInstance.hooks.afterRender.callbacks.push(() => {
          if (filterTimeout) {
            clearTimeout(filterTimeout);
          }

          filterTimeout = setTimeout(() => {
            productsEmptyParagraphs();
          }, 150);
        });
      }
    },
  ]);
}

// --- PRODUCTS TECH SPECS VISIBILITY
function productsTechSpecsVisibility() {
  const sideList = document.querySelector(".c-pdt-side-dl-list");
  const certWrap = document.querySelector(".c-pdt-cert-wrap");

  if (!sideList || !certWrap) return;

  // Get all direct children of the side list
  const allItems = sideList.children;

  // Check if all items have the .w-condition-invisible class
  const allInvisible = Array.from(allItems).every(item =>
    item.classList.contains("w-condition-invisible")
  );

  // Hide or show the cert wrap based on the condition
  if (allInvisible && allItems.length > 0) {
    certWrap.style.display = "none";
  } else {
    certWrap.style.display = "";
  }
}

// --- HOME FEATURED CARDS
function homeFeaturedCards() {
  const homePage = document.querySelector("[data-page='home']");
  if (!homePage) return;

  const prodCardWraps = homePage.querySelectorAll(".c-prod-card-wrap");

  function moveTxtOut() {
    prodCardWraps.forEach(cardWrap => {
      const prodTxt = cardWrap.querySelector(".c-prod-txt");
      if (prodTxt) {
        cardWrap.appendChild(prodTxt);
      }
    });
  }

  function moveTxtBack() {
    prodCardWraps.forEach(cardWrap => {
      const prodTxt = cardWrap.querySelector(".c-prod-txt");
      const prodCard = cardWrap.querySelector(".c-prod-card");
      if (prodTxt && prodCard) {
        prodCard.appendChild(prodTxt);
      }
    });
  }

  function handleResize() {
    if (window.innerWidth <= 991) {
      moveTxtOut();
    } else if (window.innerWidth >= 992) {
      moveTxtBack();
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);
}

// --- HEADER MOBILE
function headerMobile() {
  const header = document.querySelector(".c-header");
  const navBtn = document.querySelector(".c-nav-btn");
  const navMenu = document.querySelector(".c-header-nav");
  const body = document.querySelector(".c-body");
  const ddGroupBt = document.querySelector(".c-dd-group_bt");
  const menuLine1 = document.querySelectorAll(".c-nav-bar.is-1");
  const menuLine2 = document.querySelectorAll(".c-nav-bar.is-2");
  const menuLine3 = document.querySelectorAll(".c-nav-bar.is-3");
  let navStatus = "closed";
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "expo.inOut", duration: 0.6 },
    onComplete: function () {
      // When open animation finishes, set overflow to scroll
      if (navStatus === "open") {
        navMenu.style.overflow = "scroll";
      }
    },
    onReverseComplete: function () {
      // When close animation finishes, set overflow to hidden
      if (navStatus === "closed") {
        navMenu.style.overflow = "hidden";
      }
    },
  });

  if (navMenu && ddGroupBt) {
    navMenu.appendChild(ddGroupBt);
  }

  gsap.set(menuLine1, { transformOrigin: "center center" });
  gsap.set(menuLine2, { transformOrigin: "center center" });
  gsap.set(menuLine3, { transformOrigin: "center center" });

  tl.to(header, { borderRadius: 0 }, 0);
  tl.to(navMenu, { height: "auto" }, 0);
  tl.to(menuLine1, { rotation: 45, y: 5 }, 0);
  tl.to(menuLine2, { width: 0 }, 0);
  tl.to(menuLine3, { rotation: -45, y: -5 }, 0);

  const ddLinks = document.querySelectorAll(".c-dd-link");

  function closeAllDropdowns() {
    ddLinks.forEach(link => {
      link.classList.remove("is-active");
    });
  }

  function toggleDropdown(targetLink) {
    const isCurrentlyActive = targetLink.classList.contains("is-active");
    closeAllDropdowns();
    if (!isCurrentlyActive) {
      targetLink.classList.add("is-active");
    }
  }

  ddLinks.forEach(link => {
    const toggle = link.querySelector(".c-dd-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        toggleDropdown(link);
      });
    }
  });

  document.addEventListener("click", e => {
    const isInsideDropdown = e.target.closest(".c-dd-group");
    const isToggle = e.target.closest(".c-dd-toggle");
    if (!isInsideDropdown && !isToggle) {
      closeAllDropdowns();
    }
  });

  navBtn.addEventListener("click", function () {
    if (navStatus === "closed") {
      tl.restart();
      navStatus = "open";
      navMenu.setAttribute("data-lenis-prevent", "");
      body.classList.add("header-is-open");
      lenis.stop();
    } else {
      tl.reverse();
      navStatus = "closed";
      navMenu.removeAttribute("data-lenis-prevent");
      body.classList.remove("header-is-open");
      lenis.start();
    }
  });

  window.addEventListener("resize", function () {
    const originalContainer = document.querySelector(
      ".c-dd-link.products .c-dd-group.products"
    );
    if (window.innerWidth >= 992) {
      if (originalContainer && ddGroupBt) {
        originalContainer.appendChild(ddGroupBt);
      }
    } else {
      if (navMenu && ddGroupBt) {
        navMenu.appendChild(ddGroupBt);
      }
    }
  });
}

// --- HEADER VISIBILITY
function headerScrollVisibility() {
  const header = document.querySelector(".c-header");
  if (!header) return;

  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      if (!header.classList.contains("not-visible")) {
        header.classList.add("not-visible");
        gsap.to(header, { autoAlpha: 0, duration: 0.4, ease: "power2.inOut" });
      }
    } else {
      if (header.classList.contains("not-visible")) {
        header.classList.remove("not-visible");
        gsap.to(header, { autoAlpha: 1, duration: 0.4, ease: "power2.inOut" });
      }
    }
    lastScrollTop = scrollTop;
  });
}

// --- GLOBAL LOADER
function globalLoader() {
  const homePage = document.querySelector("[data-page='home']");
  if (homePage) return;

  const pageWrapper = document.querySelector(".o-page-wrapper");

  let tl = gsap.timeline({
    defaults: {
      duration: 0.4,
      ease: "ease-in-out-1",
    },
  });

  tl.to(pageWrapper, { opacity: 1 });
}

// --- HOME LOADER
function homeLoader() {
  const homePage = document.querySelector("[data-page='home']");
  if (!homePage) return;

  const pageWrapper = document.querySelector(".o-page-wrapper");
  gsap.set(pageWrapper, { opacity: 1 });

  const tl = gsap.timeline({
    defaults: {
      duration: 1.2,
      ease: "ease-in-out-2",
    },
    delay: 0.1,
  });

  tl.to(".c-loader_top", { yPercent: -100 });
  tl.to(".c-loader_bt", { yPercent: 100 }, 0);

  const textInstances = document.querySelectorAll("[data-split='loader-text']");
  if (textInstances.length > 0) {
    textInstances.forEach(text => {
      gsap.set(text, { autoAlpha: 1 });
      let split = SplitText.create(text, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
      });

      tl.from(
        split.lines,
        {
          yPercent: 105,
          ease: "ease-out-2",
          stagger: 0.15,
          onComplete: () => {
            split.revert();
          },
        },
        ">-0.3"
      );
    });
  }

  // tl.from(".c-header", { yPercent: -150 }, "<0.2");
  tl.from(
    ".c-header",
    {
      yPercent: -150,
      onComplete: function () {
        gsap.set(".c-header", { clearProps: "transform" });
      },
    },
    "<0.2"
  );
}

// --- FUNCTION FILTERS MOBILE
function filtersMobile() {
  const filterBtn = document.querySelector(".c-filter-btn-mobile .c-btn");
  const filterSideForm = document.querySelector(".c-filter-side-form-block");
  const body = document.querySelector(".c-body");
  const applyBtn = document.querySelector('[data-filter-btn="apply"]');
  const clearBtn = document.querySelector('[data-filter-btn="clear"]');
  if (!filterBtn || !filterSideForm || !body) return;

  function openFilter() {
    filterSideForm.classList.add("is-open");
    filterSideForm.setAttribute("data-lenis-prevent", "");
    body.classList.add("header-is-open");
    if (typeof lenis !== "undefined" && lenis.stop) {
      lenis.stop();
    }
  }

  function closeFilter() {
    filterSideForm.classList.remove("is-open");
    filterSideForm.removeAttribute("data-lenis-prevent");
    body.classList.remove("header-is-open");
    if (typeof lenis !== "undefined" && lenis.start) {
      lenis.start();
    }
  }

  function clearAllFilters() {
    const radios = filterSideForm.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.checked = false;
    });
    // Remove .is-list-active class from all elements
    const activeElements = filterSideForm.querySelectorAll(".is-list-active");
    activeElements.forEach(element => {
      element.classList.remove("is-list-active");
    });
  }

  filterBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openFilter();
  });

  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      closeFilter();

      const sectionFilter = document.querySelector("#section-filter");
      if (sectionFilter && typeof lenis !== "undefined" && lenis.scrollTo) {
        setTimeout(() => {
          lenis.scrollTo(sectionFilter, { offset: -60 });
        }, 150);
      }
    });
  }

  // Clear filters functionality
  if (clearBtn) {
    clearBtn.addEventListener("click", function (e) {
      e.preventDefault();
      clearAllFilters();
    });
  }

  document.addEventListener("click", function (e) {
    if (filterSideForm.classList.contains("is-open")) {
      if (!filterSideForm.contains(e.target) && !filterBtn.contains(e.target)) {
        closeFilter();
      }
    }
  });

  filterSideForm.addEventListener("click", function (e) {
    e.stopPropagation();
  });
}

// --------------- INIT ---------------
function init() {
  solutionsSlider();
  resourcesSlider();
  solutionsTabber();
  teSlider();
  videoPlayer();
  homeHeroProductsSlider();
  featuresTabber();
  accordions(
    ".c-ac-item",
    ".c-ac-question",
    ".c-ac-answer",
    ".c-icon.ac-arrow",
    false
  );
  pdtTabber();
  pdtTabberSlider();
  filterSettings();
  accordions(
    ".c-filter-item",
    ".c-filter-toggle",
    ".c-filter-list",
    ".c-icon.filter-arrow",
    true,
    180
  );
  paginationScrollTo();
  headerTabber();
  articlePaginationScrollTo();
  productsEmptyParagraphs();
  insightsPrevNext();
  hidePaginationIfSinglePage();
  accordions(
    ".c-faq-item",
    ".c-faq-question",
    ".c-faq-answer",
    ".c-icon",
    true,
    180
  );
  faqPage();
  careersJobBoard();
  returnToTop();
  accordions(
    ".c-rh-ac",
    ".c-rh-ac-toggle .c-btn",
    ".c-rh-ac-main",
    ".c-icon.rh",
    true
  );
  resourcesHub();
  requestLayourForm();
  searchPage();
  headerSearch();
  filterPage();
  productsTechSpecsVisibility();
  homeFeaturedCards();
  solutionsTabberTabletMobile();
  globalLoader();
  homeLoader();
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  headerDesktop();
  headerScrollVisibility();
  fade();
  drawLine();
  drawVerticalLine();
  parallax();
  return () => {
    //
  };
});

// --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
mm.add("(max-width: 991px)", () => {
  headerMobile();
  filtersMobile();
  return () => {
    //
  };
});
