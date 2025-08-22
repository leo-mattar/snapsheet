export default function partnersFilterSystem() {
  const page = document.querySelector("[data-page='integrations']");
  if (!page) return;

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    listInstances => {
      const [listInstance] = listInstances;

      const options = {
        container: "#macy-container",
        trueOrder: false,
        waitForImages: false,
        margin: 20,
        columns: 3,
        breakAt: {
          991: 2,
          520: 1,
        },
      };

      let macyInstance = Macy(options);

      listInstances[1].addHook("render", items => {
        // Destroy existing instance to prevent conflicts
        if (macyInstance) {
          macyInstance.remove();
        }

        // Small delay to ensure DOM is updated
        setTimeout(() => {
          macyInstance = Macy(options);

          // Force recalculation after initialization
          setTimeout(() => {
            macyInstance.recalculate();
          }, 50);
        }, 10);
      });

      // Optional: Add window resize handler for responsive recalculation
      window.addEventListener("resize", () => {
        if (macyInstance) {
          macyInstance.recalculate();
        }
      });
    },
  ]);
}
