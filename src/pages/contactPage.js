export default function contactPage() {
  const page = document.querySelector("[data-page='contact']");
  if (!page) return;

  const items = page.querySelectorAll(".c-contact-item");

  items.forEach(item => {
    const trigger = item.querySelector("[data-contact-modal-trigger]");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const value = trigger.getAttribute("data-contact-modal-trigger");
      const modal = document.querySelector(
        `.c-form-modal[data-contact-modal-item='${value}']`
      );
      if (!modal) return;

      const modalInner = modal.querySelector(".c-form-modal-inner");
      const closeBtn = modal.querySelector(".form-modal-close-btn");

      // Open modal
      modal.classList.add("is-open");
      lenis.stop();

      // Close function
      const closeModal = () => {
        modal.classList.remove("is-open");
        lenis.start();
        document.removeEventListener("keydown", escHandler);
      };

      // ESC key handler
      const escHandler = e => {
        if (e.key === "Escape") closeModal();
      };

      document.addEventListener("keydown", escHandler);

      // Click outside handler
      modal.addEventListener("click", e => {
        if (!modalInner.contains(e.target)) closeModal();
      });

      // Close button handler
      if (closeBtn) {
        closeBtn.addEventListener("click", closeModal, { once: true });
      }
    });
  });
}
