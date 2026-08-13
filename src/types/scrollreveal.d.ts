declare module "scrollreveal" {
  interface ScrollRevealOptions {
    origin?: "top" | "right" | "bottom" | "left";
    distance?: string;
    duration?: number;
    delay?: number;
    interval?: number;
    opacity?: number;
    scale?: number;
    easing?: string;
    reset?: boolean;
    mobile?: boolean;
    viewFactor?: number;
    cleanup?: boolean;
  }

  interface ScrollRevealInstance {
    reveal(
      target: string | Element | NodeListOf<Element>,
      options?: ScrollRevealOptions,
    ): ScrollRevealInstance;
    sync(): void;
    destroy(): void;
  }

  export default function ScrollReveal(options?: ScrollRevealOptions): ScrollRevealInstance;
}
