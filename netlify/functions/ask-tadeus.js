// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 6.0 - O CONSULTOR ESPECIALISTA)
// ATUALIZAÇÃO: Expansão massiva do Cérebro Local (tadeusLocalBrain) com profundo conhecimento de
// múltiplos nichos de negócio e uma abordagem consultiva sobre investimentos.
// A arquitetura de orquestração (handler) permanece a mesma da v5.2.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;

const tadeusAIPersona = `
Você é “tadeus”, um agente de vendas e consultoria de elite, especialista em AUTOMAÇÃO e TRÁFGO PAGO para pequenas e médias empresas.
Seu idioma é Português do Brasil. Seu tom é o de um vendedor consultivo — direto, confiante, cortês e focado em resultados.
Seu objetivo principal é qualificar o lead e movê-lo para o próximo passo: agendar uma chamada ou solicitar a auditoria gratuita.
Seu objetivo secundário é educar sobre os benefícios dos serviços, tirar dúvidas e remover objeções comuns.
Use negrito para destacar termos importantes e sempre que possível, termine suas respostas com uma pergunta para manter a conversa fluindo.
`;


// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - VERSÃO 6.0: CONSULTOR ESPECIALISTA
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
            ]
        },
        
        // ★★★ INTENÇÃO DE PREÇO/VALOR ATUALIZADA ★★★
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

        // ★★★ INTENÇÃO DE NICHOS DE NEGÓCIO SUPER EXPANDIDA ★★★
        {
            name: "business_niche_application",
            keywords: { 
                primary: [
                    "hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria",
                    "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária",
                    "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor",
                    "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"
                ], 
                secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] 
            },
            priority: 100,
            responseFunction: (message) => {
                const niches = {
                    restaurante: {
                        pain: "a concorrência no iFood é brutal e as taxas são altas.",
                        automation: "um robô no WhatsApp que anota pedidos, recebe pagamentos e envia para a cozinha, criando um canal de vendas direto e sem taxas.",
                        traffic: "anúncios geolocalizados no Instagram para pessoas com fome perto de você, mostrando seu prato do dia."
                    },
                    beleza: { // Cobre barbearia, cosméticos, clínicas de estética
                        pain: "a agenda tem buracos e clientes somem depois do primeiro serviço.",
                        automation: "um sistema de agendamento inteligente que confirma, envia lembretes e, o mais importante, ativa um fluxo de reengajamento 30 dias depois para garantir o retorno do cliente.",
                        traffic: "campanhas de remarketing no Instagram mostrando um antes e depois para quem visitou seu perfil e não agendou."
                    },
                    saude: { // Cobre clínicas, dentistas, psicólogos, personal trainers
                        pain: "muitos pacientes faltam às consultas e a captação de novos depende muito de indicação.",
                        automation: "integração da sua agenda ao WhatsApp para reduzir as faltas em até 80% com lembretes automáticos e facilitar remarcações.",
                        traffic: "anúncios no Google para que você apareça no topo quando alguém pesquisa por 'dentista no seu bairro', por exemplo."
                    },
                    ecommerce: { // Cobre loja, moda, eletrônicos, artesanato
                        pain: "muita gente abandona o carrinho de compras e o custo para atrair um novo cliente é alto.",
                        automation: "um fluxo de recuperação de carrinho abandonado via WhatsApp e E-mail, que converte até 30% das vendas que seriam perdidas.",
                        traffic: "campanhas no Google Shopping e Remarketing no Instagram para 'perseguir' o cliente com o produto que ele demonstrou interesse."
                    },
                    servicos: { // Cobre advogados, profissionais liberais
                        pain: "você gasta muito tempo respondendo as mesmas perguntas iniciais e o processo de qualificação é lento.",
                        automation: "um bot de qualificação que faz as perguntas-chave, filtra os clientes com real potencial e já os direciona para agendar uma reunião na sua agenda.",
                        traffic: "artigos de blog e anúncios no LinkedIn ou Google sobre temas específicos ('como abrir empresa', 'divórcio', etc.) para atrair um público qualificado."
                    },
                    educacao: { // Cobre escolas, cursos online, professores, influenciadores
                        pain: "vender o curso ou conteúdo depende de lançamentos pontuais e é difícil manter o engajamento da base de leads.",
                        automation: "um funil de nutrição perpétuo, que educa e aquece seus leads automaticamente via e-mail e WhatsApp, preparando-os para a compra a qualquer momento.",
                        traffic: "campanhas de captura de leads com iscas digitais (e-books, aulas gratuitas) para construir uma audiência que confia em você."
                    }
                };

                let strategy;
                if (message.includes("restaurante") || message.includes("hamburgueria") || message.includes("pizzaria") || message.includes("doceria") || message.includes("cafeteria") || message.includes("delivery")) strategy = niches.restaurante;
                else if (message.includes("barbearia") || message.includes("cosméticos")) strategy = niches.beleza;
                else if (message.includes("clínica") || message.includes("consultório") || message.includes("dentista") || message.includes("psicólogo") || message.includes("personal trainer")) strategy = niches.saude;
                else if (message.includes("loja") || message.includes("ecommerce") || message.includes("moda") || message.includes("eletrônicos") || message.includes("artesanato")) strategy = niches.ecommerce;
                else if (message.includes("advogado") || message.includes("advocacia") || message.includes("profissional liberal")) strategy = niches.servicos;
                else if (message.includes("escola") || message.includes("curso online") || message.includes("professor") || message.includes("influenciador") || message.includes("criador de conteúdo")) strategy = niches.educacao;

                if (strategy) {
                    return `Excelente! Para negócios como o seu, percebemos que a maior dor geralmente é que ${strategy.pain}<br><br>
                    Nós atacaríamos isso em duas frentes:<br>
                    <strong>1. Com Automação:</strong> Implementando ${strategy.automation}<br>
                    <strong>2. Com Tráfego Pago:</strong> Criando ${strategy.traffic}<br><br>
                    Qual dessas duas soluções resolveria seu problema mais urgente agora?`;
                }
                
                return "Interessante! Para o seu tipo de negócio, podemos aplicar estratégias de automação para organizar seus processos e de tráfego para atrair mais clientes. Qual é o seu maior desafio hoje?";
            }
        },
        
        // ★★★ NOVAS INTENÇÕES BASEADAS EM "DORES" ★★★
        {
            name: "inquiry_lead_generation",
            keywords: { primary: ["gerar leads", "mais clientes", "vender mais", "atrair pessoas", "poucas vendas", "aumentar faturamento"], secondary: ["como", "preciso", "quero"] },
            priority: 90,
            responses: [
                `Entendido. Para gerar mais vendas, atuamos em duas alavancas:<br><br><strong>1. Tráfego Pago:</strong> Vamos buscar clientes novos onde eles estão (Google, Instagram, etc.).<br><br><strong>2. Automação:</strong> Garantimos que nenhum lead que chega seja desperdiçado, com um follow-up imediato e inteligente.<br><br>Você sente que seu problema maior é a falta de gente chegando ou a dificuldade de converter os que chegam?`
            ]
        },
        {
            name: "inquiry_efficiency",
            keywords: { primary: ["organizar", "processos", "bagunça", "perco tempo", "muito trabalho", "sobrecarregado", "equipe pequena"], secondary: ["como", "preciso", "estou"] },
            priority: 90,
            responses: [
                `Eu entendo perfeitamente. A sobrecarga de tarefas manuais é o que impede a maioria das empresas de crescer. É exatamente aqui que a <strong>automação</strong> entra.<br><br>Podemos criar robôs para cuidar do agendamento, do envio de orçamentos, do follow-up e da qualificação de clientes, liberando até 80% do seu tempo operacional.<br><br>Qual tarefa hoje, se você pudesse deletar da sua rotina, te daria mais paz?`
            ]
        },

        // --- DEMAIS INTENÇÕES (já estavam boas e foram mantidas) ---
        {
            name: "how_it_works",
            keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] },
            priority: 50,
            responses: ["Funciona em 3 passos: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita para começarmos o passo 1?"]
        },
        {
            name: "inquiry_help",
            keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] },
            priority: 90,
            responses: [`Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`]
        }
    ],
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};


// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (INTOCADO)
// ========================================================================
function analyzeLocalBrain(message) {
    const lowerCaseMessage = message.toLowerCase();
    let scores = [];

    for (const intent of tadeusLocalBrain.intents) {
        let currentScore = 0;
        for (const keyword of intent.keywords.primary) { if (lowerCaseMessage.includes(keyword)) { currentScore += (intent.priority || 50); } }
        if (intent.keywords.secondary) { for (const keyword of intent.keywords.secondary) { if (lowerCaseMessage.includes(keyword)) { currentScore += 10; } } }
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
// 4. HELPERS DE API (PLANOS A & B) (INTOCADOS)
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
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR (INTOCADO)
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";

    console.log("Analisando com o Cérebro Local (v6.0)...");
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
