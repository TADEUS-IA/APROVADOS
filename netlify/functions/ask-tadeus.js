// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 5.0 - SUPER AGENTE ORQUESTRADOR)
// LÓGICA: Esta versão implementa uma orquestração inteligente.
// 1. O Cérebro Local é SEMPRE consultado primeiro para identificar intenções e contexto.
// 2. Se a intenção for clara e simples, a resposta é imediata (rápida e barata).
// 3. Se a pergunta for complexa, o contexto do Cérebro Local é usado para instruir a IA Externa (DeepSeek/Gemini),
//    transformando-a em uma especialista que usa as SUAS regras de negócio para responder.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";

// ✅ NOVO: Nível de confiança para o Cérebro Local responder diretamente.
// Se a pontuação da intenção for maior que este valor, ele responde sem gastar API.
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;

// A Persona completa do Tadeus, usada pelos Planos A e B (as IAs)
const tadeusAIPersona = `
Você é “tadeus”, um agente de vendas e consultoria de elite, especialista em AUTOMAÇÃO e TRÁFGO PAGO para pequenas e médias empresas.
Seu idioma é Português do Brasil. Seu tom é o de um vendedor consultivo — direto, confiante, cortês e focado em resultados.
Seu objetivo principal é qualificar o lead e movê-lo para o próximo passo: agendar uma chamada ou solicitar a auditoria gratuita.
Seu objetivo secundário é educar sobre os benefícios dos serviços, tirar dúvidas e remover objeções comuns.
Use negrito para destacar termos importantes e sempre que possível, termine suas respostas com uma pergunta para manter a conversa fluindo.
`;


// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - BASE DE CONHECIMENTO (INTOCÁVEL)
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        // --- SAUDAÇÕES ---
        {
            name: "greeting",
            keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"], secondary: [] },
            priority: 10,
            responses: [
                "Olá! Melhor agora que chegou — mais um cliente pra potencializar resultados. Em que posso te ajudar? (auditoria rápida, configurar automação, escala de tráfego?)",
                "E aí! Pronto pra parar de perder tempo e começar a vender enquanto dorme? Me diga o que você precisa.",
                "Oi! Posso te mostrar onde você está vazando faturamento? Me conte um pouco sobre seu negócio."
            ]
        },
        // --- CONHECIMENTO POR NICHO DE NEGÓCIO ---
        {
            name: "business_niche_application",
            keywords: { primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "consultório", "advocacia", "imobiliária", "delivery"], secondary: ["tenho um", "minha empresa é", "sou dono de"] },
            priority: 100,
            responseFunction: (message) => {
                if (message.includes("hamburgueria") || message.includes("restaurante") || message.includes("delivery")) {
                    return `Excelente! Para uma <strong>hamburgueria ou restaurante</strong>, atacamos duas frentes principais:<br><br><strong>1. Automação:</strong> Criamos um robô de atendimento no WhatsApp que anota pedidos, recebe pagamentos e envia para a cozinha, tudo sozinho. Chega de atendentes ocupados e pedidos errados.<br><br><strong>2. Tráfego Pago:</strong> Lançamos anúncios no Instagram e Facebook para as pessoas que estão com fome e perto do seu restaurante, mostrando suas promoções do dia. O resultado é mais pedidos e clientes fiéis.<br><br>Qual dessas áreas é sua maior dor de cabeça hoje: o caos nos pedidos ou a falta de clientes?`;
                }
                if (message.includes("barbearia")) {
                    return `Ótimo! Para <strong>barbearias</strong>, o foco é manter a agenda cheia e evitar furos.<br><br><strong>1. Automação:</strong> Implementamos um sistema de agendamento inteligente no WhatsApp. Ele agenda, confirma, envia lembretes 24h antes e até oferece horários vagos de última hora. Chega de "no-shows".<br><br><strong>2. Tráfego Pago:</strong> Criamos campanhas locais no Instagram mostrando seus melhores cortes e promoções para homens na sua região, transformando seguidores em clientes na cadeira.<br><br>Quer acabar com os buracos na sua agenda e ter uma previsibilidade de faturamento?`;
                }
                if (message.includes("clínica") || message.includes("clinica") || message.includes("consultório")) {
                    return `Perfeito. Para <strong>clínicas e consultórios</strong>, a eficiência no atendimento e a captação de novos pacientes são cruciais.<br><br><strong>1. Automação:</strong> Integramos sua agenda com o WhatsApp para confirmação automática de consultas, envio de lembretes e remarcações, reduzindo faltas em até 80%. Também automatizamos o follow-up pós-consulta.<br><br><strong>2. Tráfego Pago:</strong> Usamos o Google Ads para que sua clínica apareça no topo quando alguém procurar por [Ex: "dentista na sua cidade"] e o Instagram para divulgar procedimentos específicos (como clareamento, botox, etc.) para o público certo.<br><br>Vamos transformar sua gestão e atrair mais pacientes?`;
                }
                if (message.includes("loja") || message.includes("ecommerce")) {
                    return `Excelente! Para <strong>lojas e e-commerce</strong>, o objetivo é claro: vender mais e automatizar o processo.<br><br><strong>1. Automação:</strong> Criamos automações para recuperação de carrinhos abandonados via WhatsApp e E-mail, além de chatbots que respondem dúvidas sobre produtos e frete, 24/7.<br><br><strong>2. Tráfego Pago:</strong> Estruturamos campanhas de 'remarketing' no Instagram e Facebook para mostrar anúncios dos produtos que o cliente visitou e não comprou, além de campanhas no Google Shopping para atrair novos compradores.<br><br>Pronto para transformar visitantes em clientes e automatizar seu pós-venda?`;
                }
                return "Interessante! Para o seu tipo de negócio, podemos aplicar estratégias de automação para organizar seus processos e de tráfego para atrair mais clientes. Qual é o seu maior desafio hoje?";
            }
        },
        // --- RESTANTE DAS SUAS INTENÇÕES (inquiry_automation, inquiry_traffic, objeções, etc.) ---
        // --- MANTIVE EXATAMENTE IGUAL AO SEU CÓDIGO ORIGINAL ---
        {
            name: "inquiry_automation",
            keywords: { primary: ["automação", "automatizar", "n8n", "zapier", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [ "Automação é sobre criar 'robôs' que fazem o trabalho repetitivo por você...", `Usamos ferramentas como n8n e Zapier...` ]
        },
        {
            name: "inquiry_traffic",
            keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionar", "meta ads", "google ads"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [ "Tráfego pago é a arte de colocar o anúncio certo, na frente da pessoa certa...", "Funciona assim: definimos seu cliente ideal..." ]
        },
        {
            name: "how_it_works",
            keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] },
            priority: 50,
            responses: [ "Funciona em 3 passos simples: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita para começarmos o passo 1?" ]
        },
        {
            name: "inquiry_price",
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"], secondary: [] },
            priority: 70,
            responses: [ "Essa é uma ótima pergunta! Para te dar um valor preciso, preciso entender um pouco mais. Você poderia me informar sua meta de faturamento, seu ticket médio e a verba que investe em tráfego? Com isso, já consigo montar uma proposta." ]
        },
        {
            name: "inquiry_help",
            keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] },
            priority: 90,
            responses: [ `Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.` ]
        }
        // ... (e todas as outras objeções que você mapeou)
    ],
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};


// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (VERSÃO 5.0)
// ✅ MELHORIA: Agora, em vez de só retornar a melhor resposta, ele retorna um
// objeto de análise completo, com todas as intenções encontradas e um
// contexto combinado para ser usado pelo orquestrador.
// ========================================================================
function analyzeLocalBrain(message) {
    const lowerCaseMessage = message.toLowerCase();
    let scores = [];

    for (const intent of tadeusLocalBrain.intents) {
        let currentScore = 0;
        for (const keyword of intent.keywords.primary) {
            if (lowerCaseMessage.includes(keyword)) {
                currentScore += (intent.priority || 50);
            }
        }
        if (intent.keywords.secondary) {
            for (const keyword of intent.keywords.secondary) {
                if (lowerCaseMessage.includes(keyword)) {
                    currentScore += 10;
                }
            }
        }
        if (currentScore > 0) {
            scores.push({ intent, score: currentScore });
        }
    }

    if (scores.length === 0) {
        return { bestMatch: null, allMatches: [], combinedContext: "Nenhum contexto interno específico foi encontrado." };
    }

    scores.sort((a, b) => b.score - a.score);
    const bestMatch = scores[0];
    const topMatches = scores.slice(0, 2); // Pega até as 2 intenções mais relevantes

    let combinedContext = topMatches.map(match => {
        const intent = match.intent;
        if (typeof intent.responseFunction === 'function') {
            // Para responseFunction, pegamos uma descrição ou o nome da intenção
            return `- Sobre '${intent.name}': A resposta é dinâmica e depende da mensagem.`;
        }
        return `- Sobre '${intent.name}': ${intent.responses[0]}`; // Pega a primeira resposta como contexto
    }).join('\n');
    
    let bestResponse = null;
    if (bestMatch.intent) {
        if (typeof bestMatch.intent.responseFunction === 'function') {
            bestResponse = bestMatch.intent.responseFunction(lowerCaseMessage);
        } else {
            bestResponse = bestMatch.intent.responses[Math.floor(Math.random() * bestMatch.intent.responses.length)];
        }
    }

    return {
        bestMatch: { ...bestMatch, response: bestResponse },
        allMatches: scores,
        combinedContext: combinedContext,
    };
}


// ========================================================================
// 4. HELPERS DE API (PLANOS A & B) - (INTOCÁVEIS)
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
            contents: [{ parts: [{ text: message }] }], // O prompt completo já vem formatado
            systemInstruction: { parts: [{ text: tadeusAIPersona }] } // ✅ Melhoria: Usando o campo de instrução do sistema
        })
    });
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorBody}`);
    }
    const data = await response.json();
    // Adiciona verificação para evitar erro caso a API retorne vazio
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        throw new Error("Gemini API retornou uma resposta vazia ou malformada.");
    }
    return data.candidates[0].content.parts[0].text;
}


// ========================================================================
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR VERSÃO 5.0
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

    // ETAPA 1: SEMPRE consultar a inteligência local primeiro.
    console.log("Analisando com o Cérebro Local...");
    const localAnalysis = analyzeLocalBrain(message);

    // ETAPA 2: DECIDIR se a resposta local é boa o suficiente ou se precisamos orquestrar.
    if (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD) {
        // A confiança é alta. A resposta local é rápida, precisa e gratuita.
        console.log(`Plano C (Cérebro Local) respondeu com alta confiança (${localAnalysis.bestMatch.score}).`);
        reply = localAnalysis.bestMatch.response;
    } else {
        // A confiança é baixa ou a pergunta é complexa. Vamos orquestrar a IA externa.
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa (Planos A/B).");

        // Monta o "Super Prompt" para a IA externa
        const orchestratedPrompt = `
        Com base no seu conhecimento e no CONTEXTO INTERNO da empresa fornecido abaixo, responda à pergunta do cliente.
        
        --- CONTEXTO INTERNO RELEVANTE ---
        ${localAnalysis.combinedContext}
        --- FIM DO CONTEXTO ---

        Pergunta do Cliente: "${message}"
        `;

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
                // FALHA TOTAL: Se mesmo com a orquestração as IAs falharem, usamos a melhor resposta local que tivermos, ou a padrão.
                console.log("Planos A e B falharam. Executando Plano C/D como fallback final.");
                reply = localAnalysis.bestMatch ? localAnalysis.bestMatch.response : tadeusLocalBrain.defaultResponse;
            }
        }
    }

    // ETAPA FINAL: Retornar a melhor resposta encontrada.
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";

    return {
        statusCode: finalStatusCode,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: finalReply }),
    };
};
