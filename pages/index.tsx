import AllSections from "@/src/components/AllSections/AllSections";
import Head from "next/head";
import Script from "next/script";

const SITE_URL = "https://fellow-lp-master.vercel.app/";
const OG_IMAGE_URL = `${SITE_URL}/assets/fellow-banner.jpg`;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function HomePage() {
    return (
        <>
            <Head>
                {/* Título: Foco em Infraestrutura e Operações Críticas */}
                <title>Grupo Fellow | Infraestrutura Digital e Tecnologia de Alta Disponibilidade</title>

                {/* Meta description: Baseada no novo posicionamento de "epicentro financeiro" */}
                <meta
                    name="description"
                    content="O Grupo Fellow provê infraestrutura digital para operações financeiras e gestão tecnológica de eventos. Soluções de alta disponibilidade, escalabilidade e licenciamento de softwares customizáveis."
                />

                {/* Keywords: Termos mais técnicos e de maior valor agregado */}
                <meta
                    name="keywords"
                    content="Grupo Fellow, Infraestrutura Digital, Gestão de Eventos, Operações Financeiras, Alta Disponibilidade, Licenciamento de Software, Software Customizável, Tecnologia para Eventos, Fintech Infrastructure"
                />

                <meta name="author" content="Grupo Fellow" />
                <meta name="robots" content="index, follow" />

                <link rel="canonical" href={SITE_URL} />

                {/* Open Graph (Social Media) */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={SITE_URL} />
                <meta property="og:title" content="Grupo Fellow | Tecnologia para Operações de Alta Disponibilidade" />
                <meta
                    property="og:description"
                    content="Centralizando e escalando negócios com infraestrutura digital robusta e tolerância zero a falhas. Conheça o ecossistema Fellow."
                />
                
                <meta property="og:image" content={OG_IMAGE_URL} />
                <meta property="og:image:secure_url" content={OG_IMAGE_URL} />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Infraestrutura Digital Grupo Fellow" />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:site_name" content="Grupo Fellow" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Grupo Fellow | Infraestrutura e Software Estratégico" />
                <meta name="twitter:image" content={OG_IMAGE_URL} />

                <link rel="icon" type="image/jpg" href="/assets/fellow-logo.jpg"  />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            {GA_MEASUREMENT_ID ? (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    />
                    <Script
                        id="google-analytics"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${GA_MEASUREMENT_ID}');
                            `,
                        }}
                    />
                </>
            ) : null}

            {/* Structured Data: Ajustado para "Corporation" (mais autoridade) */}
            <Script
                id="schema-org-organization"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Corporation",
                        "name": "Grupo Fellow",
                        "description": "Provedora de infraestrutura digital e licenciamento de softwares para operações financeiras e eventos de larga escala.",
                        "url": SITE_URL,
                        "logo": OG_IMAGE_URL,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Vitória da Conquista",
                            "addressRegion": "BA",
                            "addressCountry": "BR"
                        },
                        "knowsAbout": [
                            "Infraestrutura Digital",
                            "SaaS - Software as a Service",
                            "Sistemas de Alta Disponibilidade",
                            "Tecnologia Financeira",
                            "Gestão de Eventos"
                        ],
                        "sameAs": [
                            "https://www.instagram.com/grupofellow/"
                        ]
                    })
                }}
            />

            <main>
                <AllSections />
            </main>
        </>
    );
}

export async function getStaticProps() {
    return {
        props: {},
        revalidate: 60 * 60 * 24,
    };
}

export default HomePage;
