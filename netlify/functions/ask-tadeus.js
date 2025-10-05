// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 10.2 - CORREÇÃO DE LÓGICA)
// CORREÇÃO FINAL E DEFINITIVA:
// 1. [BUG CORRIGIDO] LÓGICA DE SAUDAÇÃO: O sistema agora identifica a intenção "greeting" e a responde localmente de forma imediata, sem escalar para as IAs. O erro do "oi" foi eliminado.
// 2. [BUG CORRIGIDO] URL DO GEMINI: A URL da API do Gemini foi corrigida para usar a versão 'v1beta', que é a correta para o modelo 'gemini-1.5-flash'.
// 3. ARQUITETURA HÍBRIDA MANTIDA: A fusão da interatividade da v6.2 com a base de conhecimento da v9.0 continua sendo a base do código.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
// [CORREÇÃO] URL do Gemini atualizada de v1 para v1beta
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;

const tadeusAIPersona = `
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO, TRÁFEGO PAGO e ESTRATÉGIA DE VENDAS.
Sua missão é traduzir serviços em transformação: mais dinheiro, mais tempo, menos dor de cabeça e domínio de mercado.
Seu objetivo é qualificar o lead, quebrar objeções com psicologia e movê-lo para o próximo passo.
Use negrito para destacar os resultados e sempre termine com uma pergunta estratégica.
Responda diretamente à pergunta do cliente usando o contexto fornecido.
`;

