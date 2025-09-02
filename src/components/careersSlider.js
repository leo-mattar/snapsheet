export default function careersSlider() {
  const sliderEl = document.querySelector(".swiper.careers");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,
    loop: true,
    // loopAdditionalSlides: 2,
    centeredSlides: true,
    navigation: {
      prevEl: "#careers-prev",
      nextEl: "#careers-next",
    },
  });
}
