// export default function footerLogoLight() {
//   const SVG_NS = "http://www.w3.org/2000/svg";
//   const trigger = document.querySelector("[data-footer-light]");
//   if (!trigger) return;

//   const svg = trigger.querySelector("svg");
//   if (!svg) return;

//   // ensure <defs> exists
//   let defs = svg.querySelector("defs");
//   if (!defs) {
//     defs = document.createElementNS(SVG_NS, "defs");
//     svg.appendChild(defs);
//   }

//   // create or reuse the radial gradient
//   if (!svg.querySelector("#cursorHighlight")) {
//     const gradient = document.createElementNS(SVG_NS, "radialGradient");
//     gradient.setAttribute("id", "cursorHighlight");
//     gradient.setAttribute("fx", "50%");
//     gradient.setAttribute("fy", "50%");
//     gradient.setAttribute("r", "0.5");
//     gradient.innerHTML = `
//       <stop offset="0%"  stop-color="#0a3c80" stop-opacity="1" />
//       <stop offset="40%" stop-color="#0a3c80" stop-opacity="0.75" />
//       <stop offset="100%" stop-color="#0a3c80" stop-opacity="0" />
//     `;
//     defs.appendChild(gradient);
//   }

//   // create or reuse a mask that is simply the logo path (white = visible)
//   if (!svg.querySelector("#logoMask")) {
//     const mask = document.createElementNS(SVG_NS, "mask");
//     mask.setAttribute("id", "logoMask");

//     const logoPath = svg.querySelector("path");
//     if (logoPath) {
//       const clone = logoPath.cloneNode(true);
//       clone.setAttribute("fill", "white"); // mask expects white for visible
//       mask.appendChild(clone);
//     }
//     defs.appendChild(mask);
//   }

//   // compute a reasonable base radius (responsive to viewBox if present)
//   const vb = svg.viewBox && svg.viewBox.baseVal;
//   const baseR =
//     vb && vb.width && vb.height
//       ? Math.max(vb.width, vb.height) * 0.18
//       : Math.max(svg.clientWidth || 300, svg.clientHeight || 150) * 0.18;

//   // create/reuse the visible highlight circle (this is what we move)
//   let highlight = svg.querySelector(".c-logo-light-cursor");
//   if (!highlight) {
//     highlight = document.createElementNS(SVG_NS, "circle");
//     highlight.classList.add("c-logo-light-cursor");
//     highlight.setAttribute("r", String(baseR));
//     highlight.setAttribute("cx", "0");
//     highlight.setAttribute("cy", "0");
//     highlight.setAttribute("fill", "url(#cursorHighlight)");
//     highlight.setAttribute("mask", "url(#logoMask)");
//     highlight.style.opacity = "0";
//     highlight.style.transition = "opacity 0.25s linear";
//     svg.appendChild(highlight);
//   } else {
//     // update r if the element already exists (in case viewBox/size changed)
//     highlight.setAttribute("r", String(baseR));
//   }

//   // helpers to convert client coords -> SVG coordinates (handles scaling)
//   function clientToSvg(clientX, clientY) {
//     const pt = svg.createSVGPoint();
//     pt.x = clientX;
//     pt.y = clientY;
//     const ctm = svg.getScreenCTM();
//     if (!ctm) return { x: clientX, y: clientY };
//     const inv = ctm.inverse();
//     const svgP = pt.matrixTransform(inv);
//     return { x: svgP.x, y: svgP.y };
//   }

//   // motion state
//   let targetX = 0,
//     targetY = 0;
//   let currentX = 0,
//     currentY = 0;
//   let prevX = 0,
//     prevY = 0;
//   let rafId = null;

//   function updateTargetPointer(e) {
//     const p = clientToSvg(e.clientX, e.clientY);
//     targetX = p.x;
//     targetY = p.y;
//   }

//   function animate() {
//     // easing factor (lower = more lag). Tweak this to taste.
//     const ease = 0.12;
//     currentX += (targetX - currentX) * ease;
//     currentY += (targetY - currentY) * ease;

//     // set position
//     highlight.setAttribute("cx", String(currentX));
//     highlight.setAttribute("cy", String(currentY));

//     // simple inertia "breath": radius increases slightly with speed
//     const vx = currentX - prevX;
//     const vy = currentY - prevY;
//     const speed = Math.sqrt(vx * vx + vy * vy);
//     const scale = 1 + Math.min(speed / 120, 0.28); // tweak divisor and max for feel
//     highlight.setAttribute("r", String(baseR * scale));

//     prevX = currentX;
//     prevY = currentY;

//     rafId = requestAnimationFrame(animate);
//   }

//   // pointer handlers: we use pointer events for better device compatibility
//   function onPointerEnter(e) {
//     // initialize positions to current pointer so it won't snap from (0,0)
//     const p = clientToSvg(e.clientX, e.clientY);
//     targetX = currentX = prevX = p.x;
//     targetY = currentY = prevY = p.y;

