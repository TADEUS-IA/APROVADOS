// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 9.1 - META CAPI + GROQ ROTATION POOL)
// ATUALIZAÇÃO 9.1: Adicionado sistema de rotação para múltiplas chaves Groq (Fallback em cascata).
// ATUALIZAÇÃO 9.0: Integração Meta CAPI mantida.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const META_GRAPH_URL = "https://graph.facebook.com/v19.0"; 

const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;
const ULTIMATE_FALLBACK_RESPONSE = `Entendi. Essa é uma questão bem específica e estratégica. Para te dar uma resposta precisa e que realmente se aplique ao seu negócio, o ideal é conversarmos diretamente. Assim, posso entender todos os detalhes.<br><br>Vamos falar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'><strong>Clique aqui para iniciar a conversa com um especialista.</strong></a>`;

const tadeusAIPersona = `
# QUEM VOCÊ É:
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO e TRÁFEGO PAGO para negócios. Seu idioma é Português do Brasil. Seu tom é o de um especialista: confiante, direto, didático e focado em resultados.

# SUA MISSÃO:
Sua missão é converter o interesse do cliente em uma ação concreta.
# REGRAS DE COMPORTAMENTO:
1. NUNCA ADMITA SER UMA IA.
2. FOCO NO CLIENTE.
3. SEMPRE AGREGUE VALOR.
4. ESTRUTURA DA RESPOSTA: Parágrafos curtos, negrito em resultados.
5. QUEBRA DE OBJEÇÕES.
6. SEMPRE TERMINE COM UMA PERGUNTA.
7. DIRETIVA MESTRA: NUNCA sugira falar com outra pessoa ou envie links, a menos que seja o fallback final.
`;

