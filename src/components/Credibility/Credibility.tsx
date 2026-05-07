"use client";

import React, { useLayoutEffect, useRef } from "react";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  IconApi,
  IconBolt,
  IconCloudLock,
  IconCpu,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import {
  SiCss,
  SiDocker,
  SiDotnet,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiReact,
  SiSharp,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import LogoLoop, { LogoItem } from "../ui/LogoLoop";
import styles from "./Credibility.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const headingFont = Sora({ subsets: ["latin"], weight: ["500", "600"] });
const bodyFont = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const softEase = "power3.out";

const pillars = [
  {
    icon: IconBolt,
    label: "Performance",
    title: "Produtos rápidos por padrão",
    description: "Arquitetura orientada a carregamento eficiente, respostas objetivas e interfaces fluidas.",
  },
  {
    icon: IconShieldCheck,
    label: "Segurança",
    title: "Boas práticas desde a base",
    description: "Camadas modernas para autenticação, autorização, isolamento de contexto e proteção de dados.",
  },
  {
    icon: IconCpu,
    label: "Escalabilidade",
    title: "Estrutura modular para crescer",
    description: "Serviços pensados para evoluir por produto, integração e demanda operacional.",
  },
  {
    icon: IconSparkles,
    label: "Automação",
    title: "IA aplicada ao fluxo real",
    description: "Agentes, integrações e rotinas inteligentes para reduzir trabalho repetitivo e acelerar decisões.",
  },
];

const stack: LogoItem[] = [
  { node: <TechLogo icon={<SiNextdotjs />} label="Next.js" />, title: "Next.js" },
  { node: <TechLogo icon={<SiTypescript />} label="TypeScript" />, title: "TypeScript" },
  { node: <TechLogo icon={<SiReact />} label="React" />, title: "React" },
  { node: <TechLogo icon={<SiTailwindcss />} label="Tailwind" />, title: "Tailwind CSS" },
  { node: <TechLogo icon={<SiCss />} label="CSS" />, title: "CSS" },
  { node: <TechLogo icon={<SiNodedotjs />} label="Node.js" />, title: "Node.js" },
  { node: <TechLogo icon={<SiSharp />} label="C#" />, title: "C#" },
  { node: <TechLogo icon={<SiDotnet />} label=".NET" />, title: ".NET" },
  { node: <TechLogo icon={<IconApi size={18} stroke={1.9} />} label="REST APIs" />, title: "REST APIs" },
  { node: <TechLogo icon={<IconCloudLock size={18} stroke={1.9} />} label="Cloud-ready" />, title: "Cloud-ready" },
  { node: <TechLogo icon={<SiDocker />} label="Docker" />, title: "Docker" },
  { node: <TechLogo icon={<SiOpenai />} label="IA Automation" />, title: "IA Automation" },
];

function TechLogo({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className={`${styles.techPill} ${bodyFont.className}`}>
      <span className={styles.techIcon}>{icon}</span>
      <span>{label}</span>
    </span>
  );
}

export default function Credibility() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const stackPanelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const splitBadge = new SplitText(badgeTextRef.current, { type: "chars" });
      const splitTitle = new SplitText(titleRef.current, { type: "words, chars" });
      const splitSubtitle = new SplitText(subtitleRef.current, { type: "lines" });
      const validCards = cardsRef.current.filter((card): card is HTMLElement => card !== null);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            toggleActions: "play none none reverse",
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
            filter: "blur(2px)",
            stagger: 0.016,
            duration: 1,
            ease: softEase,
          },
          "-=0.55"
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
          "-=0.6"
        )
        .from(
          validCards,
          {
            opacity: 0,
            y: 32,
            filter: "blur(2px)",
            stagger: 0.12,
            duration: 1.05,
            ease: softEase,
            clearProps: "filter",
          },
          "-=0.45"
        )
        .from(
          stackPanelRef.current,
          {
            opacity: 0,
            y: 24,
            filter: "blur(3px)",
            duration: 1,
            ease: softEase,
            clearProps: "filter",
          },
          "-=0.55"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} id="credibilidade">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={`${styles.badge} ${bodyFont.className}`}>
            <span className={styles.badgeIcon}>
              <IconCloudLock size={14} stroke={1.8} />
            </span>
            <span ref={badgeTextRef}>Prova técnica</span>
          </div>

          <h2 ref={titleRef} className={`${styles.title} ${headingFont.className}`}>
            Infraestrutura moderna para produtos modernos.
          </h2>

          <p ref={subtitleRef} className={`${styles.subtitle} ${bodyFont.className}`}>
            Construímos soluções digitais com foco em escalabilidade, automação e experiência. A credibilidade da Fellow começa na arquitetura.
          </p>
        </div>

        <div className={styles.pillarsGrid}>
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <article
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className={styles.pillarCard}
                key={pillar.title}
              >
                <div className={styles.pillarTop}>
                  <span className={styles.pillarIcon}>
                    <Icon size={24} stroke={1.65} />
                  </span>
                  <span className={`${styles.pillarLabel} ${bodyFont.className}`}>{pillar.label}</span>
                </div>

                <h3 className={`${styles.pillarTitle} ${headingFont.className}`}>{pillar.title}</h3>
                <p className={`${styles.pillarDescription} ${bodyFont.className}`}>{pillar.description}</p>
              </article>
            );
          })}
        </div>

        <div ref={stackPanelRef} className={styles.stackPanel}>
          <div className={styles.stackHeader}>
            <span className={`${styles.stackEyebrow} ${bodyFont.className}`}>Tecnologias que sustentam nossos produtos</span>
            <p className={`${styles.stackText} ${bodyFont.className}`}>
              Uma base técnica moderna para criar interfaces refinadas, APIs integráveis, automações inteligentes e sistemas preparados para operação real.
            </p>
          </div>

          <LogoLoop
            logos={stack}
            speed={34}
            logoHeight={38}
            gap={14}
            pauseOnHover
            fadeOut
            fadeOutColor="rgba(4, 4, 8, 1)"
            ariaLabel="Tecnologias e capacidades usadas pela Fellow"
            className={styles.logoLoop}
          />
        </div>
      </div>
    </section>
  );
}
