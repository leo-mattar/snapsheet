import partnersMarquee from "./components/partnersMarquee";
import marqueeObserver from "./global/marqueeObserver";
import tabComponent from "./components/tabComponent";
import videoState from "./global/videoState";
import accordion from "./components/accordion";
import resourcesSlider from "./components/resourcesSlider";
import customerTestimonialSlider from "./components/customerTestimonialSlider";
import onboardingProcess from "./components/onboardingProcess";
import featurePanel from "./components/featurePanel";
import lenisInit from "./global/lenis";
import painPointPanel from "./components/painPointPanel";
import videoHighlight from "./components/videoHighlight";
import footerMobile from "./global/footerMobile";
import headerDropdown from "./global/headerDropdown";
import headerMobile from "./global/headerMobile";
import headerScrolled from "./global/headerScrolled";
import headerCtaVisibility from "./global/headerCtaVisibility";
import duplexScrollable from "./components/duplexScrollable";

// --- GSAP
// gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, SplitText);

// gsap.config({
//   nullTargetWarn: false,
//   trialWarn: false,
// });

let mm = gsap.matchMedia();

// --------------- INIT ---------------
function init() {
  lenisInit();
  partnersMarquee();
  marqueeObserver();
  tabComponent();
  videoState();
  accordion();
  resourcesSlider();
  customerTestimonialSlider();
  onboardingProcess();
  featurePanel();
  painPointPanel();
  videoHighlight();
  footerMobile();
  headerDropdown();
  headerScrolled();
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  headerCtaVisibility();
  duplexScrollable();
  return () => {
    //
  };
});

// --------------- MATCHMEDIA (TABLET AND MOBILE) ---------------
mm.add("(max-width: 991px)", () => {
  headerMobile();
  return () => {
    //
  };
});
