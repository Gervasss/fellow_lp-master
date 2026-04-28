'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import {
    IconGauge,
    IconLicense,
    IconServer2,
    IconTarget,
} from '@tabler/icons-react';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const headingFont = Sora({ subsets: ['latin'], weight: ['600'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });

const stats = [
    {
        label: 'INFRAESTRUTURA',
        icon: IconServer2,
    },
    {
        label: 'LICENCIAMENTO',
        icon: IconLicense,
    },
    {
        label: 'PERFORMANCE',
        icon: IconGauge,
    },
];

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const hasPlayedRef = useRef(false);
    const badgeRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const revealItems = gsap.utils.toArray<HTMLElement>(`.${styles.revealItem}`);
            const statItems = gsap.utils.toArray<HTMLElement>(`.${styles.statItem}`);
            const splitBadge = new SplitText(badgeTextRef.current, { type: 'chars' });
            const splitTitle = new SplitText(titleRef.current, { type: 'words, chars' });
            const splitDescription = new SplitText(descriptionRef.current, { type: 'lines' });

            gsap.set([...revealItems, ...statItems], {
                opacity: 0,
                y: 42,
                filter: 'blur(14px)',
            });

            gsap.to(`.${styles.brandGlow}`, {
                opacity: 0.42,
                duration: 2.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(`.${styles.brandLogo}`, {
                opacity: 0.16,
                filter: 'drop-shadow(0 0 12px rgba(200, 180, 160, 0.1))',
                duration: 2.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.to(`.${styles.logoOrb}`, {
                y: -8,
                x: 6,
                duration: 3.6,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            const playAboutIntro = () => {
                if (hasPlayedRef.current) {
                    return;
                }

                hasPlayedRef.current = true;

                gsap.set([badgeRef.current, badgeTextRef.current, titleRef.current, descriptionRef.current], {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                });

                const secondaryRevealItems = revealItems.filter(
                    item => item !== badgeRef.current && item !== titleRef.current && item !== descriptionRef.current
                );

                const tl = gsap.timeline();

                tl.from(splitBadge.chars, {
                    opacity: 0,
                    y: 10,
                    stagger: 0.03,
                    duration: 0.6,
                    ease: 'power2.out',
                })
                    .from(
                        splitTitle.chars,
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
                    .to(
                        secondaryRevealItems,
                        {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            duration: 0.9,
                            stagger: 0.12,
                            ease: 'power3.out',
                        },
                        '-=0.45'
                    )
                    .from(
                        splitDescription.lines,
                        {
                            opacity: 0,
                            y: 20,
                            stagger: 0.1,
                            duration: 0.8,
                            ease: 'power3.out',
                        },
                        '-=0.65'
                    )
                    .to(
                        statItems,
                        {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            duration: 0.9,
                            stagger: 0.12,
                            ease: 'power3.out',
                        },
                        '-=0.42'
                    );
            };

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top 78%',
                once: true,
                onEnter: playAboutIntro,
            });

            const onAboutFocus = () => {
                playAboutIntro();
            };

            window.addEventListener('about:focus', onAboutFocus);

            return () => {
                window.removeEventListener('about:focus', onAboutFocus);
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.aboutWrapper} id="sobre">
            <div className={styles.container}>
                <div ref={badgeRef} className={`${styles.badge} ${bodyFont.className} ${styles.revealItem} ${styles.badgeTop}`}>
                    <span className={styles.badgeIcon}>
                        <IconTarget size={14} stroke={1.8} />
                    </span>
                    <span ref={badgeTextRef}>Sobre nós</span>
                </div>

                <div className={styles.content}>
                    <h2 ref={titleRef} className={`${styles.mainTitle} ${headingFont.className} ${styles.revealItem}`}>
                        Moldando o futuro através da tecnologia.
                    </h2>

                    <div ref={descriptionRef} className={`${styles.description} ${styles.revealItem}`}>
                        <p className={bodyFont.className}>
                            O <strong>Grupo Fellow</strong> atua no epicentro das operações financeiras
                            e da gestão tecnológica de eventos. Somos uma provedora de infraestrutura digital
                            dedicada a centralizar, simplificar e escalar negócios que exigem
                            <strong> alta disponibilidade</strong> e tolerância zero a falhas.
                        </p>
                        <p className={bodyFont.className}>
                            Nossa expertise abrange o desenvolvimento e licenciamento de softwares
                            customizáveis, garantindo que a tecnologia seja o motor estratégico, e não
                            o gargalo, para empresas que buscam segurança e escalabilidade real.
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.label} className={styles.statItem}>
                                    <span className={styles.statIcon}>
                                        <Icon size={30} stroke={1.7} />
                                    </span>
                                    <span className={`${styles.statLabel} ${bodyFont.className}`}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={`${styles.brandBlock} ${styles.revealItem}`}>
                        <span className={styles.brandGlow} />
                        <span className={styles.logoOrb} />
                        <Image
                            src="/assets/felloww-logo.png"
                            alt="Logo Grupo Fellow"
                            width={600}
                            height={600}
                            className={styles.brandLogo}
                        />
                    </div>
                </aside>
            </div>
        </section>
    );
}
