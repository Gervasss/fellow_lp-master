"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './SubscriptionCTA.module.css';
import { 
    IoFlashOutline, 
    IoShieldCheckmarkOutline, 
    IoTrendingUpOutline, 
    IoRocketOutline,
    IoCheckmarkCircle
} from 'react-icons/io5';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';

gsap.registerPlugin(ScrollTrigger);

const headingFont = Sora({ subsets: ['latin'], weight: ['700', '800'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

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
    const cardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const ctx = gsap.context(() => {
        // Selecionamos os mini cards
        const miniCards = gsap.utils.toArray(`.${styles.productMiniCard}`);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 90%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",


            }
        });

        tl.from(badgeRef.current, { 
            opacity: 0, 
            y: 30, 
            duration: 0.6, 
            ease: "power3.out" 
        })
        .from(cardRef.current, { 
            opacity: 0, 
            y: 40, 
            duration: 0.8, 
            ease: "power3.out" 
        }, "-=0.3")
        .from(miniCards, { 
            opacity: 0, 
            scale: 0.9, 
            y: 30, 
            stagger: 0.1, 
            duration: 0.6,
            ease: "back.out(1.7)",
            clearProps: "all" 
        }, "-=0.4");

    }, sectionRef);

    return () => ctx.revert();
}, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Badge flutuando acima da seção */}
            <div ref={badgeRef} className={styles.badgeWrapper}>
                <div className={`${styles.badge} ${bodyFont.className}`}>
                    <div className={styles.pulseIcon}>
                        <IoRocketOutline size={16} />
                    </div>
                    <span>Planos de Assinatura</span>
                </div>
            </div>

            <div className={styles.container} ref={containerRef}>
                <div className={styles.glassCard} ref={cardRef}>
                    <div className={styles.content}>
                        <h2 className={`${styles.title} ${headingFont.className}`}>
                            Transforme sua operação com <br />
                            <span>nossas soluções premium</span>
                        </h2>

                        <p className={`${styles.description} ${bodyFont.className}`}>
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
                                            priority
                                        />
                                    </div>
                                    <h3 className={`${styles.prodName} ${headingFont.className}`}>
                                        {prod.name}
                                    </h3>
                                    <ul className={styles.prodFeatures}>
                                        <li><IoCheckmarkCircle size={14} /> Full Access</li>
                                        <li><IoCheckmarkCircle size={14} /> Updates</li>
                                    </ul>
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