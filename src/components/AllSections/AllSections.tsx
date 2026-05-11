"use client"

import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '../HeroSection/HeroSection';
import styles from './AllSections.module.css';

const AboutSection = dynamic(() => import('../AboutSection/AboutSection'), { ssr: false });
const Credibility = dynamic(() => import('../Credibility/Credibility'), { ssr: false });
const ServicesSections = dynamic(() => import('../ServicesSection/ServicesSection'), { ssr: false });
const SquadSection = dynamic(() => import('../SquadSection/SquadSection'), { ssr: false });
const ContactSection = dynamic(() => import('../ContactSection/ContactSection'), { ssr: false });
const SubscriptionCTA = dynamic(() => import('../ProductsSection/SubscriptionCTA'), { ssr: false });
const FooterSection = dynamic(() => import('../FooterSection/FooterSection'), { ssr: false });

const AllSections = () => {
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const [pendingHash, setPendingHash] = useState<string | null>(null);

  const loadDeferredSections = useCallback(() => {
    setShowDeferredSections(true);
  }, []);

  const scrollToTarget = (hash: string) => {
    const target = document.querySelector(hash) as HTMLElement | null;
    if (!target) return;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!pendingHash || !showDeferredSections) return;

    const frame = window.requestAnimationFrame(() => {
      scrollToTarget(pendingHash);
      setPendingHash(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pendingHash, showDeferredSections]);

  useEffect(() => {
    const events: Array<keyof WindowEventMap> = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

    events.forEach((eventName) => {
      window.addEventListener(eventName, loadDeferredSections, { once: true, passive: true });
    });
    window.addEventListener('load-deferred-sections', loadDeferredSections);

    const revealFromAnchor = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const hash = link?.hash;

      if (!hash || hash === '#inicio') {
        return;
      }

      event.preventDefault();
      setPendingHash(hash);
      loadDeferredSections();
    };

    document.addEventListener('click', revealFromAnchor, { capture: true });

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, loadDeferredSections));
      window.removeEventListener('load-deferred-sections', loadDeferredSections);
      document.removeEventListener('click', revealFromAnchor);
    };
  }, [loadDeferredSections]);

  useLayoutEffect(() => {
    if (!showDeferredSections) return;

    let cleanupLenis: (() => void) | undefined;
    const setupLenis = async () => {
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

    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(() => void setupLenis(), { timeout: 2200 })
      : window.setTimeout(() => void setupLenis(), 1200);

    return () => {
      cleanupLenis?.();
      if (typeof idleId === "number") {
        window.clearTimeout(idleId);
      } else {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [showDeferredSections]);

  return (
    <div className={styles.sectionsShell}>
      <div className={styles.ambientBackground} aria-hidden="true">
        <span className={`${styles.meshBlob} ${styles.meshBlobOne}`} />
        <span className={`${styles.meshBlob} ${styles.meshBlobTwo}`} />
        <span className={`${styles.meshBlob} ${styles.meshBlobThree}`} />
        <span className={styles.ambientGrid} />
      </div>
      <div className={styles.noiseLayer} aria-hidden="true" />

      <div className={styles.sectionsContent}>
        <HeroSection />
        {showDeferredSections ? (
          <>
            <AboutSection />
            <Credibility />
            <ServicesSections />
            <SquadSection />
            <ContactSection />
            <SubscriptionCTA />
          </>
        ) : null}
      </div>
      {showDeferredSections ? <FooterSection /> : null}
    </div>
  );
};

export default AllSections;
