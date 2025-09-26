export const TEAM_MIN = 3;
export const TEAM_MAX = 6;
export const NUM_TEST_QUESTIONS = 10;
export const TEACHER_PASSWORD = 'professor123';

export const SEGMENTS = [
  {
    id: 's1',
    title: 'SaaS B2B (Plataforma de Produtividade)',
    description: 'Plataforma SaaS para empresas. Necessidades: Produto, Back-end, Suporte, Vendas.',
    needs: ['Product','Backend','Support','Sales'],
    idealProfile: { Lider:0.35, Tecnico:0.35, Comercial:0.2, Operacional:0.1 },
    baseMultiplier: 1.2
  },
  { id: 's2', title: 'Marketplace', description: 'Marketplace vertical. Necessidades: Ops, Engenharia, Marketing, Jurídico', needs:['Ops','Eng','Mkt','Legal'], idealProfile:{Comercial:0.4,Tecnico:0.3,Organizador:0.2}, baseMultiplier:1.1 },
  { id: 's3', title: 'Cybersecurity Tool', description: 'Produto de segurança. Necessidades técnicas e compliance', needs:['R&D','Security','Sales','Support'], idealProfile:{Tecnico:0.6,Lider:0.2,Organizador:0.2}, baseMultiplier:1.4 },
  { id: 's4', title: 'EduTech', description: 'Plataforma de educação digital', needs:['Content','Product','Sales','Support'], idealProfile:{Criativo:0.35,Comercial:0.25,Tecnico:0.25,Organizador:0.15}, baseMultiplier:1.1 },
  { id: 's5', title: 'Fintech (Pagamentos)', description: 'Serviços financeiros digitais', needs:['Compliance','Backend','Product','Sales'], idealProfile:{Tecnico:0.4,Organizador:0.3,Lider:0.2}, baseMultiplier:1.3 },
  { id: 's6', title: 'Data Analytics as a Service', description: 'Soluções de dados e BI', needs:['Data','ML','Sales','Support'], idealProfile:{Tecnico:0.6,Comercial:0.2,Organizador:0.2}, baseMultiplier:1.25 }
];

export const PROFILES = [
  { id:'Lider', title:'Líder', description:'Focado em visão, coordenação e tomada de decisão.' },
  { id:'Tecnico', title:'Técnico', description:'Especialista técnico, foco em qualidade de entrega.' },
  { id:'Comercial', title:'Comercial', description:'Conector com mercado e vendas.' },
  { id:'Organizador', title:'Organizador', description:'Processos, compliance e operação.' },
  { id:'Criativo', title:'Criativo', description:'Inovação, produto e experiência.' },
  { id:'Operacional', title:'Operacional', description:'Execução e suporte.' }
];