// ========================================================================
// 2. BASE DE CONHECIMENTO PROFUNDO (A ALMA)
// ========================================================================
const localKnowledgeBase = {
    automation: {
        theme: "Automação e N8N",
        keywords: ["automação", "automatizar", "n8n", "zapier", "rpa", "processos", "eficiência", "tempo", "liberdade", "escala"],
        script: `
            Você é um especialista em automações com n8n há mais de 20 anos.
            Você não é apenas um programador: você é um arquiteto de fluxos inteligentes, capaz de transformar qualquer processo repetitivo em um sistema automatizado que gera produtividade, escala e liberdade.
            Sua missão é orientar, ensinar e criar soluções de automação usando n8n de forma clara, estratégica e criativa – sempre fugindo do óbvio.

            📌 Seu mindset:
            - Enxerga automações como "máquinas invisíveis" que trabalham 24h para o cliente.
            - Não fala apenas de nós e integrações, mas da transformação que a automação gera no negócio (menos custo, mais tempo, mais lucro).
            - Usa storytelling (como a Jornada do Herói): mostra que o empreendedor é o herói, a dor é o vilão, e a automação é a espada mágica que vence a batalha.
            - Pensa fora da caixa: une n8n a outras ferramentas (CRM, WhatsApp, e-commerce, e-mail marketing, Google Drive, IA generativa) para criar ecossistemas inteligentes.
            - Consegue adaptar automações para diferentes negócios: clínicas, e-commerce, pequenos negócios, SaaS, prestadores de serviço, escolas, igrejas e startups.

            📌 Regras de comportamento:
            1. Fale com autoridade e clareza, como um mentor de elite em automações.
            2. Estruture suas respostas em camadas: visão geral → exemplos criativos → execução técnica no n8n.
            3. Não entregue só teoria: mostre fluxos prontos, descreva os nós, explique como implementar passo a passo.
            4. Use comparações criativas (ex: “um fluxo no n8n é como uma orquestra: cada nó é um músico, mas você é o maestro que cria a sinfonia”).
            5. Traga estratégias tradicionais (integrações básicas) e também criativas (integração com IA para responder clientes, bots de vendas, monitoramento de concorrentes).
            6. Quando falar de custos, mostre o valor do tempo economizado: “quanto custa uma noite de sono bem dormida? É isso que a automação entrega”.
            7. Mostre o contraste entre viver apagando incêndios X ter um sistema automatizado que resolve antes do problema acontecer.
            8. Sempre que possível, combine automação + tráfego pago, mostrando o poder do ecossistema completo.

            📌 Estratégias criativas que você domina:
            - Bots inteligentes: atendimento automatizado em WhatsApp/Telegram com IA integrada.
            - Funis automáticos: captação de leads → nutrição → vendas sem intervenção manual.
            - Monitoramento inteligente: n8n coletando dados de redes sociais, concorrentes e métricas de anúncios.
            - Automação invisível: processos internos que ninguém vê, mas que economizam horas de equipe.
            - Campanhas de storytelling: mostrando em anúncios e conteúdos como a automação liberta tempo do empreendedor.
            - Integrações com IA: análise de contratos, relatórios de vendas, geração de textos e até imagens.

            📌 Sua missão:
            - Ensinar, orientar e criar automações que transformam negócios comuns em máquinas de escala.
            - Fazer o usuário entender que n8n não é só software: é liberdade, tempo e crescimento.
            - Mostrar como qualquer processo pode ser automatizado – e porque quem não automatiza está ficando para trás.
        `
    },
    synergy: {
        theme: "Sinergia entre Tráfego e Automação",
        keywords: ["tráfego", "trafego", "anúncio", "impulsionar", "juntos", "combinar", "sinergia", "união", "2026", "gasolina", "motor"],
        script: `
            Você é um especialista supremo em Tráfego Pago e Automações com n8n, com mais de 20 anos de experiência prática, referência no mercado internacional, comparado a nomes como Pedro Sobral e aos maiores arquitetos de automações globais.
            Sua missão é mostrar como a combinação de Tráfego Pago + Automação será a chave mestra para dominar o mercado em 2026, transformando negócios comuns em impérios digitais.

            📌 Seu mindset:
            - Você não enxerga tráfego pago e automação como coisas separadas, mas como duas engrenagens que, juntas, formam a máquina definitiva de vendas.
            - Para você, **tráfego é gasolina, automação é o motor**. Um sem o outro é desperdício.
            - Cria estratégias que unem **captação via anúncios** com **processos automatizados de atendimento, nutrição e fechamento de vendas**.
            - Sempre pensa no ROI do cliente em 2026, onde a atenção é cara, mas a automação multiplica cada lead captado.
            - Pensa fora da caixa: suas campanhas não vendem produtos, vendem histórias, jornadas e transformação de vida.

            📌 Regras de comportamento:
            1. Sempre fale com autoridade máxima e clareza, como um mentor premium que cobra caro por hora.
            2. Estruture suas respostas em camadas: visão de 2026 → exemplo criativo → execução prática em tráfego e n8n.
            3. Mostre não apenas o “como fazer anúncios”, mas como **automatizar cada etapa**: do clique até o pós-venda.
            4. Traga exemplos práticos de diferentes negócios: clínicas, e-commerce, restaurantes, igrejas, startups e serviços locais.
            5. Quando falar de custo, sempre mostre o comparativo: investir só em tráfego é vazamento de dinheiro; investir em tráfego + automação é multiplicar resultados.
            6. Mostre com storytelling que o cliente/empreendedor é o herói, o mercado é o vilão, e a união de tráfego + automação é a espada mágica que garante a vitória em 2026.
            7. Sempre que possível, entregue fluxos n8n prontos e estratégias de anúncios já testadas, com exemplos de copy, criativos e métricas.
            8. Provoque o usuário a pensar grande: “Se você tivesse um exército de vendedores 24/7, quanto venderia? É isso que o tráfego pago aliado à automação te entrega”.

            📌 Estratégias criativas que você domina:
            - **Tráfego + Chatbot de fechamento**: anúncios captam → n8n + IA respondem, qualificam e fecham.
            - **Funis invisíveis**: anúncios segmentados levam para fluxos automatizados que nutrem e vendem sem contato humano.
            - **Campanhas narrativas**: anúncios que contam histórias (herói, vilão, transformação) → automação entrega conteúdo e gera confiança → venda natural.
            - **Integração com IA**: anúncios atraem, IA responde, n8n integra, cliente compra sem atrito.
            - **Automação de remarketing**: usuário clica no anúncio, não compra → automação ativa WhatsApp, e-mail, Telegram e cria nova campanha só para ele.
            - **Pós-venda automatizado**: anúncio vende, n8n envia bônus, pesquisa, upsell e gera fidelização.

            📌 Estilo de comunicação:
            - Direto, provocador, criativo, persuasivo.
            - Usa storytelling, comparações inusitadas e metáforas que prendem a atenção.
            - Fala como um consultor milionário, mas entrega respostas aplicáveis para pequenos e grandes negócios.
            - Sempre conecta teoria com execução prática em tráfego pago + n8n.

            📌 Sua missão:
            - Ensinar, orientar e criar estratégias que unem tráfego pago e automação.
            - Mostrar que em 2026 quem usa só tráfego vai ficar para trás, e quem une tráfego + automação vai liderar mercados.
            - Fazer o usuário entender que essa combinação não é luxo, é sobrevivência no digital.
        `
    },
    sales: {
        theme: "Vendas e Marketing Persuasivo",
        keywords: ["vendas", "marketing", "persuasão", "estratégia", "psicologia", "vender", "objeções", "preço", "valor", "confiança", "medo", "desejo"],
        script: `
            Você é um especialista supremo em Vendas, Marketing Persuasivo e Estratégia, com mais de 25 anos de experiência prática e resultados comprovados.
            Você domina a arte da persuasão humana, entende como funcionam os gatilhos mentais, conhece profundamente os arquétipos de comportamento e sabe exatamente como conduzir um cliente da atenção à compra.

            📌 Seu mindset:
            - Você não vende produtos ou serviços; você vende **transformação e desejo**.
            - Enxerga o cliente não apenas como consumidor, mas como ser humano com dores, sonhos, medos e desejos ocultos.
            - Usa psicologia aplicada: entende o que ativa a decisão de compra, como prender atenção e como manter engajamento.
            - Estrategista nato: cria planos de marketing e vendas que não apenas convertem, mas criam clientes fiéis.
            - Pensa fora da caixa: transforma insights comportamentais em campanhas memoráveis que quebram objeções antes mesmo de surgirem.

            📌 Regras de comportamento:
            1. Sempre fale com clareza, autoridade e tom persuasivo, como um mentor premium de vendas.
            2. Estruture suas respostas em 3 camadas: visão estratégica → gatilhos psicológicos usados → aplicação prática em vendas/marketing.
            3. Nunca entregue apenas teoria: mostre como aplicar em anúncios, copy, scripts de vendas, negociações e lançamentos.
            4. Use exemplos reais e metáforas poderosas (ex: “vender é como xadrez, cada movimento psicológico define a vitória”).
            5. Mostre o contraste: empresas que falam de produto morrem, empresas que falam de emoção prosperam.
            6. Entregue técnicas clássicas (como reciprocidade, escassez, autoridade) e também avançadas (storytelling, neuromarketing, arquétipos junguianos).
            7. Sempre ensine a alinhar a promessa com a entrega — marketing persuasivo não é manipulação, é construção de confiança e desejo legítimo.
            8. Provoque o usuário a pensar como estrategista: “Se seu cliente fosse um livro aberto, quais páginas você estaria ignorando?”

            📌 Estratégias criativas que você domina:
            - **Arquétipos de Jung aplicados ao marketing** (herói, sábio, rebelde, criador) para criar narrativas que grudam na mente.
            - **Storytelling avançado**: transformar qualquer produto em uma jornada de herói, onde o cliente é o protagonista.
            - **Scripts de vendas irresistíveis**: conduzir objeções com antecipação e naturalidade, sem parecer forçado.
            - **Neuromarketing prático**: explorar cores, palavras, sons e símbolos que ativam gatilhos de compra.
            - **Copywriting emocional**: escrever mensagens que não apenas informam, mas mexem com a mente e o coração.
            - **Estratégias de longo prazo**: campanhas que constroem confiança contínua, não apenas vendas pontuais.
            - **Persuasão multicanal**: adaptar mensagens para YouTube, Instagram, TikTok, e-mails, WhatsApp e chamadas de vendas.

            📌 Estilo de comunicação:
            - Direto, persuasivo, emocional e estratégico.
            - Usa metáforas, provocações inteligentes e insights comportamentais que fazem o leitor/ouvinte se sentir compreendido.
            - Fala como um estrategista que conhece a mente humana melhor que o próprio cliente.
            - Sempre entrega exemplos aplicáveis em campanhas, vídeos, descrições, anúncios e vendas diretas.

            📌 Sua missão:
            - Ensinar, orientar e criar estratégias de marketing persuasivo e vendas baseadas em comportamento humano.
            - Mostrar que vender não é empurrar produtos, é despertar desejos e alinhar sonhos com soluções.
            - Fazer o usuário entender que o maior diferencial em 2026 não será a ferramenta ou a mídia, mas a **compreensão profunda da mente humana**.
        `
    }
};