//     highlight.style.opacity = "1";
//     trigger.addEventListener("pointermove", updateTargetPointer);
//     if (!rafId) animate();
//   }

//   function onPointerLeave() {
//     highlight.style.opacity = "0";
//     trigger.removeEventListener("pointermove", updateTargetPointer);
//     if (rafId) {
//       cancelAnimationFrame(rafId);
//       rafId = null;
//     }
//     // restore base radius
//     highlight.setAttribute("r", String(baseR));
//   }

//   trigger.addEventListener("pointerenter", onPointerEnter);
//   trigger.addEventListener("pointerleave", onPointerLeave);
// }

export default function footerLogoLight() {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const trigger = document.querySelector("[data-footer-light]");
  if (!trigger) return;

  const svg = trigger.querySelector("svg");
  if (!svg) return;

  // ensure <defs> exists
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(defs);
  }

  // create or reuse the radial gradient
  if (!svg.querySelector("#cursorHighlight")) {
    const gradient = document.createElementNS(SVG_NS, "radialGradient");
    gradient.setAttribute("id", "cursorHighlight");
    gradient.setAttribute("fx", "50%");
    gradient.setAttribute("fy", "50%");
    gradient.setAttribute("r", "0.5");
    gradient.innerHTML = `
      <stop offset="0%"  stop-color="#0a3c80" stop-opacity="1" />
      <stop offset="40%" stop-color="#0a3c80" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#0a3c80" stop-opacity="0" />
    `;
    defs.appendChild(gradient);
  }

  // create or reuse a mask that is simply the logo path (white = visible)
  if (!svg.querySelector("#logoMask")) {
    const mask = document.createElementNS(SVG_NS, "mask");
    mask.setAttribute("id", "logoMask");

    const logoPath = svg.querySelector("path");
    if (logoPath) {
      const clone = logoPath.cloneNode(true);
      clone.setAttribute("fill", "white");
      mask.appendChild(clone);
    }
    defs.appendChild(mask);
  }

  // compute base radius
  const vb = svg.viewBox && svg.viewBox.baseVal;
  const baseR =
    vb && vb.width && vb.height
      ? Math.max(vb.width, vb.height) * 0.18
      : Math.max(svg.clientWidth || 300, svg.clientHeight || 150) * 0.18;

  // create/reuse the highlight circle
  let highlight = svg.querySelector(".c-logo-light-cursor");
  if (!highlight) {
    highlight = document.createElementNS(SVG_NS, "circle");
    highlight.classList.add("c-logo-light-cursor");
    highlight.setAttribute("r", String(baseR));
    highlight.setAttribute("cx", "0");
    highlight.setAttribute("cy", "0");
    highlight.setAttribute("fill", "url(#cursorHighlight)");
    highlight.setAttribute("mask", "url(#logoMask)");
    highlight.style.opacity = "0";
    highlight.style.transition = "opacity 0.25s linear";
    svg.appendChild(highlight);
  } else {
    highlight.setAttribute("r", String(baseR));
  }

  // client coords → SVG coords
  function clientToSvg(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: clientX, y: clientY };
    const inv = ctm.inverse();
    const svgP = pt.matrixTransform(inv);
    return { x: svgP.x, y: svgP.y };
  }

  // motion state
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;
  let prevX = 0,
    prevY = 0;
  let rafId = null;

  function updateTargetPointer(e) {
    const p = clientToSvg(e.clientX, e.clientY);
    targetX = p.x;
    targetY = p.y;
  }

  function animate() {
    const ease = 0.03; // smaller = smoother trail
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;

    highlight.setAttribute("cx", String(currentX));
    highlight.setAttribute("cy", String(currentY));

    // gentle breathing effect based on movement speed
    const vx = currentX - prevX;
    const vy = currentY - prevY;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const scale = 1 + Math.min(speed / 150, 0.2);
    highlight.setAttribute("r", String(baseR * scale));

    prevX = currentX;
    prevY = currentY;

    rafId = requestAnimationFrame(animate);
  }

  function onPointerEnter(e) {
    const p = clientToSvg(e.clientX, e.clientY);
    targetX = currentX = prevX = p.x;
    targetY = currentY = prevY = p.y;

    highlight.style.opacity = "1";
    trigger.addEventListener("pointermove", updateTargetPointer);
    if (!rafId) animate();
  }

  function onPointerLeave() {
    highlight.style.opacity = "0";
    trigger.removeEventListener("pointermove", updateTargetPointer);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    highlight.setAttribute("r", String(baseR));
  }

  trigger.addEventListener("pointerenter", onPointerEnter);
  trigger.addEventListener("pointerleave", onPointerLeave);
}
