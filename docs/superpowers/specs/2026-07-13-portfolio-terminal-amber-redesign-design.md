# Portfólio de Marcos Guedes — Redesign "Terminal Amber" (v3)

## Objetivo

Substituir a identidade visual atual (fundo quase-preto + verde-água neon + Space Grotesk — reconhecida como um padrão genérico de design gerado por IA) por uma identidade mais específica e opinativa: **Terminal Amber** — uma estética inspirada em terminal/CLI, com paleta âmbar quente e tipografia monoespaçada nos títulos.

Esta spec substitui a direção de cores/tipografia da spec anterior (`2026-07-12-portfolio-visual-redesign-design.md`) e reformata os cards de projeto. **As seções existentes (Header, Hero, Sobre, Projetos, Contato, Footer) continuam as mesmas em conteúdo e significado — muda a pele visual e a estrutura do Hero e dos cards.**

## Processo de decisão

Duas direções completas foram apresentadas em mockup visual (Terminal Amber e Blueprint Schematic). O usuário preferiu a atmosfera geral do Terminal Amber, mas o formato de card estruturado (rótulos + cantos de esquadro) da Blueprint. O resultado final mescla as duas: paleta e Hero do Terminal Amber + formato de card da Blueprint (recolorido em âmbar), com uma miniatura de imagem mantida no topo do card.

## 1. Paleta de cores

Substituição completa das variáveis de cor em `css/style.css`:

| Variável | Valor atual (verde) | Novo valor (âmbar) |
|---|---|---|
| `--bg` | `#0b0f14` | `#0a0908` |
| `--bg-alt` | `#121821` | `#16130f` |
| `--text` | `#e6edf3` | `#f2ece1` |
| `--text-muted` | `#8b949e` | `#8a8175` |
| `--accent` | `#00e6a8` | `#ffb454` |
| `--border` | `#21262d` | `#2a2419` |

Adicionar uma nova variável `--accent-dim: #cc8c34;` (usada em bordas/estados secundários, ex: prompt do terminal, cantos de card).

Todo elemento que hoje referencia `var(--accent)` (bolhas de fundo, botões primários, estado ativo dos filtros, botão flutuante do WhatsApp, links de destaque) recolore automaticamente — não é necessário alterar cada regra individualmente, só as variáveis raiz e os poucos lugares com cor hexadecimal fixa (ex: `rgba(0, 230, 168, ...)` em sombras, que devem virar `rgba(255, 180, 84, ...)`).

## 2. Tipografia

- **Títulos** (`h1, h2, h3, .hero__title, .section__title, .header__logo`, mais o nome dentro do Hero e os títulos dos cards): passam a usar uma pilha de fontes monoespaçadas de sistema — `ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace` — sem depender de fonte externa.
- **Corpo de texto**: continua em Inter (já carregada via Google Fonts).
- A dependência do Google Fonts "Space Grotesk" é removida do `<link>` em `index.html` (volta a carregar só Inter), já que o novo estilo de título não precisa de fonte externa.

## 3. Hero: janela de terminal

O Hero deixa de ser o layout de 2 colunas (texto + mockup de código) da spec anterior e vira uma única "janela de terminal" centralizada:

- Barra de título com 3 bolinhas coloridas (vermelho/amarelo/verde, estilo macOS) e um texto de caminho (`marcos@portfolio — zsh`).
- Corpo do terminal, em fonte monoespaçada:
  - Linha de prompt: `➜ whoami`
  - Nome "Marcos Guedes" em destaque, com um cursor piscando ao lado (bloco sólido na cor de destaque, animação `blink`, respeitando `prefers-reduced-motion: reduce` — sem animação para quem prefere menos movimento).
  - Cargo ("Desenvolvedor Full Stack") na cor de destaque.
  - Descrição atual, formatada como comentário de código (linhas iniciadas por `#`).
  - Botão de contato estilizado como um comando (`$ contact --whatsapp`), linkando para o WhatsApp como antes.
- As duas bolhas decorativas de fundo do Hero (`orb--hero-1`, `orb--hero-2`) permanecem — apenas recolorem para âmbar automaticamente via `var(--accent)`.
- Uma textura sutil de "scanline" (linhas horizontais finas e quase transparentes) é adicionada apenas à seção do Hero, para reforçar a sensação de terminal/CRT, sem se espalhar pelo resto do site.

## 4. Cards de projeto

Novo formato, combinando o card estruturado da Blueprint com uma miniatura de imagem:

- Miniatura de imagem no topo do card (mantém `project.image`, hoje `assets/placeholder.svg`), como já existia.
- Cantos de esquadro (pequenos brackets em L nas 4 pontas do card, na cor de destaque) em vez da borda simples atual.
- Rótulo `CAT · <categoria>` acima do título, em monoespaçada, maiúsculo, com leve espaçamento entre letras.
- Título do projeto em monoespaçada (antes estava na fonte de título padrão).
- Descrição do projeto, sem alteração de conteúdo.
- Linha `STACK · <tag1> / <tag2> / <tag3>` no rodapé do card, substituindo a lista de badges `.tag` atual — mesmas tags, formato textual em vez de pills.
- O ícone SVG de categoria (adicionado na spec anterior) é removido — o rótulo `CAT` já comunica a categoria.
- O link "Ver projeto →" permanece.

## 5. Demais seções (Sobre, Contato, Footer, Header, menu mobile, filtros)

Sem mudança estrutural ou de conteúdo — apenas herdam a nova paleta âmbar e a tipografia monoespaçada nos títulos/labels. Especificamente:

- Botões de filtro de categoria mantêm o texto atual em português ("Todos", "Landing Pages", "Sistemas", "Ferramentas", "Integrações") — **não** viram estilo de flag de comando.
- Tags de tecnologia na seção Sobre (`.tag`) continuam como pills, apenas recoloridas.
- Botão flutuante do WhatsApp, header, footer: mesma estrutura, nova cor.

## Fora de escopo

- Qualquer mudança de conteúdo, categorias de projeto, ou no link/número do WhatsApp.
- Estilo de "flag" de comando nos botões de filtro (decisão explícita do usuário: manter texto em português).
- Textura de scanline fora do Hero.
- Remoção da miniatura de imagem dos cards (decisão explícita do usuário: manter).
- A estética "Blueprint Schematic" (grid de papel milimetrado, serifa, anotações técnicas) — descartada em favor da mescla com Terminal Amber.

## Testagem

- Testes automatizados (Node, sem dependências) para: variáveis de cor âmbar em `:root`; fonte monoespaçada aplicada aos títulos; ausência da fonte Space Grotesk no HTML; estrutura do Hero como terminal (barra de título, prompt, cursor, comentários); novo formato de card (`CAT`, `STACK`, cantos de esquadro, miniatura de imagem presente); ausência do ícone SVG de categoria nos cards.
- Validação manual/visual no navegador: cursor pisca de forma sutil (ou fica estático se `prefers-reduced-motion` estiver ativo); scanline não atrapalha a leitura do texto do Hero; cards mantêm legibilidade com o novo formato; contraste do âmbar sobre o fundo escuro é suficiente.
