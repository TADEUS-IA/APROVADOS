// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 7.0 - O ORQUESTRADOR ROBUSTO)
// ATUALIZAÇÃO FINAL:
// 1. CÓDIGO UNIFICADO: Esta é a versão completa e definitiva, integrando todas as funcionalidades solicitadas.
// 2. ORQUESTRADOR MULTI-IA: A lógica de cascata (DeepSeek -> Gemini -> Groq) está implementada e otimizada.
// 3. CÉREBRO LOCAL EXPANDIDO: A base de conhecimento interna (v6.4) está totalmente integrada para máxima autonomia e eficiência.
// 4. ALTA DISPONIBILIDADE: O sistema é resiliente a falhas de API, sempre buscando uma resposta antes de recorrer ao fallback final.
// 5. EFICIÊNCIA DE CUSTOS: A análise de confiança local previne chamadas desnecessárias às APIs pagas.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent`;
const GROQ_API_URL = "https://api.groq.com/openai/v4/chat/completions";
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
// 2. CÉREBRO LOCAL (PLANO D) - v7.0: BASE DE CONHECIMENTO EXPANDIDA
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
        
        // --- CONHECIMENTO POR SERVIÇO (PRINCIPAL) ---
        {
            name: "inquiry_automation",
            keywords: { primary: ["automação", "automatizar", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] },
            priority: 80,
            responses: [
                "Automação é a sua equipe de robôs trabalhando 24/7 para você. Imagine suas tarefas repetitivas desaparecendo, leads sendo respondidos instantaneamente e clientes recebendo follow-ups no momento certo. Na prática, isso significa <strong>mais vendas com menos esforço e zero erros</strong>. Que processo manual, se fosse automatizado hoje, te daria mais tempo para pensar na estratégia do seu negócio?",
                `Usamos ferramentas poderosas como o N8N para conectar os sistemas que você já usa (CRM, planilhas, WhatsApp, etc.) e criar um fluxo de trabalho inteligente. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la, não um humano. O resultado é a redução de custos operacionais e uma equipe mais focada no que realmente importa. Quer encontrar os gargalos na sua operação que podemos eliminar essa semana?`
            ]
        },
        {
            name: "inquiry_traffic",
            keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionamento"], secondary: ["o que é", "como funciona", "fale sobre", "gerenciamento", "gestão de"] },
            priority: 80,
            responses: [
                "Tráfego Pago é a ponte mais rápida entre seu produto e seu cliente ideal. Em vez de esperar que as pessoas te encontrem, nós vamos até elas. Analisamos quem tem o maior potencial de compra e colocamos anúncios irresistíveis na frente delas no Google, Instagram, onde quer que estejam. O objetivo não é gerar cliques, é gerar <strong>clientes que compram</strong>. Onde você acredita que seu melhor cliente passa o tempo online?",
                "Funciona como uma ciência: definimos seu cliente ideal, criamos os anúncios certos e usamos plataformas como Google e Meta para mostrá-los a quem tem mais chance de comprar. Nós gerenciamos o orçamento de forma inteligente para garantir o máximo de Retorno Sobre o Investimento (ROI). Na prática, é mais faturamento com um Custo por Aquisição (CPA) cada vez menor. Qual produto seu você gostaria de vender 50% a mais no próximo mês?"
            ]
        },

        // --- CONHECIMENTO ESPECÍFICO E APROFUNDADO ---
        {
            name: "inquiry_n8n_vs_zapier",
            keywords: { primary: ["n8n", "zapier"], secondary: ["diferença", "qual o melhor", "por que", "vs"] },
            priority: 85,
            responses: ["Excelente pergunta. Ambos são ótimos, mas vemos o Zapier como 'fácil de começar' e o N8N como 'poderoso para escalar'. Com o N8N, temos <strong>controle total para criar automações complexas e customizadas</strong> sem as limitações de 'tasks' do Zapier, o que se traduz em <strong>melhor custo-benefício para você</strong> a longo prazo. Qual processo complexo na sua empresa você acha que nenhuma ferramenta 'pronta' conseguiria resolver?"]
        },
        {
            name: "inquiry_automation_examples",
            keywords: { primary: ["exemplos", "o que dá pra", "ideias", "casos de uso"], secondary: ["automação", "automatizar"] },
            priority: 85,
            responses: ["Podemos automatizar praticamente qualquer processo digital. Pense em:<br><strong>1. Qualificação de Leads:</strong> um robô que conversa com o lead no WhatsApp, faz as perguntas-chave e agenda a reunião só com os mais quentes.<br><strong>2. Onboarding de Clientes:</strong> assim que a venda é feita, um fluxo automático envia contrato, fatura e acesso.<br><strong>3. Pós-venda:</strong> um robô que pede feedback e oferece novos produtos 30 dias após a compra.<br><br>Qual dessas áreas, se fosse 100% automática, <strong>liberaria mais o seu tempo</strong> hoje?"]
        },
        {
            name: "inquiry_google_vs_meta",
            keywords: { primary: ["google", "meta", "instagram", "facebook"], secondary: ["diferença", "qual o melhor", "onde anunciar", "vs"] },
            priority: 85,
            responses: ["A escolha depende de onde seu cliente está e o que ele está pensando. No <strong>Google, nós 'pescamos' clientes que já estão procurando ativamente</strong> por uma solução como a sua ('dentista em São Paulo'). No <strong>Meta (Instagram/Facebook), nós 'caçamos' o cliente ideal</strong>, mostrando anúncios para pessoas com o perfil certo, mesmo que não estejam procurando agora. Para começar, você quer alcançar quem já sabe que tem o problema ou quer apresentar sua solução para quem ainda não te conhece?"]
        },
        {
            name: "inquiry_traffic_investment",
            keywords: { primary: ["investir", "investimento", "gastar", "orçamento para", "budget"], secondary: ["quanto", "qual valor"] },
            priority: 95,
            responses: ["Essa é a pergunta certa. Não existe um 'valor mágico', mas sim um <strong>investimento estratégico</strong>. Começamos com um orçamento controlado para validar as campanhas e encontrar o Custo por Aquisição (CPA) ideal. A partir daí, a regra é simples: se para cada R$1,00 investido estão voltando R$5,00, o investimento se torna uma máquina de crescimento. Qual seria uma meta de faturamento inicial que faria este projeto ser um sucesso para você?"]
        },
        {
            name: "inquiry_boost_vs_professional",
            keywords: { primary: ["impulsionar", "botão", "promover"], secondary: ["diferença", "eu mesmo faço", "funciona"] },
            priority: 85,
            responses: ["Entendo perfeitamente. O botão 'Impulsionar' é como pescar com uma vara simples. Você pode pegar um peixe ou outro. A <strong>gestão profissional de tráfego é como pescar com um sonar e uma rede de arrasto</strong>: nós identificamos o cardume exato (seu público), usamos a isca certa (o anúncio perfeito) e medimos tudo. O resultado é previsibilidade e escala. Quer parar de contar com a sorte e começar a ter uma estratégia de aquisição de clientes?"]
        },

        // --- CONHECIMENTO POR NICHO DE NEGÓCIO ---
        {
            name: "business_niche_application",
            keywords: { 
                primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"], 
                secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] 
            },
            priority: 100,
            responseFunction: (message) => { /* ... */ }
        },
        
        // --- PERGUNTAS E OBJEÇÕES GERAIS ---
        {
            name: "inquiry_price",
            keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"], secondary: [] },
            priority: 100,
            responseFunction: () => { /* ... */ }
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
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (ESTÁVEL)
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
// 4. HELPERS DE API (PLANOS A, B & C)
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

async function callGroqAPI(orchestratedPrompt, apiKey) {
    const response = await fetch(GROQ_API_URL, {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }],
            stream: false
        })
    });
    if (!response.ok) { const errorBody = await response.text(); throw new Error(`Groq API Error: ${response.status} ${errorBody}`); }
    const data = await response.json();
    return data.choices[0].message.content;
}

