export default function painPointPanel() {
  const panel = document.querySelector("#panel-pain");
  if (!panel) return;

  const navLinks = panel.querySelectorAll(".c-panel-nav-link");
  const statsItems = panel.querySelectorAll(".c-b-stats-panel-item");

  // if (!navLinks.length || !statsItems.length) return;

  // Function to activate a specific index
  function activate(index) {
    navLinks.forEach((link, i) =>
      link.classList.toggle("is-active", i === index)
    );
    statsItems.forEach((item, i) =>
      item.classList.toggle("is-active", i === index)
    );
  }

  // Set first item active on page load
  activate(0);

  // Add click listeners
  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => activate(index));
  });
}
