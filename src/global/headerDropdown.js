// --- HOVER VERSION
// export default function headerDropdown() {
//   const dropdowns = document.querySelectorAll("[data-nav-dropdown]");
//   const header = document.querySelector(".c-header");
//   let isMobile = window.innerWidth <= 991;

//   window.addEventListener("resize", () => {
//     isMobile = window.innerWidth <= 991;
//   });

//   function closeDropdown(dropdown) {
//     dropdown.setAttribute("data-nav-dropdown", "closed");
//     dropdown.classList.remove("animate-clip");
//   }

//   function closeAllDropdowns(except = null) {
//     dropdowns.forEach(d => {
//       if (d === except) return;
//       closeDropdown(d);
//     });
//   }

//   function openDropdown(dropdown) {
//     const anyOpen = Array.from(dropdowns).some(
//       d => d.getAttribute("data-nav-dropdown") === "open"
//     );
//     if (!isMobile && !anyOpen) dropdown.classList.add("animate-clip");
//     closeAllDropdowns(dropdown);
//     dropdown.setAttribute("data-nav-dropdown", "open");
//   }

//   dropdowns.forEach(dropdown => {
//     const toggle = dropdown.querySelector(".c-nav-toggle");
//     const megamenu = dropdown.querySelector(".c-nav-megamenu");

//     if (!toggle || !megamenu) return;

//     function handleDesktopHover() {
//       if (isMobile) return;

//       toggle.addEventListener("mouseenter", () => {
//         openDropdown(dropdown);
//       });

//       let isOverMegamenu = false;
//       let isOverHeader = false;

//       megamenu.addEventListener("mouseenter", () => {
//         isOverMegamenu = true;
//       });

//       megamenu.addEventListener("mouseleave", () => {
//         isOverMegamenu = false;
//         setTimeout(() => {
//           if (!isOverHeader && !isOverMegamenu) closeDropdown(dropdown);
//         }, 10);
//       });

//       megamenu.addEventListener("animationend", e => {
//         if (e.animationName === "revealClip")
//           dropdown.classList.remove("animate-clip");
//       });

//       if (header) {
//         header.addEventListener("mouseenter", () => {
//           isOverHeader = true;
//         });

//         header.addEventListener("mouseleave", () => {
//           isOverHeader = false;
//           setTimeout(() => {
//             if (!isOverHeader && !isOverMegamenu) closeDropdown(dropdown);
//           }, 10);
//         });
//       }
//     }

//     function handleMobileClick() {
//       if (!isMobile) return;

//       toggle.addEventListener("click", e => {
//         e.preventDefault();
//         e.stopPropagation();

//         const currentState = dropdown.getAttribute("data-nav-dropdown");
//         if (currentState === "open") {
//           closeDropdown(dropdown);
//         } else {
//           openDropdown(dropdown);
//         }
//       });
//     }

//     handleDesktopHover();
//     handleMobileClick();

//     document.addEventListener("click", e => {
//       if (!isMobile) return;
//       if (!dropdown.contains(e.target)) closeDropdown(dropdown);
//     });
//   });

//   document.addEventListener("click", e => {
//     if (!isMobile) return;
//     if (header && !header.contains(e.target)) closeAllDropdowns();
//   });
// }

// --- CLICK VERSION
export default function headerDropdown() {
  const dropdowns = document.querySelectorAll("[data-nav-dropdown]");
  const header = document.querySelector(".c-header");
  let isMobile = window.innerWidth <= 991;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 991;
  });

  function updateHeaderBackground() {
    if (!header) return;
    const anyOpen = Array.from(dropdowns).some(
      d => d.getAttribute("data-nav-dropdown") === "open"
    );

    if (!header.classList.contains("scrolled")) {
      header.style.background = anyOpen
        ? "var(--_theme---background--background)"
        : "";
    }
  }

  function closeDropdown(dropdown) {
    dropdown.setAttribute("data-nav-dropdown", "closed");
    updateHeaderBackground();
  }

  function closeAllDropdowns(except = null) {
    dropdowns.forEach(d => {
      if (d === except) return;
      d.setAttribute("data-nav-dropdown", "closed");
    });
    updateHeaderBackground();
  }

  function openDropdown(dropdown) {
    closeAllDropdowns(dropdown);
    dropdown.setAttribute("data-nav-dropdown", "open");
    updateHeaderBackground();
  }

  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector(".c-nav-toggle");
    const megamenu = dropdown.querySelector(".c-nav-megamenu");

    if (!toggle || !megamenu) return;

    toggle.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      const currentState = dropdown.getAttribute("data-nav-dropdown");
      if (currentState === "open") {
        closeDropdown(dropdown);
      } else {
        openDropdown(dropdown);
      }
    });
  });

  // Close when clicking outside header
  document.addEventListener("click", e => {
    if (header && !header.contains(e.target)) closeAllDropdowns();
  });

  // Close with Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeAllDropdowns();
  });
}
