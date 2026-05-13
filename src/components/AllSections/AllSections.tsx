"use client"

import React, { ComponentType, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../HeroSection/HeroSection';
import styles from './AllSections.module.css';

// Mantemos o dynamic import se você quiser reduzir o bundle inicial, 
// mas eles carregarão imediatamente agora.
const AboutSection = dynamic(() => import('../AboutSection/AboutSection'), { ssr: false });
const Credibility = dynamic(() => import('../Credibility/Credibility'), { ssr: false });
const ServicesSections = dynamic(() => import('../ServicesSection/ServicesSection'), { ssr: false });
const SquadSection = dynamic(() => import('../SquadSection/SquadSection'), { ssr: false });
const ContactSection = dynamic(() => import('../ContactSection/ContactSection'), { ssr: false });
const SubscriptionCTA = dynamic(() => import('../ProductsSection/SubscriptionCTA'), { ssr: false });
const FooterSection = dynamic(() => import('../FooterSection/FooterSection'), { ssr: false });

type LazySectionProps = {
  anchorId?: string;
  minHeight: string;
  component: ComponentType;
  desktopPreloadMargin?: string;
  preserveScrollEffects?: boolean;
};

function LazySection({
  anchorId,
  minHeight,
  component: Component,
  desktopPreloadMargin = '0px 0px -12% 0px',
  preserveScrollEffects = false,
}: LazySectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(
    () => typeof window !== 'undefined' && !!anchorId && window.location.hash === `#${anchorId}`
  );

  useEffect(() => {
    if (shouldRender) return;

    const hashMatches = () => anchorId && window.location.hash === `#${anchorId}`;

    if (hashMatches() || !('IntersectionObserver' in window)) {
      queueMicrotask(() => setShouldRender(true));
      return;
    }

    const preloadMargin = window.matchMedia('(max-width: 768px)').matches ? '320px 0px' : desktopPreloadMargin;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: preloadMargin }
    );

    const handleHashChange = () => {
      if (!hashMatches()) return;
      setShouldRender(true);
      observer.disconnect();
    };

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [anchorId, desktopPreloadMargin, shouldRender]);

  return (
    <div
      ref={wrapperRef}
      id={shouldRender ? undefined : anchorId}
      className={`${styles.lazySection} ${preserveScrollEffects ? styles.preserveScrollEffects : ''}`}
      style={{ minHeight, containIntrinsicSize: minHeight }}
    >
      {shouldRender ? <Component /> : null}
    </div>
  );
}

const AllSections = () => {
  
  // Inicializa o scroll suave fora do caminho crítico.
  useEffect(() => {
    let cleanupLenis: (() => void) | undefined;
    let cancelled = false;

    const setupLenis = async () => {
      if (
        cancelled ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.matchMedia('(pointer: coarse)').matches
      ) {
        return;
      }

      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      lenis.on('scroll', ScrollTrigger.update);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      cleanupLenis = () => {
        lenis.destroy();
        gsap.ticker.remove(raf);
      };
    };

    const startLenis = () => {
      window.removeEventListener('wheel', startLenis);
      window.removeEventListener('keydown', startLenis);
      window.removeEventListener('touchstart', startLenis);
      setupLenis();
    };

    window.addEventListener('wheel', startLenis, { passive: true, once: true });
    window.addEventListener('keydown', startLenis, { once: true });
    window.addEventListener('touchstart', startLenis, { passive: true, once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('wheel', startLenis);
      window.removeEventListener('keydown', startLenis);
      window.removeEventListener('touchstart', startLenis);
      cleanupLenis?.();
    };
  }, []);

  return (
    <div className={styles.sectionsShell}>
      {/* Background persistente */}
      <div className={styles.ambientBackground} aria-hidden="true">
        <span className={`${styles.meshBlob} ${styles.meshBlobOne}`} />
        <span className={`${styles.meshBlob} ${styles.meshBlobTwo}`} />
        <span className={`${styles.meshBlob} ${styles.meshBlobThree}`} />
        <span className={styles.ambientGrid} />
      </div>
      <div className={styles.noiseLayer} aria-hidden="true" />

      <div className={styles.sectionsContent}>
        <HeroSection />
        <LazySection anchorId="sobre" minHeight="820px" component={AboutSection} />
        <LazySection anchorId="credibilidade" minHeight="760px" component={Credibility} />
        <LazySection
          anchorId="servicos"
          minHeight="1200px"
          component={ServicesSections}
          desktopPreloadMargin="1200px 0px"
          preserveScrollEffects
        />
        <LazySection anchorId="time" minHeight="980px" component={SquadSection} />
        <LazySection anchorId="contato" minHeight="900px" component={ContactSection} />
        <LazySection minHeight="720px" component={SubscriptionCTA} />
      </div>
      
      <LazySection minHeight="220px" component={FooterSection} />
    </div>
  );
};

export default AllSections;
