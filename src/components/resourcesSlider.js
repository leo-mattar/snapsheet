export default function resourcesSlider() {
  const sliderEl = document.querySelector(".swiper.re");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: 3,
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#re-prev",
      nextEl: "#re-next",
    },
    //   pagination: {
    //     el: ".swiper-pagination.re",
    //     type: "progressbar",
    //   },
  });
}
