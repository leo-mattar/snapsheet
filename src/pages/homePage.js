export default function homePage() {
  const page = document.querySelector("[data-page='home']");
  if (!page) return;

  document.fonts.ready.then(() => {
    gsap.to("body", {
      opacity: 1,
      ease: "power3.out",
      duration: 1.4,
    });
  });
}
