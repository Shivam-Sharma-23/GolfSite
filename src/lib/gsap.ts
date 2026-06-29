import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";

/**
 * Register all plugins ONCE, at module evaluation time.
 * (gsap-skills / gsap-plugins: register once, safe to import repeatedly.)
 * SplitText & MotionPathPlugin are free as of GSAP 3.13+, shipped in the
 * public `gsap` npm package and bundled into the single-file build.
 */
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, SplitText);

export { gsap, ScrollTrigger, MotionPathPlugin, SplitText };
