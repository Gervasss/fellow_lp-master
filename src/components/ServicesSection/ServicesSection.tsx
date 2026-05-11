'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import styles from './ServicesSection.module.css';
import { GrServices } from 'react-icons/gr';

const headingFont = Sora({ subsets: ['latin'], weight: ['500', '600'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const softEase = 'power3.out';

export default function ServicesSections() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null);
    const introTitleRef = useRef<HTMLHeadingElement>(null);
    const introSubtitleRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let cleanup = () => {};
        let cancelled = false;

        async function initAnimations() {
            const [{ default: gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
                import('gsap/SplitText'),
            ]);

            if (cancelled) return;

            gsap.registerPlugin(ScrollTrigger, SplitText);

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
                    y: 8,
                    stagger: 0.03,
                    duration: 0.85,
                    ease: softEase,
                })
                .from(
                    splitTitle.chars,
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
                    splitSubtitle.lines,
                    {
                        opacity: 0,
                        y: 14,
                        stagger: 0.08,
                        duration: 0.95,
                        ease: softEase,
                    },
                    '-=0.6'
                );

            const media = gsap.matchMedia();

            media.add('(min-width: 769px)', () => {
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
                        { scale: 0.86, opacity: 0.72, duration: 1, ease: 'none' }
                    ).to(panel, { opacity: 0.28, duration: 0.45, ease: 'none' });
                });

                return () => {
                    animatedPanels.forEach((panel) => {
                        panel.style.marginBottom = '';
                    });
                };
            });
            }, wrapperRef);

            cleanup = () => ctx.revert();
        }

        initAnimations();

        return () => {
            cancelled = true;
            cleanup();
        };
    }, []);

    return (
        <div ref={wrapperRef} className={styles.slidesWrapper} id="servicos">
            <div className={styles.introBlock}>
                <div className={`${styles.badge} ${bodyFont.className}`}>
                    <span className={styles.badgeIcon}>
                        <GrServices size={14} />
                    </span>
                    <span ref={badgeTextRef}>Produtos</span>
                </div>

                <h2 ref={introTitleRef} className={`${styles.introTitle} ${headingFont.className}`}>
                    Cada marca, seu próprio universo.
                </h2>

                <p ref={introSubtitleRef} className={`${styles.introSubtitle} ${bodyFont.className}`}>
                   Quatro produtos, quatro propostas. Você contrata a marca que precisa, sem pacote, sem dependência cruzada.
                </p>
            </div>

            <section className={`${styles.section} ${styles.section1}`}>
                <div className={styles.sectionContent}>
                    <div className={styles.sectionInner}>
                        <div className={styles.serviceFeature}>
                            <div className={`${styles.cardMeta} ${bodyFont.className}`}>
                                <span>Marca</span>
                                <span>01 de 04</span>
                            </div>

                            <div className={styles.featureContentRow}>
                                <div className={styles.serviceFeatureLeft}>
                                    <Image
                                        className={styles.productLogo}
                                        src="/assets/payment.jpg"
                                        width={96}
                                        height={96}
                                        sizes="(max-width: 768px) 58px, 80px"
                                        alt="Logo Fellow Pay"
                                    />
                                    <h1 className={`${styles.featureTitle} ${headingFont.className} ${styles.section1Title}`}>Fellow Pay</h1>
                                    <span className={`${styles.productEyebrow} ${bodyFont.className}`}>Gateway de pagamentos</span>
                                    <p className={`${styles.featureDescription} ${bodyFont.className}`}>
                                        Plataforma de pagamentos para empresas que precisam acelerar Pix, cartão,
                                        boleto e carteiras digitais com checkout próprio, conciliação e repasses
                                        em um produto pensado para o mercado brasileiro.
                                    </p>
                                    <ul className={`${styles.featureList} ${bodyFont.className}`}>
                                        <li>Checkout link de pagamento e cobrança recorrente</li>
                                        <li>Pix, cartão, boleto e carteiras digitais</li>
                                        <li>Dashboard com relatórios e conciliação</li>
                                    </ul>
                                    <a className={`${styles.featureButton} ${bodyFont.className}`} href="#contato">
                                       Em Desenvolvimento
                                    </a>
                                </div>

                                <div className={styles.productVisual}>
                                    <Image
                                        className={styles.featureImage}
                                        src="/assets/fellow_example.png"
                                        width={760}
                                        height={760}
                                        sizes="(max-width: 420px) 340px, (max-width: 768px) 540px, 520px"
                                        quality={70}
                                        alt="Interface do produto Fellow Pay"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className={`${styles.section} ${styles.section4}`}>
                <div className={styles.sectionContent}>
                    <div className={styles.sectionInner}>
                        <div className={styles.serviceFeature}>
                            <div className={`${styles.cardMeta} ${bodyFont.className}`}>
                                <span>Marca</span>
                                <span>02 de 04</span>
                            </div>

                            <div className={styles.featureContentRow}>
                                <div className={styles.serviceFeatureLeft}>
                                    <Image
                                        className={styles.productLogo}
                                        src="/assets/core.png"
                                        width={96}
                                        height={96}
                                        sizes="(max-width: 768px) 58px, 80px"
                                        alt="Logo Fellow Core"
                                    />
                                    <h1 className={`${styles.featureTitle} ${headingFont.className}`}>
                                        Fellow Core
                                    </h1>
                                    <span className={`${styles.productEyebrow} ${bodyFont.className}`}>API de pagamentos</span>
                                    <p className={`${styles.featureDescription} ${bodyFont.className}`}>
                                        Fellow Core é a API de pagamentos que opera por trás do Fellow Pay.
                                        Para empresas com produtos próprios, que precisam de uma camada técnica direta (webhooks, autorização, roteamento) sem dashboard ou interface do Pay.
                                    </p>
                                    <ul className={`${styles.featureList} ${bodyFont.className}`}>
                                        <li>REST API, implementação completa</li>
                                        <li>Webhooks, conciliação e eventos transacionais</li>
                                        <li>Infraestrutura para integrações financeiras críticas</li>
                                    </ul>
                                    <a className={`${styles.featureButton} ${bodyFont.className}`} href="#contato">
                                        Em Desenvolvimento
                                    </a>
                                </div>

                                <div className={styles.productVisual}>
                                    <Image
                                        className={styles.featureImage}
                                        src="/assets/core_ex.png"
                                        width={760}
                                        height={760}
                                        sizes="(max-width: 420px) 340px, (max-width: 768px) 540px, 520px"
                                        quality={70}
                                        alt="Interface do produto Fellow Core"
                                    />
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
                            <div className={`${styles.cardMeta} ${bodyFont.className}`}>
                                <span>Marca</span>
                                <span>03 de 04</span>
                            </div>

                            <div className={`${styles.featureContentRow} ${styles.section3ContentRow}`}>
                                <div className={`${styles.serviceFeatureLeft} ${styles.section3Right}`}>
                                    <Image
                                        className={styles.productLogo}
                                        src="/assets/tickets.png"
                                        width={96}
                                        height={96}
                                        sizes="(max-width: 768px) 58px, 80px"
                                        alt="Logo Fellow Ticket"
                                    />
                                    <h1 className={`${styles.featureTitle} ${styles.section3Title} ${headingFont.className}`}>
                                        Fellow Ticket
                                    </h1>
                                    <span className={`${styles.productEyebrow} ${bodyFont.className}`}>Ingressos e eventos</span>
                                    <p className={`${styles.featureDescription} ${styles.section3Description} ${bodyFont.className}`}>
                                        Plataforma de venda e gestão de ingressos para eventos que precisam de
                                        checkout rápido, controle de lotes e validação segura em tempo real.
                                    </p>
                                    <ul className={`${styles.featureList} ${bodyFont.className}`}>
                                        <li>Venda online com checkout otimizado</li>
                                        <li>Gestão de lotes, cupons e acessos</li>
                                        <li>Validação e operação no dia do evento</li>
                                    </ul>

                                    <div className={styles.buttonGroup}>
                                        <a className={`${styles.featureButton} ${styles.section3Button} ${bodyFont.className}`} href="#contato">
                                           Em Desenvolvimento
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.productVisual}>
                                    <Image
                                        className={`${styles.featureImage} ${styles.section3Image}`}
                                        src="/assets/ticket_ex.png"
                                        width={760}
                                        height={520}
                                        sizes="(max-width: 420px) 340px, (max-width: 768px) 540px, 520px"
                                        quality={70}
                                        alt="Interface do produto Fellow Ticket"
                                    />
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
                            <div className={`${styles.cardMeta} ${bodyFont.className}`}>
                                <span>Marca</span>
                                <span>04 de 04</span>
                            </div>

                            <div className={`${styles.featureContentRow} ${styles.section2ContentRow}`}>
                                <div className={`${styles.serviceFeatureLeft} ${styles.section2Right}`}>
                                    <Image
                                        className={styles.productLogo}
                                        src="/assets/agents.jpg"
                                        width={96}
                                        height={96}
                                        sizes="(max-width: 768px) 58px, 80px"
                                        alt="Logo Fellow AI"
                                    />
                                    <h1 className={`${styles.featureTitle} ${styles.section2Title} ${headingFont.className}`}>
                                        Fellow AI
                                    </h1>
                                    <span className={`${styles.productEyebrow} ${bodyFont.className}`}>Automação com IA</span>
                                    <p className={`${styles.featureDescription} ${styles.section2Description} ${bodyFont.className}`}>
                                        Agentes de IA aplicados a atendimento, operação e produtividade,
                                        conectando contexto, automações e execução real para responder,
                                        analisar e agir com mais eficiência.
                                    </p>
                                    <ul className={`${styles.featureList} ${bodyFont.className}`}>
                                        <li>Agentes para atendimento e triagem operacional</li>
                                        <li>Automações conectadas ao contexto do negócio</li>
                                        <li>Fluxos para análise, resposta e execução</li>
                                    </ul>
                                    <a className={`${styles.featureButton} ${styles.section2Button} ${bodyFont.className}`} href="#contato">
                                        Em Desenvolvimento
                                    </a>
                                </div>

                                <div className={styles.productVisual}>
                                    <Image
                                        className={`${styles.featureImage} ${styles.section2Image}`}
                                        src="/assets/chat_ai.png"
                                        width={760}
                                        height={520}
                                        sizes="(max-width: 420px) 340px, (max-width: 768px) 540px, 520px"
                                        quality={70}
                                        alt="Interface do produto Fellow AI"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>




        </div>
    );
}
