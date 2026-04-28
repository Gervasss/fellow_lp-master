"use client";

import React, {
  CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as math from "mathjs";

/* Se quiser usar CSS Module, reative e aplique as classes:
// import styles from "./GradualBlur.module.css";
*/

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
type Target = "parent" | "page";
type PresetName =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "subtle"
  | "intense"
  | "smooth"
  | "sharp"
  | "header"
  | "footer"
  | "sidebar"
  | "page-header"
  | "page-footer";

export type GradualBlurProps = {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: Curve;
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
  preset?: PresetName;
  gpuOptimized?: boolean;
  hoverIntensity?: number;
  target?: Target;
  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
};

const DEFAULT_CONFIG: Required<Pick<
  GradualBlurProps,
  | "position"
  | "strength"
  | "height"
  | "divCount"
  | "exponential"
  | "zIndex"
  | "animated"
  | "duration"
  | "easing"
  | "opacity"
  | "curve"
  | "responsive"
  | "target"
  | "className"
  | "style"
>> = {
  position: "bottom",
  strength: 2,
  height: "6rem",
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: "0.3s",
  easing: "ease-out",
  opacity: 1,
  curve: "linear",
  responsive: false,
  target: "parent",
  className: "",
  style: {},
};

const PRESETS: Record<PresetName, Partial<GradualBlurProps>> = {
  top: { position: "top", height: "6rem" },
  bottom: { position: "bottom", height: "6rem" },
  left: { position: "left", height: "6rem" },
  right: { position: "right", height: "6rem" },
  subtle: { height: "4rem", strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: "10rem", strength: 4, divCount: 8, exponential: true },
  smooth: { height: "8rem", curve: "bezier", divCount: 10 },
  sharp: { height: "5rem", curve: "linear", divCount: 4 },
  header: { position: "top", height: "8rem", curve: "ease-out" },
  footer: { position: "bottom", height: "8rem", curve: "ease-out" },
  sidebar: { position: "left", height: "6rem", strength: 2.5 },
  "page-header": { position: "top", height: "10rem", target: "page", strength: 3 },
  "page-footer": { position: "bottom", height: "10rem", target: "page", strength: 3 },
};

const CURVE_FUNCTIONS: Record<Curve, (p: number) => number> = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  "ease-in": (p) => p * p,
  "ease-out": (p) => 1 - Math.pow(1 - p, 2),
  "ease-in-out": (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
};

const GRADUAL_BLUR_STYLES =
  `.gradual-blur{pointer-events:none;transition:opacity 0.3s ease-out}.gradual-blur-inner{pointer-events:none}`;

const mergeConfigs = (
  ...configs: Partial<GradualBlurProps>[]
): Partial<GradualBlurProps> => configs.reduce((acc, c) => ({ ...acc, ...c }), {});

const getGradientDirection = (position?: Position): string => {
  const directions: Record<Position, string> = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };
  return position ? directions[position] : "to bottom";
};

