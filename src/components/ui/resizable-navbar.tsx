"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import NextImage from "next/image";
import { Sora } from "next/font/google";
import { cn } from "@/src/lib/utils";
import {
  IconBriefcase2,
  IconMail,
  IconMenu2,
  IconStack2,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INTERFACES ---

const navFont = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

const defaultNavItems = [
  { name: "Soluções", link: "#solucoes" },
  { name: "Sobre", link: "#sobre" },
  { name: "Time", link: "#time" },
  { name: "Contato", link: "#contato" },
];

const mobileNavItems = [
  { name: "Soluções", link: "#solucoes", icon: IconStack2 },
  { name: "Sobre", link: "#sobre", icon: IconBriefcase2 },
  { name: "Time", link: "#time", icon: IconUsers },
  { name: "Contato", link: "#contato", icon: IconMail },
];

// --- COMPONENTE PAI (CONTROLLER) ---

export const Navbar = ({ children, className }: NavbarProps) => {
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const previousScrollY = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    const directionThreshold = 12;
    const mobileQuery = window.matchMedia("(max-width: 1023px)");

    const updateViewport = () => {
      const matchesMobile = mobileQuery.matches;

      setIsMobile(matchesMobile);

      if (matchesMobile) {
        hiddenRef.current = false;
        setHidden(false);
      }
    };

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const previous = previousScrollY.current;
      const delta = currentScrollY - previous;

      setVisible(currentScrollY > 40);

      if (mobileQuery.matches || currentScrollY <= 40) {
        hiddenRef.current = false;
        setHidden(false);
      } else if (delta > directionThreshold && !hiddenRef.current) {
        hiddenRef.current = true;
        setHidden(true);
      } else if (delta < -directionThreshold && hiddenRef.current) {
        hiddenRef.current = false;
        setHidden(false);
      }

      previousScrollY.current = currentScrollY;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNavbar);
    };

    updateViewport();
    updateNavbar();
    mobileQuery.addEventListener("change", updateViewport);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mobileQuery.removeEventListener("change", updateViewport);
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const navbarContent = (
    <motion.div
      animate={{
        y: isMobile ? 0 : hidden ? -96 : visible ? 16 : 0,
        opacity: isMobile ? 1 : hidden ? 0.92 : 1,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
            child as React.ReactElement<{ visible?: boolean }>,
            { visible }
          )
          : child
      )}
    </motion.div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(navbarContent, document.body);
};

// --- COMPONENTES DESKTOP ---

