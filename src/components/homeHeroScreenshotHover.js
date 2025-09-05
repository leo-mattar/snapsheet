export default function homeHeroScreenshotHover() {
  const heroSection = document.querySelector(".c-section.hm-hero");
  if (!heroSection) return;

  const heroTags = heroSection.querySelectorAll(".c-hm-hero-tag");
  const heroImages = heroSection.querySelectorAll(".c-img-contain.hero-tag");

  heroTags.forEach((tag, index) => {
    tag.addEventListener("mouseenter", () => {
      if (heroImages[index]) {
        heroImages[index].classList.add("is-active");
      }
    });

    tag.addEventListener("mouseleave", () => {
      if (heroImages[index]) {
        heroImages[index].classList.remove("is-active");
      }
    });
  });
}
