const revealTargets = document.querySelectorAll("[data-reveal]");
const partnerTransitions = document.querySelectorAll("[data-partner-transition]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let partnerTicking = false;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const revealAll = () => {
  revealTargets.forEach((target, index) => {
    const delay = prefersReducedMotion ? 0 : Math.min(index * 45, 260);

    window.setTimeout(() => {
      target.classList.add("is-visible");
    }, delay);
  });
};

const syncPartnerTransitions = () => {
  const isCompactLayout = prefersReducedMotion || window.innerWidth <= 760;

  partnerTransitions.forEach((stage) => {
    if (isCompactLayout) {
      stage.style.setProperty("--partners-progress", "1");
      stage.dataset.phase = "panel";
      return;
    }

    const rect = stage.getBoundingClientRect();
    const scrollSpan = Math.max(stage.offsetHeight - window.innerHeight, 1);
    const progress = clamp((-rect.top + window.innerHeight * 0.08) / scrollSpan, 0, 1);
    let phase = "strip";

    if (progress >= 0.34) {
      phase = "panel";
    } else if (progress >= 0.16) {
      phase = "switch";
    }

    stage.style.setProperty("--partners-progress", progress.toFixed(3));
    stage.dataset.phase = phase;
  });

  partnerTicking = false;
};

const queuePartnerSync = () => {
  if (partnerTicking) {
    return;
  }

  partnerTicking = true;
  window.requestAnimationFrame(syncPartnerTransitions);
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      revealAll();
      syncPartnerTransitions();
    },
    { once: true },
  );
} else {
  revealAll();
  syncPartnerTransitions();
}

window.addEventListener("scroll", queuePartnerSync, { passive: true });
window.addEventListener("resize", queuePartnerSync);
