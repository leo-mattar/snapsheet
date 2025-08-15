export default function footerMobile() {
  const footerTitles = document.querySelectorAll(".c-footer-title");

  footerTitles.forEach(title => {
    title.addEventListener("click", () => {
      const item = title.closest("[footer-dropdown-item]");

      if (item) {
        const currentState = item.getAttribute("footer-dropdown-item");
        const allItems = document.querySelectorAll("[footer-dropdown-item]");

        allItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.setAttribute("footer-dropdown-item", "closed");
          }
        });

        if (currentState === "open") {
          item.setAttribute("footer-dropdown-item", "closed");
        } else {
          item.setAttribute("footer-dropdown-item", "open");
        }
      }
    });
  });
}
