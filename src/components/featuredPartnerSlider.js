export default function featuredPartnerSlider() {
  const sliderEl = document.querySelector(".swiper.ft-partner");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#ft-partner-prev",
      nextEl: "#ft-partner-next",
    },

    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 12,
        grid: {
          rows: 2,
          fill: "row",
        },
      },
      992: {
        slidesPerView: "auto",
        spaceBetween: 32,
      },
    },
  });
}
