'use client';

import React, { useEffect, useRef } from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import ProfileCard from '@/src/components/ui/ProfileCard';
import { useMobileFadeIn } from '@/src/lib/useMobileFadeIn';
import styles from './SquadSection.module.css';

const headingFont = Sora({ subsets: ['latin'], weight: ['500', '600'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const softEase = 'power3.out';

const founders = [
  {
    name: 'Thiago Reis',
    handle: 'thiago.reis@grupofellow.com.br',
    title: ' Founder, CEO & CTO',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/WbC6QL1Z/thiago.png',
  },
  {
    name: 'Jonathan Reis',
    handle: 'jonathan.reis@grupofellow.com.br',
    title: ' Co-Founder & Head of AI ',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/zGhSNtyh/jon.png',
  },
  {
    name: 'Gervásio Cardoso',
    handle: 'gervasio.cardoso@grupofellow.com.br',
    title: 'Partner & Head of Front-end',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/8P9BqQzr/ge.png',
  },
  {
    name: 'Guilherme Veiga',
    handle: 'guilherme.veiga@grupofellow.com.br',
    title: 'Co-Founder & AI Automation Engineer',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/GmDJR74s/gui.png',
  },
    {
    name: 'Gabriel Botelho',
    handle: 'gabriel.botelho@grupofellow.com.br',
    title: 'Business Development',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/KvwrdS8L/gb.png',
  },
   {
    name: 'Samuel Medeiros',
    handle: 'samuel.medeiros@grupofellow.com.br',
    title: 'Business Development',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/yYtXw48s/medeiros.png',
  },
    {
    name: 'Matheus Martins',
    handle: 'matheus.martins@grupofellow.com.br',
    title: ' Partner & Board Member',
    status: 'Grupo Fellow',
    avatarUrl: 'https://i.postimg.cc/GhVJZwmT/mt.png',
  },
];

const SquadSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const upperTitleRef = useRef<HTMLSpanElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useMobileFadeIn(containerRef);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let cleanup = () => {};
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    async function initAnimations() {
      const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('gsap/SplitText'),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(SplitText, ScrollTrigger);

      const validCards = cardsRef.current.filter(el => el !== null);

      const ctx = gsap.context(() => {
      const splitUpper = new SplitText(upperTitleRef.current, { type: 'chars' });
      const splitMain = new SplitText(mainTitleRef.current, { type: 'words, chars' });
      const splitDesc = new SplitText(descriptionRef.current, { type: 'lines' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.from(splitUpper.chars, {
        opacity: 0,
        y: 8,
        stagger: 0.03,
        duration: 0.85,
        ease: softEase,
      })
        .from(
          splitMain.chars,
          {
            opacity: 0,
            x: -8,
            filter: 'blur(2px)',
            stagger: 0.016,
            duration: 1,
            ease: softEase,
          },
          '-=0.55'
        )
        .from(
          splitDesc.lines,
          {
            opacity: 0,
            y: 14,
            stagger: 0.08,
            duration: 0.95,
            ease: softEase,
          },
          '-=0.6'
        )
        .from(
          validCards,
          {
            y: 34,
            opacity: 0,
            filter: 'blur(2px)',
            stagger: 0.14,
            duration: 1.15,
            ease: softEase,
            clearProps: 'filter',
          },
          '-=0.5'
        );
      }, containerRef);

      cleanup = () => ctx.revert();
    }

    const section = containerRef.current;

    if (!section || !('IntersectionObserver' in window)) {
      initAnimations();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          initAnimations();
        },
        { rootMargin: '650px 0px' }
      );
      observer.observe(section);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section ref={containerRef} className={styles['founders-container']} id="time">
      <div className={styles['founders-header']}>
        <div className={`${styles.badge} ${bodyFont.className}`} data-mobile-fade>
          <span className={styles.badgeIcon}>
            <IconUsersGroup size={14} stroke={1.8} />
          </span>
          <span ref={upperTitleRef}>Time Fellow</span>
        </div>

        <h2 ref={mainTitleRef} className={`${styles['main-title']} ${headingFont.className}`} data-mobile-fade>
          Pessoas que constroem a operação.
        </h2>

        <p ref={descriptionRef} className={`${styles.description} ${bodyFont.className}`} data-mobile-fade>
          Um squad multidisciplinar conectando produto, engenharia, operação e crescimento para sustentar soluções de alta disponibilidade.
        </p>
      </div>

      <div className={styles['cards-grid']}>
        {founders.map((socia, index) => (
          <div
            key={socia.handle}
            ref={el => { cardsRef.current[index] = el; }}
            className={styles['profile-card-wrapper']}
            data-mobile-fade
            data-mobile-batch="squad-cards"
            data-mobile-batch-size="3"
          >
            <ProfileCard
              {...socia}
              enableTilt
              enableMobileTilt={false}
              showBehindGradient={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SquadSection;
