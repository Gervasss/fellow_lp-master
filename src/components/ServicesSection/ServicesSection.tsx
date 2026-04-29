'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import styles from './ServicesSection.module.css';
import { GrServices } from 'react-icons/gr';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(SplitText);
}

const headingFont = Sora({ subsets: ['latin'], weight: ['500', '600'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function ServicesSections() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null);
    const introTitleRef = useRef<HTMLHeadingElement>(null);
    const introSubtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const splitBadge = new SplitText(badgeTextRef.current, { type: 'chars' });
            const splitTitle = new SplitText(introTitleRef.current, { type: 'words, chars' });
            const splitSubtitle = new SplitText(introSubtitleRef.current, { type: 'lines' });
            gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            })
                .from(splitBadge.chars, {
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
                    splitSubtitle.lines,
                    {
                        opacity: 0,
                        y: 20,
                        stagger: 0.1,
                        duration: 0.8,
                        ease: 'power3.out',
                    },
                    '-=0.5'
                );

            const media = gsap.matchMedia();

            media.add('(min-width: 0px)', () => {
                const panels = gsap.utils.toArray<HTMLElement>(`.${styles.section}`);
                const animatedPanels = panels.slice(0, -1);

                animatedPanels.forEach((panel) => {
                    const innerpanel = panel.querySelector(`.${styles.sectionInner}`) as HTMLElement | null;
                    if (!innerpanel) return;

                    const panelHeight = innerpanel.offsetHeight;
                    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
                    const windowHeight = viewportHeight - 64;
                    const difference = panelHeight - windowHeight;
                    const fakeScrollRatio = difference > 0 ? difference / (difference + windowHeight) : 0;

                    if (fakeScrollRatio > 0) {
                        panel.style.marginBottom = `${difference}px`;
                    }

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: panel,
                            start: 'bottom bottom',
                            end: () => (difference > 0 ? `+=${panelHeight}` : 'bottom top'),
                            pinSpacing: false,
                            pin: true,
                            scrub: true,
                            invalidateOnRefresh: true,
                        },
                    });

                    if (difference > 0) {
                        tl.to(innerpanel, {
                            y: -difference,
                            duration: difference / windowHeight,
                            ease: 'none',
                        });
                    }

                    tl.fromTo(
                        panel,
                        { scale: 1, opacity: 1 },
                        { scale: 0.7, opacity: 0.5, duration: 0.9, ease: 'none' }
                    ).to(panel, { opacity: 0, duration: 0.1 });
                });

                return () => {
                    animatedPanels.forEach((panel) => {
                        panel.style.marginBottom = '';
                    });
                };
            });
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={wrapperRef} className={styles.slidesWrapper} id="servicos">
            <div className={styles.introBlock}>
                <div className={`${styles.badge} ${bodyFont.className}`}>
                    <span className={styles.badgeIcon}>
                        <GrServices size={14} />
                    </span>
                    <span ref={badgeTextRef}>Serviços</span>
                </div>

                <h2 ref={introTitleRef} className={`${styles.introTitle} ${headingFont.className}`}>
                    Nossos serviços
                </h2>

                <p ref={introSubtitleRef} className={`${styles.introSubtitle} ${bodyFont.className}`}>
                    Conheça serviços que podem impulsionar sua operação e presença digital.
                </p>
            </div>

            <section className={`${styles.section} ${styles.section1}`}>
                <div className={styles.sectionContent}>
                    <div className={styles.sectionInner}>
                        <div className={styles.serviceFeature}>
                            <h1 className={`${styles.featureTitle} ${headingFont.className} ${styles.section1Title}`}>Fellow Pay</h1>

                            <div className={styles.featureContentRow}>
                                <Image
                                    className={styles.featureImage}
                                    src="/assets/pay.jpg"
                                    width={760}
                                    height={520}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    alt="Representação visual do serviço Fellow Pay"
                                />

                                <div className={styles.serviceFeatureRight}>
                                    <p className={`${styles.featureDescription} ${bodyFont.className}`}>
                                        O <strong>Fellow Pay</strong> é a solução do Grupo Fellow para operações que precisam de
                                        pagamentos mais fluidos, controle centralizado e uma experiência digital sólida para
                                        vender, receber e acompanhar transações com mais clareza.
                                    </p>
                                    <a className={`${styles.featureButton} ${bodyFont.className}`} href="#contato">
                                        Em breve
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <section className={`${styles.section} ${styles.section3}`}>
                <div className={styles.sectionContent}>
                    <div className={`${styles.sectionInner} ${styles.section3Inner}`}>
                        <div className={`${styles.serviceFeature} ${styles.section3Feature}`}>
                            {/* Título com a fonte de heading do projeto */}
                            <h1 className={`${styles.featureTitle} ${styles.section3Title} ${headingFont.className}`}>
                                Fellow Ticket
                            </h1>

                            <div className={`${styles.featureContentRow} ${styles.section3ContentRow}`}>
                                <Image
                                    className={`${styles.featureImage} ${styles.section3Image}`}
                                    src="/assets/ticket.jpg"
                                    width={760}
                                    height={520}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    alt="Plataforma Fellow Ticket - Gestão de Eventos"
                                />

                                <div className={`${styles.serviceFeatureRight} ${styles.section3Right}`}>
                                    <p className={`${styles.featureDescription} ${styles.section3Description} ${bodyFont.className}`}>
                                        O <strong>Fellow Ticket</strong> é a nossa solução de alta performance para a
                                        venda e gestão de ingressos. Projetada para suportar <strong>altos volumes de tráfego</strong>
                                        e garantir transações seguras, a plataforma oferece controle total sobre o ecossistema
                                        do evento, desde o checkout otimizado até a validação em tempo real.
                                    </p>

                                    <div className={styles.buttonGroup}>
                                        <a className={`${styles.featureButton} ${styles.section3Button} ${bodyFont.className}`} href="#contato">
                                            Em breve
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.section2}`}>
                <div className={styles.sectionContent}>
                    <div className={`${styles.sectionInner} ${styles.section2Inner}`}>
                        <div className={`${styles.serviceFeature} ${styles.section2Feature}`}>
                            <h1 className={`${styles.featureTitle} ${styles.section2Title} ${headingFont.className}`}>
                                Fellow AI
                            </h1>

                            <div className={`${styles.featureContentRow} ${styles.section2ContentRow}`}>
                                <Image
                                    className={`${styles.featureImage} ${styles.section2Image}`}
                                    src="/assets/ai.jpg"
                                    width={760}
                                    height={520}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    alt="Representação visual do serviço Fellow Agents"
                                />

                                <div className={`${styles.serviceFeatureRight} ${styles.section2Right}`}>
                                    <p className={`${styles.featureDescription} ${styles.section2Description} ${bodyFont.className}`}>
                                        O <strong>Fellow AI</strong> é a frente do Grupo Fellow para agentes de IA
                                        aplicados a atendimento, operação e produtividade, conectando contexto,
                                        automações e execução real para responder, analisar e agir com mais eficiência.
                                    </p>
                                    <a className={`${styles.featureButton} ${styles.section2Button} ${bodyFont.className}`} href="#contato">
                                        Em breve
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




        </div>
    );
}
