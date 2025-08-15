export default function customerTestimonialSlider() {
  const sliderEl = document.querySelector(".swiper.customer");
  if (!sliderEl) return;

  const sliderMain = new Swiper(sliderEl, {
    slidesPerView: "auto",
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    navigation: {
      prevEl: "#customer-prev",
      nextEl: "#customer-next",
    },
    //   pagination: {
    //     el: ".swiper-pagination.re",
    //     type: "progressbar",
    //   },
  });
}
