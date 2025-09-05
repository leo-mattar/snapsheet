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
import resourcesQuoteSlider from "./components/resourcesQuoteSlider";
import aboutHeroPanel from "./components/aboutHeroPanel";
import featuredPartnerSlider from "./components/featuredPartnerSlider";
import partnersFilterSystem from "./components/partnersFilterSystem";
import integrationsPage from "./pages/integrationsPage";
import resourcesHubSlider from "./components/resourcesHubSlider";
import blogPage from "./pages/blogPage";
import blogHeroSlider from "./components/blogHeroSlider";
import teamModal from "./components/teamModal";
import careersSlider from "./components/careersSlider";
import footerLogoLight from "./global/footerLogoLight";
import resourcesHubSolutions from "./components/resourcesHubSolutions";
import returnToTop from "./global/returnToTop";
import contactPage from "./pages/contactPage";
import homeHeroScreenshotHover from "./components/homeHeroScreenshotHover";

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
  resourcesQuoteSlider();
  aboutHeroPanel();
  featuredPartnerSlider();
  partnersFilterSystem();
  integrationsPage();
  resourcesHubSlider();
  blogPage();
  blogHeroSlider();
  teamModal();
  careersSlider();
  resourcesHubSolutions();
  returnToTop();
  contactPage();
  homeHeroScreenshotHover();
}

init();

// --------------- MATCHMEDIA (DESKTOP) ---------------
mm.add("(min-width: 992px)", () => {
  headerCtaVisibility();
  duplexScrollable();
  footerLogoLight();
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
