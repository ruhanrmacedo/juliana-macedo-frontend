/**
 * Fonte local da pagina profissional, sem chamadas HTTP ou dados clinicos.
 * Os campos espelham o contrato publico esperado para uma futura integracao
 * administrativa. Este view model contem somente texto, nunca HTML.
 * Credenciais, agenda, precos e canais nao confirmados nao sao publicados.
 */
export interface ProfessionalPageContent {
  displayName: string;
  headline: string;
  institutionalPhrase: string;
  introduction: string[];
  professionalJourney: string;
  education: string;
  carePhilosophy: string;
  services: {
    id: string;
    name: string;
    description: string;
    modality: "ONLINE" | "IN_PERSON";
    bookingEnabled: false;
    featured?: boolean;
    whatsappMessage: string;
    price: { amount: null; currency: "BRL"; visibility: "HIDDEN" };
  }[];
  faqs: { id: string; question: string; answer: string }[];
  contacts: null;
}

export const professionalPreview: ProfessionalPageContent = {
  displayName: "Juliana Macedo",
  headline: "Nutricionista",
  institutionalPhrase: "Uma nutrição que vai além do prato. Ciência, acolhimento e orientação individualizada para construir uma relação mais equilibrada com a alimentação, respeitando sua história e sua rotina.",
  introduction: [
    "Mudar hábitos alimentares não depende apenas de força de vontade. Emoções, rotina, responsabilidades e cansaço também fazem parte dessa relação.",
    "Por isso, acredito em uma Nutrição que acolhe sem julgamentos e considera a história, as preferências e as possibilidades reais de cada pessoa.",
  ],
  professionalJourney: "Minha primeira formação foi em Recursos Humanos. Trabalhando com pessoas, aprendi a importância da escuta, da comunicação, do respeito e da compreensão das diferentes realidades.",
  education: "Depois vieram a graduação em Nutrição, a pós-graduação em Saúde Mental e a experiência em ambiente hospitalar. São vivências que se encontram na forma como compreendo o cuidado.",
  carePhilosophy: "A alimentação vai muito além de nutrientes e calorias: envolve comportamento, emoções, cultura, rotina e relações. A orientação é baseada na ciência, sem milagres, culpa ou terrorismo nutricional, com foco em reeducação alimentar e mudanças possíveis e sustentáveis.",
  services: [
    {
      id: "in-person-nutrition-consultation",
      name: "Consulta nutricional presencial",
      description: "Um atendimento pensado para você, não para uma dieta pronta. Na consulta, o ponto de partida é compreender seus hábitos alimentares, sua rotina, suas dificuldades e seus objetivos. A proposta é construir orientações nutricionais individualizadas, com base na ciência e respeitando suas preferências e possibilidades.",
      modality: "IN_PERSON",
      bookingEnabled: false,
      featured: true,
      whatsappMessage: "Olá, Juliana! Conheci seu site e gostaria de saber mais sobre a consulta nutricional presencial.",
      price: { amount: null, currency: "BRL", visibility: "HIDDEN" },
    },
    {
      id: "online-nutrition-consultation",
      name: "Consulta nutricional online",
      description: "Uma possibilidade de atendimento com a mesma escuta, orientação individualizada e respeito à sua realidade. Formato, disponibilidade e demais informações serão confirmados antes da abertura de agenda.",
      modality: "ONLINE",
      bookingEnabled: false,
      whatsappMessage: "Olá, Juliana! Conheci seu site e gostaria de saber mais sobre a consulta nutricional online.",
      price: { amount: null, currency: "BRL", visibility: "HIDDEN" },
    },
  ],
  faqs: [
    {
      id: "first-consultation",
      question: "Como funciona a primeira consulta?",
      answer: "A primeira consulta é um momento de escuta e acolhimento. Quero conhecer você, sua história, seus hábitos alimentares, sua rotina e seus objetivos. A partir dessa conversa e da avaliação nutricional, vamos construir estratégias individualizadas, respeitando suas necessidades e sua realidade, sem julgamentos ou dietas impossíveis de seguir.",
    },
    {
      id: "service-format",
      question: "Quais modalidades de atendimento estarão disponíveis?",
      answer: "Os atendimentos serão realizados nas modalidades on-line e presencial, em Florianópolis (SC), mediante agendamento prévio. Em ambas as modalidades, meu compromisso é oferecer um acompanhamento nutricional acolhedor, humanizado e individualizado, respeitando suas necessidades e objetivos.",
    },
    {
      id: "individual-care",
      question: "A alimentação pode ser pensada para a minha rotina?",
      answer: "Com certeza! Acredito que uma alimentação saudável precisa fazer sentido na vida real. Por isso, considero seus horários, preferências, condições financeiras e desafios do dia a dia. Meu objetivo não é fazer você viver em função de uma dieta, mas ajudar a construir hábitos que se encaixem na sua rotina e sejam sustentáveis.",
    },
    {
      id: "contact",
      question: "Como entrar em contato?",
      answer: "Você pode entrar em contato comigo pelo WhatsApp (48) 99116-9041 ou pelo e-mail julcdmacedo@gmail.com. Será um prazer conversar com você, esclarecer suas dúvidas e explicar como funciona o acompanhamento nutricional.",
    },
  ],
  contacts: null,
};
