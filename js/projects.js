const projectsData = [
  {
    title: 'Landing Page — Lançamento de Produto',
    category: 'landing',
    description: 'Página de alta conversão para lançamento de produto, com seções de benefícios, depoimentos e chamada para ação.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Landing Page — Captura de Leads',
    category: 'landing',
    description: 'Landing page otimizada para captura de leads via formulário integrado a serviço de e-mail marketing.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['HTML', 'CSS', 'Formspree'],
  },
  {
    title: 'Sistema de Gestão de Estoque',
    category: 'sistema',
    description: 'Sistema web para controle de entrada, saída e níveis de estoque, com relatórios e alertas automáticos.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'Express', 'PostgreSQL'],
  },
  {
    title: 'Sistema de Agendamento Online',
    category: 'sistema',
    description: 'Plataforma de agendamento de horários com confirmação automática e notificações por e-mail.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Painel de Controle Financeiro',
    category: 'ferramenta',
    description: 'Dashboard para acompanhamento de receitas, despesas e fluxo de caixa em tempo real.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Chart.js', 'Node.js'],
  },
  {
    title: 'Ferramenta de Gerenciamento de Tarefas',
    category: 'ferramenta',
    description: 'Aplicação estilo Kanban para organização de tarefas em equipe, com quadros e prazos.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['React', 'Firebase'],
  },
  {
    title: 'Integração com API de Pagamentos',
    category: 'integracao',
    description: 'Integração de checkout com gateway de pagamentos, incluindo webhooks para confirmação automática.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'Stripe API'],
  },
  {
    title: 'Integração entre CRM e WhatsApp',
    category: 'integracao',
    description: 'Automação que sincroniza conversas do WhatsApp Business com o CRM da empresa em tempo real.',
    image: 'assets/placeholder.svg',
    link: '#',
    tags: ['Node.js', 'WhatsApp API', 'Webhooks'],
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = projectsData;
}
