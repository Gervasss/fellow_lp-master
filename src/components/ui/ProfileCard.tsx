"use client";

import React, { useEffect, useRef, useCallback, useMemo, useState } from "react";
import styles from "./ProfileCard.module.css";

/* Tipos auxiliares (sem any) */
interface DeviceMotionEventConstructor {
  new (...args: unknown[]): DeviceMotionEvent;
  requestPermission?: () => Promise<"granted" | "denied">;
}
interface DeviceOrientationEventConstructor {
  new (...args: unknown[]): DeviceOrientationEvent;
  requestPermission?: () => Promise<"granted" | "denied">;
}
declare global {
  interface Window {
    DeviceMotionEvent?: DeviceMotionEventConstructor;
    DeviceOrientationEvent?: DeviceOrientationEventConstructor;
  }
}

type CSSVars = React.CSSProperties & Record<string, string | number | undefined>;

export interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  behindGlowEnabled?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableHoloEffects?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  description?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
  cardBackground?: string;
  neonBorderColor?: string;
  cardBackdropFilter?: string;
  nameColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  avatarBlendMode?: React.CSSProperties["mixBlendMode"];
  avatarZIndex?: number;
  avatarFilter?: string;
}

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg, #60496e8c 0%, #71c4ff44 100%)";

