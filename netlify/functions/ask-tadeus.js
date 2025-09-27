// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 5.0 - SUPER AGENTE)

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1"; // SEU WHATSAPP JÁ ESTÁ AQUI

// A Persona completa do Tadeus, usada pelos Planos A e B (as IAs)
const tadeusAIPersona = `
Você é “tadeus”, um agente de vendas e consultoria especializado em AUTOMAÇÃO e TRÁFGO PAGO.
Idioma: Português (Brasil). Tom: vendedor consultivo — direto, confiante, cortês, com pitadas de humor rápido quando apropriado.
Objetivo principal: converter visitantes em leads/cliente (agendar call, solicitar auditoria, fechar plano). Objetivo secundário: educar, tirar dúvidas, remover objeções.
// ... E O RESTO DA SUA PERSONA COMPLETA ...
`;

// ========================================================================
// 2. CÉREBRO LOCAL (PLANO C) - BASE DE CONHECIMENTO COMPLETA
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
        // --- CONHECIMENTO POR SERVIÇO ---
        {
            name: "inquiry_automation",
            keywords: { primary: ["automação", "automatizar", "n8n", "zapier", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Automação é sobre criar 'robôs' que fazem o trabalho repetitivo por você. Por exemplo, quando um cliente preenche um formulário, um robô pode salvar em uma planilha, enviar um e-mail de boas-vindas e notificar sua equipe, tudo em 2 segundos. Isso libera seu tempo e evita erros. Que processo mais te consome tempo hoje?",
                `Usamos ferramentas como n8n e Zapier para conectar os sistemas que você já usa e criar um fluxo de trabalho inteligente. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la, não um humano. Quer auditar seus processos para encontrar pontos de automação?`
            ]
        },
        {
            name: "inquiry_traffic",
            keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionar", "meta ads", "google ads"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Tráfego pago é a arte de colocar o anúncio certo, na frente da pessoa certa, na hora certa. Em vez de esperar o cliente te achar, nós vamos ativamente buscá-lo no Instagram, Facebook, Google, etc. O objetivo é atrair pessoas qualificadas para o seu negócio com o menor custo possível. Qual plataforma seu público mais usa hoje?",
                "Funciona assim: definimos seu cliente ideal, criamos anúncios persuasivos e usamos plataformas como Google e Meta (Instagram/Facebook) para mostrá-los a quem tem mais chance de comprar. Nós gerenciamos o orçamento para garantir o máximo de retorno sobre o investimento (ROI). Qual produto você mais gostaria de vender agora?"
            ]
        },
        // --- PERGUNTAS E OBJEÇÕES COMUNS ---
        {
            name: "how_it_works",
            keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] },
            priority: 50,
            responses: [
                "Funciona em 3 passos simples: 1) Fazemos um diagnóstico rápido (24h); 2) Implementamos as automações e campanhas iniciais (7–14 dias); 3) Escalamos com otimização contínua. Quer agendar sua auditoria gratuita para começarmos o passo 1?",
            ]
        },
        {
            name: "inquiry_price",
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"], secondary: [] },
            priority: 70,
            responses: [
                "Essa é uma ótima pergunta! Para te dar um valor preciso, preciso entender um pouco mais. Você poderia me informar sua meta de faturamento, seu ticket médio e a verba que investe em tráfego? Com isso, já consigo montar uma proposta.",
            ]
        },
        {
            name: "objection_price",
            keywords: { primary: ["caro", "custoso", "preço alto", "investimento alto"], secondary: [] },
            priority: 60,
            responses: [
                "Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento com alto retorno. Em média, nossos clientes recuperam o valor em poucas semanas. Quer testar uma auditoria gratuita de 10 dias para ver o potencial sem compromisso?",
            ]
        },
        {
            name: "objection_time",
            keywords: { primary: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"], secondary: [] },
            priority: 60,
            responses: [
                "É exatamente por isso que nosso serviço existe: para te devolver tempo. Exigimos o mínimo de você, apenas uma reunião inicial. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?",
            ]
        },
        {
            name: "objection_trust",
            keywords: { primary: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"], secondary: [] },
            priority: 60,
            responses: [
                "Dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?",
            ]
        },
        {
            name: "objection_past_failure",
            keywords: { primary: ["já tentei", "outra agência", "não funcionou", "deu errado", "outro freelancer"], secondary: [] },
            priority: 60,
            responses: [
                "Entendo sua frustração. Muitos chegam aqui após experiências ruins. A diferença é que não usamos 'achismo', usamos dados. Nosso processo começa com um diagnóstico para provar onde está o problema antes de mexer em algo. Quer ver como nossa abordagem é diferente?",
            ]
        },
        {
            name: "objection_uniqueness",
            keywords: { primary: ["meu negócio é diferente", "meu nicho é específico", "meu público é complicado"], secondary: [] },
            priority: 60,
            responses: [
                "Você tem razão, cada negócio é único. É por isso que não vendemos pacotes prontos. Nossas soluções são 100% customizadas. Qual o maior desafio do seu nicho hoje?",
            ]
        },
        {
            name: "objection_diy",
            keywords: { primary: ["fazer sozinho", "eu mesmo faço", "usar o zapier"], secondary: [] },
            priority: 60,
            responses: [
                "Com certeza você consegue aprender! A questão é: quanto vale a sua hora? Nós entregamos em dias um sistema otimizado que talvez levaria meses de tentativa e erro. Nosso trabalho é acelerar seu resultado.",
            ]
        },
        {
            name: "inquiry_discount",
            keywords: { primary: ["desconto", "mais barato", "valor menor", "consegue melhorar", "negociar o preço"], secondary: [] },
            priority: 60,
            responses: [
                "Entendo sua pergunta. Nosso foco é sempre no ROI. Em vez de um desconto, prefiro te mostrar como o valor investido volta para o seu bolso em poucas semanas. Que tal fazermos uma simulação rápida com seus números?",
            ]
        },
        {
            name: "inquiry_support",
            keywords: { primary: ["suporte", "manutenção", "se der problema", "acompanhamento"], secondary: [] },
            priority: 50,
            responses: [
                "Sim, o suporte é contínuo. Nossos planos incluem monitoramento e manutenção. Se algo falhar, somos os primeiros a saber e a agir. Você nunca fica na mão.",
            ]
        },
        {
            name: "inquiry_case_studies",
            keywords: { primary: ["cases", "exemplos", "portfólio", "clientes", "referências"], secondary: [] },
            priority: 50,
            responses: [
                "Temos sim! Já ajudamos empresas a aumentar em até 300% a geração de leads. Em qual área você gostaria de ver um exemplo: Aumento de Vendas, Redução de Custos ou Organização de Processos?",
            ]
        },
        {
            name: "inquiry_help",
            keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] },
            priority: 90,
            responses: [
                `Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`
            ]
        }
    ],
    defaultResponse: `Entendi. Essa é uma pergunta mais específica. Para te dar a melhor resposta, o ideal é falar com um de nossos especialistas. Que tal chamar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'>É só clicar aqui.</a>`
};


