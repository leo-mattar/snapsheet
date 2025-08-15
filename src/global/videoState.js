export default function videoState() {
  const medias = document.querySelectorAll(".c-media");
  if (!medias.length) return;

  function getVideoAndWrapper(media) {
    const video = media.querySelector("video");
    if (!video) return { video: null, wrapper: null };
    const wrapper = video.classList.contains("c-video")
      ? video
      : media.querySelector(".c-video") || video;
    return { video, wrapper };
  }

  function setState(wrapper, button, isPlaying) {
    if (isPlaying) {
      wrapper.classList.add("is-playing");
      wrapper.classList.remove("not-playing");
      button.classList.add("is-playing");
      button.classList.remove("not-playing");
    } else {
      wrapper.classList.add("not-playing");
      wrapper.classList.remove("is-playing");
      button.classList.add("not-playing");
      button.classList.remove("is-playing");
    }
  }

  function lazyLoadVideo(video) {
    const dataSrc = video.dataset.src;
    const isLoaded = video.dataset.loaded === "true";

    if (dataSrc && !isLoaded) {
      video.src = dataSrc;
      video.setAttribute("preload", "metadata");
      video.dataset.loaded = "true";
      video.load();

      const wrapper = video.closest(".c-media");
      if (wrapper) {
        wrapper.classList.add("is-loading");

        video.addEventListener(
          "canplay",
          () => {
            wrapper.classList.remove("is-loading");
          },
          { once: true }
        );

        video.addEventListener(
          "error",
          () => {
            wrapper.classList.remove("is-loading");
            wrapper.classList.add("has-error");
          },
          { once: true }
        );
      }
    }
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const media = entry.target;
        const { video, wrapper } = getVideoAndWrapper(media);
        const button = media.querySelector(".c-media-controls-btn");
        if (!video || !wrapper || !button) return;

        const override = media.dataset.userOverride === "true";

        if (entry.isIntersecting) {
          lazyLoadVideo(video);

          if (!override) {
            const playVideo = () => {
              video.play().catch(error => {
                console.warn("Autoplay failed:", error);
                return;
              });
              setState(wrapper, button, true);
            };

            if (video.readyState >= 3) {
              playVideo();
            } else {
              video.addEventListener("canplay", playVideo, { once: true });
            }
          }
        } else {
          video.pause();
          setState(wrapper, button, false);
          media.dataset.userOverride = "false";
        }
      });
    },
    { threshold: 0.1 }
  );

  medias.forEach(media => {
    // Skip if this video is inside .c-section.tab
    if (media.closest(".c-section.tab")) return;

    const { video, wrapper } = getVideoAndWrapper(media);
    const button = media.querySelector(".c-media-controls-btn");
    if (!video || !wrapper || !button) return;

    const dataSrc = video.dataset.src;
    if (dataSrc) {
      video.removeAttribute("src");
      video.setAttribute("preload", "none");
      video.dataset.loaded = "false";
    }

    video.pause();
    setState(wrapper, button, false);
    media.dataset.userOverride = "false";

    observer.observe(media);

    button.addEventListener("click", () => {
      media.dataset.userOverride = "true";

      lazyLoadVideo(video);

      if (video.paused) {
        const playVideo = () => {
          video.play().catch(error => {
            console.warn("Play failed:", error);
          });
          setState(wrapper, button, true);
        };

        if (video.readyState >= 3) {
          playVideo();
        } else {
          video.addEventListener("canplay", playVideo, { once: true });
        }
      } else {
        video.pause();
        setState(wrapper, button, false);
      }
    });
  });
}
