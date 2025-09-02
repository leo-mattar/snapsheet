export default function resourcesHubSlider() {
  const sliderEl = document.querySelector(".swiper.re-hub");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#re-hub-prev",
      nextEl: "#re-hub-next",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.15,
      },
      480: {
        slidesPerView: 2.15,
      },
      768: {
        slidesPerView: 2.8,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
}
