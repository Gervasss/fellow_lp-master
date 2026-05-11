"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './SubscriptionCTA.module.css';
import { 
    IoFlashOutline, 
    IoShieldCheckmarkOutline, 
    IoTrendingUpOutline, 
    IoRocketOutline
} from 'react-icons/io5';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';

const headingFont = Sora({ subsets: ['latin'], weight: ['700', '800'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const softEase = "power3.out";

const BENEFITS = [
    { icon: <IoFlashOutline />, text: "Ativação Imediata" },
    { icon: <IoShieldCheckmarkOutline />, text: "Garantia Fellow" },
    { icon: <IoTrendingUpOutline />, text: "Suporte 24/7" },
];

const SUBSCRIPTION_PRODUCTS = [
    { 
        id: 'pay', 
        name: 'Fellow Pay', 
        logo: '/assets/payment.jpg' 
    }, 
    {
        id: 'core',
        name: 'Fellow Core',
        logo: '/assets/core.png'
    },
    { 
        id: 'ai', 
        name: 'Fellow AI', 
        logo: '/assets/agents.jpg' 
    },
    { 
        id: 'tickets', 
        name: 'Fellow Tickets', 
        logo: '/assets/tickets.png' 
    },
];

export default function SubscriptionCTA() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

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
        // Selecionamos os mini cards
        const miniCards = gsap.utils.toArray(`.${styles.productMiniCard}`);
        const splitBadge = new SplitText(badgeTextRef.current, { type: 'chars' });
        const splitTitle = new SplitText(titleRef.current, { type: 'words, chars' });
        const splitDescription = new SplitText(descriptionRef.current, { type: 'lines' });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 90%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",


            }
        });

        tl.from(splitBadge.chars, {
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
            splitDescription.lines,
            {
                opacity: 0,
                y: 14,
                stagger: 0.08,
                duration: 0.95,
                ease: softEase,
            },
            '-=0.6'
        )
        .from(cardRef.current, {
            opacity: 0,
            y: 24,
            filter: "blur(3px)",
            duration: 1,
            ease: softEase,
            clearProps: "filter"
        }, "-=0.4")
        .from(miniCards, {
            opacity: 0,
            scale: 0.97,
            y: 20,
            filter: "blur(2px)",
            stagger: 0.08,
            duration: 0.95,
            ease: softEase,
            clearProps: "all"
        }, "-=0.4");

        }, sectionRef);

        cleanup = () => ctx.revert();
    }

    initAnimations();

    return () => {
        cancelled = true;
        cleanup();
    };
}, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Badge flutuando acima da seção */}
            <div ref={badgeRef} className={styles.badgeWrapper}>
                <div className={`${styles.badge} ${bodyFont.className}`}>
                    <div className={styles.pulseIcon}>
                        <IoRocketOutline size={16} />
                    </div>
                    <span ref={badgeTextRef}>Vamos Escalar?</span>
                </div>
            </div>

            <div className={styles.container} ref={containerRef}>
                <div className={styles.glassCard} ref={cardRef}>
                    <div className={styles.content}>
                        <h2 ref={titleRef} className={`${styles.title} ${headingFont.className}`}>
                            Transforme sua operação com <br />
                            <span>nossas soluções </span>
                        </h2>

                        <p ref={descriptionRef} className={`${styles.description} ${bodyFont.className}`}>
                            Selecione o ecossistema ideal para o seu negócio e tenha acesso imediato a ferramentas de alta performance.
                        </p>

                        <div className={styles.productsGrid}>
                            {SUBSCRIPTION_PRODUCTS.map((prod) => (
                                <div key={prod.id} className={styles.productMiniCard}>
                                    <div className={styles.prodLogo}>
                                        <Image 
                                            src={prod.logo} 
                                            alt={prod.name} 
                                            width={80} 
                                            height={80}
                                            className={styles.logoImage}
                                        />
                                    </div>
                                    <h3 className={`${styles.prodName} ${headingFont.className}`}>
                                        {prod.name}
                                    </h3>
                                   
                                    <button className={`${styles.subscribeBtn} ${bodyFont.className}`}>
                                       Ir para o Produto
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className={styles.benefitsRow}>
                            {BENEFITS.map((item, index) => (
                                <div key={index} className={`${styles.benefitItem} ${bodyFont.className}`}>
                                    <span className={styles.icon}>{item.icon}</span>
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Brilho decorativo de fundo */}
                    <div className={styles.glowOrb} />
                </div>
            </div>
        </section>
    );
}
