
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sora } from 'next/font/google';
import { 
  FaLinkedin,
  FaInstagram, 
  FaEnvelope, 
  FaPhoneAlt,
  FaMapMarkerAlt 
} from 'react-icons/fa';
import styles from './FooterSection.module.css';

const footerFont = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const data = {
  instaLink: 'https://www.instagram.com/grupofellow/',
  linkedinLink: 'https://www.linkedin.com/company/grupo-fellow/posts/?feedView=all',
  services: [
    { text: 'Fellow Pay', href: '#servicos' },
    { text: 'Fellow Core', href: '#servicos' },
    { text: 'Fellow Ticket', href: '#servicos' },
    { text: 'Fellow AI', href: '#servicos' },
  ],
  about: [
    { text: 'Sobre', href: '#sobre' },
    { text: 'Serviços', href: '#servicos' },
    { text: 'Time', href: '#time' },
  ],
  help: [
    { text: 'Contato', href: '#contato', hasIndicator: true },
  ],
  contact: {
    email: 'contato@grupofellow.com.br',
    phone: '+55 71 99641-8877',
    address: 'Caminho das Árvores, Salvador - BA',
  },
  company: {
    name: 'Grupo Fellow',
    description: 'Infraestrutura digital para centralizar, simplificar e escalar operações com alta disponibilidade.',
    logo: '/assets/felloww-logo.png',
  },
};

const socialLinks = [
  { icon: FaLinkedin, label: 'LinkedIn', href: data.linkedinLink },
  { icon: FaInstagram, label: 'Instagram', href: data.instaLink },
];

export default function FooterSection() {
  return (
    <footer className={`${styles.footerContainer} ${footerFont.className}`}>
      <div className={styles.footerWrapper}>
        <div className={styles.mainGrid}>
          
          {/* Brand & Social */}
          <div>
            <div className={styles.brandSection}>
              <Image
                src={data.company.logo}
                alt="Logo Grupo Fellow"
                className={styles.logo}
                width={40}
                height={40}
                sizes="40px"
              />
              <span className={styles.poweredBy}>
                Powered by <span>Grupo Fellow</span>
              </span>
            </div>
            <p className={styles.description}>{data.company.description}</p>
            <ul className={styles.socialList}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link href={href} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                    <span className="sr-only">{label}</span>
                    <Icon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links Grid */}
          <div className={styles.linksGrid}>
            <div className="text-center sm:text-left">
              <p className={styles.columnTitle}>Empresa</p>
              <ul className={styles.list}>
                {data.about.map((item) => (
                  <li key={item.text}>
                    <Link href={item.href} className={styles.navLink}>{item.text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className={styles.columnTitle}>Soluções</p>
              <ul className={styles.list}>
                {data.services.map((item) => (
                  <li key={item.text}>
                    <Link href={item.href} className={styles.navLink}>{item.text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className={styles.columnTitle}>Links</p>
              <ul className={styles.list}>
                {data.help.map((item) => (
                  <li key={item.text}>
                    <Link href={item.href} className={item.hasIndicator ? styles.contactItem : styles.navLink}>
                      <span className={styles.navLink}>{item.text}</span>
                      {item.hasIndicator && (
                        <span className={styles.ping}>
                          <span className={styles.pingDot}></span>
                          <span className={styles.pingCircle}></span>
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className={styles.columnTitle}>Contato</p>
              <ul className={styles.list}>
                <li>
                  <a href={`mailto:${data.contact.email}`} className={styles.contactItem}>
                    <FaEnvelope className={styles.contactIcon} />
                    <span className={`${styles.navLink} ${styles.emailText}`}>{data.contact.email}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${data.contact.phone}`} className={styles.contactItem}>
                    <FaPhoneAlt className={styles.contactIcon} />
                    <span className={styles.navLink}>{data.contact.phone}</span>
                  </a>
                </li>
                <li>
                  <div className={styles.contactItem}>
                    <FaMapMarkerAlt className={styles.contactIcon} />
                    <address className={`${styles.navLink} not-italic`}>{data.contact.address}</address>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <p className="text-sm">Todos os direitos reservados.</p>
            <p className={`${styles.navLink} text-sm`}>
              &copy; {new Date().getFullYear()} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
