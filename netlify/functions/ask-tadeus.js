// ARQUIVO: netlify/functions/ask-tadeus.js

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1"; // <-- SUBSTITUA PELO SEU LINK DO WHATSAPP

// A Persona completa do Tadeus, usada pelos Planos A e B (as IAs)
const tadeusAIPersona = `
Você é “tadeus”, um agente de vendas e consultoria especializado em AUTOMAÇÃO e TRÁFEGO PAGO...
// COLE AQUI A SUA PERSONA COMPLETA E DETALHADA QUE VOCÊ ME ENVIOU.
// Este é o cérebro das IAs.
`;


// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - BASE DE CONHECIMENTO
// Respostas pré-definidas para quando as IAs falharem.
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        // --- SAUDAÇÕES ---
        {
            name: "greeting",
            keywords: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"],
            responses: [
                "Olá! Melhor agora que chegou — mais um cliente pra potencializar resultados. Em que posso te ajudar? (auditoria rápida, configurar automação, escala de tráfego?)",
                "E aí! Pronto pra parar de perder tempo e começar a vender enquanto dorme? Me diga o que você precisa.",
                "Oi! Posso te mostrar onde você está vazando faturamento? Me conte um pouco sobre seu negócio."
            ]
        },
        // --- PERGUNTAS GERAIS ---
        {
            name: "how_it_works",
            keywords: ["como funciona", "o que vocês fazem", "qual o processo", "como é"],
            responses: [
                "Funciona em 3 passos simples: 1) Fazemos um diagnóstico rápido (24h) para encontrar os pontos de melhoria; 2) Implementamos as automações e campanhas iniciais (7–14 dias); 3) Escalamos com otimização contínua. Quer agendar sua auditoria gratuita para começarmos o passo 1?",
                "Nosso processo é direto: primeiro um diagnóstico para entender suas necessidades, depois a implementação da solução e, por fim, a otimização para escalar seus resultados. Podemos começar com uma auditoria sem compromisso, o que acha?"
            ]
        }, {
            name: "inquiry_price",
            keywords: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"],
            responses: [
                "Essa é uma ótima pergunta! Para te dar um valor preciso, preciso entender um pouco mais. Você poderia me informar sua meta de faturamento mensal, seu ticket médio e a verba que investe em tráfego atualmente? Com isso, já consigo montar uma proposta.",
                "Claro! Nossos planos são personalizados. Para simular o melhor para você, me passe 3 dados: 1) seu ticket médio; 2) seu faturamento mensal; 3) sua verba atual para tráfego."
            ]
        },
        // --- OBJEÇÕES ---
        {
            name: "objection_price",
            keywords: ["caro", "custoso", "preço alto", "investimento alto"],
            responses: [
                "Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento. Em média, nossos clientes recuperam o valor investido em poucas semanas com a otimização que fazemos. Quer testar uma auditoria gratuita de 10 dias para ver o potencial de retorno sem compromisso?",
                "Compreendo. O custo é um ponto importante. Posso te enviar um mini-relatório gratuito com 3 ações de alto impacto que você mesmo pode aplicar? Se gostar dos resultados, podemos conversar sobre um plano mais completo."
            ]
        }, {
            name: "objection_time",
            keywords: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"],
            responses: [
                "É exatamente por isso que nosso serviço existe: para te devolver tempo. O processo exige o mínimo de você: apenas uma reunião inicial de 15-30 minutos para o diagnóstico. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?",
                "Entendo que seu tempo é valioso. Por isso, nosso processo é desenhado para ser o mais eficiente possível. Cuidamos de toda a implementação e te enviamos relatórios resumidos. Que tal uma conversa rápida de 15 minutos para eu te mostrar como podemos te poupar dezenas de horas por mês?"
            ]
        }, {
            name: "objection_trust",
            keywords: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"],
            responses: [
                "Essa é uma dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?",
                "Entendo sua cautela. Oferecemos uma auditoria gratuita de 10 dias justamente para isso: para você ver o potencial de resultado sem nenhum risco. Se ao final dos 10 dias você não estiver satisfeito, não há nenhum compromisso. Quer começar?"
            ]
        }, {
            name: "objection_past_failure",
            keywords: ["já tentei", "já fiz", "outra agência", "não funcionou", "deu errado", "outro freelancer", "perdi dinheiro"],
            responses: [
                "Entendo perfeitamente sua frustração. Muitos clientes chegam aqui após experiências ruins. A grande diferença é que não trabalhamos com 'achismo'. Nosso processo começa com um diagnóstico de dados para provar onde está o problema antes de investirmos um real. Quer ver como nossa abordagem é diferente com uma auditoria gratuita?",
                "Essa é uma preocupação muito justa. Para não repetir o erro, o mais importante é entender: o que exatamente não funcionou na sua tentativa anterior? Sabendo disso, posso te mostrar exatamente como nosso método evita essa mesma armadilha."
            ]
        }, {
            name: "objection_uniqueness",
            keywords: ["meu negócio é diferente", "meu nicho é específico", "meu público é complicado", "não serve pra mim", "meu mercado"],
            responses: [
                "Você tem razão, cada negócio é único. É exatamente por isso que não vendemos 'pacotes prontos'. Nossas soluções são 100% customizadas após o diagnóstico inicial. Já aplicamos esses princípios em nichos de [Exemplo: estética avançada] a [Exemplo: indústria de parafusos]. Qual é o seu nicho para eu te dar um exemplo prático?",
                "Perfeito. Se o seu negócio é específico, você precisa de uma estratégia específica. A automação e os princípios de tráfego são universais, mas a aplicação é artesanal. É isso que fazemos. Qual o maior desafio do seu nicho hoje?"
            ]
        }, {
            name: "objection_diy",
            keywords: ["fazer sozinho", "eu mesmo faço", "usar o zapier", "aprender a fazer", "parece fácil"],
            responses: [
                "Com certeza você consegue aprender, as ferramentas estão aí para isso! A questão é: quanto vale a sua hora? Nós entregamos em dias um sistema otimizado e à prova de erros que talvez levaria meses de tentativa e erro para construir. Nosso trabalho é comprar seu tempo de volta e acelerar seu resultado.",
                "É como a contabilidade. Você pode fazer sozinho, mas um contador profissional te economiza dinheiro e evita erros caros. Nós somos os 'contadores' da sua automação e tráfego. Quer focar na estratégia do seu negócio enquanto nós garantimos que a operação rode perfeitamente?"
            ]
        },
        // --- DÚVIDAS ESPECÍFICAS ---
        {
            name: "inquiry_discount",
            keywords: ["desconto", "mais barato", "valor menor", "consegue melhorar", "faz por menos", "promoção", "cupom", "negociar o preço"],
            responses: [
                "Entendo sua pergunta. Nosso foco principal é sempre no ROI (Retorno Sobre o Investimento) que entregamos. Em vez de um simples desconto, prefiro te mostrar como o valor investido volta para o seu bolso em poucas semanas. Que tal fazermos uma simulação rápida com seus números para você ver o potencial de lucro?",
                "É uma ótima pergunta. Nossos preços já são bem justos pelo valor que entregamos, mas temos condições especiais para parceiros de longo prazo. Para pagamentos anuais ou pacotes que combinam Automação + Tráfego, conseguimos oferecer um desconto progressivo. Qual dessas opções te interessa mais?",
                `No momento não temos uma campanha de descontos ativa. O que posso te oferecer como bônus para fecharmos hoje é uma consultoria de otimização de funil, que normalmente já traria um retorno maior que o desconto. Se preferir, podemos discutir as condições diretamente no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Vamos negociar</a>.`
            ]
        }, {
            name: "inquiry_timeline",
            keywords: ["quanto tempo", "demora", "prazo", "quando vejo resultado", "implementação"],
            responses: [
                "Ótima pergunta. Dividimos os resultados em duas fases: as 'vitórias rápidas' (quick wins), como otimizações de automação e campanhas, que você já sente em 7 a 14 dias. E a 'escala sustentável', que é o crescimento contínuo do faturamento mês a mês. Quer começar com uma ação de impacto para a próxima semana?",
                "A implementação inicial leva de 7 a 14 dias. A partir daí, a otimização é constante. Alguns clientes dobram os leads no primeiro mês, outros aumentam a conversão em 30%. O resultado varia, mas o progresso é sempre visível desde o início."
            ]
        }, {
            name: "inquiry_customer_effort",
            keywords: ["o que eu preciso fazer", "meu trabalho", "tenho que aprender", "é difícil de usar", "complicado"],
            responses: [
                "Seu envolvimento é mínimo e estratégico. Precisamos de você na reunião de diagnóstico (cerca de 30 min) para entendermos suas metas e do seu feedback nos relatórios. O resto, toda a parte técnica e operacional, é com a gente. Nosso objetivo é te dar mais tempo, não mais trabalho.",
                "Pelo contrário! A ideia é simplificar sua vida. Você não precisa aprender a usar nenhuma ferramenta nova. Nós integramos tudo o que você já usa e entregamos um painel com os resultados claros. A única coisa que você precisa fazer é se preparar para atender mais clientes."
            ]
        }, {
            name: "inquiry_support",
            keywords: ["suporte", "manutenção", "se der problema", "acompanhamento", "depois"],
            responses: [
                "Sim, o suporte é contínuo. Nossos planos incluem monitoramento e manutenção constantes. Se uma automação falhar ou uma campanha performar mal, somos os primeiros a saber e a agir. Você nunca fica na mão.",
                `Todo nosso trabalho inclui um período de suporte e garantia. Além disso, temos planos de manutenção contínua para garantir que tudo funcione perfeitamente a longo prazo. Quer que eu detalhe as opções de suporte? Ou prefere chamar no WhatsApp para uma resposta mais rápida? <a href='${WHATSAPP_LINK}' target='_blank'>Fale conosco</a>.`
            ]
        }, {
            name: "inquiry_case_studies",
            keywords: ["cases", "exemplos", "portfólio", "clientes", "referências", "quem vocês atendem"],
            responses: [
                "Temos sim! Já ajudamos empresas a aumentar em até 300% a geração de leads e a economizar mais de 20 horas de trabalho manual por semana. Em qual área você gostaria de ver um exemplo: [1] Aumento de Vendas, [2] Redução de Custos ou [3] Organização de Processos?",
                `Claro. Nosso maior orgulho são os resultados dos nossos clientes. Para te enviar os exemplos mais relevantes, me diga qual o seu nicho de mercado. Ou, se preferir, posso te conectar com um cliente nosso para ele mesmo te contar a experiência. É só chamar no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Peça uma referência aqui</a>.`
            ]
        }, {
            name: "inquiry_help",
            keywords: ["ajuda", "socorro", "contato", "falar com", "quero falar com um atendente"],
            responses: [
                `Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`
            ]
        }
    ],
    // Resposta final se nenhuma intenção for encontrada
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};


