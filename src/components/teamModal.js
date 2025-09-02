export default function teamModal() {
  const modalWrap = document.querySelector(".c-team-modal-wrap");
  const modalTriggers = document.querySelectorAll("[data-team-modal-trigger]");
  const modalItems = document.querySelectorAll("[data-team-modal-item]");

  function openModal(value) {
    const target = document.querySelector(`[data-team-modal-item='${value}']`);
    if (!target) return;

    // close any open modal first
    closeModal();

    target.classList.add("is-open");
    modalWrap.classList.add("is-open");
    if (typeof lenis !== "undefined") lenis.stop();
  }

  function closeModal() {
    modalItems.forEach(item => item.classList.remove("is-open"));
    modalWrap.classList.remove("is-open");
    if (typeof lenis !== "undefined") lenis.start();
  }

  // open on trigger click
  modalTriggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.preventDefault();
      const value = trigger.getAttribute("data-team-modal-trigger");
      openModal(value);
    });
  });

  // close on close button
  modalItems.forEach(item => {
    const closeBtn = item.querySelector(".c-team-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", e => {
        e.stopPropagation();
        closeModal();
      });
    }
  });

  // close on outside click
  if (modalWrap) {
    modalWrap.addEventListener("click", e => {
      if (e.target === modalWrap) {
        closeModal();
      }
    });
  }

  // close on ESC key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}