// ========================================================================
// 3. MOTOR DE BUSCA INTELIGENTE DO CÉREBRO LOCAL (COM PONTUAÇÃO)
// ========================================================================
function getLocalResponse(message) {
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
            scores.push({ intent: intent, score: currentScore });
        }
    }

    if (scores.length === 0) return null;

    scores.sort((a, b) => b.score - a.score);
    const bestMatch = scores[0].intent;

    if (typeof bestMatch.responseFunction === 'function') {
        return bestMatch.responseFunction(lowerCaseMessage);
    }
    
    return bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
}


// ========================================================================
// 4. HELPERS DE API (PLANOS A & B)
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
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR DOS PLANOS A, B, C e D
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
    try {
        console.log("Executando Plano A: DeepSeek");
        const deepSeekKey = process.env.DEEPSEEK_API_KEY;
        if (!deepSeekKey) throw new Error("DeepSeek API Key not configured.");
        reply = await callDeepSeekAPI(message, deepSeekKey);
    } catch (deepSeekError) {
        console.error("Plano A (DeepSeek) falhou:", deepSeekError.message);
        try {
            console.log("Executando Plano B: Gemini");
            const geminiKey = process.env.GEMINI_API_KEY;
            if (!geminiKey) throw new Error("Gemini API Key not configured.");
            reply = await callGeminiAPI(message, geminiKey);
        } catch (geminiError) {
            console.error("Plano B (Gemini) falhou:", geminiError.message);
            console.log("Executando Plano C: Cérebro Local");
            reply = getLocalResponse(message);
            if (!reply) {
                console.log("Plano C não encontrou resposta. Executando Plano D.");
                reply = tadeusLocalBrain.defaultResponse;
            }
        }
    }
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";
    return {
        statusCode: finalStatusCode,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ reply: finalReply }),
    };
};
