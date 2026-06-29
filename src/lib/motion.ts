/**
 * Shared motion constants.
 * Per design-motion-principles / Emil: never use bare `ease` or `ease-in-out`
 * (they lack strength). Prefer strong named eases or custom curves.
 */
export const EASE = {
  out: "power3.out", // default enter — fast start, gentle settle
  outQuart: "power4.out",
  expo: "expo.out", // premium, decisive settle for hero moments
  inOut: "power3.inOut", // state changes while visible
  soft: "sine.inOut", // gentle ambient
  none: "none", // scrubbed scroll-tied motion (linear)
};

/** UI timing (Emil lens — fast, quiet utility interactions). */
export const UI = {
  fast: 0.18,
  base: 0.25,
};

/** Scrub smoothing for scroll-tied tweens (premium, not instant). */
export const SCRUB = 0.6;

/** Standard reveal offsets (single fade + rise, Jakub). */
export const REVEAL = {
  y: 28,
  duration: 0.9,
};
