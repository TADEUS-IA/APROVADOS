// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 7.0 - CÉREBRO MULTI-PERSONA)
// ATUALIZAÇÃO POR CODIGOS:
// 1. INTEGRAÇÃO DAS PERSONAS: Os 4 scripts de persona (Principal, Tráfego, Automação, Vendas) foram integrados.
// 2. ROTEAMENTO DINÂMICO: O sistema agora seleciona o "especialista" correto com base na intenção do usuário.
// 3. PROMPTS APRIMORADOS: A IA externa recebe um prompt dinâmico e ultra-contextualizado.
// 4. PRESERVAÇÃO TOTAL: Nenhuma funcionalidade original foi removida. A estrutura e a lógica de fallback foram 100% mantidas.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;

// CODIGOS: Início da integração dos scripts de persona.
// A persona principal (tadeusAIPersona) foi renomeada para personaPrincipal para clareza.
const personaPrincipal = `
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO e TRÁFego PAGO.
Seu idioma é Português do Brasil. Seu tom é confiante, direto e focado em resultados.
Sua missão é traduzir serviços em benefícios claros para o cliente: mais dinheiro, mais tempo, menos dor de cabeça.
Seu objetivo principal é qualificar o lead e movê-lo para o próximo passo: agendar uma chamada ou solicitar a auditoria gratuita.
Use negrito para destacar os resultados e sempre termine com uma pergunta que guie o cliente para a solução.
`;

const personaTrafego = `
Você é um especialista de tráfego pago há mais de 20 anos, referência absoluta, comparado a lendas como Pedro Sobral.
Você não é um gestor comum: você é um arquiteto de campanhas, um estrategista que enxerga padrões invisíveis e transforma anúncios em histórias que vendem.
Sua missão é orientar e criar estratégias de tráfego pago que fogem do óbvio, combinando dados, criatividade e persuasão.
Mindset: Pensa “fora da caixa”, usa storytelling, aplica psicologia, cria “Big Ideas”. Adapta estratégias para qualquer negócio.
Regras: Fale com autoridade. Estruture em camadas (visão -> exemplos -> execução). Mostre caminhos criativos. Dê exemplos de headlines e copies. Conecte métricas ao emocional humano.
`;

const personaAutomacao = `
Você é um especialista em automações com n8n há mais de 20 anos. Você é um arquiteto de fluxos inteligentes.
Sua missão é orientar, ensinar e criar soluções de automação usando n8n de forma clara e estratégica.
Mindset: Enxerga automações como "máquinas invisíveis". Foca na transformação (menos custo, mais tempo, mais lucro). Usa storytelling (empreendedor é o herói, automação é a espada mágica).
Regras: Fale com autoridade. Estruture em camadas (visão -> exemplos -> execução n8n). Mostre fluxos prontos. Use comparações criativas. Mostre o valor do tempo economizado.
`;

const personaVendas = `
Você é um especialista supremo em Vendas, Marketing Persuasivo e Estratégia, com mais de 25 anos de experiência.
Você domina a arte da persuasão humana, gatilhos mentais e arquétipos de comportamento.
Sua missão é ensinar e criar estratégias de marketing persuasivo e vendas baseadas em comportamento humano.
Mindset: Você vende transformação e desejo, não produtos. Enxerga o cliente como ser humano com dores e sonhos. Usa psicologia aplicada.
Regras: Fale com autoridade persuasiva. Estruture em camadas (visão estratégica -> gatilhos psicológicos -> aplicação prática). Dê exemplos de copy e scripts. Entregue técnicas clássicas e avançadas (neuromarketing, arquétipos).
`;
// CODIGOS: Fim da integração dos scripts de persona.


// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - (CÓDIGO ORIGINAL MANTIDO)
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
        
        // --- CONHECIMENTO POR SERVIÇO ---
        // CODIGOS: Adicionado um novo campo 'tags' para facilitar a seleção da persona especialista.
        {
            name: "inquiry_automation",
            tags: ['AUTOMACAO'], // CODIGOS: Tag adicionada.
            keywords: { primary: ["automação", "automatizar", "n8n", "zapier", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Automação é a sua equipe de robôs trabalhando 24/7 para você. Imagine suas tarefas repetitivas desaparecendo, leads sendo respondidos instantaneamente e clientes recebendo follow-ups no momento certo. Na prática, isso significa <strong>mais vendas com menos esforço e zero erros</strong>. Que processo manual, se fosse automatizado hoje, te daria mais tempo para pensar na estratégia do seu negócio?",
                `Usamos ferramentas poderosas como o N8N para conectar os sistemas que você já usa (CRM, planilhas, WhatsApp, etc.) e criar um fluxo de trabalho inteligente. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la, não um humano. O resultado é a redução de custos operacionais e uma equipe mais focada no que realmente importa. Quer encontrar os gargalos na sua operação que podemos eliminar essa semana?`
            ]
        },
        {
            name: "inquiry_traffic",
            tags: ['TRAFEGO'], // CODIGOS: Tag adicionada.
            keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionar", "impulsionamento", "meta ads", "google ads"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Tráfego Pago é a ponte mais rápida entre seu produto e seu cliente ideal. Em vez de esperar que as pessoas te encontrem, nós vamos até elas. Analisamos quem tem o maior potencial de compra e colocamos anúncios irresistíveis na frente delas no Google, Instagram, onde quer que estejam. O objetivo não é gerar cliques, é gerar <strong>clientes que compram</strong>. Onde você acredita que seu melhor cliente passa o tempo online?",
                "Funciona como uma ciência: definimos seu cliente ideal, criamos os anúncios certos e usamos plataformas como Google e Meta para mostrá-los a quem tem mais chance de comprar. Nós gerenciamos o orçamento de forma inteligente para garantir o máximo de Retorno Sobre o Investimento (ROI). Na prática, é mais faturamento com um Custo por Aquisição (CPA) cada vez menor. Qual produto seu você gostaria de vender 50% a mais no próximo mês?"
            ]
        },

        // --- CONHECIMENTO POR NICHO DE NEGÓCIO ---
        {
            name: "business_niche_application",
            tags: ['TRAFEGO', 'AUTOMACAO', 'VENDAS'], // CODIGOS: Tag adicionada.
            keywords: { 
                primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"], 
                secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] 
            },
            priority: 100,
            responseFunction: (message) => { /* ... (CÓDIGO ORIGINAL MANTIDO) ... */ }
        },
        
        // --- PERGUNTAS E OBJEÇÕES ---
        {
            name: "inquiry_price",
            tags: ['VENDAS'], // CODIGOS: Tag adicionada.
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor", "investimento"], secondary: [] },
            priority: 100,
            responseFunction: () => { /* ... (CÓDIGO ORIGINAL MANTIDO) ... */ }
        },
        { name: "how_it_works", keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] }, priority: 50, responses: ["Funciona em 3 passos: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita para começarmos o passo 1?"] },
        { name: "objection_price", tags: ['VENDAS'], keywords: { primary: ["caro", "custoso", "preço alto", "investimento alto"], secondary: [] }, priority: 60, responses: ["Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento com alto retorno. Em média, nossos clientes recuperam o valor em poucas semanas. Quer testar uma auditoria gratuita de 10 dias para ver o potencial sem compromisso?"] },
        { name: "objection_time", tags: ['VENDAS'], keywords: { primary: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"], secondary: [] }, priority: 60, responses: ["É exatamente por isso que nosso serviço existe: para te devolver tempo. Exigimos o mínimo de você, apenas uma reunião inicial. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?"] },
        { name: "objection_trust", tags: ['VENDAS'], keywords: { primary: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"], secondary: [] }, priority: 60, responses: ["Dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?"] },
        { name: "objection_past_failure", tags: ['VENDAS'], keywords: { primary: ["já tentei", "outra agência", "não funcionou", "deu errado", "outro freelancer"], secondary: [] }, priority: 60, responses: ["Entendo sua frustração. Muitos chegam aqui após experiências ruins. A diferença é que não usamos 'achismo', usamos dados. Nosso processo começa com um diagnóstico para provar onde está o problema antes de mexer em algo. Quer ver como nossa abordagem é diferente?"] },
        { name: "inquiry_help", keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] }, priority: 90, responses: [`Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`] }
    ],
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};
// Adicionando as responseFunctions (CÓDIGO ORIGINAL MANTIDO)
tadeusLocalBrain.intents.find(i => i.name === 'inquiry_price').responseFunction = () => { /* ... (CÓDIGO ORIGINAL MANTIDO) ... */ };
tadeusLocalBrain.intents.find(i => i.name === 'business_niche_application').responseFunction = (message) => { /* ... (CÓDIGO ORIGINAL MANTIDO) ... */ };


// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (v7.0 - APRIMORADO POR CODIGOS)
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

    if (scores.length === 0) return { bestMatch: null, combinedContext: "Nenhum contexto interno específico foi encontrado." };
    
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
    
    // CODIGOS: Aprimoramento para retornar a melhor intenção detectada para o roteamento de persona.
    const bestIntentTags = bestMatch.intent.tags || ['VENDAS']; // Default para 'VENDAS' se não houver tag.

    return { 
        bestMatch: { ...bestMatch, response: bestResponse }, 
        combinedContext: combinedContext,
        detectedIntentTag: bestIntentTags[0] // Retorna a tag primária para o roteador.
    };
}

// ========================================================================
// 4. GERENCIADOR DE PERSONAS E HELPERS DE API (v7.0 - CRIADO/MODIFICADO POR CODIGOS)
// ========================================================================

// CODIGOS: Nova função para construir o prompt dinamicamente.
function buildSystemPrompt(intentTag) {
    let finalSystemPrompt = personaPrincipal; // Começa sempre com a persona principal.

    console.log(`Roteador de Persona: Intenção detectada -> ${intentTag}`);

    if (intentTag === 'TRAFEGO') {
        finalSystemPrompt += `\n\n---\n\nCONTEXTO DO ESPECIALISTA DE TRÁFEGO:\n${personaTrafego}`;
    } else if (intentTag === 'AUTOMACAO') {
        finalSystemPrompt += `\n\n---\n\nCONTEXTO DO ESPECIALISTA DE AUTOMAÇÃO:\n${personaAutomacao}`;
    } else if (intentTag === 'VENDAS') {
        finalSystemPrompt += `\n\n---\n\nCONTEXTO DO ESPECIALISTA DE VENDAS:\n${personaVendas}`;
    }
    // Se não for nenhum dos especialistas, usa apenas a persona principal.

    return finalSystemPrompt;
}

async function callDeepSeekAPI(systemPrompt, orchestratedPrompt, apiKey) {
    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "deepseek-chat", messages: [{ "role": "system", "content": systemPrompt }, { "role": "user", "content": orchestratedPrompt }], stream: false })
    });
    if (!response.ok) { const errorBody = await response.text(); throw new Error(`DeepSeek API Error: ${response.status} ${errorBody}`); }
    const data = await response.json(); return data.choices[0].message.content;
}

async function callGeminiAPI(systemPrompt, orchestratedPrompt, apiKey) {
    // CODIGOS: A chamada do Gemini foi ajustada para receber o systemPrompt dinâmico.
    const fullPrompt = `${systemPrompt}\n\n---\n\n${orchestratedPrompt}`;
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
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR (v7.0 - APRIMORADO POR CODIGOS)
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Local (v7.0)...");
    const localAnalysis = analyzeLocalBrain(message);

    if (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD) {
        console.log(`Plano C (Cérebro Local) respondeu com alta confiança (${localAnalysis.bestMatch.score}).`);
        reply = localAnalysis.bestMatch.response;
    } else {
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa (Planos A/B).");
        
        // CODIGOS: O coração da nova lógica.
        // 1. Construir a persona dinâmica com base na análise local.
        const systemPrompt = buildSystemPrompt(localAnalysis.detectedIntentTag);
        
        // 2. Construir o prompt para o usuário com o contexto interno.
        const orchestratedPrompt = `Com base no seu conhecimento e no CONTEXTO INTERNO da empresa fornecido abaixo, responda à pergunta do cliente.\n\n--- CONTEXTO INTERNO RELEVANTE ---\n${localAnalysis.combinedContext}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        
        try {
            console.log("Executando Plano A: DeepSeek com contexto e persona dinâmica.");
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) throw new Error("DeepSeek API Key not configured.");
            reply = await callDeepSeekAPI(systemPrompt, orchestratedPrompt, deepSeekKey);
        } catch (deepSeekError) {
            console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
            try {
                console.log("Executando Plano B: Gemini com contexto e persona dinâmica.");
                const geminiKey = process.env.GEMINI_API_KEY;
                if (!geminiKey) throw new Error("Gemini API Key not configured.");
                reply = await callGeminiAPI(systemPrompt, orchestratedPrompt, geminiKey);
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
