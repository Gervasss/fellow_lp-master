'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import gsap from 'gsap';
import styles from './HeroSection.module.css';
import AboutSection from '../AboutSection/AboutSection';
import ServicesSections from '../ServicesSection/ServicesSection';
import SquadSection from '../SquadSection/SquadSection';
import ContactSection from '../ContactSection/ContactSection';
import SubscriptionCTA from '../ProductsSection/SubscriptionCTA';

const FellowNavbar = dynamic(
  () =>
    import('@/src/components/ui/resizable-navbar').then(
      (mod) => mod.FellowNavbar
    ),
  { ssr: false }
);

const colors = {
  light: '#f5f5f5',
  gold: '#d1d1d1',
  bronze: '#8f8f8f',
};

const headingFont = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const supportingWords = [
  'Infraestrutura',
  'digital',
  'para',
  'centralizar,',
  'simplificar',
  'e',
  'escalar',
  'operações',
  'com',
  'alta',
  'disponibilidade',
  'e',
  'segurança.',
];

const titleWords = [
  'Tecnologia',
  'para',
  'operações',
  'que',
  'exigem',
  'escala.',
];

const bottomWords = [
  { label: 'PERFORMANCE', delay: 3050 },
  { label: 'ESTRATÉGIA', delay: 3200 },
  { label: 'PRESENÇA DIGITAL', delay: 3350 },
];

const floatingElements = [
  { top: '24%', left: '14%', delay: '0.4s', duration: '7s' },
  { top: '62%', left: '86%', delay: '1.1s', duration: '8.5s' },
  { top: '42%', left: '10%', delay: '1.8s', duration: '6.8s' },
  { top: '76%', left: '90%', delay: '2.4s', duration: '8.2s' },
  { top: '18%', left: '72%', delay: '0.9s', duration: '7.4s' },
  { top: '30%', left: '22%', delay: '1.4s', duration: '7.8s' },
  { top: '56%', left: '18%', delay: '2.1s', duration: '6.6s' },
  { top: '68%', left: '74%', delay: '2.8s', duration: '8.7s' },
  { top: '14%', left: '58%', delay: '1.7s', duration: '7.1s' },
  { top: '82%', left: '28%', delay: '3.1s', duration: '8s' },
  { top: '36%', left: '88%', delay: '2.2s', duration: '7.6s' },
  { top: '48%', left: '64%', delay: '1.2s', duration: '6.9s' },
];