const debounce = <T extends (...a: unknown[]) => void>(fn: T, wait: number) => {
  let t: ReturnType<typeof setTimeout>;
  return (...a: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};

/** Apenas para keys dimensionais */
type DimKey = "height" | "width";
type Breakpoint = "mobile" | "tablet" | "desktop";
const responsivePropKey = (bp: Breakpoint, key: DimKey) =>
  (`${bp}${key === "height" ? "Height" : "Width"}` as keyof GradualBlurProps);

function useResponsiveDimension(
  responsive: boolean | undefined,
  config: Partial<GradualBlurProps>,
  key: DimKey
): string | undefined {
  const initial = (config[key] as string | undefined) ?? undefined;
  const [val, setVal] = useState<string | undefined>(initial);

  useEffect(() => {
    if (!responsive) return;

    const calc = () => {
      const w = window.innerWidth;
      let v: string | undefined = config[key] as string | undefined;

      if (w <= 480) {
        const k = responsivePropKey("mobile", key);
        v = (config[k] as string | undefined) ?? v;
      } else if (w <= 768) {
        const k = responsivePropKey("tablet", key);
        v = (config[k] as string | undefined) ?? v;
      } else if (w <= 1024) {
        const k = responsivePropKey("desktop", key);
        v = (config[k] as string | undefined) ?? v;
      }

      setVal(v);
    };

    const deb = debounce(calc, 100);
    calc();
    window.addEventListener("resize", deb);
    return () => window.removeEventListener("resize", deb);
  }, [responsive, config, key]);

  return responsive ? val : (config[key] as string | undefined);
}

function useIntersectionObserver(
  ref: React.RefObject<HTMLDivElement | null>,
  shouldObserve: boolean = false
) {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
}

const GradualBlurBase: React.FC<PropsWithChildren<GradualBlurProps>> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const styleId = "gradual-blur-styles";

    if (document.getElementById(styleId)) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = GRADUAL_BLUR_STYLES;
    document.head.appendChild(styleElement);
  }, []);

  const config = useMemo(() => {
    const presetConfig =
      props.preset ? PRESETS[props.preset] ?? {} : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as Required<GradualBlurProps>;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(config.responsive, config, "height");
  const responsiveWidth = useResponsiveDimension(config.responsive, config, "width");

  const isVisible = useIntersectionObserver(
    containerRef,
    config.animated === "scroll"
  );

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity
        ? config.strength * config.hoverIntensity
        : config.strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve];

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Number(math.pow(2, progress * 4)) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength;
      }

      const p1 = math.round((increment * i - increment) * 10) / 10;
      const p2 = math.round(increment * i * 10) / 10;
      const p3 = math.round((increment * i + increment) * 10) / 10;
      const p4 = math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      const divStyle: CSSProperties = {
        position: "absolute",
        inset: "0",
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== "scroll"
            ? (`backdrop-filter ${config.duration} ${config.easing}` as CSSProperties["transition"])
            : undefined,
      };

      divs.push(<div key={i} style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = config.position === "top" || config.position === "bottom";
    const isHorizontal = config.position === "left" || config.position === "right";
    const isPageTarget = config.target === "page";

    const baseStyle: CSSProperties = {
      position: isPageTarget ? "fixed" : "absolute",
      pointerEvents: config.hoverIntensity ? "auto" : "none",
      opacity: isVisible ? 1 : 0,
      transition: config.animated
        ? (`opacity ${config.duration} ${config.easing}` as CSSProperties["transition"])
        : undefined,
      zIndex: isPageTarget ? (config.zIndex ?? 0) + 100 : config.zIndex,
      ...config.style,
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || "100%";
      if (config.position === "top") baseStyle.top = 0;
      if (config.position === "bottom") baseStyle.bottom = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = "100%";
      if (config.position === "left") baseStyle.left = 0;
      if (config.position === "right") baseStyle.right = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  useEffect(() => {
    if (isVisible && config.animated === "scroll" && config.onAnimationComplete) {
      const ms = Number.isNaN(parseFloat(config.duration))
        ? 300
        : parseFloat(config.duration) * 1000;
      const t = setTimeout(() => config.onAnimationComplete?.(), ms);
      return () => clearTimeout(t);
    }
    return;
  }, [isVisible, config]);

  const classes = [
    "gradual-blur",
    config.target === "page" ? "gradual-blur-page" : "gradual-blur-parent",
    config.className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className={classes}
      style={containerStyle}
      onMouseEnter={config.hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={config.hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div
        className="gradual-blur-inner"
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {blurDivs}
      </div>
    </div>
  );
};

/** Exporta com estáticos sem usar `as any` */
const GradualBlur = Object.assign(React.memo(GradualBlurBase), {
  PRESETS,
  CURVE_FUNCTIONS,
});
GradualBlur.displayName = "GradualBlur";

export default GradualBlur;

/* Injeta CSS mínimo necessário (classes globais utilizadas acima) */