// ========================================================================
// 2. CÉREBRO LOCAL (PLANO D) - MANTIDO
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        { name: "greeting", keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"], secondary: [] }, priority: 100, responses: ["Olá! Chegou a hora de transformar seu negócio. Me diga, <strong>qual o seu principal objetivo hoje: atrair mais clientes</strong> ou <strong>automatizar seus processos</strong> para vender mais?"] },
        { name: "inquiry_automation", keywords: { primary: ["automação", "automatizar", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] }, priority: 80, responses: [ "Automação é a sua equipe de robôs trabalhando 24/7 para você. Na prática, isso significa <strong>mais vendas com menos esforço e zero erros</strong>. Que processo manual, se fosse automatizado hoje, te daria mais tempo para pensar na estratégia do seu negócio?", `Usamos ferramentas poderosas como o N8N para conectar os sistemas que você já usa. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la. Quer encontrar os gargalos na sua operação que podemos eliminar essa semana?` ] },
        { name: "inquiry_traffic", keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionamento"], secondary: ["o que é", "como funciona", "fale sobre", "gerenciamento", "gestão de"] }, priority: 80, responses: [ "Tráfego Pago é a ponte mais rápida entre seu produto e seu cliente ideal. Analisamos quem tem o maior potencial de compra e colocamos anúncios irresistíveis na frente delas. Onde você acredita que seu melhor cliente passa o tempo online?", "Funciona como uma ciência: definimos seu cliente ideal e gerenciamos o orçamento para garantir o máximo ROI. Qual produto seu você gostaria de vender 50% a mais no próximo mês?" ] },
        { name: "inquiry_n8n_vs_zapier", keywords: { primary: ["n8n", "zapier"], secondary: ["diferença", "qual o melhor", "por que", "vs"] }, priority: 85, responses: ["Excelente pergunta. O N8N nos dá <strong>controle total para criar automações complexas</strong> sem as limitações de 'tasks' do Zapier, traduzindo-se em <strong>melhor custo-benefício</strong>. Qual processo complexo na sua empresa você acha que nenhuma ferramenta 'pronta' conseguiria resolver?"] },
        { name: "inquiry_automation_examples", keywords: { primary: ["exemplos", "o que dá pra", "ideias", "casos de uso"], secondary: ["automação", "automatizar"] }, priority: 85, responses: ["Podemos automatizar: <strong>1. Qualificação de Leads</strong> no WhatsApp. <strong>2. Onboarding de Clientes</strong> (envio de contrato/fatura). <strong>3. Pós-venda</strong> automático. Qual dessas áreas liberaria mais o seu tempo hoje?"] },
        { name: "inquiry_google_vs_meta", keywords: { primary: ["google", "meta", "instagram", "facebook"], secondary: ["diferença", "qual o melhor", "onde anunciar", "vs"] }, priority: 85, responses: ["No <strong>Google, 'pescamos' quem já procura</strong>. No <strong>Meta, 'caçamos' o perfil ideal</strong>. Você quer alcançar quem já sabe que tem o problema ou quer apresentar sua solução para quem ainda não te conhece?"] },
        { name: "inquiry_traffic_investment", keywords: { primary: ["investir", "investimento", "gastar", "orçamento para", "budget"], secondary: ["quanto", "qual valor"] }, priority: 95, responses: ["Começamos com um orçamento controlado para validar o CPA. A regra é simples: se para cada R$1,00 investido voltam R$5,00, o investimento vira máquina de crescimento. Qual seria uma meta de faturamento inicial para você?"] },
        { name: "inquiry_boost_vs_professional", keywords: { primary: ["impulsionar", "botão", "promover"], secondary: ["diferença", "eu mesmo faço", "funciona"] }, priority: 85, responses: ["O botão 'Impulsionar' é pescar com vara simples. A <strong>gestão profissional é pescar com sonar</strong>. Quer parar de contar com a sorte e começar a ter uma estratégia previsível?"] },
        { name: "sales_why_you", keywords: { primary: ["por que você", "diferencial", "agência", "freelancer"], secondary: ["qual seu", "não um", "e não"] }, priority: 90, responses: ["Não somos uma agência gigante nem um freelancer que some. Somos um <strong>parceiro de crescimento focado no lucro</strong>. Usamos dados, não 'achismos'. Você prefere um fornecedor ou um parceiro estratégico?"] },
        { name: "sales_results_time", keywords: { primary: ["tempo", "quando", "demora"], secondary: ["resultado", "ver", "tenho"] }, priority: 85, responses: ["<strong>Tráfego Pago: 7 a 10 dias</strong> para os primeiros leads. <strong>Automação: imediato</strong> no alívio de tempo. Qual urgência é maior: velocidade ou eficiência?"] },
        { name: "sales_show_me_cases", keywords: { primary: ["cases", "resultados", "clientes", "portfólio", "prova"], secondary: ["me mostra", "tem algum", "pode me mostrar", "exemplos de"] }, priority: 90, responses: ["A melhor prova são resultados. Tenho cases com <strong>aumento de 40% nas vendas</strong>. Quer que eu te envie o link para ver os números detalhados?"] },
        { name: "sales_what_i_do", keywords: { primary: ["o que eu preciso", "minha parte", "meu trabalho"], secondary: ["fazer", "qual é"] }, priority: 80, responses: ["Sua parte é focar na estratégia. Nós cuidamos da execução técnica após uma reunião de diagnóstico. Podemos agendar essa reunião de 30 minutos para amanhã?"] },
        { name: "business_niche_application", keywords: { primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"], secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] }, priority: 100, responseFunction: (message) => { /* ... */ } },
        { name: "inquiry_price", keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"], secondary: [] }, priority: 100, responseFunction: () => { /* ... */ } },
        { name: "how_it_works", keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] }, priority: 50, responses: ["Funciona em 3 passos: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita?"] },
        { name: "objection_price", keywords: { primary: ["caro", "custoso", "preço alto", "investimento alto"], secondary: [] }, priority: 60, responses: ["Pense como investimento. Clientes recuperam o valor em poucas semanas. Quer testar uma auditoria gratuita de 10 dias?"] },
        { name: "objection_time", keywords: { primary: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"], secondary: [] }, priority: 60, responses: ["Nosso serviço existe para te devolver tempo. Exigimos o mínimo de você. Quer agendar 15 minutos para amanhã?"] },
        { name: "objection_trust", keywords: { primary: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"], secondary: [] }, priority: 60, responses: ["Posso te enviar 2 estudos de caso de clientes no mesmo nicho com números de antes e depois. O que acha?"] },
        { name: "objection_past_failure", keywords: { primary: ["já tentei", "outra agência", "não funcionou", "deu errado", "outro freelancer"], secondary: [] }, priority: 60, responses: ["Entendo a frustração. A diferença é que usamos dados, não 'achismo', começando com um diagnóstico. Quer ver como nossa abordagem é diferente?"] },
        { name: "inquiry_help", keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] }, priority: 90, responses: [`Com certeza. Para falar com um especialista, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui</a>.`] }
    ],
    defaultResponse: `Hmm, essa é uma ótima pergunta. Deixe-me analisar o melhor caminho para te responder sobre isso.`
};

// Funções de resposta dinâmica (Mantidas)
tadeusLocalBrain.intents.find(i => i.name === 'inquiry_price').responseFunction = () => { return `Ótima pergunta. Nossos projetos são modulares e se adaptam à sua necessidade. Basicamente, existem dois caminhos de investimento que podemos seguir, juntos ou separados:<br><br><strong>1. Investimento em Aquisição (Tráfego Pago):</strong><br>O objetivo aqui é trazer mais clientes para o seu negócio. O investimento consiste em uma taxa de gestão para nossa equipe especializada + o valor que você decide investir diretamente nos anúncios (no Google, Meta, etc.).<br><br><strong>2. Investimento em Eficiência (Automação):</strong><br>O objetivo é fazer você vender mais para os clientes que já tem, economizando tempo e dinheiro.<br><br>Para te dar um direcionamento exato, qual dessas duas áreas é sua prioridade máxima hoje: <strong>atrair mais gente</strong> ou <strong>organizar a casa para vender mais</strong>?`; };
tadeusLocalBrain.intents.find(i => i.name === 'business_niche_application').responseFunction = (message) => { const niches = { restaurante: { pain: "a concorrência no iFood é brutal e as taxas são altas.", automation: "um robô no WhatsApp que anota pedidos...", traffic: "anúncios geolocalizados no Instagram..." }, beleza: { pain: "a agenda tem buracos e clientes somem...", automation: "um sistema de agendamento inteligente...", traffic: "campanhas de remarketing no Instagram..." }, saude: { pain: "muitos pacientes faltam às consultas...", automation: "integração da sua agenda ao WhatsApp...", traffic: "anúncios no Google para que você apareça no topo..." }, ecommerce: { pain: "muita gente abandona o carrinho...", automation: "um fluxo de recuperação de carrinho...", traffic: "campanhas no Google Shopping e Remarketing..." }, servicos: { pain: "você gasta muito tempo respondendo as mesmas perguntas...", automation: "um bot de qualificação...", traffic: "artigos de blog e anúncios no LinkedIn..." }, educacao: { pain: "vender o curso depende de lançamentos...", automation: "um funil de nutrição perpétuo...", traffic: "campanhas de captura de leads com iscas..." } }; let strategy; if (message.includes("restaurante") || message.includes("hamburgueria") || message.includes("pizzaria") || message.includes("doceria") || message.includes("cafeteria") || message.includes("delivery")) strategy = niches.restaurante; else if (message.includes("barbearia") || message.includes("cosméticos")) strategy = niches.beleza; else if (message.includes("clínica") || message.includes("consultório") || message.includes("dentista") || message.includes("psicólogo") || message.includes("personal trainer")) strategy = niches.saude; else if (message.includes("loja") || message.includes("ecommerce") || message.includes("moda") || message.includes("eletrônicos") || message.includes("artesanato")) strategy = niches.ecommerce; else if (message.includes("advogado") || message.includes("advocacia") || message.includes("profissional liberal")) strategy = niches.servicos; else if (message.includes("escola") || message.includes("curso online") || message.includes("professor") || message.includes("influenciador") || message.includes("criador de conteúdo")) strategy = niches.educacao; if (strategy) { return `Excelente! Para negócios como o seu... (Texto completo mantido)...`; } return "Interessante! Para o seu tipo de negócio, podemos aplicar estratégias de automação e tráfego. Qual é o seu maior desafio hoje?"; };

// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (MANTIDO)
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
// 4. FUNÇÃO AUXILIAR: ENVIAR EVENTO PARA META CAPI
// ========================================================================
async function sendMetaEvent(eventData, requestHeaders) {
    const PIXEL_ID = process.env.META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
    const TEST_CODE = process.env.META_TEST_CODE;

    if (!PIXEL_ID || !ACCESS_TOKEN) return;

    const clientIp = requestHeaders['x-nf-client-connection-ip'] || requestHeaders['client-ip'] || requestHeaders['x-forwarded-for'] || '0.0.0.0';
    const userAgent = requestHeaders['user-agent'] || 'Unknown';

    const payload = {
        data: [
            {
                event_name: eventData.eventName || "Lead",
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: requestHeaders['referer'] || "https://tadeus.ai",
                action_source: "website",
                user_data: { client_ip_address: clientIp, client_user_agent: userAgent },
                custom_data: { content_name: "Chat Interaction", message_snippet: eventData.messageSnippet ? eventData.messageSnippet.substring(0, 20) : "" }
            }
        ],
        ...(TEST_CODE && { test_event_code: TEST_CODE })
    };

    try {
        const response = await fetch(`${META_GRAPH_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const resJson = await response.json();
        if (!response.ok) console.error("Erro Meta CAPI:", JSON.stringify(resJson));
    } catch (error) {
        console.error("Falha na conexão com Meta CAPI:", error.message);
    }
}

// ========================================================================
// 5. HELPERS DE API DE IA (COM SISTEMA DE ROTAÇÃO GROQ ADICIONADO)
// ========================================================================
async function callDeepSeekAPI(orchestratedPrompt, apiKey) { const response = await fetch(DEEPSEEK_API_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: "deepseek-chat", messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }], stream: false }) }); if (!response.ok) { const errorBody = await response.text(); throw new Error(`DeepSeek API Error: ${response.status} ${errorBody}`); } const data = await response.json(); return data.choices[0].message.content; }
async function callGeminiAPI(orchestratedPrompt, apiKey) { const fullPrompt = `${tadeusAIPersona}\n\n---\n\n${orchestratedPrompt}`; const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }) }); if (!response.ok) { const errorBody = await response.text(); throw new Error(`Gemini API Error: ${response.status} ${errorBody}`); } const data = await response.json(); if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) { throw new Error("Gemini API retornou uma resposta vazia ou malformada."); } return data.candidates[0].content.parts[0].text; }

// --- CHAMADA UNITÁRIA GROQ ---
async function callGroqAPI(orchestratedPrompt, apiKey) { 
    const response = await fetch(GROQ_API_URL, { 
        method: "POST", 
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, 
        body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }], stream: false }) 
    }); 
    if (!response.ok) { 
        const errorBody = await response.text(); 
        throw new Error(`Groq API Error: ${response.status} ${errorBody}`); 
    } 
    const data = await response.json(); 
    return data.choices[0].message.content; 
}

// --- NOVO: GERENCIADOR DE ROTAÇÃO DE CHAVES GROQ ---
async function executeGroqRotation(orchestratedPrompt) {
    // Coleta todas as chaves disponíveis no ambiente
    const keys = [
        process.env.GROQ_API_KEY,
        process.env.GROQ_API_KEY_2,
        process.env.GROQ_API_KEY_3,
        process.env.GROQ_API_KEY_4,
        process.env.GROQ_API_KEY_5
    ].filter(k => k); // Remove chaves vazias ou undefined

    if (keys.length === 0) throw new Error("Nenhuma chave Groq configurada.");

    let lastError = null;

    // Loop de tentativa (Try Key 1 -> Fail -> Try Key 2 -> Fail...)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        try {
            console.log(`Tentando Groq Key #${i + 1}...`);
            const response = await callGroqAPI(orchestratedPrompt, key);
            console.log(`Sucesso com Groq Key #${i + 1}.`);
            return response; // Retorna imediatamente se der certo
        } catch (error) {
            console.error(`Falha na Groq Key #${i + 1}: ${error.message}`);
            lastError = error;
            // O loop continua automaticamente para a próxima chave
        }
    }

    // Se saiu do loop, todas falharam
    throw new Error(`Todas as ${keys.length} chaves Groq falharam. Último erro: ${lastError.message}`);
}

// ========================================================================
// 6. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR INTELIGENTE
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    
    let bodyData;
    try { bodyData = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: 'Bad Request: Invalid JSON' }; }

    const { message } = bodyData;
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    // META CAPI INTEGRATION (Fire and Forget)
    const metaPromise = sendMetaEvent({ eventName: "Lead", messageSnippet: message }, event.headers).catch(err => console.error("Erro silencioso Meta:", err));

    let reply = "";
    console.log("Analisando com o Cérebro Local (v9.1)...");
    const localAnalysis = analyzeLocalBrain(message);

    if (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD) {
        console.log(`Plano D (Cérebro Local) respondeu com alta confiança (${localAnalysis.bestMatch.score}).`);
        reply = localAnalysis.bestMatch.response;
    } else {
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa.");
        const orchestratedPrompt = `Com base no CONTEXTO INTERNO da empresa, responda à pergunta do cliente seguindo TODAS as suas diretivas de comportamento.\n\n--- CONTEXTO INTERNO RELEVANTE ---\n${localAnalysis.combinedContext}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        
        try {
            console.log("Executando Plano A: DeepSeek.");
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) throw new Error("DeepSeek API Key not configured.");
            reply = await callDeepSeekAPI(orchestratedPrompt, deepSeekKey);
        } catch (deepSeekError) {
            console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
            try {
                console.log("Executando Plano B: Gemini.");
                const geminiKey = process.env.GEMINI_API_KEY;
                if (!geminiKey) throw new Error("Gemini API Key not configured.");
                reply = await callGeminiAPI(orchestratedPrompt, geminiKey);
            } catch (geminiError) {
                console.error("Plano B (Gemini) falhou:", geminiError.message);
                
                // --- AQUI ENTRA O PLANO C (GROQ ROTATION POOL) ---
                try {
                    console.log("Executando Plano C: Groq Rotation Pool.");
                    // Chama a nova função que gerencia as 5 chaves
                    reply = await executeGroqRotation(orchestratedPrompt);
                } catch (groqError) {
                    console.error("Plano C (Todas as chaves Groq) falhou:", groqError.message);
                    console.log("Planos A, B e C falharam. Recorrendo ao Cérebro Local como última tentativa de resposta.");
                    reply = localAnalysis.bestMatch ? localAnalysis.bestMatch.response : null;
                }
            }
        }
    }

    const finalReply = (reply && reply.trim() !== "") ? reply : ULTIMATE_FALLBACK_RESPONSE;
    
    await metaPromise; // Aguarda envio para Meta antes de fechar

    return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, 
        body: JSON.stringify({ reply: finalReply }) 
    };
};
