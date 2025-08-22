export default function blogHeroSlider() {
  const sliderEl = document.querySelector(".swiper.blog-featured");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: "#blog-featured-prev",
      nextEl: "#blog-featured-next",
    },
  });
}