export default function MinimalHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const heroGlowRef = useRef<HTMLDivElement>(null);
  const heroRevealRef = useRef<HTMLDivElement>(null);
  const sectionSmokeRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const [isSectionTransitionActive, setIsSectionTransitionActive] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      const revealBlocks = gsap.utils.toArray<HTMLElement>(`.${styles.revealBlock}`);
      const words = gsap.utils.toArray<HTMLElement>(`.${styles.word}`);
      const heroChildren = gsap.utils.toArray<HTMLElement>(
        `.${styles.heroViewport} > *:not(.${styles.heroIntroGlow})`
      );

      gsap.set(heroStageRef.current, {
        scale: 0.9,
        yPercent: 4,
        filter: 'blur(16px)',
        opacity: 0,
        transformOrigin: '50% 58%',
      });

      gsap.set(heroGlowRef.current, {
        scale: 0.65,
        opacity: 0,
        transformOrigin: '50% 50%',
      });

      gsap.set(`.${styles.loaderSmoke}`, {
        xPercent: -8,
        yPercent: 3,
        rotate: -6,
      });

      gsap.set(`.${styles.loaderSmokeFront}`, {
        xPercent: -16,
        yPercent: 10,
        rotate: -8,
        scale: 0.78,
      });

      gsap.set(`.${styles.loaderSmokeBack}`, {
        xPercent: 12,
        yPercent: -6,
        rotate: 6,
        scale: 0.9,
      });

      gsap.set(heroRevealRef.current, {
        clipPath: 'circle(8% at 50% 50%)',
        WebkitClipPath: 'circle(8% at 50% 50%)',
      });

      gsap.set(sectionSmokeRef.current, {
        opacity: 0,
        scale: 0.8,
      });

      gsap.set(heroChildren, { opacity: 0 });

      tl.to(`.${styles.loaderLogo}`, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
        .to(
          `.${styles.loaderPulse}`,
          {
            opacity: 0.85,
            scale: 1.08,
            duration: 0.9,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          `.${styles.loaderName}`,
          {
            opacity: 1,
            y: 0,
            letterSpacing: '0.38em',
            duration: 0.85,
            ease: 'power4.out',
          },
          '-=0.48'
        )
        .to(
          `.${styles.loaderOrbit}`,
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.95,
            ease: 'power2.out',
          },
          '-=0.55'
        )
        .to(
          `.${styles.loaderSmoke}`,
          {
            opacity: 1,
            scale: 1.08,
            xPercent: 8,
            yPercent: -4,
            rotate: 5,
            duration: 1.1,
            ease: 'sine.inOut',
          },
          '-=0.45'
        )
        .to(
          `.${styles.loaderSmokeFront}`,
          {
            opacity: 0.72,
            xPercent: 10,
            yPercent: -2,
            rotate: 4,
            scale: 1.08,
            duration: 1.35,
            ease: 'sine.inOut',
          },
          '-=0.95'
        )
        .to(
          `.${styles.loaderSmokeBack}`,
          {
            opacity: 0.5,
            xPercent: -4,
            yPercent: -10,
            rotate: -2,
            scale: 1.18,
            duration: 1.55,
            ease: 'sine.inOut',
          },
          '<'
        )
        .to(
          `.${styles.loaderPulse}`,
          {
            scale: 1.42,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          '-=0.5'
        )
        .to(
          [
            `.${styles.loaderLogo}`,
            `.${styles.loaderName1}`,
            `.${styles.loaderName}`,
          ],
          {
            opacity: 0.18,
            filter: 'blur(18px)',
            scale: 1.03,
            duration: 0.95,
            ease: 'power2.inOut',
          },
          '+=0.12'
        )
        .to(
          heroRevealRef.current,
          {
            clipPath: 'circle(150% at 50% 50%)',
            WebkitClipPath: 'circle(150% at 50% 50%)',
            duration: 1.5,
            ease: 'expo.out',
          },
          '-=0.5'
        )
        .to(
          heroStageRef.current,
          {
            opacity: 1,
            scale: 1,
            yPercent: 0,
            filter: 'blur(0px)',
            duration: 1.4,
            ease: 'expo.out',
          },
          '-=1.2'
        )
        .to(
          heroGlowRef.current,
          {
            opacity: 1,
            scale: 1.8,
            duration: 1.25,
            ease: 'expo.out',
          },
          '<'
        )
        .to(
          `.${styles.loaderSmoke}`,
          {
            opacity: 0,
            scale: 1.45,
            xPercent: 18,
            yPercent: -10,
            rotate: 10,
            duration: 1.3,
            ease: 'power2.out',
          },
          '-=1.15'
        )
        .to(
          `.${styles.loaderSmokeFront}`,
          {
            opacity: 0,
            scale: 1.55,
            xPercent: 22,
            yPercent: -16,
            rotate: 8,
            duration: 1.45,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          `.${styles.loaderSmokeBack}`,
          {
            opacity: 0,
            scale: 1.7,
            xPercent: -14,
            yPercent: -18,
            rotate: -6,
            duration: 1.65,
            ease: 'power2.out',
          },
          '<'
        )
        .to(
          heroChildren,
          {
            opacity: 1,
            stagger: 0.04,
            duration: 0.38,
            ease: 'power1.out',
          },
          '-=0.82'
        )
        .add(() => {
          setIsPreloading(false);
        }, '-=0.55')
        .to(
          loaderRef.current,
          {
            opacity: 0,
            filter: 'blur(28px)',
            duration: 1.2,
            ease: 'power2.out',
          },
          '-=1.15'
        );

      tl.add(() => {
        revealBlocks.forEach((block) => {
          const delay = parseInt(block.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            block.style.animation = `${styles.blockAppear} 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
          }, delay);
        });

        words.forEach((word) => {
          const delay = parseInt(word.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            word.style.animation = `${styles.wordAppear} 0.8s ease-out forwards`;
          }, delay);
        });
      }, '-=0.2');
    }, containerRef);

    function onMouseMove(e: MouseEvent) {
      if (gradientRef.current) {
        gradientRef.current.style.left = `${e.clientX - 192}px`;
        gradientRef.current.style.top = `${e.clientY - 192}px`;
        gradientRef.current.style.opacity = '1';
      }
    }

    function onMouseLeave() {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '0';
      }
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      ctx.revert();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!isSectionTransitionActive || !sectionSmokeRef.current) {
      return;
    }

    const aboutSection = document.querySelector<HTMLElement>('#sobre');
    const smokeLayers = sectionSmokeRef.current.querySelectorAll<HTMLElement>(`[data-smoke-layer="true"]`);
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        isTransitioningRef.current = false;
        setIsSectionTransitionActive(false);
      },
    });

    tl.set(sectionSmokeRef.current, {
      display: 'block',
      pointerEvents: 'auto',
    })
      .fromTo(
        smokeLayers,
        {
          opacity: 0,
          scale: 0.72,
          yPercent: 18,
        },
        {
          opacity: (index) => (index === 1 ? 0.95 : 0.72),
          scale: (index) => 1.18 + index * 0.08,
          xPercent: (index) => (index === 0 ? -14 : index === 1 ? 0 : 14),
          yPercent: (index) => (index === 2 ? -16 : -8),
          duration: 0.75,
          stagger: 0.04,
        }
      )
      .to(
        sectionSmokeRef.current,
        {
          opacity: 1,
          duration: 0.18,
        },
        '<'
      )
      .add(() => {
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.dispatchEvent(new CustomEvent('about:focus'));
      }, '-=0.12')
      .to(
        smokeLayers,
        {
          opacity: 0,
          scale: 1.6,
          xPercent: (index) => (index === 0 ? -28 : index === 1 ? 10 : 30),
          yPercent: -34,
          duration: 1.05,
          stagger: 0.05,
          ease: 'power2.inOut',
        },
        '+=0.12'
      )
      .to(
        sectionSmokeRef.current,
        {
          opacity: 0,
          duration: 0.45,
          pointerEvents: 'none',
        },
        '-=0.55'
      )
      .set(sectionSmokeRef.current, {
        display: 'none',
      });

    return () => {
      tl.kill();
    };
  }, [isSectionTransitionActive]);

  function handleKnowMoreClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (isTransitioningRef.current) {
      return;
    }

    isTransitioningRef.current = true;
    setIsSectionTransitionActive(true);
  }

  return (
    <div ref={containerRef} className={styles.mainWrapper}>
      <div ref={sectionSmokeRef} className={styles.sectionSmokeTransition}>
        <span className={`${styles.sectionSmokeLayer} ${styles.sectionSmokeLayerLeft}`} data-smoke-layer="true" />
        <span className={`${styles.sectionSmokeLayer} ${styles.sectionSmokeLayerCenter}`} data-smoke-layer="true" />
        <span className={`${styles.sectionSmokeLayer} ${styles.sectionSmokeLayerRight}`} data-smoke-layer="true" />
      </div>

      <div ref={loaderRef} className={styles.preloader}>
        <div className={styles.loaderBrand}>
          <span className={`${styles.loaderSmoke} ${styles.loaderSmokeBack}`} />
          <span className={styles.loaderPulse} />
          <span className={styles.loaderOrbit} />
          <span className={styles.loaderSmoke} />
          <span className={`${styles.loaderSmoke} ${styles.loaderSmokeFront}`} />
          <Image
            className={styles.loaderLogo}
            src="/assets/felloww-logo.png"
            alt="Logo Fellow"
            width={400}
            height={400}
            priority
          />
          <div className={styles.loaderWrapper}>
            <span className={`${styles.loaderName1} ${headingFont.className}`}>
              GRUPO
            </span>

            <span className={`${styles.loaderName} ${headingFont.className}`}>
              FELLOW
            </span>
          </div>
        </div>
      </div>

      <section ref={heroRevealRef} className={styles.heroContainer} id="inicio">
        <div className={styles.heroViewport}>
          <div ref={heroGlowRef} className={styles.heroIntroGlow} />
          {!isPreloading ? <FellowNavbar /> : null}

          <svg className={styles.gridLayer} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {[18, 50, 82].map((pos, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={`${pos}%`}
                x2="100%"
                y2={`${pos}%`}
                className={styles.gridLine}
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </svg>

          <div className={`${styles.cornerElement} ${styles.topLeft}`}>
            <div className={styles.cornerDot} style={{ background: colors.gold }} />
          </div>
          <div className={`${styles.cornerElement} ${styles.topRight}`}>
            <div className={styles.cornerDot} style={{ background: colors.gold }} />
          </div>
          {floatingElements.map((item, index) => (
            <div
              key={`${item.top}-${item.left}-${index}`}
              className={styles.floatingElement}
              style={{
                top: item.top,
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
              }}
            />
          ))}

          <div ref={heroStageRef} className={styles.content}>
            <div className={`${styles.copy} ${styles.revealBlock}`} data-delay="40">
              <p
                className={`${styles.kicker} ${bodyFont.className} ${styles.revealBlock}`}
                data-delay="120"
              >
                <span className={styles.word} data-delay="0">
                  Grupo{' '}
                </span>
                <span className={styles.word} data-delay="140">
                  Fellow
                </span>
              </p>

              <h1
                className={`${styles.title} ${headingFont.className} ${styles.revealBlock}`}
                data-delay="220"
                style={{ color: colors.light }}
              >
                {titleWords.map((word, index) => (
                  <span
                    key={word}
                    className={styles.word}
                    data-delay={520 + index * 120}
                  >
                    {word}{' '}
                  </span>
                ))}
              </h1>

              <p
                className={`${styles.supportingText} ${bodyFont.className} ${styles.revealBlock}`}
                data-delay="360"
              >
                {supportingWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={styles.word}
                    data-delay={1400 + index * 90}
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>

              <div
                className={`${styles.actions} ${bodyFont.className} ${styles.revealBlock}`}
                data-delay="3900"
              >
                <a className={styles.primaryButton} href="#sobre" onClick={handleKnowMoreClick}>
                  Conhecer
                </a>
              </div>
            </div>

            <div
              className={`${styles.bottomLabel} ${bodyFont.className} ${styles.revealBlock}`}
              data-delay="460"
            >
              {bottomWords.map((item, index) => (
                <React.Fragment key={item.label}>
                  <span className={styles.word} data-delay={item.delay}>
                    {item.label}
                  </span>
                  {index < bottomWords.length - 1 ? (
                    <span className={styles.separator}>•</span>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div
            ref={gradientRef}
            className={styles.mouseGradient}
            style={{
              background: `radial-gradient(circle, ${colors.bronze}22 0%, transparent 100%)`,
            }}
          />
        </div>
        <AboutSection />
        <ServicesSections />
        <SquadSection />
        <ContactSection />
        <SubscriptionCTA />
      </section>
    </div>
  );
}
