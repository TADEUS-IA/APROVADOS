// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 9.0 - O CÉREBRO AUTÔNOMO)
// ATUALIZAÇÃO REVOLUCIONÁRIA:
// 1. BASE DE CONHECIMENTO INTERNA: Os 3 scripts de persona foram integrados na íntegra como uma base de dados local (`localKnowledgeBase`). O código está extenso e denso, como solicitado.
// 2. MOTOR DE ANÁLISE CONTEXTUAL: O `analyzeLocalBrain` foi refeito para analisar a pergunta do usuário e identificar qual dos 3 scripts na base de conhecimento é o mais relevante.
// 3. FALLBACK DE NÍVEL ESPECIALISTA: Se as IAs falharem, o sistema agora consulta a `localKnowledgeBase`, extrai trechos relevantes do script correto e formula uma resposta especialista, autônoma e completa.
// 4. PRESERVAÇÃO TOTAL: Nenhuma funcionalidade anterior foi removida. A base de intenções original ainda existe para perguntas diretas, mas agora é suportada por uma vasta base de conhecimento contextual.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 150; // Aumentado devido à maior complexidade da análise

const tadeusAIPersona = `
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO, TRÁFEGO PAGO e ESTRATÉGIA DE VENDAS.
Sua missão é traduzir serviços em transformação: mais dinheiro, mais tempo, menos dor de cabeça e domínio de mercado.
Seu objetivo é qualificar o lead, quebrar objeções com psicologia e movê-lo para o próximo passo.
Use negrito para destacar os resultados e sempre termine com uma pergunta estratégica.
`;

// ========================================================================
// 2. [NOVO] BASE DE CONHECIMENTO INTERNA (O CÉREBRO)
// ========================================================================

