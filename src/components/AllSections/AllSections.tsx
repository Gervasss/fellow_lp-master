"use client"

import React, { useEffect, useRef, useState } from 'react';
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
  const shellRef = useRef<HTMLDivElement>(null);
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  useEffect(() => {
    if (showDeferredSections) return;

    const revealSections = () => setShowDeferredSections(true);
    const revealFromAnchor = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      const hash = link?.hash;

      if (!hash || hash === '#inicio') {
        return;
      }

      event.preventDefault();
      revealSections();

      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    };

    window.addEventListener('wheel', revealSections, { passive: true, once: true });
    window.addEventListener('touchstart', revealSections, { passive: true, once: true });
    window.addEventListener('keydown', revealSections, { once: true });
    document.addEventListener('click', revealFromAnchor, { capture: true });

    return () => {
      window.removeEventListener('wheel', revealSections);
      window.removeEventListener('touchstart', revealSections);
      window.removeEventListener('keydown', revealSections);
      document.removeEventListener('click', revealFromAnchor, { capture: true });
    };
  }, [showDeferredSections]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let frame = 0;

    const updateParallax = (event: MouseEvent) => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5).toFixed(4);
        const y = (event.clientY / window.innerHeight - 0.5).toFixed(4);

        shell.style.setProperty('--ambient-x', x);
        shell.style.setProperty('--ambient-y', y);
        frame = 0;
      });
    };

    window.addEventListener('mousemove', updateParallax, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={shellRef} className={styles.sectionsShell}>
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
      </div>
      {showDeferredSections ? <FooterSection /> : null}
    </>
  );
};

export default AllSections;
