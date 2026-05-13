"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sora } from "next/font/google";
import styles from "./navbar.module.css";

const navFont = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const navItems = [
    { name: "Soluções", href: "#servicos" },
    { name: "Sobre", href: "#sobre" },
    { name: "Time", href: "#time" },
    { name: "Contato", href: "#contato" },
];

const WHATSAPP_URL = "https://wa.me/5571996418877";

const Navbar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let frame = 0;

        const handleScroll = () => {
            if (frame) return;

            frame = window.requestAnimationFrame(() => {
                navRef.current?.classList.toggle(styles.scrolled, window.scrollY > 50);
                frame = 0;
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav
            ref={navRef}
            className={`${styles.navbar} ${navFont.className}`}
            aria-label="Navegação principal"
        >
            <div className={styles.navbarStart}>
                <button
                    type="button"
                    className={styles.mobileToggle}
                    onClick={() => setMenuOpen((current) => !current)}
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <a href="#inicio" className={styles.brand} onClick={closeMenu}>
                    <Image
                        src="/assets/felloww-logo.png"
                        alt="Logotipo Grupo Fellow"
                        width={42}
                        height={42}
                        sizes="42px"
                        className={styles.logo}
                        loading="eager"
                        decoding="async"
                    />
                    <span>Grupo Fellow</span>
                </a>
            </div>

            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
                {navItems.map((item) => (
                    <a key={item.name} href={item.href} onClick={closeMenu}>
                        {item.name}
                    </a>
                ))}

                <a
                    className={styles.mobileCta}
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                >
                    Fale com a equipe
                </a>
            </div>

            <div className={styles.navbarCenter}>
                <ul className={styles.desktopMenu}>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a href={item.href}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.navbarEnd}>
                <a className={styles.cta} href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    Fale com a equipe
                </a>
            </div>
        </nav>
    );
};

export const FellowNavbar = Navbar;

export default Navbar;
