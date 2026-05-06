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
    const visualRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const revealItems = gsap.utils.toArray<HTMLElement>(`.${styles.revealItem}`);
            const statItems = gsap.utils.toArray<HTMLElement>(`.${styles.statItem}`);
            const splitBadge = new SplitText(badgeTextRef.current, { type: 'chars' });
            const splitTitle = new SplitText(titleRef.current, { type: 'words, chars' });
            const splitDescription = new SplitText(descriptionRef.current, { type: 'lines' });

            gsap.set(revealItems, {
                opacity: 0,
                y: 42,
                filter: 'blur(14px)',
            });

            gsap.set(visualRef.current, {
                opacity: 0,
                x: 120,
                scale: 0.98,
                filter: 'blur(18px)',
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
                        visualRef.current,
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            filter: 'blur(0px)',
                            duration: 0.95,
                            ease: 'power3.out',
                        },
                        '-=0.25'
                    )
                    .to(
                        statItems,
                        {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            duration: 0.8,
                            stagger: 0.1,
                            ease: 'power3.out',
                        },
                        '-=0.45'
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
                    <span ref={badgeTextRef}>Quem somos</span>
                </div>

                <div className={styles.content}>
                    <h2 ref={titleRef} className={`${styles.mainTitle} ${headingFont.className} ${styles.revealItem}`}>
                        <span className={styles.mainTitleLine}>Não somos um produto.</span>
                        <span className={`${styles.mainTitleLine} ${styles.mainTitleAccent}`}>Somos quatro.</span>
                    </h2>

                    <div ref={descriptionRef} className={`${styles.description} ${styles.revealItem}`}>
                        <p className={bodyFont.className}>
                            O <strong>Grupo Fellow</strong> é uma empresa brasileira que atua como
                            holding de produtos digitais. Não vendemos um SaaS: operamos um portfólio
                            de marcas, cada uma resolvendo um problema diferente,
                            com seu próprio time de produto e sua própria base de clientes.
                        </p>
                        <p className={bodyFont.className}>
                            Quando uma marca precisa de outra, a sinergia acontece. Mas o cliente
                            não precisa saber disso. Ele contrata a marca. A marca resolve.
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        {stats.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div key={item.label} className={`${styles.statItem} ${styles.revealItem}`}>
                                    <span className={styles.statIcon}>
                                        <Icon size={28} stroke={1.7} />
                                    </span>
                                    <span className={`${styles.statLabel} ${bodyFont.className}`}>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <aside ref={visualRef} className={styles.visual} aria-label="Grupo Fellow">
                    <Image
                        src="/assets/about.png"
                        alt="Composição visual do Grupo Fellow"
                        fill
                        sizes="(max-width: 968px) 78vw, 440px"
                        className={styles.aboutImage}
                    />
                </aside>
            </div>
        </section>
    );
}
