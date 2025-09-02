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
        waitForImages: true,
        margin: 20,
        columns: 3,
        breakAt: {
          991: 2,
          520: {
            columns: 1,
            margin: 12,
          },
        },
      };

      let macyInstance = Macy(options);

      listInstances[1].addHook("render", () => {
        requestAnimationFrame(() => {
          if (macyInstance) {
            macyInstance.recalculate(true);
          }
        });
      });

      window.addEventListener("resize", () => {
        if (macyInstance) {
          macyInstance.recalculate(true);
        }
      });
    },
  ]);
}
