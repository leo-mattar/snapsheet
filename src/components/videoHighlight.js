export default function videoHighlight() {
  const videoHighlightItems = document.querySelectorAll("[data-video-hl-item]");

  videoHighlightItems.forEach(item => {
    item.addEventListener("click", function () {
      const video = this.querySelector(".c-video-hl");
      const src = this.getAttribute("data-video-src") || "";
      const isActive = this.classList.contains("is-active");

      if (isActive) {
        this.classList.remove("is-active");
        video.pause();
      } else {
        videoHighlightItems.forEach(otherItem => {
          const otherVideo = otherItem.querySelector(".c-video-hl");
          otherItem.classList.remove("is-active");
          otherVideo.pause();
        });

        this.classList.add("is-active");

        if (!video.getAttribute("src") && src) {
          video.setAttribute("src", src);
        }

        if (video.src && video.src !== "") {
          video.play().catch(() => {});
        }
      }
    });
  });
}
