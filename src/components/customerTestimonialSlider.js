export default function customerTestimonialSlider() {
  const sliderEl = document.querySelector(".swiper.customer");
  if (!sliderEl) return;

  // Check if the attribute exists and is "on"
  const isAttributeOn = sliderEl.getAttribute("data-disable-loop") === "true";

  const sliderMain = new Swiper(sliderEl, {
    // slidesPerView: "auto",
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,
    centeredSlides: !isAttributeOn,
    loop: !isAttributeOn,
    navigation: {
      prevEl: "#customer-prev",
      nextEl: "#customer-next",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
      },
      480: {
        slidesPerView: 1.25,
      },
      992: {
        slidesPerView: "auto",
      },
    },
  });
}
