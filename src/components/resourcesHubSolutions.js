export default function resourcesHubSolutions() {
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-see-more-btn]");
    if (!btn) return;

    const items = document.querySelectorAll(".c-solution-item");
    if (!items.length) return; // guard clause

    items.forEach(item => {
      item.style.display = "flex";
    });

    btn.style.display = "none"; // hide the button
  });
}
