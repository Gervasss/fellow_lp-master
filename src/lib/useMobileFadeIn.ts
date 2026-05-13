import { RefObject, useEffect } from 'react';

const fadeVariants = [
  { x: '0px', y: '24px' },
  { x: '-24px', y: '12px' },
  { x: '24px', y: '12px' },
  { x: '0px', y: '34px' },
];

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

    const revealItem = (item: HTMLElement) => {
      item.dataset.mobileVisible = 'true';
    };

    const revealBatch = (batchItems: HTMLElement[], batchSize: number) => {
      batchItems.forEach((item, index) => {
        const chunkIndex = Math.floor(index / batchSize);
        const indexInChunk = index % batchSize;

        window.setTimeout(() => {
          item.style.transitionDelay = `${indexInChunk * 140}ms`;
          revealItem(item);
        }, chunkIndex * 560);
      });
    };

    const batchedItems = new Map<string, HTMLElement[]>();

    items.forEach((item, index) => {
      const variant = fadeVariants[index % fadeVariants.length];
      item.style.setProperty('--mobile-fade-x', variant.x);
      item.style.setProperty('--mobile-fade-y', variant.y);

      if (!item.dataset.mobileBatch) return;

      const group = batchedItems.get(item.dataset.mobileBatch) ?? [];
      group.push(item);
      batchedItems.set(item.dataset.mobileBatch, group);
    });

    const revealedBatches = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const item = entry.target as HTMLElement;
          const batchName = item.dataset.mobileBatch;

          if (batchName) {
            if (!revealedBatches.has(batchName)) {
              revealedBatches.add(batchName);
              const batchItems = batchedItems.get(batchName) ?? [item];
              const batchSize = Number(item.dataset.mobileBatchSize ?? 3);
              revealBatch(batchItems, Number.isFinite(batchSize) ? Math.max(batchSize, 1) : 3);
            }

            batchedItems.get(batchName)?.forEach((batchItem) => observer.unobserve(batchItem));
            return;
          }

          revealItem(item);
          observer.unobserve(item);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 110, 360)}ms`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [rootRef]);
}
