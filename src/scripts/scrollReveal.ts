import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initScrollReveal() {
  gsap.registerPlugin(ScrollTrigger);

  // Default reveal: fade up
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  revealElements.forEach((el) => {
    const element = el as HTMLElement;
    const type = element.dataset.revealType || 'fade-up';
    const delay = parseFloat(element.dataset.revealDelay || '0');
    const duration = parseFloat(element.dataset.revealDuration || '1');
    const stagger = parseFloat(element.dataset.revealStagger || '0');
    
    const fromVars = getFromVars(type);
    
    if (stagger > 0) {
      const children = Array.from(element.children);
      if (children.length > 0) {
        // Ensure the container itself is visible so children can be seen
        gsap.set(element, { visibility: 'visible', opacity: 1 });
        
        gsap.fromTo(children, fromVars, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          visibility: 'visible',
          duration: duration,
          delay: delay,
          stagger: stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none none",
          }
        });
        return;
      }
    }

    gsap.fromTo(element, fromVars, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      visibility: 'visible',
      duration: duration,
      delay: delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });
  });
}

function getFromVars(type: string): gsap.TweenVars {
  switch (type) {
    case 'fade-up':
      return { opacity: 0, y: 40, visibility: 'hidden' };
    case 'fade-down':
      return { opacity: 0, y: -40, visibility: 'hidden' };
    case 'fade-left':
      return { opacity: 0, x: 40, visibility: 'hidden' };
    case 'fade-right':
      return { opacity: 0, x: -40, visibility: 'hidden' };
    case 'scale-in':
      return { opacity: 0, scale: 0.9, visibility: 'hidden' };
    default:
      return { opacity: 0, y: 40, visibility: 'hidden' };
  }
}