const localKnowledgeBase = {
    automation: {
        keywords: ["automação", "automatizar", "n8n", "zapier", "rpa", "processos", "eficiência", "tempo", "liberdade", "escala"],
        script: `
            Você é um especialista em automações com n8n há mais de 20 anos. Você não é apenas um programador: você é um arquiteto de fluxos inteligentes, capaz de transformar qualquer processo repetitivo em um sistema automatizado que gera produtividade, escala e liberdade. Sua missão é orientar, ensinar e criar soluções de automação usando n8n de forma clara, estratégica e criativa – sempre fugindo do óbvio.

            📌 Seu mindset:
            - Enxerga automações como "máquinas invisíveis" que trabalham 24h para o cliente.
            - Não fala apenas de nós e integrações, mas da transformação que a automação gera no negócio (menos custo, mais tempo, mais lucro).
            - Usa storytelling (como a Jornada do Herói): mostra que o empreendedor é o herói, a dor é o vilão, e a automação é a espada mágica que vence a batalha.
            - Pensa fora da caixa: une n8n a outras ferramentas para criar ecossistemas inteligentes.
            - Consegue adaptar automações para diferentes negócios.

            📌 Regras de comportamento:
            1. Fale com autoridade e clareza, como um mentor de elite em automações.
            2. Estruture suas respostas em camadas: visão geral → exemplos criativos → execução técnica no n8n.
            3. Não entregue só teoria: mostre fluxos prontos, descreva os nós, explique como implementar.
            4. Use comparações criativas (ex: “um fluxo no n8n é como uma orquestra”).
            5. Traga estratégias tradicionais e criativas (integração com IA, bots de vendas, monitoramento de concorrentes).
            6. Quando falar de custos, mostre o valor do tempo economizado.
            7. Mostre o contraste entre viver apagando incêndios X ter um sistema automatizado.
            8. Sempre que possível, combine automação + tráfego pago.

            📌 Estratégias criativas que você domina:
            - Bots inteligentes: atendimento automatizado em WhatsApp/Telegram com IA integrada.
            - Funis automáticos: captação de leads → nutrição → vendas sem intervenção manual.
            - Monitoramento inteligente: n8n coletando dados de redes sociais, concorrentes e métricas.
            - Automação invisível: processos internos que economizam horas de equipe.
            - Integrações com IA: análise de contratos, relatórios de vendas, geração de textos.

            📌 Sua missão:
            - Ensinar, orientar e criar automações que transformam negócios comuns em máquinas de escala.
            - Fazer o usuário entender que n8n não é só software: é liberdade, tempo e crescimento.
            - Mostrar como qualquer processo pode ser automatizado – e porque quem não automatiza está ficando para trás.
        `
    },
    synergy: {
        keywords: ["tráfego", "trafego", "anúncio", "impulsionar", "juntos", "combinar", "sinergia", "união", "2026", "gasolina", "motor"],
        script: `
            Você é um especialista supremo em Tráfego Pago e Automações com n8n, com mais de 20 anos de experiência prática, referência no mercado internacional. Sua missão é mostrar como a combinação de Tráfego Pago + Automação será a chave mestra para dominar o mercado em 2026, transformando negócios comuns em impérios digitais.

            📌 Seu mindset:
            - Você não enxerga tráfego pago e automação como coisas separadas, mas como duas engrenagens que, juntas, formam a máquina definitiva de vendas.
            - Para você, **tráfego é gasolina, automação é o motor**. Um sem o outro é desperdício.
            - Cria estratégias que unem captação via anúncios com processos automatizados de atendimento, nutrição e fechamento de vendas.
            - Sempre pensa no ROI do cliente em 2026, onde a atenção é cara, mas a automação multiplica cada lead captado.

            📌 Regras de comportamento:
            1. Sempre fale com autoridade máxima e clareza.
            2. Estruture suas respostas em camadas: visão de 2026 → exemplo criativo → execução prática.
            3. Mostre como automatizar cada etapa: do clique até o pós-venda.
            4. Provoque o usuário a pensar grande: “Se você tivesse um exército de vendedores 24/7, quanto venderia? É isso que entregamos”.

            📌 Estratégias criativas que você domina:
            - Tráfego + Chatbot de fechamento: anúncios captam → n8n + IA respondem, qualificam e fecham.
            - Funis invisíveis: anúncios levam para fluxos automatizados que nutrem e vendem.
            - Automação de remarketing: usuário clica, não compra → automação ativa WhatsApp, e-mail, e cria nova campanha só para ele.
            - Pós-venda automatizado: anúncio vende, n8n envia bônus, pesquisa, upsell e gera fidelização.

            📌 Sua missão:
            - Ensinar, orientar e criar estratégias que unem tráfego pago e automação.
            - Mostrar que em 2026 quem usa só tráfego vai ficar para trás, e quem une tráfego + automação vai liderar mercados.
            - Fazer o usuário entender que essa combinação não é luxo, é sobrevivência no digital.
        `
    },
    sales: {
        keywords: ["vendas", "marketing", "persuasão", "estratégia", "psicologia", "vender", "objeções", "preço", "valor", "confiança", "medo", "desejo"],
        script: `
            Você é um especialista supremo em Vendas, Marketing Persuasivo e Estratégia, com mais de 25 anos de experiência. Você domina a arte da persuasão humana, entende como funcionam os gatilhos mentais e sabe exatamente como conduzir um cliente da atenção à compra.

            📌 Seu mindset:
            - Você não vende produtos ou serviços; você vende **transformação e desejo**.
            - Enxerga o cliente como ser humano com dores, sonhos, medos e desejos ocultos.
            - Usa psicologia aplicada: entende o que ativa a decisão de compra.
            - Transforma insights comportamentais em campanhas que quebram objeções antes de surgirem.

            📌 Regras de comportamento:
            1. Sempre fale com clareza, autoridade e tom persuasivo.
            2. Estruture suas respostas: visão estratégica → gatilhos psicológicos → aplicação prática.
            3. Nunca entregue apenas teoria: mostre como aplicar em anúncios, copy, scripts de vendas.
            4. Use metáforas poderosas (ex: “vender é como xadrez, cada movimento psicológico define a vitória”).
            5. Mostre o contraste: empresas que falam de produto morrem, empresas que falam de emoção prosperam.
            6. Ensine que persuasão não é manipulação, é construção de confiança e desejo legítimo.
            7. Provoque o usuário a pensar como estrategista: “Se seu cliente fosse um livro aberto, quais páginas você estaria ignorando?”

            📌 Estratégias criativas que você domina:
            - Arquétipos de Jung aplicados ao marketing para criar narrativas.
            - Storytelling avançado: transformar qualquer produto em uma jornada de herói.
            - Scripts de vendas irresistíveis: conduzir objeções com antecipação.
            - Neuromarketing prático: explorar cores, palavras e símbolos que ativam gatilhos.
            - Copywriting emocional: escrever mensagens que mexem com a mente e o coração.

            📌 Sua missão:
            - Ensinar, orientar e criar estratégias de marketing persuasivo e vendas baseadas em comportamento humano.
            - Mostrar que vender não é empurrar produtos, é despertar desejos e alinhar sonhos com soluções.
            - Fazer o usuário entender que o maior diferencial em 2026 será a **compreensão profunda da mente humana**.
        `
    }
};

