export default function blogPage() {
  const page = document.querySelector("[data-page='blog']");
  if (!page) return;

  function paginationScrollTo() {
    const paginationBtns = document.querySelectorAll(".c-pagination-page-btn");
    const blogSection = document.querySelector("[data-blog-content-section]");

    paginationBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (blogSection) {
          lenis.scrollTo(blogSection, { offset: -56 });
        }
      });
    });
  }

  paginationScrollTo();

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      listInstances[0].addHook("afterRender", items => {
        setTimeout(() => {
          paginationScrollTo();
          console.log("pagination");
        }, 100);
      });
    },
  ]);
}
