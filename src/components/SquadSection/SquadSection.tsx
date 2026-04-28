'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { IconUsersGroup } from '@tabler/icons-react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import ProfileCard from '@/src/components/ui/ProfileCard';
import styles from './SquadSection.module.css';

gsap.registerPlugin(SplitText, ScrollTrigger);

const headingFont = Sora({ subsets: ['latin'], weight: ['500', '600'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const founders = [
  {
    name: 'Thiago Reis',
    handle: 'thiago',
    title: 'Founder e CTO',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/thiago.png',
  },
  {
    name: 'Jonathan Reis',
    handle: 'jonathan',
    title: 'Arquitetura e Plataforma',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/jon.png',
  },
  {
    name: 'Gervásio Cardoso',
    handle: 'gervasio',
    title: 'Performance e Suporte',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/ge.png',
  },
  {
    name: 'Guilherme Veiga',
    handle: 'guilherme',
    title: 'Performance e Suporte',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/gui.png',
  },
    {
    name: 'Gabriel Viana',
    handle: 'gb',
    title: 'Performance e Suporte',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/gb.png',
  },
   {
    name: 'Samuel Medeiros',
    handle: 'medeiros',
    title: 'Performance e Suporte',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/medeiros.png',
  },
    {
    name: 'Matheus',
    handle: 'matheus',
    title: 'Performance e Suporte',
    status: 'Grupo Fellow',
    avatarUrl: '/assets/mt.png',
  },
];

const SquadSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const upperTitleRef = useRef<HTMLSpanElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
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
        y: 10,
        stagger: 0.03,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          splitMain.chars,
          {
            opacity: 0,
            x: -15,
            filter: 'blur(5px)',
            stagger: 0.02,
            duration: 0.8,
            ease: 'back.out(1.7)',
          },
          '-=0.4'
        )
        .from(
          splitDesc.lines,
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          validCards,
          {
            y: 60,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
            ease: 'expo.out',
          },
          '-=0.4'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles['founders-container']} id="time">
      <div className={styles['founders-header']}>
        <div className={`${styles.badge} ${bodyFont.className}`}>
          <span className={styles.badgeIcon}>
            <IconUsersGroup size={14} stroke={1.8} />
          </span>
          <span ref={upperTitleRef}>Time Fellow</span>
        </div>

        <h2 ref={mainTitleRef} className={`${styles['main-title']} ${headingFont.className}`}>
          Pessoas que constroem a operação.
        </h2>

        <p ref={descriptionRef} className={`${styles.description} ${bodyFont.className}`}>
          Um squad multidisciplinar conectando produto, engenharia, operação e crescimento para sustentar solucoes de alta disponibilidade.
        </p>
      </div>

      <div className={styles['cards-grid']}>
        {founders.map((socia, index) => (
          <div
            key={socia.handle}
            ref={el => { cardsRef.current[index] = el; }}
            className={styles['profile-card-wrapper']}
          >
            <ProfileCard
              {...socia}
              enableTilt
              enableMobileTilt
              showBehindGradient={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SquadSection;