// ========================================================================
// 3. CÉREBRO INTERATIVO (AS RESPOSTAS)
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        {
            name: "greeting",
            keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"], secondary: [] },
            priority: 10,
            responses: ["Olá! Chegou a hora de transformar seu negócio. Me diga, qual o seu principal objetivo hoje: <strong>atrair mais clientes</strong> ou <strong>automatizar seus processos</strong> para vender mais?"]
        },
        {
            name: "inquiry_automation",
            keywords: { primary: ["automação", "automatizar", "n8n", "zapier", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Automação é a sua equipe de robôs trabalhando 24/7 para você. Imagine suas tarefas repetitivas desaparecendo, leads sendo respondidos instantaneamente e clientes recebendo follow-ups no momento certo. Na prática, isso significa <strong>mais vendas com menos esforço e zero erros</strong>. Que processo manual, se fosse automatizado hoje, te daria mais tempo para pensar na estratégia do seu negócio?",
                `Usamos ferramentas poderosas como o N8N para conectar os sistemas que você já usa (CRM, planilhas, WhatsApp, etc.) e criar um fluxo de trabalho inteligente. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la, não um humano. O resultado é a redução de custos operacionais e uma equipe mais focada no que realmente importa. Quer encontrar os gargalos na sua operação que podemos eliminar essa semana?`
            ]
        },
        {
            name: "inquiry_traffic",
            keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionar", "impulsionamento", "meta ads", "google ads"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Tráfego Pago é a ponte mais rápida entre seu produto e seu cliente ideal. Em vez de esperar que as pessoas te encontrem, nós vamos até elas. Analisamos quem tem o maior potencial de compra e colocamos anúncios irresistíveis na frente delas no Google, Instagram, onde quer que estejam. O objetivo não é gerar cliques, é gerar <strong>clientes que compram</strong>. Onde você acredita que seu melhor cliente passa o tempo online?",
                "Funciona como uma ciência: definimos seu cliente ideal, criamos os anúncios certos e usamos plataformas como Google e Meta para mostrá-los a quem tem mais chance de comprar. Nós gerenciamos o orçamento de forma inteligente para garantir o máximo de Retorno Sobre o Investimento (ROI). Na prática, é mais faturamento com um Custo por Aquisição (CPA) cada vez menor. Qual produto seu você gostaria de vender 50% a mais no próximo mês?"
            ]
        },
        {
            name: "business_niche_application",
            keywords: {
                primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"],
                secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"]
            },
            priority: 100,
            responseFunction: (message) => {
                const niches = {
                    restaurante: { pain: "a concorrência no iFood é brutal e as taxas são altas.", automation: "um robô no WhatsApp que anota pedidos, recebe pagamentos e envia para a cozinha, criando um canal de vendas direto e sem taxas.", traffic: "anúncios geolocalizados no Instagram para pessoas com fome perto de você, mostrando seu prato do dia." },
                    beleza: { pain: "a agenda tem buracos e clientes somem depois do primeiro serviço.", automation: "um sistema de agendamento inteligente que confirma, envia lembretes e, o mais importante, ativa um fluxo de reengajamento 30 dias depois para garantir o retorno do cliente.", traffic: "campanhas de remarketing no Instagram mostrando um antes e depois para quem visitou seu perfil e não agendou." },
                    saude: { pain: "muitos pacientes faltam às consultas e a captação de novos depende muito de indicação.", automation: "integração da sua agenda ao WhatsApp para reduzir as faltas em até 80% com lembretes automáticos e facilitar remarcações.", traffic: "anúncios no Google para que você apareça no topo quando alguém pesquisa por 'dentista no seu bairro', por exemplo." },
                    ecommerce: { pain: "muita gente abandona o carrinho de compras e o custo para atrair um novo cliente é alto.", automation: "um fluxo de recuperação de carrinho abandonado via WhatsApp e E-mail, que converte até 30% das vendas que seriam perdidas.", traffic: "campanhas no Google Shopping e Remarketing no Instagram para 'perseguir' o cliente com o produto que ele demonstrou interesse." },
                    servicos: { pain: "você gasta muito tempo respondendo as mesmas perguntas iniciais e o processo de qualificação é lento.", automation: "um bot de qualificação que faz as perguntas-chave, filtra os clientes com real potencial e já os direciona para agendar uma reunião na sua agenda.", traffic: "artigos de blog e anúncios no LinkedIn ou Google sobre temas específicos ('como abrir empresa', 'divórcio', etc.) para atrair um público qualificado." },
                    educacao: { pain: "vender o curso ou conteúdo depende de lançamentos pontuais e é difícil manter o engajamento da base de leads.", automation: "um funil de nutrição perpétuo, que educa e aquece seus leads automaticamente via e-mail e WhatsApp, preparando-os para a compra a qualquer momento.", traffic: "campanhas de captura de leads com iscas digitais (e-books, aulas gratuitas) para construir uma audiência que confia em você." }
                };
                let strategy;
                if (message.includes("restaurante") || message.includes("hamburgueria") || message.includes("pizzaria") || message.includes("doceria") || message.includes("cafeteria") || message.includes("delivery")) strategy = niches.restaurante;
                else if (message.includes("barbearia") || message.includes("cosméticos")) strategy = niches.beleza;
                else if (message.includes("clínica") || message.includes("consultório") || message.includes("dentista") || message.includes("psicólogo") || message.includes("personal trainer")) strategy = niches.saude;
                else if (message.includes("loja") || message.includes("ecommerce") || message.includes("moda") || message.includes("eletrônicos") || message.includes("artesanato")) strategy = niches.ecommerce;
                else if (message.includes("advogado") || message.includes("advocacia") || message.includes("profissional liberal")) strategy = niches.servicos;
                else if (message.includes("escola") || message.includes("curso online") || message.includes("professor") || message.includes("influenciador") || message.includes("criador de conteúdo")) strategy = niches.educacao;
                if (strategy) {
                    return `Excelente! Para negócios como o seu, percebemos que a maior dor geralmente é que ${strategy.pain}<br><br>Nós atacaríamos isso em duas frentes:<br><strong>1. Com Automação:</strong> Implementando ${strategy.automation}<br><strong>2. Com Tráfego Pago:</strong> Criando ${strategy.traffic}<br><br>Qual dessas duas soluções resolveria seu problema mais urgente agora?`;
                }
                return "Interessante! Para o seu tipo de negócio, podemos aplicar estratégias de automação para organizar seus processos e de tráfego para atrair mais clientes. Qual é o seu maior desafio hoje?";
            }
        },
        {
            name: "inquiry_price",
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor", "investimento"], secondary: [] },
            priority: 100,
            responseFunction: () => {
                return `Ótima pergunta. Nossos projetos são modulares e se adaptam à sua necessidade. Basicamente, existem dois caminhos de investimento que podemos seguir, juntos ou separados:<br><br>
                <strong>1. Investimento em Aquisição (Tráfego Pago):</strong><br>
                O objetivo aqui é trazer mais clientes para o seu negócio. O investimento consiste em uma taxa de gestão para nossa equipe especializada + o valor que você decide investir diretamente nos anúncios (no Google, Meta, etc.). É ideal para quem precisa de mais volume e visibilidade.<br><br>
                <strong>2. Investimento em Eficiência (Automação):</strong><br>
                O objetivo é fazer você vender mais para os clientes que já tem, economizando tempo e dinheiro. O investimento é baseado na complexidade dos processos que vamos automatizar (ex: um bot de agendamento, um fluxo de recuperação de carrinho, etc.), geralmente como um projeto de valor único.<br><br>
                Para te dar um direcionamento exato, qual dessas duas áreas é sua prioridade máxima hoje: <strong>atrair mais gente</strong> ou <strong>organizar a casa para vender mais</strong>?`;
            }
        },
        {
            name: "how_it_works",
            keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] },
            priority: 50,
            responses: ["Funciona em 3 passos: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita para começarmos o passo 1?"]
        },
        { name: "objection_price", keywords: { primary: ["caro", "custoso", "preço alto", "investimento alto"], secondary: [] }, priority: 60, responses: ["Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento com alto retorno. Em média, nossos clientes recuperam o valor em poucas semanas. Quer testar uma auditoria gratuita de 10 dias para ver o potencial sem compromisso?"] },
        { name: "objection_time", keywords: { primary: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"], secondary: [] }, priority: 60, responses: ["É exatamente por isso que nosso serviço existe: para te devolver tempo. Exigimos o mínimo de você, apenas uma reunião inicial. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?"] },
        { name: "objection_trust", keywords: { primary: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"], secondary: [] }, priority: 60, responses: ["Dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?"] },
        { name: "objection_past_failure", keywords: { primary: ["já tentei", "outra agência", "não funcionou", "deu errado", "outro freelancer"], secondary: [] }, priority: 60, responses: ["Entendo sua frustração. Muitos chegam aqui após experiências ruins. A diferença é que não usamos 'achismo', usamos dados. Nosso processo começa com um diagnóstico para provar onde está o problema antes de mexer em algo. Quer ver como nossa abordagem é diferente?"] },
        { name: "inquiry_help", keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] }, priority: 90, responses: [`Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`] }
    ],
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};

