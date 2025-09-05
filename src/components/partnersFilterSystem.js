// export default function partnersFilterSystem() {
//   const page = document.querySelector("[data-page='integrations']");
//   if (!page) return;

//   window.FinsweetAttributes ||= [];
//   window.FinsweetAttributes.push([
//     "list",
//     listInstances => {
//       const [listInstance] = listInstances;

//       const options = {
//         container: "#macy-container",
//         trueOrder: false,
//         waitForImages: true,
//         margin: 20,
//         columns: 3,
//         breakAt: {
//           991: 2,
//           520: {
//             columns: 1,
//             margin: 12,
//           },
//         },
//       };

//       let macyInstance = Macy(options);

//       listInstances[1].addHook("render", () => {
//         requestAnimationFrame(() => {
//           if (macyInstance) {
//             macyInstance.recalculate(true);
//           }
//         });
//       });

//       window.addEventListener("resize", () => {
//         if (macyInstance) {
//           macyInstance.recalculate(true);
//         }
//       });
//     },
//   ]);
// }

export default function partnersFilterSystem() {
  const page = document.querySelector("[data-page='integrations']");
  if (!page) return;

  // Ensure Macy is available before proceeding
  function waitForMacy() {
    return new Promise(resolve => {
      if (typeof Macy !== "undefined") {
        resolve();
        return;
      }

      const checkMacy = setInterval(() => {
        if (typeof Macy !== "undefined") {
          clearInterval(checkMacy);
          resolve();
        }
      }, 50);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkMacy);
        console.warn("Macy library not found after 5 seconds");
        resolve();
      }, 5000);
    });
  }

  // Ensure container exists before initializing
  function waitForContainer() {
    return new Promise(resolve => {
      const container = document.querySelector("#macy-container");
      if (container) {
        resolve(container);
        return;
      }

      const observer = new MutationObserver(() => {
        const container = document.querySelector("#macy-container");
        if (container) {
          observer.disconnect();
          resolve(container);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        console.warn("Macy container not found after 10 seconds");
        resolve(null);
      }, 10000);
    });
  }

  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    "list",
    async listInstances => {
      const [listInstance] = listInstances;
      let macyInstance = null;
      let isInitializing = false;

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

      async function initializeMacy() {
        if (isInitializing) return;
        isInitializing = true;

        try {
          // Wait for both Macy library and container
          await waitForMacy();
          const container = await waitForContainer();

          if (!container || typeof Macy === "undefined") {
            console.warn(
              "Cannot initialize Macy: missing library or container"
            );
            isInitializing = false;
            return;
          }

          // Destroy existing instance if it exists
          if (macyInstance) {
            try {
              macyInstance.remove();
            } catch (e) {
              console.warn("Error removing existing Macy instance:", e);
            }
          }

          // Initialize new instance
          macyInstance = Macy(options);

          // Force initial recalculation after a short delay
          setTimeout(() => {
            if (macyInstance) {
              macyInstance.recalculate(true);
            }
          }, 100);
        } catch (error) {
          console.error("Error initializing Macy:", error);
        } finally {
          isInitializing = false;
        }
      }

      // Initialize on first load
      await initializeMacy();

      // Reinitialize when list renders
      if (listInstances[1]) {
        listInstances[1].addHook("render", () => {
          requestAnimationFrame(async () => {
            // Small delay to ensure DOM is fully updated
            await new Promise(resolve => setTimeout(resolve, 50));

            if (macyInstance) {
              try {
                macyInstance.recalculate(true);
              } catch (e) {
                // If recalculate fails, try reinitializing
                console.warn("Macy recalculate failed, reinitializing:", e);
                await initializeMacy();
              }
            } else {
              // If no instance exists, initialize
              await initializeMacy();
            }
          });
        });
      }

      // Handle window resize with debouncing
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (macyInstance) {
            try {
              macyInstance.recalculate(true);
            } catch (e) {
              console.warn("Macy recalculate failed on resize:", e);
            }
          }
        }, 150);
      });

      // Handle images loading (additional safety measure)
      const container = document.querySelector("#macy-container");
      if (container) {
        const images = container.querySelectorAll("img");
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages > 0) {
          images.forEach(img => {
            if (img.complete) {
              loadedImages++;
            } else {
              img.addEventListener("load", () => {
                loadedImages++;
                if (loadedImages === totalImages && macyInstance) {
                  macyInstance.recalculate(true);
                }
              });
              img.addEventListener("error", () => {
                loadedImages++;
                if (loadedImages === totalImages && macyInstance) {
                  macyInstance.recalculate(true);
                }
              });
            }
          });

          // If all images are already loaded, recalculate
          if (loadedImages === totalImages && macyInstance) {
            setTimeout(() => macyInstance.recalculate(true), 100);
          }
        }
      }

      // Cleanup function (optional, for SPA environments)
      return () => {
        if (macyInstance) {
          try {
            macyInstance.remove();
          } catch (e) {
            console.warn("Error cleaning up Macy instance:", e);
          }
        }
        clearTimeout(resizeTimeout);
      };
    },
  ]);
}
