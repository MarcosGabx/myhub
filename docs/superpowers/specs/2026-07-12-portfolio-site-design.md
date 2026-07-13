# Portfólio de Marcos Guedes — Design

## Objetivo

Site estático de página única para expor projetos de desenvolvimento (landing pages, sistemas, ferramentas de gerenciamento e integrações), com contato direto via WhatsApp.

## Stack

HTML/CSS/JS puro, sem build step, sem dependências externas. Hospedável em qualquer serviço estático (GitHub Pages, Netlify, Vercel).

## Estrutura de arquivos

```
mywebsites/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── projects.js      # array de dados dos projetos
│   └── script.js        # filtro de categorias, renderização de cards, menu mobile, scroll suave
└── assets/
    └── placeholder.png  # imagem placeholder dos projetos
```

## Seções da página

1. **Header** — fixo, com nome/logo, menu de navegação (âncoras para as seções) e link de WhatsApp. Vira menu hambúrguer em mobile.
2. **Hero** — nome, tagline/cargo, breve frase de apresentação, botão CTA para WhatsApp.
3. **Sobre** — bio curta e stack/tecnologias que Marcos domina.
4. **Projetos** — grid de cards filtrável por categoria: Landing Pages, Sistemas, Ferramentas de Gerenciamento, Integrações. Botões de filtro acima do grid; categoria ativa destacada visualmente. Filtragem via JS, sem reload de página.
5. **Contato** — bloco final com botão de WhatsApp em destaque.
6. **Footer** — informações de rodapé simples (nome, ano, links).
7. **Botão flutuante de WhatsApp** — fixo no canto da tela, visível em todas as seções e em mobile, sem sobrepor conteúdo.

## Modelo de dados dos projetos

Definido em `js/projects.js` como array de objetos:

```js
{
  title: "Nome do Projeto",
  category: "landing" | "sistema" | "ferramenta" | "integracao",
  description: "Breve descrição do que o projeto faz.",
  image: "assets/placeholder.png",
  link: "#",
  tags: ["React", "Node.js"]
}
```

O HTML/CSS não muda ao adicionar/editar projetos — só este array é editado. Popular inicialmente com ~2 projetos placeholder por categoria (8 no total), para Marcos substituir por conteúdo real depois.

## Contato via WhatsApp

Todos os pontos de contato (header, hero, botão flutuante, seção contato) apontam para:

```
https://wa.me/5538984216381?text=Ol%C3%A1%20Marcos%2C%20vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar!
```

Número com código do Brasil (+55) incluído, mensagem pré-preenchida. Sem formulário de contato — apenas o link direto para WhatsApp.

## Estilo visual

Dark tech moderno: fundo escuro, accent color vibrante (verde/azul neon), tipografia sans-serif moderna (ex: Inter ou similar via Google Fonts, com fallback para system fonts).

## Responsividade

Mobile-first. Grid de projetos colapsa para 1 coluna em telas pequenas. Menu do header vira hambúrguer abaixo de um breakpoint definido (ex: 768px). Botão flutuante do WhatsApp permanece acessível e não sobrepõe conteúdo em nenhum tamanho de tela.

## Testagem

Sem lógica de servidor — validação manual/visual:
- Abrir no navegador e conferir renderização de todas as seções.
- Testar filtro de categorias (todos os filtros mostram/escondem os cards corretos).
- Testar responsividade em mobile e desktop.
- Confirmar que todos os links de WhatsApp abrem corretamente com o número e mensagem esperados.

## Fora de escopo

- Formulário de contato (decisão explícita: só WhatsApp).
- Backend, CMS ou build step.
- Múltiplas páginas (tudo em uma única página com âncoras).
- Seções de depoimentos, certificações ou blog.
