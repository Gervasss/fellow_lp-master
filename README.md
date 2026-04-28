
# 🚀 Grupo Fellow Landing Page

Landing page institucional do **Grupo Fellow**, construída com tecnologias de ponta para entregar uma experiência de alta performance e fluidez visual.

O projeto apresenta o ecossistema Fellow através de uma jornada animada: hero com preloader, navegação responsiva, seções institucionais, serviços, time, contato, CTA de produtos e footer.

## 🛠 Stack Tecnológica

* **Framework:** Next.js 16 (Pages Router)
* **Biblioteca UI:** React 19 & Mantine Provider
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS 4 & CSS Modules
* **Animações:** GSAP + ScrollTrigger
* **Experiência de Scroll:** Lenis (Smooth Scroll)
* **Tipografia:** `next/font/google` (Sora e Plus Jakarta Sans)

---

## 📥 Requisitos & Instalação

* **Node.js:** Compatível com Next.js 16
* **Package Manager:** npm

```bash
# Instale as dependências
npm install
```

## ⚙️ Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | 🚀 Inicia o servidor local em `http://localhost:3000` |
| `npm run build` | 🏗️ Gera o build de produção (via Turbopack) |
| `npm run start` | ⚡ Executa a aplicação em modo produção |
| `npm run lint` | 🔍 Executa a verificação do ESLint |

> [!TIP]
> **No Windows (PowerShell):** Caso o acesso seja bloqueado, utilize o prefixo `.cmd` (ex: `npm.cmd run dev`).

---

## 📂 Estrutura de Pastas

```text
pages/
  📄 _app.tsx          # Provider global, estilos e GradualBlur
  📄 _document.tsx     # Documento HTML customizado
  📄 index.tsx         # Página principal, SEO e Analytics

src/
  📁 components/
    📁 AllSections/    # Composição geral da landing page
    📁 HeroSection/    # Hero, preloader e navbar
    📁 ui/             # Componentes de interface reutilizáveis
  📁 styles/           # globals.css e tokens de design
  📁 lib/              # Utilitários (utils.ts)

public/assets/         # 🖼️ Imagens e logos
```

---

## 🌊 Fluxo da Página & IDs

A estrutura segue uma ordem lógica de conversão, gerenciada em `AllSections.tsx`:

1.  🏠 **Hero** (`#inicio`)
2.  🏢 **About** (`#sobre`)
3.  💼 **Services** (`#servicos`)
4.  👥 **Squad** (`#time`)
5.  📩 **Contact** (`#contato`)
6.  🛍️ **Subscription CTA**
7.  🔚 **Footer**

---

## 📈 SEO, Analytics & Imagens

* **SEO:** Open Graph e JSON-LD configurados em `pages/index.tsx`.
* **Analytics:** Para ativar o Google Analytics, configure a variável de ambiente:
    `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
* **Imagens:** Utilize sempre o componente `next/image` para suporte nativo a **AVIF/WebP**.

---

## 🪄 Animações (GSAP & Lenis)

O projeto foca em alta fidelidade visual. Ao dar manutenção:
* ✅ **Limpeza:** Sempre use o retorno do `useEffect` para matar instâncias do GSAP.
* ✅ **Performance:** Registre os plugins (`ScrollTrigger`) apenas onde necessário.
* ✅ **Scroll:** A suavização do Lenis é aplicada globalmente no shell principal.

---

## 🚀 Deploy & Manutenção

* **Plataforma:** Otimizado para **Vercel**.
* **Padronização:** Preserve a paleta escura com acentos roxos característica do Grupo Fellow.
* **Configuração:** `reactStrictMode` ativo e `poweredByHeader` desativado para segurança.

---

**© 2026 Grupo Fellow** - *Tecnologia e Performance.*
