const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REDUCED_MOTION_DELAY_MS = 200;
const DEFAULT_DURATION_MS = 1500;

/**
 * prefersReducedMotion reports whether the user prefers reduced motion.
 * @param {typeof globalThis.matchMedia} [media]
 * @returns {boolean}
 */
export function prefersReducedMotion(media = globalThis.matchMedia) {
  return media(REDUCED_MOTION_QUERY).matches;
}

/**
 * playSealMotion runs the seal animation on an element.
 * @param {{ classList: { add: (c: string) => void, remove: (c: string) => void }, addEventListener: Function, removeEventListener?: Function }} element
 * @param {{ durationMs?: number, reducedMotion?: boolean }} [opts]
 * @returns {Promise<void>}
 */
export function playSealMotion(element, opts = {}) {
  const { durationMs = DEFAULT_DURATION_MS, reducedMotion } = opts;
  const useReduced = reducedMotion ?? prefersReducedMotion();

  if (useReduced) {
    element.classList.add("is-sealed");
    return new Promise((resolve) => {
      setTimeout(resolve, REDUCED_MOTION_DELAY_MS);
    });
  }

  element.classList.add("is-sealing");

  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      element.removeEventListener?.("animationend", onAnimationEnd);
      element.classList.add("is-sealed");
      element.classList.remove("is-sealing");
      resolve();
    };

    const onAnimationEnd = () => finish();

    element.addEventListener("animationend", onAnimationEnd);
    setTimeout(finish, durationMs);
  });
}
