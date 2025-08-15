export default function partnersMarquee() {
  const section = document.querySelector("#partners-panel");
  if (!section) return;

  const panels = Array.from(
    document.querySelectorAll("[data-section-panel]")
  ).filter(p => section.contains(p));
  if (!panels.length) return;

  if (!document.getElementById("partners-marquee-style")) {
    const style = document.createElement("style");
    style.id = "partners-marquee-style";
    style.textContent = `
#partners-panel [data-marquee-list] {
  animation-name: slide;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
`;
    document.head.appendChild(style);
  }

  panels.forEach(panel => {
    const navLinks = panel.querySelectorAll(".c-panel-nav-link");
    const marquees = panel.querySelectorAll(".c-partner-marquee");

    if (marquees.length > 0) {
      marquees[marquees.length - 1].classList.add("reverse");
    }

    const fetchWrap = section.querySelector(".c-partner-marquee-fetch-wrap");
    const allItems = fetchWrap
      ? Array.from(fetchWrap.querySelectorAll(".c-partner-marquee-item"))
      : [];

    function setDynamicSpeed(list, itemCount) {
      const baseSpeed = 60;
      const baseItemCount = 10;
      const duration = Math.max(20, (itemCount / baseItemCount) * baseSpeed);
      list.style.animationDuration = `${duration}s`;
    }

    function removeActiveClass() {
      navLinks.forEach(link => link.classList.remove("is-active"));
    }

    function setActiveClass(link) {
      removeActiveClass();
      link.classList.add("is-active");
    }

    function clearMarquees() {
      marquees.forEach(marquee => {
        marquee
          .querySelectorAll(".c-partner-marquee-item")
          .forEach(item => item.remove());
        marquee
          .querySelectorAll(".c-partner-marquee-list")
          .forEach(list => list.remove());
      });
    }

    function setMarqueeStates(activeMarquees) {
      const allLists = panel.querySelectorAll(".c-partner-marquee-list");
      allLists.forEach(list =>
        list.setAttribute("data-marquee-state", "paused")
      );
      activeMarquees.forEach(marquee => {
        const list = marquee.querySelector(".c-partner-marquee-list");
        if (list) list.setAttribute("data-marquee-state", "playing");
      });
    }

    function duplicateLists(activeMarquees) {
      activeMarquees.forEach(marquee => {
        const list = marquee.querySelector(".c-partner-marquee-list");
        if (list) {
          const itemCount = list.children.length;
          const duplicateCount = itemCount < 5 ? 2 : 1;
          const totalFilteredCount =
            parseInt(list.dataset.totalItems) || itemCount;

          for (let i = 0; i < duplicateCount; i++) {
            const clone = list.cloneNode(true);
            if (marquee.classList.contains("reverse")) {
              clone.setAttribute("data-marquee-direction", "right");
              clone.classList.add("reverse");
            }
            setDynamicSpeed(clone, totalFilteredCount);
            marquee.appendChild(clone);
          }
        }
      });
    }

    function populateMarquees(category) {
      let filteredItems;
      if (category === "All Partners") {
        filteredItems = allItems.slice();
      } else {
        filteredItems = allItems.filter(item => {
          const catEl = item.querySelector("[data-partner-category]");
          const text = catEl ? catEl.textContent.trim() : "";
          return text === category;
        });
      }

      const marqueeCount = marquees.length || 1;
      const totalFilteredCount = filteredItems.length;

      marquees.forEach((marquee, marqueeIndex) => {
        const list = document.createElement("div");
        list.className = "c-partner-marquee-list";
        list.setAttribute("data-marquee-list", "");
        if (marquee.classList.contains("reverse")) {
          list.setAttribute("data-marquee-direction", "right");
          list.classList.add("reverse");
        }
        filteredItems.forEach((item, index) => {
          if (index % marqueeCount === marqueeIndex) {
            list.appendChild(item.cloneNode(true));
          }
        });
        list.dataset.totalItems = totalFilteredCount;
        setDynamicSpeed(list, totalFilteredCount);
        marquee.appendChild(list);
      });

      setMarqueeStates(marquees);
      duplicateLists(marquees);
    }

    function fadeSwitch(category) {
      const marqueeTab = panel.querySelector(".c-partner-marquee-tab");
      if (!marqueeTab) {
        clearMarquees();
        populateMarquees(category);
        return;
      }

      marqueeTab.style.transition = "opacity 0.3s ease";
      marqueeTab.style.opacity = "0";

      setTimeout(() => {
        clearMarquees();
        populateMarquees(category);
        marqueeTab.style.opacity = "1";
      }, 300);
    }

    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        if (this.classList.contains("is-active")) return;
        setActiveClass(this);
        const category = this.getAttribute("data-panel-link");
        fadeSwitch(category);
      });
    });

    clearMarquees();
    populateMarquees("All Partners");

    if (navLinks.length > 0) {
      navLinks[0].classList.add("is-active");
    }
  });
}
