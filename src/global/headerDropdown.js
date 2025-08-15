export default function headerDropdown() {
  const dropdowns = document.querySelectorAll("[data-nav-dropdown]");
  const header = document.querySelector(".c-header");
  let isMobile = window.innerWidth <= 991;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 991;
  });

  function closeAllDropdowns() {
    dropdowns.forEach(dropdown => {
      dropdown.setAttribute("data-nav-dropdown", "closed");
    });
  }

  function openDropdown(dropdown) {
    closeAllDropdowns();
    dropdown.setAttribute("data-nav-dropdown", "open");
  }

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".c-nav-toggle");
    const megamenu = dropdown.querySelector(".c-nav-megamenu");

    if (!toggle || !megamenu) return;

    function handleDesktopHover() {
      if (isMobile) return;

      toggle.addEventListener("mouseenter", () => {
        openDropdown(dropdown);
      });

      let isOverMegamenu = false;
      let isOverHeader = false;

      megamenu.addEventListener("mouseenter", () => {
        isOverMegamenu = true;
      });

      megamenu.addEventListener("mouseleave", () => {
        isOverMegamenu = false;
        setTimeout(() => {
          if (!isOverHeader && !isOverMegamenu) {
            dropdown.setAttribute("data-nav-dropdown", "closed");
          }
        }, 10);
      });

      if (header) {
        header.addEventListener("mouseenter", () => {
          isOverHeader = true;
        });

        header.addEventListener("mouseleave", () => {
          isOverHeader = false;
          setTimeout(() => {
            if (!isOverHeader && !isOverMegamenu) {
              dropdown.setAttribute("data-nav-dropdown", "closed");
            }
          }, 10);
        });
      }
    }

    function handleMobileClick() {
      if (!isMobile) return;

      toggle.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();

        const currentState = dropdown.getAttribute("data-nav-dropdown");
        if (currentState === "open") {
          dropdown.setAttribute("data-nav-dropdown", "closed");
        } else {
          openDropdown(dropdown);
        }
      });
    }

    handleDesktopHover();
    handleMobileClick();

    document.addEventListener("click", e => {
      if (!isMobile) return;

      if (!dropdown.contains(e.target)) {
        dropdown.setAttribute("data-nav-dropdown", "closed");
      }
    });
  });

  document.addEventListener("click", e => {
    if (!isMobile) return;

    if (header && !header.contains(e.target)) {
      closeAllDropdowns();
    }
  });
}