// ========================================================================
// 5. FUNÇÃO PRINCIPAL (HANDLER) - O ORQUESTRADOR
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Local (v7.0)...");
    const localAnalysis = analyzeLocalBrain(message);

    if (localAnalysis.bestMatch && localAnalysis.bestMatch.score >= LOCAL_BRAIN_CONFIDENCE_THRESHOLD) {
        console.log(`Plano D (Cérebro Local) respondeu com alta confiança (${localAnalysis.bestMatch.score}).`);
        reply = localAnalysis.bestMatch.response;
    } else {
        console.log("Cérebro Local forneceu contexto. Orquestrando com IA Externa.");
        const orchestratedPrompt = `Com base no seu conhecimento e no CONTEXTO INTERNO da empresa fornecido abaixo, responda à pergunta do cliente.\n\n--- CONTEXTO INTERNO RELEVANTE ---\n${localAnalysis.combinedContext}\n--- FIM DO CONTEXTO ---\n\nPergunta do Cliente: "${message}"`;
        
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

                try {
                    console.log("Executando Plano C: Groq.");
                    const groqKey = process.env.GROQ_API_KEY;
                    if (!groqKey) throw new Error("Groq API Key not configured.");
                    reply = await callGroqAPI(orchestratedPrompt, groqKey);
                } catch (groqError) {
                    console.error("Plano C (Groq) falhou:", groqError.message);
                    console.log("Planos A, B e C falharam. Executando Plano D (Cérebro Local) como fallback final.");
                    reply = localAnalysis.bestMatch ? localAnalysis.bestMatch.response : tadeusLocalBrain.defaultResponse;
                }
            }
        }
    }
    const finalStatusCode = (reply) ? 200 : 500;
    const finalReply = reply || "Desculpe, estamos com uma instabilidade geral. Por favor, tente mais tarde.";
    return { statusCode: finalStatusCode, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ reply: finalReply }) };
};
