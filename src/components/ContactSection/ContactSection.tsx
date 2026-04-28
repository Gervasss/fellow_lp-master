"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './ContactSection.module.css';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline, 
  IoLogoInstagram, 
  IoLogoGithub, 
  IoLogoLinkedin, 
  IoPaperPlaneOutline,
  IoChatbubblesOutline 
} from 'react-icons/io5';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';

gsap.registerPlugin(ScrollTrigger, SplitText);

const headingFont = Sora({ subsets: ['latin'], weight: ['600', '800'] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type FormState = {
    name: string;
    email: string;
    message: string;
    errors: Record<string, string>;
    submitting: boolean;
    submitted: boolean;
};

const WHATSAPP_NUMBER_E164 = '5584584958';

export default function ContactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const badgeTextRef = useRef<HTMLSpanElement>(null); // Ref para o texto do badge
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);

    const [state, setState] = useState<FormState>({
        name: '', email: '', message: '',
        errors: {}, submitting: false, submitted: false,
    });

    useEffect(() => {
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
                y: 20, 
                duration: 0.6,
                ease: "power3.out" 
            })
            .from(splitBadge.chars, {
                opacity: 0,
                y: 10,
                stagger: 0.03,
                duration: 0.5,
                ease: "power2.out"
            }, "-=0.3")
            .from(splitTitle.chars, { 
                opacity: 0, 
                x: -10, 
                filter: "blur(5px)", 
                stagger: 0.02, 
                duration: 0.8, 
                ease: "back.out(1.7)" 
            }, "-=0.4")
            .from(splitSubtitle.lines, { 
                opacity: 0, 
                y: 15, 
                stagger: 0.1, 
                duration: 0.7, 
                ease: "power3.out" 
            }, "-=0.6");
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (key: keyof Pick<FormState, 'name' | 'email' | 'message'>) => 
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setState(prev => ({ ...prev, [key]: e.target.value, errors: { ...prev.errors, [key]: '' } }));
    };

    return (
        <section ref={sectionRef} className={styles.section} id="contact">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div ref={badgeRef} className={`${styles.badge} ${bodyFont.className}`}>
                        <span className={styles.badgeIcon}>
                            <IoChatbubblesOutline size={16} />
                        </span>
                        <span ref={badgeTextRef}>Contato</span>
                    </div>
                    
                    <h2 ref={titleRef} className={`${styles.title} ${headingFont.className}`}>
                        Entre em Contato Conosco
                    </h2>
                    
                    <p ref={subtitleRef} className={`${styles.subtitle} ${bodyFont.className}`}>
                        Entre em Contato e nos conte como podemos ajudar a impulsionar seu negócio com nossas soluções de infraestrutura digital e software estratégico. Estamos prontos para transformar suas necessidades em resultados concretos!
                    </p>
                </div>

                <div className={styles.grid}>
                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
                            <span>Enviar via WhatsApp</span>
                            <IoPaperPlaneOutline size={18} />
                        </button>
                    </form>

                    <div className={styles.side}>
                        <h3 className={`${styles.sideTitle} ${headingFont.className}`}>Informações</h3>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.iconBubble}><IoCallOutline size={22} /></div>
                            <div className={`${styles.infoText} ${bodyFont.className}`}>
                                <p>WhatsApp</p>
                                <span className={styles.infoStrong}>(77) 98165-2668</span>
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