export default function resourcesHubSlider() {
  const sliderEl = document.querySelector(".swiper.re-hub");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: 3,
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#re-hub-prev",
      nextEl: "#re-hub-next",
    },
  });
}
