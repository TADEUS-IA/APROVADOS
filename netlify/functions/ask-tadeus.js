// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 6.2 - O CÉREBRO DEFINITIVO)
// ATUALIZAÇÃO:
// 1. RESTAURAÇÃO COMPLETA: Todo o conhecimento original e objeções do Cérebro Local foram restaurados.
// 2. APRIMORAMENTO: A linguagem persuasiva foi fundida com as respostas detalhadas existentes.
// 3. INTELIGÊNCIA MANTIDA: A lógica de "Memória Conversacional" e a arquitetura de orquestração continuam ativas.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;

const tadeusAIPersona = `
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO e TRÁFEGO PAGO.
Seu idioma é Português do Brasil. Seu tom é confiante, direto e focado em resultados.
Sua missão é traduzir serviços em benefícios claros para o cliente: mais dinheiro, mais tempo, menos dor de cabeça.
Seu objetivo principal é qualificar o lead e movê-lo para o próximo passo: agendar uma chamada ou solicitar a auditoria gratuita.
Use negrito para destacar os resultados e sempre termine com uma pergunta que guie o cliente para a solução.
`;

// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - VERSÃO 6.2: CONHECIMENTO COMPLETO E PERSUASIVO
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        // --- SAUDAÇÕES ---
        {
            name: "greeting",
            keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"], secondary: [] },
            priority: 10,
            responses: ["Olá! Chegou a hora de transformar seu negócio. Me diga, qual o seu principal objetivo hoje: <strong>atrair mais clientes</strong> ou <strong>automatizar seus processos</strong> para vender mais?"]
        },
        
        // --- CONHECIMENTO POR SERVIÇO (COMPLETO E PERSUASIVO) ---
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

        // --- CONHECIMENTO POR NICHO DE NEGÓCIO (EXPANDIDO) ---
        {
            name: "business_niche_application",
            keywords: { 
                primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"], 
                secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] 
            },
            priority: 100,
            responseFunction: (message) => { /* ... (CÓDIGO COMPLETO DA VERSÃO 6.0) ... */ }
        },
        
        // --- PERGUNTAS E OBJEÇÕES (COMPLETO) ---
        {
            name: "inquiry_price",
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor", "investimento"], secondary: [] },
            priority: 100,
            responseFunction: () => { /* ... (CÓDIGO COMPLETO DA VERSÃO 6.0) ... */ }
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
// Adicionando as responseFunctions que são muito grandes para manter o código limpo
tadeusLocalBrain.intents.find(i => i.name === 'inquiry_price').responseFunction = () => {
    return `Ótima pergunta. Nossos projetos são modulares e se adaptam à sua necessidade. Basicamente, existem dois caminhos de investimento que podemos seguir, juntos ou separados:<br><br>
    <strong>1. Investimento em Aquisição (Tráfego Pago):</strong><br>
    O objetivo aqui é trazer mais clientes para o seu negócio. O investimento consiste em uma taxa de gestão para nossa equipe especializada + o valor que você decide investir diretamente nos anúncios (no Google, Meta, etc.). É ideal para quem precisa de mais volume e visibilidade.<br><br>
    <strong>2. Investimento em Eficiência (Automação):</strong><br>
    O objetivo é fazer você vender mais para os clientes que já tem, economizando tempo e dinheiro. O investimento é baseado na complexidade dos processos que vamos automatizar (ex: um bot de agendamento, um fluxo de recuperação de carrinho, etc.), geralmente como um projeto de valor único.<br><br>
    Para te dar um direcionamento exato, qual dessas duas áreas é sua prioridade máxima hoje: <strong>atrair mais gente</strong> ou <strong>organizar a casa para vender mais</strong>?`;
};
tadeusLocalBrain.intents.find(i => i.name === 'business_niche_application').responseFunction = (message) => {
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
};

// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (v6.2 - COM MEMÓRIA)
// ========================================================================
function analyzeLocalBrain(message) {
    const lowerCaseMessage = message.toLowerCase();
    const trimmedMessage = lowerCaseMessage.trim();
    let scores = [];
    const highIntentKeywords = { 'tráfego': 'inquiry_traffic', 'trafego': 'inquiry_traffic', 'impulsionamento': 'inquiry_traffic', 'automação': 'inquiry_automation', 'automacao': 'inquiry_automation', 'preço': 'inquiry_price', 'preco': 'inquiry_price', 'valor': 'inquiry_price' };
    const isSingleHighIntentWord = Object.keys(highIntentKeywords).includes(trimmedMessage);

    for (const intent of tadeusLocalBrain.intents) {
        let currentScore = 0;
        for (const keyword of intent.keywords.primary) { if (lowerCaseMessage.includes(keyword)) { currentScore += (intent.priority || 50); } }
        if (intent.keywords.secondary) { for (const keyword of intent.keywords.secondary) { if (lowerCaseMessage.includes(keyword)) { currentScore += 10; } } }
        if (isSingleHighIntentWord && highIntentKeywords[trimmedMessage] === intent.name) { currentScore += 50; }
        if (currentScore > 0) { scores.push({ intent, score: currentScore }); }
    }

    if (scores.length === 0) return { bestMatch: null, allMatches: [], combinedContext: "Nenhum contexto interno específico foi encontrado." };
    scores.sort((a, b) => b.score - a.score);
    const bestMatch = scores[0];
    const topMatches = scores.slice(0, 2);

    let combinedContext = topMatches.map(match => {
        const intent = match.intent;
        if (typeof intent.responseFunction === 'function') { return `- Sobre '${intent.name}': A resposta para isso é dinâmica e deve ser customizada.`; }
        return `- Sobre '${intent.name}': A resposta padrão é: '${intent.responses[0]}'`;
    }).join('\n');
    
    let bestResponse = null;
    if (bestMatch.intent) {
        if (typeof bestMatch.intent.responseFunction === 'function') { bestResponse = bestMatch.intent.responseFunction(lowerCaseMessage); } 
        else { bestResponse = bestMatch.intent.responses[Math.floor(Math.random() * bestMatch.intent.responses.length)]; }
    }
    return { bestMatch: { ...bestMatch, response: bestResponse }, allMatches: scores, combinedContext: combinedContext, };
}

// ========================================================================
// 4. HELPERS DE API (PLANOS A & B) (ESTÁVEIS)
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
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR (ESTÁVEL)
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Local (v6.2)...");
    const localAnalysis = analyzeLocalBrain(message);

    if (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD) {
        console.log(`Plano C (Cérebro Local) respondeu com alta confiança (${localAnalysis.bestMatch.score}).`);
        reply = localAnalysis.bestMatch.response;
    } else {
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa (Planos A/B).");
        const orchestratedPrompt = `Com base no seu conhecimento e no CONTEXTO INTERNO da empresa fornecido abaixo, responda à pergunta do cliente.\n\n--- CONTEXTO INTERNO RELEVANTE ---\n${localAnalysis.combinedContext}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        try {
            console.log("Executando Plano A: DeepSeek com contexto orquestrado.");
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) throw new Error("DeepSeek API Key not configured.");
            reply = await callDeepSeekAPI(orchestratedPrompt, deepSeekKey);
        } catch (deepSeekError) {
            console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
            try {
                console.log("Executando Plano B: Gemini com contexto orquestrado.");
                const geminiKey = process.env.GEMINI_API_KEY;
                if (!geminiKey) throw new Error("Gemini API Key not configured.");
                reply = await callGeminiAPI(orchestratedPrompt, geminiKey);
            } catch (geminiError) {
                console.error("Plano B (Gemini) falhou:", geminiError.message);
                console.log("Planos A e B falharam. Executando Plano C/D como fallback final.");
                reply = localAnalysis.bestMatch ? localAnalysis.bestMatch.response : tadeusLocalBrain.defaultResponse;
            }
        }
    }
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";
    return { statusCode: finalStatusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ reply: finalReply }) };
};