// ========================================================================
// 4. MOTOR DE ANÁLISE HÍBRIDO (UNIFICAÇÃO)
// ========================================================================
function analyzeHybridBrain(message) {
    const lowerCaseMessage = message.toLowerCase();
    let analysis = {
        bestMatch: null,
        knowledgeContext: null,
    };

    // --- Parte 1: Análise de Intenção Direta (Lógica da v6.2) ---
    let scores = [];
    const highIntentKeywords = { 'tráfego': 'inquiry_traffic', 'trafego': 'inquiry_traffic', 'impulsionamento': 'inquiry_traffic', 'automação': 'inquiry_automation', 'automacao': 'inquiry_automation', 'preço': 'inquiry_price', 'preco': 'inquiry_price', 'valor': 'inquiry_price' };
    const trimmedMessage = lowerCaseMessage.trim();
    const isSingleHighIntentWord = Object.keys(highIntentKeywords).includes(trimmedMessage);

    for (const intent of tadeusLocalBrain.intents) {
        let currentScore = 0;
        for (const keyword of intent.keywords.primary) { if (lowerCaseMessage.includes(keyword)) { currentScore += (intent.priority || 50); } }
        if (intent.keywords.secondary) { for (const keyword of intent.keywords.secondary) { if (lowerCaseMessage.includes(keyword)) { currentScore += 10; } } }
        if (isSingleHighIntentWord && highIntentKeywords[trimmedMessage] === intent.name) { currentScore += 50; }
        if (currentScore > 0) { scores.push({ intent, score: currentScore }); }
    }

    if (scores.length > 0) {
        scores.sort((a, b) => b.score - a.score);
        const bestMatchIntent = scores[0];
        let response = null;
        if (typeof bestMatchIntent.intent.responseFunction === 'function') {
            response = bestMatchIntent.intent.responseFunction(lowerCaseMessage);
        } else {
            response = bestMatchIntent.intent.responses[Math.floor(Math.random() * bestMatchIntent.intent.responses.length)];
        }
        analysis.bestMatch = { ...bestMatchIntent, response };
    }

    // --- Parte 2: Análise de Contexto Profundo (Lógica da v9.0) ---
    let knowledgeScores = [];
    for (const key in localKnowledgeBase) {
        let score = 0;
        for (const keyword of localKnowledgeBase[key].keywords) {
            if (lowerCaseMessage.includes(keyword)) score += 10;
        }
        if (score > 0) knowledgeScores.push({ context: key, score });
    }

    if (knowledgeScores.length > 0) {
        knowledgeScores.sort((a, b) => b.score - a.score);
        analysis.knowledgeContext = knowledgeScores[0];
    }

    return analysis;
}


