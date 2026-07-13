# Portfólio de Marcos Guedes — Redesign Visual (v2)

## Objetivo

Aproximar o visual do site (já implementado — ver `2026-07-12-portfolio-site-design.md`) de uma referência visual estilo "SaaS dev-tool dark tech": bolhas verdes desfocadas de fundo, mockup decorativo de janela de código no Hero, ícones de categoria nos cards de projeto e uma segunda fonte para títulos. **As seções existentes (Header, Hero, Sobre, Projetos, Contato, Footer) permanecem as mesmas — este é um redesign visual, não uma reestruturação de conteúdo.**

## Elementos adotados da referência

Da imagem de referência enviada pelo usuário, foram escolhidos estes elementos (outros, como a faixa de logos de clientes e o footer multi-coluna, não se aplicam a um portfólio pessoal e foram descartados):

1. Bolhas/orbs verdes desfocadas de fundo
2. Mockup decorativo de janela de código no Hero
3. Cards de projeto com ícone de categoria (mantendo a imagem existente)
4. Tipografia com fonte técnica/geométrica nos títulos

O estilo de headline com palavra destacada entre `{chaves}` da referência **não** foi adotado.

## 1. Bolhas decorativas de fundo

- Elementos puramente decorativos: `<div class="orb" aria-hidden="true"></div>`, um ou dois por seção (`.hero`, `.about`, `.projects`, `.contact` recebem orbs; todas as seções, conforme decisão do usuário).
- CSS: `border-radius: 50%`, `background: radial-gradient(circle, var(--accent) 0%, transparent 70%)`, `filter: blur(80px)`, `opacity` baixa (~0.15–0.25), `position: absolute`, `pointer-events: none`.
- Cada seção que recebe orbs precisa de `position: relative; overflow: hidden` para conter o blur sem vazar layout ou causar scroll horizontal.
- Sem JavaScript, sem animação — efeito estático, replicando a referência.

## 2. Hero em 2 colunas + mockup de código

- Desktop (≥768px): `.hero__content` vira um grid/flex de 2 colunas — texto e CTA à esquerda, mockup de código à direita.
- Mobile (<768px): empilha em 1 coluna — texto em cima, mockup embaixo.
- O mockup (`.code-mockup`) é markup estático decorativo, não executável: uma "janela" com barra de título (3 bolinhas coloridas estilo macOS: vermelho/amarelo/verde) e linhas de pseudo-código com `<span>` coloridos simulando syntax highlighting (ex: palavras-chave em uma cor, strings em outra, comentários em cinza). Conteúdo genérico (ex: uma função JS fictícia), sem relação com dados reais.
- `aria-hidden="true"` no mockup, já que é puramente decorativo e não deve ser lido por leitores de tela.

## 3. Ícones de categoria nos cards de projeto

- `js/script.js`: adicionar um mapeamento `categoryIcons` (objeto `{ landing, sistema, ferramenta, integracao }`) onde cada valor é uma string SVG inline pequena:
  - `landing`: ícone de página/monitor
  - `sistema`: ícone de banco de dados/servidor
  - `ferramenta`: ícone de chave de ferramenta
  - `integracao`: ícone de plugue/conexão
- `createProjectCard(project)` passa a incluir o ícone correspondente à categoria do projeto, exibido junto à imagem existente (não a substitui).
- O teste existente (`tests/script.test.js`, teste `createProjectCard includes title, description and tags`) precisa de uma asserção adicional confirmando que o ícone correto aparece no HTML gerado para cada categoria.

## 4. Tipografia

- Adicionar **Space Grotesk** via Google Fonts (mesmo padrão de `<link>` já usado para Inter em `index.html`).
- CSS: `--font-heading: 'Space Grotesk', sans-serif;` aplicada a `h1, h2, h3, .hero__title, .section__title, .header__logo`; `--font-body: 'Inter', system-ui, -apple-system, sans-serif;` continua no `body` para texto corrido.

## Fora de escopo

- Estilo de headline com palavra destacada em `{chaves}`.
- Faixa de logos de clientes/parceiros (não se aplica a portfólio pessoal).
- Footer multi-coluna (Company/Resource/Legal/Support/Platform) — footer atual (nome + ano) permanece.
- Animação ou movimento nas bolhas de fundo (efeito estático, como na referência).
- Qualquer mudança no conteúdo/dados dos projetos, nas categorias, ou no link do WhatsApp.

## Testagem

- Testes automatizados (Node, sem dependências) para: presença do ícone correto por categoria em `createProjectCard`; presença das classes/seletores decorativos (`.orb`, `.code-mockup`) na estrutura HTML/CSS.
- Validação manual/visual no navegador: bolhas não causam scroll horizontal ou sobreposição de texto; mockup de código não quebra o layout do Hero em mobile; ícones aparecem corretamente em todos os 8 cards; título usa a fonte Space Grotesk.
