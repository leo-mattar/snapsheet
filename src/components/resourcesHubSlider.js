export default function resourcesHubSlider() {
  const sliders = document.querySelectorAll(".swiper.re-hub");
  if (!sliders.length) return;

  sliders.forEach((sliderEl, index) => {
    const sliderMain = new Swiper(sliderEl, {
      spaceBetween: 0,
      speed: 600,
      grabCursor: true,
      navigation: {
        // scope navigation to each slider
        prevEl: sliderEl
          .closest(".c-swiper.re-hub")
          ?.querySelector("#re-hub-prev"),
        nextEl: sliderEl
          .closest(".c-swiper.re-hub")
          ?.querySelector("#re-hub-next"),
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
  });
}
