export default function blogHeroSlider() {
  const sliderEl = document.querySelector(".swiper.blog-featured");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#blog-featured-prev",
      nextEl: "#blog-featured-next",
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
        slidesPerView: "auto",
      },
    },
  });
}
