const revealTargets = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealAll = () => {
  revealTargets.forEach((target, index) => {
    const delay = prefersReducedMotion ? 0 : Math.min(index * 45, 260);

    window.setTimeout(() => {
      target.classList.add("is-visible");
    }, delay);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", revealAll, { once: true });
} else {
  revealAll();
}
