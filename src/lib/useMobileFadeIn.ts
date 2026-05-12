import { RefObject, useEffect } from 'react';

export function useMobileFadeIn(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-mobile-fade]'));

    if (!isMobile || reduceMotion || items.length === 0) {
      items.forEach((item) => {
        item.dataset.mobileVisible = 'true';
      });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => {
        item.dataset.mobileVisible = 'true';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.mobileVisible = 'true';
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 80, 240)}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [rootRef]);
}
