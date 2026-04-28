# Grupo Fellow Landing Page

Landing page institucional do Grupo Fellow, construída com Next.js, React, TypeScript, Tailwind CSS 4, CSS Modules, GSAP e Lenis.

O projeto apresenta o ecossistema Fellow com uma experiência visual animada: hero com preloader, navegação responsiva, seções institucionais, serviços, time, contato, CTA de produtos e footer.

## Stack

- Next.js 16 com Pages Router
- React 19
- TypeScript
- Tailwind CSS 4
- CSS Modules por componente
- GSAP e ScrollTrigger para animações
- Lenis para smooth scroll
- Mantine Provider
- `next/font/google` para Sora e Plus Jakarta Sans
- `next/image` para otimização de imagens locais

## Requisitos

- Node.js compatível com Next.js 16
- npm

Instale as dependências:

```bash
npm install
```

## Scripts

```bash
npm run dev
```

Inicia o servidor local em `http://localhost:3000`.

```bash
npm run build
```

Gera o build de produção.

```bash
npm run start
```

Executa a aplicação em modo produção depois do build.

```bash
npm run lint
```

Executa o ESLint.

No Windows, caso o PowerShell bloqueie `npm`, use:

```bash
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

## Estrutura

```text
pages/
  _app.tsx              Provider global, estilos globais e GradualBlur
  _document.tsx         Documento HTML customizado
  index.tsx             Página principal, SEO, schema.org e analytics

src/
  components/
    AllSections/        Composição geral da landing page
    HeroSection/        Hero, preloader e navbar
    AboutSection/       Seção institucional
    ServicesSection/    Produtos/serviços com animações de scroll
    SquadSection/       Cards do time
    ContactSection/     Formulário e informações de contato
    ProductsSection/    CTA de produtos
    FooterSection/      Footer institucional
    ui/                 Componentes reutilizáveis
  styles/
    globals.css         Tailwind, tokens globais e ajustes base
  lib/
    utils.ts            Utilitários compartilhados

public/assets/          Imagens e logos usados na página
```

## Fluxo da página

A composição principal fica em `src/components/AllSections/AllSections.tsx`.

Ordem atual:

1. Hero
2. About
3. Services
4. Squad
5. Contact
6. Subscription CTA
7. Footer

O wrapper `AllSections.module.css` mantém o background escuro compartilhado entre as seções principais. O footer fica fora desse shell para evitar conflitos com `overflow`, `clip-path` e animações do hero.

## Seções e IDs

As âncoras usadas pela navbar e links internos são:

- `#inicio`
- `#sobre`
- `#servicos`
- `#time`
- `#contato`

Ao criar novas seções, mantenha os IDs sincronizados com `src/components/ui/resizable-navbar.tsx` e com o footer.

## Contatos e redes

Os principais links estão distribuídos em:

- Footer: `src/components/FooterSection/FooterSection.tsx`
- Navbar: `src/components/ui/resizable-navbar.tsx`
- Contact section: `src/components/ContactSection/ContactSection.tsx`

O botão "Fale com a equipe" da navbar aponta para o WhatsApp da empresa via `wa.me`.

## SEO e analytics

SEO, Open Graph, Twitter Card, canonical URL, schema.org e Google Analytics ficam em `pages/index.tsx`.

Variável opcional:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Se a variável não estiver definida, os scripts do Google Analytics não são renderizados.

## Imagens

As imagens locais ficam em `public/assets`.

Use `next/image` sempre que possível para imagens de conteúdo ou marca. Imagens referenciadas com caminho absoluto público devem começar com `/assets/...`.

## Animações

O projeto usa GSAP, ScrollTrigger e Lenis.

Cuidados importantes:

- Registre plugins GSAP apenas onde necessário.
- Em componentes com animação, limpe timelines/contexts no retorno do `useEffect` ou `useLayoutEffect`.
- Ao alterar altura, pinning ou ordem das seções, valide a rolagem em desktop e mobile.
- A suavização global de scroll está em `AllSections.tsx`.

## Next.js 16

Este projeto usa Next.js 16. Antes de alterar APIs, estrutura de rotas, imagens, fontes ou configuração do framework, consulte a documentação local em:

```text
node_modules/next/dist/docs/
```

Essa orientação também está registrada em `AGENTS.md`.

## Build e validação

Antes de entregar mudanças, rode:

```bash
npm.cmd run lint
npm.cmd run build
```

O build usa Turbopack via Next.js 16.

## Deploy

O projeto é compatível com Vercel.

Configurações relevantes:

- `next.config.ts` habilita compressão.
- `poweredByHeader` está desativado.
- `reactStrictMode` está ativo.
- Imagens otimizadas para AVIF e WebP.

## Manutenção

- Mantenha textos institucionais e contatos consistentes entre Footer, Navbar e Contact section.
- Evite colocar o footer dentro do container animado do hero.
- Prefira CSS Modules para estilos específicos de componentes.
- Use Tailwind para utilitários pontuais, especialmente em componentes UI já escritos nesse padrão.
- Preserve a paleta escura com acentos roxos do Grupo Fellow.
