import { useEffect, useState } from "react";

/**
 * Reactive prefers-reduced-motion detection.
 * Used for conditional rendering (e.g. whether to mount a heavy scene).
 * All GSAP choreography is additionally gated via gsap.matchMedia().
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
