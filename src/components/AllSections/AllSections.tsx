"use client"

import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import HeroSection from '../HeroSection/HeroSection';
import AboutSection from '../AboutSection/AboutSection';
import Credibility from '../Credibility/Credibility';
import ServicesSections from '../ServicesSection/ServicesSection';
import SquadSection from '../SquadSection/SquadSection';
import ContactSection from '../ContactSection/ContactSection';
import SubscriptionCTA from '../ProductsSection/SubscriptionCTA';
import FooterSection from '../FooterSection/FooterSection';
import styles from './AllSections.module.css';

gsap.registerPlugin(ScrollTrigger);

const AllSections = () => {
  const shellRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 3.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onTick);
    };
  }, []);

  useLayoutEffect(() => {
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
          <AboutSection />
          <Credibility />
          <ServicesSections />
          <SquadSection />
          <ContactSection />
          <SubscriptionCTA />
        </div>
      </div>
      <FooterSection />
    </>
  );
};

export default AllSections;
