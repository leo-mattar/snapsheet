export default function resourcesQuoteSlider() {
  const sliderEl = document.querySelector(".swiper.re-quote");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 600,
    // grabCursor: false,
    navigation: {
      prevEl: "#re-quote-prev",
      nextEl: "#re-quote-next",
    },
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
  });
}