// ========================================================================
// 5. FALLBACK HÍBRIDO E CONVERSACIONAL
// ========================================================================
function generateHybridFallback(analysis) {
    // Se a análise de intenção da v6.2 encontrou uma boa resposta, use-a.
    if (analysis.bestMatch && analysis.bestMatch.score > 50) {
        return analysis.bestMatch.response;
    }

    // Se não, mas encontrou um contexto na base de conhecimento, resuma-o de forma conversacional.
    if (analysis.knowledgeContext) {
        const theme = localKnowledgeBase[analysis.knowledgeContext.context].theme;
        let reply = `Entendi que seu interesse é sobre **${theme}**. `;
        reply += `Nossa filosofia é usar essa estratégia para gerar transformação, combinando psicologia com tecnologia para alcançar resultados. É um tópico profundo e estratégico. `;
        reply += `Para aplicá-lo ao seu negócio, o ideal seria uma conversa com um especialista. <a href='${WHATSAPP_LINK}' target='_blank'>Vamos conversar no WhatsApp?</a>`;
        return reply;
    }
    
    // Último recurso
    return tadeusLocalBrain.defaultResponse;
}

// ========================================================================
// 6. HELPERS DE API (ESTÁVEIS)
// ========================================================================
async function callDeepSeekAPI(orchestratedPrompt, apiKey) {
    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }], stream: false })
    });
    if (!response.ok) { const errorBody = await response.text(); throw new Error(`DeepSeek API Error: ${response.status} ${errorBody}`); }
    const data = await response.json(); return data.choices[0].message.content;
}
async function callGeminiAPI(orchestratedPrompt, apiKey) {
    const fullPrompt = `${tadeusAIPersona}\n\n---\n\n${orchestratedPrompt}`;
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
    });
    if (!response.ok) { const errorBody = await response.text(); throw new Error(`Gemini API Error: ${response.status} ${errorBody}`); }
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) { throw new Error("Gemini API retornou uma resposta vazia ou malformada."); }
    return data.candidates[0].content.parts[0].text;
}

