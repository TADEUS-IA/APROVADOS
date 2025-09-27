// ARQUIVO: netlify/functions/ask-tadeus.js

// ========================================================================
// CONFIGURAÇÃO DAS APIs E PERSONA
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;

// A Persona completa do Tadeus, usada pelos Planos A e B (as IAs)
const tadeusAIPersona = `
Você é “tadeus”, um agente de vendas e consultoria especializado em AUTOMAÇÃO e TRÁFGO PAGO...
// COLE AQUI A SUA PERSONA COMPLETA E DETALHADA QUE VOCÊ ME ENVIOU.
// Este é o cérebro das IAs.
`;

// Link do WhatsApp para o Plano C e D
const WHATSAPP_LINK = "https://wa.me/SEUNUMEROAQUI"; // <-- SUBSTITUA PELO SEU LINK DO WHATSAPP

// ========================================================================
// PLANO C: O CÉREBRO LOCAL (FALLBACK ROBUSTO)
// Transformamos suas regras em uma base de conhecimento estruturada.
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        {
            name: "greeting",
            keywords: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"],
            responses: [
                "Olá! Melhor agora que chegou — mais um cliente pra potencializar resultados. Em que posso te ajudar? (auditoria rápida, configurar automação, escala de tráfego?)",
                "E aí! Pronto pra parar de perder tempo e começar a vender enquanto dorme? Me diga o que você precisa.",
                "Oi! Posso te mostrar onde você está vazando faturamento? Me conte um pouco sobre seu negócio."
            ]
        },
        {
            name: "how_it_works",
            keywords: ["como funciona", "o que vocês fazem", "qual o processo", "como é"],
            responses: [
                "Funciona em 3 passos simples: 1) Fazemos um diagnóstico rápido (24h) para encontrar os pontos de melhoria; 2) Implementamos as automações e campanhas iniciais (7–14 dias); 3) Escalamos com otimização contínua. Quer agendar sua auditoria gratuita para começarmos o passo 1?",
                "Nosso processo é direto: primeiro um diagnóstico para entender suas necessidades, depois a implementação da solução e, por fim, a otimização para escalar seus resultados. Podemos começar com uma auditoria sem compromisso, o que acha?"
            ]
        },
        {
            name: "inquiry_price",
            keywords: ["preço", "valor", "quanto custa", "orçamento", "planos"],
            responses: [
                "Essa é uma ótima pergunta! Para te dar um valor preciso, preciso entender um pouco mais. Você poderia me informar sua meta de faturamento mensal, seu ticket médio e a verba que investe em tráfego atualmente? Com isso, já consigo montar uma proposta.",
                "Claro! Nossos planos são personalizados. Para simular o melhor para você, me passe 3 dados: 1) seu ticket médio; 2) seu faturamento mensal; 3) sua verba atual para tráfego."
            ]
        },
        {
            name: "objection_price",
            keywords: ["caro", "custoso", "preço alto", "investimento alto"],
            responses: [
                "Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento. Em média, nossos clientes recuperam o valor investido em poucas semanas com a otimização que fazemos. Quer testar uma auditoria gratuita de 10 dias para ver o potencial de retorno sem compromisso?",
                "Compreendo. O custo é um ponto importante. Posso te enviar um mini-relatório gratuito com 3 ações de alto impacto que você mesmo pode aplicar? Se gostar dos resultados, podemos conversar sobre um plano mais completo."
            ]
        },
        {
            name: "objection_time",
            keywords: ["sem tempo", "não tenho tempo", "muito ocupado", "correria"],
            responses: [
                "É exatamente por isso que nosso serviço existe: para te devolver tempo. O processo exige o mínimo de você: apenas uma reunião inicial de 15-30 minutos para o diagnóstico. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?",
                "Entendo que seu tempo é valioso. Por isso, nosso processo é desenhado para ser o mais eficiente possível. Cuidamos de toda a implementação e te enviamos relatórios resumidos. Que tal uma conversa rápida de 15 minutos para eu te mostrar como podemos te poupar dezenas de horas por mês?"
            ]
        },
        {
            name: "objection_trust",
            keywords: ["funciona", "garantia", "confio", "dá resultado", "certeza"],
            responses: [
                "Essa é uma dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?",
                "Entendo sua cautela. Oferecemos uma auditoria gratuita de 10 dias justamente para isso: para você ver o potencial de resultado sem nenhum risco. Se ao final dos 10 dias você não estiver satisfeito, não há nenhum compromisso. Quer começar?"
            ]
        },
        {
            name: "inquiry_help",
            keywords: ["ajuda", "suporte", "contato", "falar com"],
            responses: [
                `Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`
            ]
        }
    ],
    // Resposta final se nenhuma intenção for encontrada
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};

// Motor de busca do cérebro local (Plano C)
function getLocalResponse(message) {
    const lowerCaseMessage = message.toLowerCase();
    for (const intent of tadeusLocalBrain.intents) {
        for (const keyword of intent.keywords) {
            if (lowerCaseMessage.includes(keyword)) {
                // Retorna uma das respostas possíveis aleatoriamente para não parecer robótico
                return intent.responses[Math.floor(Math.random() * intent.responses.length)];
            }
        }
    }
    return null; // Nenhuma intenção encontrada
}

// ========================================================================
// FUNÇÕES HELPER PARA CHAMAR AS APIs
// ========================================================================

async function callDeepSeekAPI(message, apiKey) {
    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": message }],
            stream: false
        })
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`DeepSeek API Error: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

async function callGeminiAPI(message, apiKey) {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: tadeusAIPersona + "\n\nUsuário: " + message }] }]
        })
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}


// ========================================================================
// FUNÇÃO PRINCIPAL (HANDLER) COM LÓGICA DE MÚLTIPLOS NÍVEIS
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { message } = JSON.parse(event.body);
    if (!message) {
        return { statusCode: 400, body: 'Bad Request: message is required.' };
    }

    let reply = "";

    // --- PLANO A: TENTAR DEEPSEEK ---
    try {
        console.log("Executando Plano A: DeepSeek");
        const deepSeekKey = process.env.DEEPSEEK_API_KEY;
        if (!deepSeekKey) throw new Error("DeepSeek API Key not configured.");
        reply = await callDeepSeekAPI(message, deepSeekKey);
    } catch (deepSeekError) {
        console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);

        // --- PLANO B: TENTAR GEMINI ---
        try {
            console.log("Executando Plano B: Gemini");
            const geminiKey = process.env.GEMINI_API_KEY;
            if (!geminiKey) throw new Error("Gemini API Key not configured.");
            reply = await callGeminiAPI(message, geminiKey);
        } catch (geminiError) {
            console.error("Plano B (Gemini) falhou:", geminiError.message);
            
            // --- PLANO C: USAR CÉREBRO LOCAL ---
            console.log("Executando Plano C: Cérebro Local");
            reply = getLocalResponse(message);

            // --- PLANO D: FALLBACK FINAL ---
            if (!reply) {
                console.log("Plano C não encontrou resposta. Executando Plano D.");
                reply = tadeusLocalBrain.defaultResponse;
            }
        }
    }

    // Retornar a resposta encontrada (seja do Plano A, B, C ou D)
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";

    return {
        statusCode: finalStatusCode,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: finalReply }),
    };
};