export const NavBody = ({ children, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(0px)",
        backgroundColor: visible ? "rgba(109, 76, 255, 0.18)" : "rgba(255, 255, 255, 0)",
        borderColor: visible ? "rgba(159, 140, 255, 0.42)" : "rgba(255, 255, 255, 0)",
        boxShadow: visible ? "0 10px 34px rgba(109, 76, 255, 0.22)" : "none",
        width: visible ? "68%" : "100%",
      }}
      style={{
        WebkitBackdropFilter: visible ? "blur(14px)" : "blur(0px)",
        borderStyle: "solid",
        borderWidth: 1,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 25 }}
      className="relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full px-8 py-3 lg:flex"
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-8 text-sm font-medium lg:flex",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={`link-${idx}`}
          href={item.link}
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 transition-colors duration-300 text-[#E9E4FF] hover:text-[#9F8CFF]"
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-[#6D4CFF]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

// --- COMPONENTES MOBILE ---

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(14px)" : "blur(24px)",
        backgroundColor: visible ? "rgba(24, 23, 23, 0.69)" : "rgb(12, 12, 12)",
        borderColor: visible ? "rgba(159, 140, 255, 0.48)" : "rgba(18, 18, 19, 0.91)",
        boxShadow: visible ? "0 10px 34px rgba(109, 76, 255, 0.26)" : "0 8px 24px rgba(12, 12, 12, 0.88)",
        width: visible ? "92%" : "100%",
        borderRadius: visible ? "20px" : "20px",
        y: visible ? 10 : 0,
      }}
      style={{
        WebkitBackdropFilter: visible ? "blur(0px)" : "blur(0px)",
        borderStyle: "solid",
        borderWidth: 1,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-4 py-4 lg:hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between px-2 py-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button onClick={onClick} className="p-2 text-white focus:outline-none">
      {isOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
    </button>
  );
};

export const MobileNavMenu = ({
  children,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={cn(
            "flex w-full flex-col items-center gap-4 overflow-hidden px-2 py-6",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- ELEMENTOS DE BRANDING E BOTÃO ---

export const NavbarLogo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center">
      <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-[#c5a07f] via-[#e2d1c1] to-[#c5a07f] bg-clip-text text-transparent">
        FELLOW
      </span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"a">) => {
  return (
    <a
      href={href}
      className={cn(
        "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
        "border border-[#9F8CFF]/40 bg-[#7B61FF]/20 text-[#E9E4FF] hover:bg-[#6D4CFF]/35 hover:text-[#9F8CFF] hover:border-[#9F8CFF]/70 hover:scale-105 active:scale-95 shadow-lg shadow-[#6D4CFF]/20",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export const FellowNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <Navbar className={cn("px-4 pt-4", navFont.className)}>
<NavBody >
  <a
    className="inline-flex items-center gap-3 no-underline transition-transform duration-300 hover:scale-[1.03]"
    href="#inicio"
  >
    <NextImage
      src="/assets/felloww-logo.png"
      alt="Logotipo Grupo Fellow"
      width={60}
      height={60}
      priority
      className="object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
    />

    <span className="text-base font-bold tracking-[0.05em] bg-gradient-to-r from-white  to-white bg-clip-text text-transparent">
      Grupo Fellow
    </span>
  </a>

  {/* Itens do Menu Centralizados */}
  <NavItems items={defaultNavItems} />

  {/* Botão de Call-to-Action à Direita */}
  <div className="relative z-20 ml-auto">
    <NavbarButton
      href="#contato"
      className="border-[#9F8CFF]/35 bg-[#7B61FF]/15 text-[#E9E4FF] backdrop-blur-md hover:bg-[#6D4CFF]/30 hover:text-[#9F8CFF] hover:border-[#9F8CFF]/70 transition-all duration-300 shadow-[0_10px_30px_rgba(109,76,255,0.22)] hover:shadow-[0_14px_40px_rgba(109,76,255,0.34)]"
    >
      Fale com a equipe
    </NavbarButton>
  </div>
</NavBody>


      <MobileNav>
        <MobileNavHeader>
          <a
            className="inline-flex items-center gap-3 no-underline transition-transform hover:scale-[1.02]"
            href="#inicio"
            onClick={closeMobileMenu}
          >
            <NextImage
              src="/assets/felloww-logo.png"
              alt="Logotipo Grupo Fellow"
              width={52}
              height={52}
              className="object-contain"
            />
            <span className="text-base font-bold tracking-[0.03em] bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
              Grupo Fellow
            </span>
          </a>

          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          className="mt-4 w-full"
        >
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
              key={item.name}
              href={item.link}
              onClick={closeMobileMenu}
              className="flex w-full items-center justify-start gap-3 rounded-2xl border border-transparent px-4 py-3 text-left text-base font-semibold text-[#E9E4FF] no-underline transition-all duration-300 hover:border-[#9F8CFF]/45 hover:bg-[#6D4CFF]/20 hover:text-[#9F8CFF]"
            >
              <span className="text-[#9F8CFF]">
                <Icon size={18} />
              </span>
              <span>{item.name}</span>
            </a>
            );
          })}

          <div className="mt-3 flex w-full justify-center">
            <NavbarButton
              href="#contato"
              onClick={closeMobileMenu}
             className="border-[#9F8CFF]/35 bg-[#7B61FF]/15 text-[#E9E4FF] backdrop-blur-md hover:bg-[#6D4CFF]/30 hover:text-[#9F8CFF] hover:border-[#9F8CFF]/70 transition-all duration-300 shadow-[0_10px_30px_rgba(109,76,255,0.22)] hover:shadow-[0_14px_40px_rgba(109,76,255,0.34)]"
            >
              Fale com a equipe
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar >
  );
};
