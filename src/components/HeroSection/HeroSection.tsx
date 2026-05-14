'use client';

import React, { useEffect, useRef } from 'react';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import styles from './HeroSection.module.css';

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

const HERO_BACKGROUND_VIDEO_URL =
  'https://res.cloudinary.com/ddwu6s64v/video/upload/v1778268738/hero_1_nhg9yh.mp4';
const HERO_BACKGROUND_POSTER_URL =
  'https://res.cloudinary.com/ddwu6s64v/video/upload/f_jpg,q_auto:eco,w_900,so_1/v1778268738/hero_1_nhg9yh.jpg';

const supportingText =
  'Grupo Fellow é a empresa mãe por trás do Fellow Pay, Fellow Core, Fellow Tickets e Fellow AI. Cada marca tem seu próprio produto, seu próprio time e seu próprio mercado.';

const titleLines = [
  'Onde o DNA da tecnologia se divide em quatro expertises únicas.',
  'O melhor de cada mundo, sob o mesmo teto.',
];

const bottomWords = ['PERFORMANCE', 'ESTRATÉGIA', 'PRESENÇA DIGITAL'];

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
  const gradientRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    let idleId = 0;

    const loadHeroVideo = () => {
      const video = videoRef.current;

      if (!video || !window.matchMedia('(min-width: 769px)').matches || video.dataset.loaded === 'true') {
        return;
      }

      const source = document.createElement('source');
      source.src = HERO_BACKGROUND_VIDEO_URL;
      source.type = 'video/mp4';
      source.media = '(min-width: 769px)';
      video.appendChild(source);
      video.dataset.loaded = 'true';
      video.load();
      void video.play().catch(() => { });
    };

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadHeroVideo, { timeout: 1800 });
    } else {
      loadTimer = setTimeout(loadHeroVideo, 900);
    }

    if (!window.matchMedia('(pointer: fine)').matches) {
      return () => {
        if (idleId) window.cancelIdleCallback(idleId);
        if (loadTimer) clearTimeout(loadTimer);
      };
    }

    let frame = 0;

    function onMouseMove(e: MouseEvent) {
      if (frame || !gradientRef.current) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        if (gradientRef.current) {
          gradientRef.current.style.left = `${e.clientX - 192}px`;
          gradientRef.current.style.top = `${e.clientY - 192}px`;
          gradientRef.current.style.opacity = '1';
        }
        frame = 0;
      });
    }

    function onMouseLeave() {
      if (gradientRef.current) {
        gradientRef.current.style.opacity = '0';
      }
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (frame) window.cancelAnimationFrame(frame);
      if (idleId) window.cancelIdleCallback(idleId);
      if (loadTimer) clearTimeout(loadTimer);
    };
  }, []);

  return (
    <div className={styles.mainWrapper}>
      <section className={styles.heroContainer} id="inicio">
        <div className={styles.heroViewport}>
          <div
            className={styles.videoBackground}
            aria-hidden="true"
            style={{ '--hero-mobile-poster': `url(${HERO_BACKGROUND_POSTER_URL})` } as React.CSSProperties}
          >
            <video
              ref={videoRef}
              className={styles.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster={HERO_BACKGROUND_POSTER_URL}
            />
            <div className={styles.videoScrim} />
          </div>

          <div className={styles.heroIntroGlow} />

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

          <div className={styles.content}>
            <div className={`${styles.copy} ${styles.revealBlock}`}>
              <p className={`${styles.kicker} ${bodyFont.className}`}>
                <span>Grupo Fellow</span>
              </p>

              <h1 className={`${styles.title} ${headingFont.className}`} style={{ color: colors.light }}>
                {titleLines.map((line) => (
                  <span className={styles.titleLine} key={line}>
                    {line}
                  </span>
                ))}
              </h1>

              <p className={`${styles.supportingText} ${bodyFont.className}`}>{supportingText}</p>
              {/* <div className={`${styles.actions} ${bodyFont.className}`}>
                <a className={styles.primaryButton} href="#sobre">
                  Conhecer
                </a>
              </div> */}

            </div>

            <div className={`${styles.bottomLabel} ${bodyFont.className}`}>
              {bottomWords.map((item, index) => (
                <React.Fragment key={item}>
                  <span>{item}</span>
                  {index < bottomWords.length - 1 ? <span className={styles.separator}>•</span> : null}
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
      </section>
    </div>
  );
}
