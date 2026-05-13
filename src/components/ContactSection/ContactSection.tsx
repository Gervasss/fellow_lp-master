"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './ContactSection.module.css';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoPaperPlaneOutline,
  IoChatbubblesOutline 
} from 'react-icons/io5';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import { useMobileFadeIn } from '@/src/lib/useMobileFadeIn';

const headingFont = Sora({ subsets: ['latin'], weight: ['600', '800'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const softEase = "power3.out";

type FormState = {
    name: string;
    email: string;
    message: string;
    errors: Record<string, string>;
    submitting: boolean;
    submitted: boolean;
};

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null); // Ref para o texto do badge
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    useMobileFadeIn(sectionRef);

    const [state, setState] = useState<FormState>({
        name: '', email: '', message: '',
        errors: {}, submitting: false, submitted: false,
    });

    useEffect(() => {
        if (window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)').matches) {
            return;
        }

        let cleanup = () => {};
        let observer: IntersectionObserver | undefined;
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
            // Configuração do SplitText para cada elemento
            const splitBadge = new SplitText(badgeTextRef.current, { type: "chars" });
            const splitTitle = new SplitText(titleRef.current, { type: "chars, words" });
            const splitSubtitle = new SplitText(subtitleRef.current, { type: "lines" });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                }
            });

            // Animação sequencial
            tl.from(badgeRef.current, { 
                opacity: 0, 
                y: 12,
                duration: 0.85,
                ease: softEase
            })
            .from(splitBadge.chars, {
                opacity: 0,
                y: 8,
                stagger: 0.03,
                duration: 0.75,
                ease: softEase
            }, "-=0.3")
            .from(splitTitle.chars, { 
                opacity: 0, 
                x: -8,
                filter: "blur(2px)",
                stagger: 0.016,
                duration: 1,
                ease: softEase
            }, "-=0.5")
            .from(splitSubtitle.lines, { 
                opacity: 0, 
                y: 12,
                stagger: 0.08,
                duration: 0.95,
                ease: softEase
            }, "-=0.6");
            }, sectionRef);

            cleanup = () => ctx.revert();
        }

        const section = sectionRef.current;

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

    const handleChange = (key: keyof Pick<FormState, 'name' | 'email' | 'message'>) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setState(prev => ({ ...prev, [key]: e.target.value, errors: { ...prev.errors, [key]: '' } }));
    };

    return (
        <section ref={sectionRef} className={styles.section} id="contato">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div ref={badgeRef} className={`${styles.badge} ${bodyFont.className}`} data-mobile-fade>
                        <span className={styles.badgeIcon}>
                            <IoChatbubblesOutline size={16} />
                        </span>
                        <span ref={badgeTextRef}>Contato</span>
                    </div>
                    
                    <h2 ref={titleRef} className={`${styles.title} ${headingFont.className}`} data-mobile-fade>
                        Entre em Contato Conosco
                    </h2>
                    
                    <p ref={subtitleRef} className={`${styles.subtitle} ${bodyFont.className}`} data-mobile-fade>
                        Entre em Contato e nos conte como podemos ajudar a impulsionar seu negócio com nossas soluções de infraestrutura digital e software estratégico. Estamos prontos para transformar suas necessidades em resultados concretos!
                    </p>
                </div>

                <div className={styles.grid}>
                    <form className={styles.form} onSubmit={(e) => e.preventDefault()} data-mobile-fade>
                        <div className={styles.field}>
                            <label className={`${styles.label} ${bodyFont.className}`}>Nome Completo</label>
                            <input className={`${styles.input} ${bodyFont.className}`} placeholder="Como podemos te chamar?" value={state.name} onChange={handleChange('name')} />
                        </div>
                        <div className={styles.field}>
                            <label className={`${styles.label} ${bodyFont.className}`}>E-mail Corporativo</label>
                            <input className={`${styles.input} ${bodyFont.className}`} type="email" placeholder="seu@email.com" value={state.email} onChange={handleChange('email')} />
                        </div>
                        <div className={styles.field}>
                            <label className={`${styles.label} ${bodyFont.className}`}>Sua Mensagem</label>
                            <textarea className={`${styles.textarea} ${bodyFont.className}`} placeholder="Conte-nos sua necessidade..." value={state.message} onChange={handleChange('message')} />
                        </div>

                        <button className={`${styles.button} ${bodyFont.className}`} type="submit">
                            <span>Agendar conversa estratégica</span>
                            <IoPaperPlaneOutline size={18} className={styles.buttonIcon}/>
                        </button>
                    </form>

                    <div className={styles.side} data-mobile-fade>
                        <h3 className={`${styles.sideTitle} ${headingFont.className}`}>Informações</h3>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.iconBubble}><IoCallOutline size={22} /></div>
                            <div className={`${styles.infoText} ${bodyFont.className}`}>
                                <p>WhatsApp</p>
                                <span className={styles.infoStrong}>(71) 99641-8877</span>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.iconBubble}><IoMailOutline size={22} /></div>
                            <div className={`${styles.infoText} ${bodyFont.className}`}>
                                <p>E-mail</p>
                                <span className={styles.infoStrong}>contato@grupofellow.com.br</span>
                            </div>
                        </div>

                        <div className={styles.socialRow}>
                            <a className={styles.social} href="https://www.linkedin.com/company/grupo-fellow/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                                <IoLogoLinkedin size={20} />
                            </a>
                            <a className={styles.social} href="https://www.instagram.com/grupofellow/" target="_blank" rel="noopener noreferrer">
                                <IoLogoInstagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