// ========================================================================
// 3. MOTOR DE BUSCA DO CÉREBRO LOCAL
// ========================================================================
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
// 4. HELPERS DE API (PLANOS A & B)
// Funções isoladas para chamar as IAs externas.
// ========================================================================
// ========================================================================
// 4. HELPERS DE API (PLANOS A & B)
// ========================================================================
async function callDeepSeekAPI(message, apiKey) {
    // ... (esta função permanece exatamente a mesma)
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

// ✅ FUNÇÃO CORRIGIDA PARA A VERSÃO 5.1
async function callGeminiAPI(orchestratedPrompt, apiKey) {
    // CORREÇÃO: A API REST v1 não aceita o campo "systemInstruction".
    // Portanto, unimos a persona e o prompt do usuário em um único "text",
    // garantindo a compatibilidade.
    const fullPrompt = `${tadeusAIPersona}\n\n---\n\n${orchestratedPrompt}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            // O corpo (body) agora está no formato correto para a API v1
            contents: [{
                parts: [{ text: fullPrompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
        throw new Error("Gemini API retornou uma resposta vazia ou malformada.");
    }
    return data.candidates[0].content.parts[0].text;
}

// ========================================================================
// 5. FUNÇÃO PRINCIPAL (HANDLER)
// Orquestra a lógica de múltiplos níveis de fallback.
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