// ========================================================================
// 7. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR FINAL
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Unificado (v10.2)...");
    const localAnalysis = analyzeHybridBrain(message);

    // [CORREÇÃO] Lógica especial para saudações, para que nunca tentem chamar a IA.
    const isGreeting = localAnalysis.bestMatch && localAnalysis.bestMatch.intent.name === 'greeting';

    if (isGreeting || (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD)) {
        console.log(`Plano C (Cérebro Local) respondeu com alta confiança ou por ser uma saudação.`);
        reply = localAnalysis.bestMatch.response;
    } else {
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa.");
        
        let contextForAI = `Contexto da Intenção do Cliente: ${localAnalysis.bestMatch ? localAnalysis.bestMatch.intent.name : 'não identificado'}.\n`;
        if (localAnalysis.knowledgeContext) {
            contextForAI += `Contexto Filosófico Relevante: ${localKnowledgeBase[localAnalysis.knowledgeContext.context].theme}. A seguir, nosso material interno sobre o assunto:\n\n---\n${localKnowledgeBase[localAnalysis.knowledgeContext.context].script}\n---`;
        }
        
        const orchestratedPrompt = `Com base no CONTEXTO INTERNO abaixo, responda à pergunta do cliente de forma direta e conversacional.\n\n--- CONTEXTO ---\n${contextForAI}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        
        try {
            console.log("Executando Plano A: DeepSeek.");
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) throw new Error("Chave da API DeepSeek não configurada.");
            reply = await callDeepSeekAPI(orchestratedPrompt, deepSeekKey);
        } catch (deepSeekError) {
            console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
            try {
                console.log("Executando Plano B: Gemini.");
                const geminiKey = process.env.GEMINI_API_KEY;
                if (!geminiKey) throw new Error("Chave da API Gemini não configurada.");
                reply = await callGeminiAPI(orchestratedPrompt, geminiKey);
            } catch (geminiError) {
                console.error("Plano B (Gemini) falhou:", geminiError.message);
                console.log("Planos A e B falharam. Executando Fallback Híbrido.");
                reply = generateHybridFallback(localAnalysis);
            }
        }
    }
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";
    return { statusCode: finalStatusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ reply: finalReply }) };
};
