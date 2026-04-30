"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sora } from "next/font/google";
import { useRouter } from "next/router";
import {
    IconBriefcase2,
    IconMail,
    IconMessageCircle,
    IconStack2,
    IconUsers,
} from "@tabler/icons-react";
import styles from "./navbar.module.css";

const navFont = Sora({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const navItems = [
    { name: "Soluções", href: "#servicos", icon: IconStack2 },
    { name: "Sobre", href: "#sobre", icon: IconBriefcase2 },
    { name: "Time", href: "#time", icon: IconUsers },
    { name: "Contato", href: "#contato", icon: IconMail },
];

const WHATSAPP_URL = "https://wa.me/5571996418877";

const Navbar: React.FC = () => {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [preloaderFinished, setPreloaderFinished] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (router.pathname !== "/") return;

        const handlePreloaderComplete = () => {
            setPreloaderFinished(true);
        };

        window.addEventListener("hero:preloader-complete", handlePreloaderComplete);

        return () => {
            window.removeEventListener("hero:preloader-complete", handlePreloaderComplete);
        };
    }, [router.pathname]);

    const closeMenu = () => setMenuOpen(false);
    const shouldHideForPreloader = router.pathname === "/" && !preloaderFinished;

    return (
        <nav
            className={`${styles.navbar} ${navFont.className} ${scrolled ? styles.scrolled : ""} ${shouldHideForPreloader ? styles.preloading : ""}`}
            aria-label="Navegação principal"
        >
            <div className={styles.navbarStart}>
                {/* Mobile começa aqui */}
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
                        className={styles.logo}
                        priority
                    />
                    <span>Grupo Fellow</span>
                </a>
            </div>

            {/* Menu mobile começa aqui */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <a key={item.name} href={item.href} onClick={closeMenu}>
                            <Icon size={18} stroke={1.8} />
                            {item.name}
                        </a>
                    );
                })}

                <a
                    className={styles.mobileCta}
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                >
                    <IconMessageCircle size={18} stroke={1.8} />
                    Fale com a equipe
                </a>
            </div>

            {/* Desktop começa aqui */}
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
