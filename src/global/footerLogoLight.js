export default function footerLogoLight() {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const trigger = document.querySelector("[data-footer-light]");
  if (!trigger) return;

  const svg = trigger.querySelector("svg");
  if (!svg) return;

  // Cache DOM elements and calculations
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(defs);
  }

  // Create gradient (only once)
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

  // Create mask (only once)
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

  // Pre-calculate base radius
  const vb = svg.viewBox && svg.viewBox.baseVal;
  const baseR =
    vb && vb.width && vb.height
      ? Math.max(vb.width, vb.height) * 0.18
      : Math.max(svg.clientWidth || 300, svg.clientHeight || 150) * 0.18;

  // Create/cache highlight element
  let highlight = svg.querySelector(".c-logo-light-cursor");
  if (!highlight) {
    highlight = document.createElementNS(SVG_NS, "circle");
    highlight.classList.add("c-logo-light-cursor");
    highlight.setAttribute("r", baseR);
    highlight.setAttribute("cx", "0");
    highlight.setAttribute("cy", "0");
    highlight.setAttribute("fill", "url(#cursorHighlight)");
    highlight.setAttribute("mask", "url(#logoMask)");
    highlight.style.opacity = "0";
    highlight.style.transition = "opacity 0.25s linear";
    svg.appendChild(highlight);
  } else {
    highlight.setAttribute("r", baseR);
  }

  // Cache CTM for coordinate transformation
  let cachedCTM = null;
  let cachedInverse = null;

  function updateCTMCache() {
    cachedCTM = svg.getScreenCTM();
    cachedInverse = cachedCTM ? cachedCTM.inverse() : null;
  }

  // Optimized coordinate transformation
  function clientToSvg(clientX, clientY) {
    if (!cachedInverse) {
      updateCTMCache();
      if (!cachedInverse) return { x: clientX, y: clientY };
    }

    // Reuse point object to avoid allocation
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(cachedInverse);
    return { x: svgP.x, y: svgP.y };
  }

  // Motion state
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;
  let prevX = 0,
    prevY = 0;
  let rafId = null;
  let isAnimating = false;

  // Throttling for pointer move events
  let lastMoveTime = 0;
  const MOVE_THROTTLE = 16; // ~60fps

  // Animation with motion detection
  function animate() {
    const ease = 0.03;
    const dx = targetX - currentX;
    const dy = targetY - currentY;

    // Check if we need to keep animating
    const distance = Math.sqrt(dx * dx + dy * dy);
    const threshold = 0.1;

    if (
      distance < threshold &&
      Math.abs(currentX - prevX) < 0.01 &&
      Math.abs(currentY - prevY) < 0.01
    ) {
      // Stop animating when close enough and not moving
      isAnimating = false;
      rafId = null;
      return;
    }

    currentX += dx * ease;
    currentY += dy * ease;

    // Batch DOM updates
    const vx = currentX - prevX;
    const vy = currentY - prevY;
    const speed = Math.sqrt(vx * vx + vy * vy);
    const scale = 1 + Math.min(speed / 150, 0.2);
    const newR = baseR * scale;

    // Update position and radius together
    highlight.setAttribute("cx", currentX);
    highlight.setAttribute("cy", currentY);
    highlight.setAttribute("r", newR);

    prevX = currentX;
    prevY = currentY;

    rafId = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  }

  function updateTargetPointer(e) {
    const now = performance.now();
    if (now - lastMoveTime < MOVE_THROTTLE) return;
    lastMoveTime = now;

    const p = clientToSvg(e.clientX, e.clientY);
    targetX = p.x;
    targetY = p.y;

    startAnimation();
  }

  function onPointerEnter(e) {
    const p = clientToSvg(e.clientX, e.clientY);
    targetX = currentX = prevX = p.x;
    targetY = currentY = prevY = p.y;

    highlight.style.opacity = "1";
    trigger.addEventListener("pointermove", updateTargetPointer, {
      passive: true,
    });
    startAnimation();
  }

  function onPointerLeave() {
    highlight.style.opacity = "0";
    trigger.removeEventListener("pointermove", updateTargetPointer);

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      isAnimating = false;
    }

    highlight.setAttribute("r", baseR);
  }

  // Use passive listeners for better performance
  trigger.addEventListener("pointerenter", onPointerEnter, { passive: true });
  trigger.addEventListener("pointerleave", onPointerLeave, { passive: true });
}