const ANIMATION = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
} as const;

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, p = 3) => parseFloat(v.toFixed(p));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  behindGlowEnabled,
  className = "",
  enableTilt = true,
  enableHoloEffects = false,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Nome Sobrenome",
  title = "Área de atuação",
  description,
  handle = "usuario",
  status = "Online",
  contactText = "Contato",
  showUserInfo = true,
  onContactClick,
  cardBackground = "#77777c7c",
  neonBorderColor = "#7B61FF",
  cardBackdropFilter = "blur(22px) saturate(1.35)",
  nameColor = "#351066",
  titleColor = "#1b0b33",
  descriptionColor = "rgba(255, 255, 255, 0.68)",
  avatarBlendMode = "normal",
  avatarZIndex = 4,
  avatarFilter = "drop-shadow(0 22px 34px rgba(0, 0, 0, 0.42)) drop-shadow(0 4px 12px rgba(123, 97, 255, 0.18))",
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId: number | null = null;

    const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const vars: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };
      for (const [k, v] of Object.entries(vars)) wrap.style.setProperty(k, v);
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const loop = (t: number) => {
        const progress = clamp((t - startTime) / duration);
        const eased = easeInOutCubic(progress);
        const x = adjust(eased, 0, 1, startX, targetX);
        const y = adjust(eased, 0, 1, startY, targetY);
        updateCardTransform(x, y, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId != null) cancelAnimationFrame(rafId);
        rafId = null;
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - rect.left, e.clientY - rect.top, card, wrap);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    setActive(true);
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (e: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      animationHandlers.createSmoothAnimation(
        ANIMATION.SMOOTH_DURATION,
        e.offsetX,
        e.offsetY,
        card,
        wrap
      );
      setActive(false);
    },
    [animationHandlers]
  );

  // (opcional) Tilt por giroscópio — só funciona via HTTPS com permissão
  useEffect(() => {
    if (!enableTilt || !enableMobileTilt || !animationHandlers) return;
    const handler = (e: DeviceOrientationEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap) return;
      const { beta, gamma } = e;
      if (beta == null || gamma == null) return;
      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 + (beta - ANIMATION.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    };

    const OrientationCtor = window.DeviceOrientationEvent;
    const bind = async () => {
      try {
        if (OrientationCtor?.requestPermission && location.protocol === "https:") {
          const state = await OrientationCtor.requestPermission();
          if (state === "granted") window.addEventListener("deviceorientation", handler);
        } else {
          window.addEventListener("deviceorientation", handler);
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
      }
    };
    void bind();

    return () => window.removeEventListener("deviceorientation", handler);
  }, [enableTilt, enableMobileTilt, mobileTiltSensitivity, animationHandlers]);

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;

    const pm = (e: Event) => handlePointerMove(e as PointerEvent);
    const pe = () => handlePointerEnter();
    const pl = (e: Event) => handlePointerLeave(e as PointerEvent);

    card.addEventListener("pointerenter", pe);
    card.addEventListener("pointermove", pm);
    card.addEventListener("pointerleave", pl);

    // posição inicial animada
    const initX = wrap.clientWidth - ANIMATION.INITIAL_X_OFFSET;
    const initY = ANIMATION.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(initX, initY, card, wrap);
    animationHandlers.createSmoothAnimation(ANIMATION.INITIAL_DURATION, initX, initY, card, wrap);

    return () => {
      card.removeEventListener("pointerenter", pe);
      card.removeEventListener("pointermove", pm);
      card.removeEventListener("pointerleave", pl);
      animationHandlers.cancelAnimation();
    };
  }, [enableTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  const cardStyle = useMemo<CSSVars>(
    () => ({
      "--icon": iconUrl ? `url(${iconUrl})` : "none",
      "--grain": grainUrl ? `url(${grainUrl})` : "none",
      "--behind-gradient": (behindGlowEnabled ?? showBehindGradient) ? behindGradient ?? DEFAULT_BEHIND_GRADIENT : "none",
      "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      "--card-background": cardBackground,
      "--neon-border-color": neonBorderColor,
      "--card-backdrop-filter": cardBackdropFilter,
      "--name-color": nameColor,
      "--title-color": titleColor,
      "--description-color": descriptionColor,
      "--avatar-blend-mode": avatarBlendMode,
      "--avatar-z-index": avatarZIndex,
      "--avatar-filter": avatarFilter,
    }),
    [
      iconUrl,
      grainUrl,
      showBehindGradient,
      behindGlowEnabled,
      behindGradient,
      innerGradient,
      cardBackground,
      neonBorderColor,
      cardBackdropFilter,
      nameColor,
      titleColor,
      descriptionColor,
      avatarBlendMode,
      avatarZIndex,
      avatarFilter,
    ]
  );

  return (
    <div
      ref={wrapRef}
      className={`${styles["pc-card-wrapper"]} ${className}`.trim()}
      style={cardStyle}
      data-active={active}
    >
      <section
        ref={cardRef}
        className={styles["pc-card"]}
        data-active={active}
        data-holo={enableHoloEffects}
      >
        <div className={styles["pc-inside"]}>
          <div className={styles["pc-shine"]} />
          <div className={styles["pc-glare"]} />

          <div className={`${styles["pc-content"]} ${styles["pc-avatar-content"]}`}>
            <img
              className={styles.avatar}
              src={avatarUrl}
              alt={`${name} avatar`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {showUserInfo && (
              <div className={styles["pc-user-info"]}>
                <div className={styles["pc-user-details"]}>
                  <div className={styles["pc-mini-avatar"]}>
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name} mini avatar`}
                      loading="lazy"
                      onError={(e) => {
                        const t = e.currentTarget;
                        t.style.opacity = "0.5";
                        t.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className={styles["pc-user-text"]}>
                    <div className={styles["pc-handle"]}>@{handle}</div>
                    <div className={styles["pc-status"]}>{status}</div>
                  </div>
                </div>
                {/* O botão de contato é opcional e só aparece se a função de clique for fornecida 
                 <button
                  className={styles["pc-contact"]}
                  type="button"
                  onClick={onContactClick}
                  aria-label={`Contato ${name}`}
                >
                  {contactText}
                </button>
                
                
                */}
               
              </div>
            )}
          </div>

          <div className={styles["pc-content"]}>
            <div className={styles["pc-details"]}>
              <h3>{name}</h3>
              <p>{title}</p>
              {description ? <span>{description}</span> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(ProfileCard);
