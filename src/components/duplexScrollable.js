export default function duplexScrollable() {
  const section = document.querySelector("[data-section-duplex-scrollable]");
  if (!section) return;

  const items = section.querySelectorAll(".o-row.duplex");
  if (!items.length) return;

  const images = section.querySelectorAll(".c-img-contain.duplex");

  items.forEach((item, index) => {
    const image = images[index];

    ScrollTrigger.create({
      trigger: item,
      start: "top 50%", // activates when the item passes into view
      end: "bottom top", // deactivates when it leaves
      onEnter: () => {
        images.forEach((img, i) => {
          if (i !== index) img.classList.remove("is-active");
        });
        image.classList.add("is-active");
      },
      onEnterBack: () => {
        images.forEach((img, i) => {
          if (i !== index) img.classList.remove("is-active");
        });
        image.classList.add("is-active");
      },
      onLeave: () => {
        image.classList.remove("is-active"); // remove when leaving downwards
      },
      onLeaveBack: () => {
        image.classList.remove("is-active"); // remove when leaving upwards
      },
    });
  });

  // Z-index adjustment
  const duplexSection = document.querySelector(
    ".c-section[data-section-duplex-scrollable]"
  );

  if (duplexSection) {
    const allSections = document.querySelectorAll(".c-section");
    const sectionsArray = Array.from(allSections);
    const duplexIndex = sectionsArray.indexOf(duplexSection);

    if (duplexIndex !== -1) {
      for (let i = 1; i <= 3; i++) {
        if (duplexIndex - i >= 0) {
          sectionsArray[duplexIndex - i].style.zIndex = "30";
        }
        if (duplexIndex + i < sectionsArray.length) {
          sectionsArray[duplexIndex + i].style.zIndex = "30";
        }
      }
    }
  }
}
