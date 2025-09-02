export default function returnToTop() {
  const returnLink = document.querySelector("[data-return-to-top-trigger]");
  if (!returnLink) return;

  const backTopLinks = document.querySelectorAll(
    "[data-return-to-top-trigger]"
  );

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