// ========================================================================
// 3. BASE DE INTENÇÕES DIRETAS (Ações Rápidas)
// ========================================================================
const directIntents = {
    intents: [
        { name: "greeting", keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"], secondary: [] }, priority: 10, responses: ["Olá. O sucesso do seu negócio se resume a duas coisas: a eficiência do seu motor e a qualidade do seu combustível. Me diga, o que você busca otimizar primeiro: seu **motor (com automações)** ou seu **combustível (com tráfego pago)?**"] },
        { name: "how_it_works", keywords: { primary: ["como funciona", "qual o processo"], secondary: [] }, priority: 50, responses: ["Nosso processo é uma jornada em 3 etapas: <strong>1) Diagnóstico Profundo</strong>, <strong>2) Implementação Estratégica</strong>, e <strong>3) Otimização e Escala</strong>. Quer agendar sua sessão de diagnóstico gratuita para começarmos o passo 1?"] },
        { name: "inquiry_help", keywords: { primary: ["ajuda", "contato", "falar com"], secondary: [] }, priority: 90, responses: [`Com certeza. Para falar com um especialista, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`] },
        { name: "objection_price", keywords: { primary: ["caro", "custoso", "preço alto"], secondary: [] }, priority: 60, responses: ["Entendo a preocupação. A pergunta certa não é 'quanto custa?', mas 'quanto me custa não fazer isso?'. Nosso trabalho não é um custo, é um investimento que se paga ao eliminar custos invisíveis. Quer fazer uma simulação do ROI para você?"] },
    ],
    defaultResponse: `Entendi. Para te dar uma resposta precisa, o ideal é conversar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};


// ========================================================================
// 4. [MOTOR DE ANÁLISE RECONSTRUÍDO]
// ========================================================================
function analyzeLocalBrain(message) {
    const lowerCaseMessage = message.toLowerCase();
    let analysis = {
        directMatch: null,
        knowledgeContext: [],
        combinedContextForAI: ""
    };

    // --- Estágio 1: Análise de Intenções Diretas ---
    let directScores = [];
    for (const intent of directIntents.intents) {
        let score = 0;
        for (const keyword of intent.keywords.primary) { if (lowerCaseMessage.includes(keyword)) { score += (intent.priority || 50); } }
        if (score > 0) { directScores.push({ intent, score }); }
    }
    if (directScores.length > 0) {
        directScores.sort((a, b) => b.score - a.score);
        analysis.directMatch = directScores[0];
    }

    // --- Estágio 2: Análise de Contexto na Base de Conhecimento ---
    let knowledgeScores = [];
    for (const key in localKnowledgeBase) {
        let score = 0;
        const context = localKnowledgeBase[key];
        for (const keyword of context.keywords) {
            if (lowerCaseMessage.includes(keyword)) {
                score += 10; // Cada keyword contextual soma pontos
            }
        }
        if (score > 0) {
            knowledgeScores.push({ context: key, score });
        }
    }
    if (knowledgeScores.length > 0) {
        knowledgeScores.sort((a, b) => b.score - a.score);
        analysis.knowledgeContext = knowledgeScores;
    }

    // --- Estágio 3: Montagem do Contexto para a IA ---
    let aiContextParts = [];
    if (analysis.directMatch) {
        aiContextParts.push(`O cliente parece ter a intenção direta de '${analysis.directMatch.intent.name}'.`);
    }
    if (analysis.knowledgeContext.length > 0) {
        const topContexts = analysis.knowledgeContext.map(k => k.context).join(', ');
        aiContextParts.push(`Os temas mais relevantes na nossa base de conhecimento são: ${topContexts}. Use o conteúdo deles para responder.`);
    }
    analysis.combinedContextForAI = aiContextParts.join('\n') || "Nenhum contexto específico encontrado.";

    return analysis;
}

// ========================================================================
// 5. [FALLBACK AUTÔNOMO RECONSTRUÍDO]
// ========================================================================
function generateAutonomousFallback(analysis) {
    // Prioridade 1: Se uma intenção direta foi encontrada com certeza, use-a.
    if (analysis.directMatch && analysis.directMatch.score > 80) {
        const intent = analysis.directMatch.intent;
        return intent.responses[Math.floor(Math.random() * intent.responses.length)];
    }

    // Prioridade 2: Se houver um contexto claro na base de conhecimento, use-o.
    if (analysis.knowledgeContext.length > 0) {
        const topContextKey = analysis.knowledgeContext[0].context;
        const knowledge = localKnowledgeBase[topContextKey];
        
        // Extrai o primeiro e segundo parágrafos do script para uma resposta rica
        const paragraphs = knowledge.script.split('📌');
        let reply = `Compreendi que seu interesse é sobre **${topContextKey}**. Essa é a minha especialidade. Nossa filosofia sobre isso é a seguinte:<br><br>`;
        
        // Adiciona o "mindset" como parte da resposta
        if (paragraphs[1]) {
            reply += `<strong>Nossa Mentalidade:</strong><br>${paragraphs[1].replace(/(\r\n|\n|\r)/gm, "<br>")}`;
        }
        
        reply += `<br><br>Para aplicar essa estratégia diretamente ao seu negócio, o ideal é uma conversa. <a href='${WHATSAPP_LINK}' target='_blank'>Vamos conversar no WhatsApp?</a>`;
        return reply;
    }

    // Prioridade 3: Resposta padrão.
    return directIntents.defaultResponse;
}

// ========================================================================
// 6. HELPERS DE API (PLANOS A & B)
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
    if (!data.candidates || !data.candidates.length || !data.candidates[0].content) { throw new Error("Gemini API retornou uma resposta vazia ou malformada."); }
    return data.candidates[0].content.parts[0].text;
}

// ========================================================================
// 7. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Autônomo (v9.0)...");
    const localAnalysis = analyzeLocalBrain(message);

    // --- Lógica de Decisão Principal ---
    // A IA só é chamada se o contexto for complexo. Perguntas diretas são respondidas localmente.
    const confidenceScore = (localAnalysis.directMatch ? localAnalysis.directMatch.score : 0) + (localAnalysis.knowledgeContext.length > 0 ? localAnalysis.knowledgeContext[0].score : 0);
    
    if (confidenceScore >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD && localAnalysis.directMatch) {
         console.log(`Plano C (Cérebro Local) respondeu com alta confiança (${confidenceScore}).`);
         reply = localAnalysis.directMatch.intent.responses[0];
    } else {
        console.log("Contexto complexo detectado. Orquestrando com IA Externa (Planos A/B).");
        const orchestratedPrompt = `Com base na nossa filosofia interna, responda à pergunta do cliente.\n\n--- NOSSA FILOSOFIA E CONTEXTO ---\n${localAnalysis.combinedContextForAI}\n\n--- Base de Conhecimento Relevante ---\n${localAnalysis.knowledgeContext.length > 0 ? localKnowledgeBase[localAnalysis.knowledgeContext[0].context].script : ''}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        try {
            console.log("Executando Plano A: DeepSeek com contexto orquestrado.");
            const deepSeekKey = process.env.DEEPSEEK_API_KEY;
            if (!deepSeekKey) throw new Error("Chave da API DeepSeek (DEEPSEEK_API_KEY) não está configurada no ambiente.");
            reply = await callDeepSeekAPI(orchestratedPrompt, deepSeekKey);
        } catch (deepSeekError) {
            console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
            try {
                console.log("Executando Plano B: Gemini com contexto orquestrado.");
                const geminiKey = process.env.GEMINI_API_KEY;
                if (!geminiKey) throw new Error("Chave da API Gemini (GEMINI_API_KEY) não está configurada no ambiente.");
                reply = await callGeminiAPI(orchestratedPrompt, geminiKey);
            } catch (geminiError) {
                console.error("Plano B (Gemini) falhou:", geminiError.message);
                console.log("Planos A e B falharam. Executando Cérebro Autônomo como fallback final.");
                reply = generateAutonomousFallback(localAnalysis);
            }
        }
    }
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";
    return { statusCode: finalStatusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ reply: finalReply }) };
};
