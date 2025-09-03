export default function loader() {
  const pageWrapper = document.querySelector(".o-page-wrapper");
  if (!pageWrapper) return;

  console.log("...");

  let tl = gsap.timeline({
    defaults: {
      duration: 0.4,
      ease: "ease-in-out-1",
    },
  });

  tl.to(pageWrapper, { opacity: 1 });
}
