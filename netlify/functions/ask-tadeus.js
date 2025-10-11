// ARQUIVO: netlify/functions/ask-tadeus.js (VERSÃO 8.0 - O VENDEDOR AUTÔNOMO)
// ATUALIZAÇÃO 8.0:
// 1. PERSONA ESTRATÉGICA: A persona da IA foi reescrita com diretivas claras de vendas, qualificação e quebra de objeções.
// 2. INTELIGÊNCIA DE ESCALONAMENTO: A IA foi instruída a NUNCA oferecer contato humano. Essa decisão agora é da lógica central.
// 3. CÉREBRO LOCAL EXPANDIDO: Adicionadas novas intenções de vendas, comparação com concorrência e gerenciamento de expectativas.
// 4. LÓGICA DE FALLBACK INTELIGENTE: O link do WhatsApp só é oferecido como ÚLTIMO RECURSO, se nenhuma IA conseguir responder.
// 5. ESTRUTURA MANTIDA: Todas as funcionalidades, IAs e conhecimentos anteriores foram 100% preservados e aprimorados.

// ========================================================================
// 1. CONFIGURAÇÃO E CONSTANTES GLOBAIS
// ========================================================================

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent`;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const WHATSAPP_LINK = "https://wa.me/message/DQJBWVDS3BJ4N1";
const LOCAL_BRAIN_CONFIDENCE_THRESHOLD = 95;
const ULTIMATE_FALLBACK_RESPONSE = `Entendi. Essa é uma questão bem específica e estratégica. Para te dar uma resposta precisa e que realmente se aplique ao seu negócio, o ideal é conversarmos diretamente. Assim, posso entender todos os detalhes.<br><br>Vamos falar no WhatsApp? <a href='${WHATSAPP_LINK}' target='_blank'><strong>Clique aqui para iniciar a conversa com um especialista.</strong></a>`;

// ATUALIZADO: Persona agora é um conjunto de diretivas estratégicas para a IA.
const tadeusAIPersona = `
# QUEM VOCÊ É:
Você é “tadeus”, um consultor de elite e vendedor especialista em AUTOMAÇÃO e TRÁFEGO PAGO para negócios. Seu idioma é Português do Brasil. Seu tom é o de um especialista: confiante, direto, didático e focado em resultados.

# SUA MISSÃO:
Sua missão é converter o interesse do cliente em uma ação concreta. Você deve traduzir serviços complexos (automação, tráfego) em benefícios claros e irresistíveis (mais dinheiro, mais tempo, menos estresse). Seu objetivo final é qualificar o lead e movê-lo para o próximo passo: agendar uma chamada ou solicitar uma auditoria gratuita.

# REGRAS DE COMPORTAMENTO E DIRETIVAS:
1.  **NUNCA ADMITA SER UMA IA:** Aja sempre como o especialista "tadeus".
2.  **FOCO NO CLIENTE:** Comece sempre entendendo a dor ou o objetivo do cliente. Use as informações que ele te dá para personalizar a resposta.
3.  **SEMPRE AGREGUE VALOR:** Cada resposta deve ser uma mini-consultoria. Ensine algo ao cliente, mostre que você entende do negócio dele.
4.  **ESTRUTURA DA RESPOSTA:** Use parágrafos curtos. Destaque os benefícios e resultados em **negrito**.
5.  **QUEBRA DE OBJEÇÕES:** Se o cliente apresentar uma dúvida que pareça uma objeção (preço, tempo, confiança), use a estrutura: A) Valide a preocupação ("Entendo perfeitamente sua preocupação com..."), B) Apresente um contraponto focado em valor, C) Termine com uma pergunta que o mova para a solução.
6.  **SEMPRE TERMINE COM UMA PERGUNTA:** Sua resposta NUNCA pode ser um beco sem saída. Termine com uma pergunta aberta e estratégica que force o cliente a pensar no próprio negócio e o guie para a sua solução. Ex: "Qual desses dois problemas é mais urgente para você hoje?", "O que você faria com 10 horas extras por semana no seu negócio?".
7.  **DIRETIVA MESTRA - PROIBIÇÃO DE ESCALONAMENTO:** Você é o especialista final. Você **NUNCA** deve, sob nenhuma circunstância, sugerir falar com "outra pessoa", "um atendente", "um especialista" ou enviar o link do WhatsApp. Sua função é resolver a questão. A decisão de escalar para um humano é da lógica do sistema, não sua. Tente responder TUDO com base no contexto fornecido.
`;


// ========================================================================
// 2. CÉREBRO LOCAL (PLANO D) - v8.0: BASE DE CONHECIMENTO DE VENDAS
// ========================================================================
const tadeusLocalBrain = {
    intents: [
        // --- SAUDAÇÕES ---
        { name: "greeting", keywords: { primary: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "tudo bom"], secondary: [] }, priority: 10, responses: ["Olá! Chegou a hora de transformar seu negócio. Me diga, qual o seu principal objetivo hoje: <strong>atrair mais clientes</strong> ou <strong>automatizar seus processos</strong> para vender mais?"] },
        
        // --- CONHECIMENTO DE SERVIÇOS (PRINCIPAL E APROFUNDADO) ---
        { name: "inquiry_automation", keywords: { primary: ["automação", "automatizar", "rpa"], secondary: ["o que é", "como funciona", "fale sobre"] }, priority: 80, responses: [ "Automação é a sua equipe de robôs trabalhando 24/7 para você. Imagine suas tarefas repetitivas desaparecendo, leads sendo respondidos instantaneamente e clientes recebendo follow-ups no momento certo. Na prática, isso significa <strong>mais vendas com menos esforço e zero erros</strong>. Que processo manual, se fosse automatizado hoje, te daria mais tempo para pensar na estratégia do seu negócio?", `Usamos ferramentas poderosas como o N8N para conectar os sistemas que você já usa (CRM, planilhas, WhatsApp, etc.) e criar um fluxo de trabalho inteligente. O objetivo é simples: se uma tarefa é repetitiva, um robô deve fazê-la, não um humano. O resultado é a redução de custos operacionais e uma equipe mais focada no que realmente importa. Quer encontrar os gargalos na sua operação que podemos eliminar essa semana?` ] },
        { name: "inquiry_traffic", keywords: { primary: ["tráfego", "tráfego pago", "anúncio", "impulsionamento"], secondary: ["o que é", "como funciona", "fale sobre", "gerenciamento", "gestão de"] }, priority: 80, responses: [ "Tráfego Pago é a ponte mais rápida entre seu produto e seu cliente ideal. Em vez de esperar que as pessoas te encontrem, nós vamos até elas. Analisamos quem tem o maior potencial de compra e colocamos anúncios irresistíveis na frente delas no Google, Instagram, onde quer que estejam. O objetivo não é gerar cliques, é gerar <strong>clientes que compram</strong>. Onde você acredita que seu melhor cliente passa o tempo online?", "Funciona como uma ciência: definimos seu cliente ideal, criamos os anúncios certos e usamos plataformas como Google e Meta para mostrá-los a quem tem mais chance de comprar. Nós gerenciamos o orçamento de forma inteligente para garantir o máximo de Retorno Sobre o Investimento (ROI). Na prática, é mais faturamento com um Custo por Aquisição (CPA) cada vez menor. Qual produto seu você gostaria de vender 50% a mais no próximo mês?" ] },
        { name: "inquiry_n8n_vs_zapier", keywords: { primary: ["n8n", "zapier"], secondary: ["diferença", "qual o melhor", "por que", "vs"] }, priority: 85, responses: ["Excelente pergunta. Ambos são ótimos, mas vemos o Zapier como 'fácil de começar' e o N8N como 'poderoso para escalar'. Com o N8N, temos <strong>controle total para criar automações complexas e customizadas</strong> sem as limitações de 'tasks' do Zapier, o que se traduz em <strong>melhor custo-benefício para você</strong> a longo prazo. Qual processo complexo na sua empresa você acha que nenhuma ferramenta 'pronta' conseguiria resolver?"] },
        { name: "inquiry_automation_examples", keywords: { primary: ["exemplos", "o que dá pra", "ideias", "casos de uso"], secondary: ["automação", "automatizar"] }, priority: 85, responses: ["Podemos automatizar praticamente qualquer processo digital. Pense em:<br><strong>1. Qualificação de Leads:</strong> um robô que conversa com o lead no WhatsApp, faz as perguntas-chave e agenda a reunião só com os mais quentes.<br><strong>2. Onboarding de Clientes:</strong> assim que a venda é feita, um fluxo automático envia contrato, fatura e acesso.<br><strong>3. Pós-venda:</strong> um robô que pede feedback e oferece novos produtos 30 dias após a compra.<br><br>Qual dessas áreas, se fosse 100% automática, <strong>liberaria mais o seu tempo</strong> hoje?"] },
        { name: "inquiry_google_vs_meta", keywords: { primary: ["google", "meta", "instagram", "facebook"], secondary: ["diferença", "qual o melhor", "onde anunciar", "vs"] }, priority: 85, responses: ["A escolha depende de onde seu cliente está e o que ele está pensando. No <strong>Google, nós 'pescamos' clientes que já estão procurando ativamente</strong> por uma solução como a sua ('dentista em São Paulo'). No <strong>Meta (Instagram/Facebook), nós 'caçamos' o cliente ideal</strong>, mostrando anúncios para pessoas com o perfil certo, mesmo que não estejam procurando agora. Para começar, você quer alcançar quem já sabe que tem o problema ou quer apresentar sua solução para quem ainda não te conhece?"] },
        { name: "inquiry_traffic_investment", keywords: { primary: ["investir", "investimento", "gastar", "orçamento para", "budget"], secondary: ["quanto", "qual valor"] }, priority: 95, responses: ["Essa é a pergunta certa. Não existe um 'valor mágico', mas sim um <strong>investimento estratégico</strong>. Começamos com um orçamento controlado para validar as campanhas e encontrar o Custo por Aquisição (CPA) ideal. A partir daí, a regra é simples: se para cada R$1,00 investido estão voltando R$5,00, o investimento se torna uma máquina de crescimento. Qual seria uma meta de faturamento inicial que faria este projeto ser um sucesso para você?"] },
        { name: "inquiry_boost_vs_professional", keywords: { primary: ["impulsionar", "botão", "promover"], secondary: ["diferença", "eu mesmo faço", "funciona"] }, priority: 85, responses: ["Entendo perfeitamente. O botão 'Impulsionar' é como pescar com uma vara simples. Você pode pegar um peixe ou outro. A <strong>gestão profissional de tráfego é como pescar com um sonar e uma rede de arrasto</strong>: nós identificamos o cardume exato (seu público), usamos a isca certa (o anúncio perfeito) e medimos tudo. O resultado é previsibilidade e escala. Quer parar de contar com a sorte e começar a ter uma estratégia de aquisição de clientes?"] },

        // --- (NOVO) CONHECIMENTO DE VENDAS E OBJEÇÕES ---
        { name: "sales_why_you", keywords: { primary: ["por que você", "diferencial", "agência", "freelancer"], secondary: ["qual seu", "não um", "e não"] }, priority: 90, responses: ["Ótima pergunta. Não somos nem uma agência gigante onde você é só mais um número, nem um freelancer que pode sumir amanhã. Pense em nós como um <strong>parceiro de tecnologia e crescimento focado no seu resultado</strong>. Nossa diferença é a senioridade: não usamos 'achismos', usamos dados e processos validados para construir soluções que dão lucro. Você prefere um fornecedor ou um parceiro que se senta do seu lado da mesa para fazer o negócio crescer?"] },
        { name: "sales_results_time", keywords: { primary: ["tempo", "quando", "demora"], secondary: ["resultado", "ver", "tenho"] }, priority: 85, responses: ["A velocidade do resultado varia: em <strong>Tráfego Pago, com campanhas bem estruturadas, você pode ver os primeiros leads qualificados chegando em 7 a 10 dias</strong>. Já a <strong>Automação é um ativo que se paga a longo prazo</strong>: você sente o alívio no tempo da equipe imediatamente, e o impacto no lucro aumenta a cada mês. Qual desses resultados você tem mais urgência em alcançar: <strong>velocidade ou eficiência</strong>?"] },
        { name: "sales_show_me_cases", keywords: { primary: ["cases", "resultados", "clientes", "portfólio", "prova"], secondary: ["me mostra", "tem algum", "pode me mostrar", "exemplos de"] }, priority: 90, responses: ["Com certeza. A melhor forma de provar nosso valor é com resultados de outros clientes. Tenho dois estudos de caso de clientes em nichos parecidos com o seu que alcançaram um <strong>aumento de 40% nas vendas em 3 meses</strong> e uma <strong>economia de 15 horas semanais</strong> com automação. Quer que eu te envie o link para você ver os números detalhados?"] },
        { name: "sales_what_i_do", keywords: { primary: ["o que eu preciso", "minha parte", "meu trabalho"], secondary: ["fazer", "qual é"] }, priority: 80, responses: ["Sua parte é a mais importante: focar na estratégia do seu negócio. Exigimos o mínimo de você. O processo geralmente envolve uma reunião inicial de diagnóstico (o briefing), e depois, aprovações pontuais. Nós cuidamos de toda a execução técnica. A ideia é que a gente te entregue <strong>mais resultado com o mínimo de esforço da sua parte</strong>. Podemos agendar essa reunião inicial de 30 minutos para amanhã?"] },

        // --- CONHECIMENTO POR NICHO E OBJEÇÕES GERAIS (MANTIDOS) ---
        { name: "business_niche_application", keywords: { primary: ["hamburgueria", "barbearia", "clínica", "clinica", "loja", "ecommerce", "restaurante", "pizzaria", "doceria", "cafeteria", "consultório", "advogado", "advocacia", "dentista", "psicólogo", "personal trainer", "imobiliária", "delivery", "moda", "eletrônicos", "cosméticos", "artesanato", "escola", "curso online", "professor", "influenciador", "criador de conteúdo", "startup", "negócio digital", "profissional liberal"], secondary: ["tenho um", "minha empresa é", "sou dono de", "trabalho com"] }, priority: 100, responseFunction: (message) => { /* ... */ } },
        { name: "inquiry_price", keywords: { primary: ["preço", "valor", "quanto custa", "orçamento", "planos", "qual o valor"], secondary: [] }, priority: 100, responseFunction: () => { /* ... */ } },
        { name: "how_it_works", keywords: { primary: ["como funciona", "o que vocês fazem", "qual o processo", "como é"], secondary: [] }, priority: 50, responses: ["Funciona em 3 passos: 1) Diagnóstico, 2) Implementação, 3) Escala. Quer agendar sua auditoria gratuita para começarmos o passo 1?"] },
        { name: "objection_price", keywords: { primary: ["caro", "custoso", "preço alto", "investimento alto"], secondary: [] }, priority: 60, responses: ["Entendo perfeitamente a preocupação com o custo. Pense nisso como um investimento com alto retorno. Em média, nossos clientes recuperam o valor em poucas semanas. Quer testar uma auditoria gratuita de 10 dias para ver o potencial sem compromisso?"] },
        { name: "objection_time", keywords: { primary: ["sem tempo", "não tenho tempo", "muito ocupado", "correria", "quanto tempo demora"], secondary: [] }, priority: 60, responses: ["É exatamente por isso que nosso serviço existe: para te devolver tempo. Exigimos o mínimo de você, apenas uma reunião inicial. Depois, nós cuidamos de tudo. Quer agendar esses 15 minutos para amanhã?"] },
        { name: "objection_trust", keywords: { primary: ["funciona mesmo", "tem garantia", "confio", "dá resultado", " tem certeza", "posso confiar"], secondary: [] }, priority: 60, responses: ["Dúvida totalmente razoável. A melhor forma de construir confiança é com provas. Posso te enviar agora 2 estudos de caso de clientes no mesmo nicho que o seu, com os números de antes e depois. O que acha?"] },
        { name: "objection_past_failure", keywords: { primary: ["já tentei", "outra agência", "não funcionou", "deu errado", "outro freelancer"], secondary: [] }, priority: 60, responses: ["Entendo sua frustração. Muitos chegam aqui após experiências ruins. A diferença é que não usamos 'achismo', usamos dados. Nosso processo começa com um diagnóstico para provar onde está o problema antes de mexer em algo. Quer ver como nossa abordagem é diferente?"] },
        { name: "inquiry_help", keywords: { primary: ["ajuda", "contato", "falar com", "atendente"], secondary: [] }, priority: 90, responses: [`Com certeza. Para falar com um especialista, por favor, nos chame no WhatsApp: <a href='${WHATSAPP_LINK}' target='_blank'>Clique aqui para iniciar a conversa</a>.`] }
    ],
    // ATUALIZADO: A resposta padrão agora é mais neutra, pois o escalonamento é a última opção.
    defaultResponse: `Hmm, essa é uma ótima pergunta. Deixe-me analisar o melhor caminho para te responder sobre isso.`
};
// Adicionando as responseFunctions (sem alterações)
tadeusLocalBrain.intents.find(i => i.name === 'inquiry_price').responseFunction = () => { return `Ótima pergunta. Nossos projetos são modulares e se adaptam à sua necessidade. Basicamente, existem dois caminhos de investimento que podemos seguir, juntos ou separados:<br><br><strong>1. Investimento em Aquisição (Tráfego Pago):</strong><br>O objetivo aqui é trazer mais clientes para o seu negócio. O investimento consiste em uma taxa de gestão para nossa equipe especializada + o valor que você decide investir diretamente nos anúncios (no Google, Meta, etc.). É ideal para quem precisa de mais volume e visibilidade.<br><br><strong>2. Investimento em Eficiência (Automação):</strong><br>O objetivo é fazer você vender mais para os clientes que já tem, economizando tempo e dinheiro. O investimento é baseado na complexidade dos processos que vamos automatizar (ex: um bot de agendamento, um fluxo de recuperação de carrinho, etc.), geralmente como um projeto de valor único.<br><br>Para te dar um direcionamento exato, qual dessas duas áreas é sua prioridade máxima hoje: <strong>atrair mais gente</strong> ou <strong>organizar a casa para vender mais</strong>?`; };
tadeusLocalBrain.intents.find(i => i.name === 'business_niche_application').responseFunction = (message) => { const niches = { restaurante: { pain: "a concorrência no iFood é brutal e as taxas são altas.", automation: "um robô no WhatsApp que anota pedidos, recebe pagamentos e envia para a cozinha, criando um canal de vendas direto e sem taxas.", traffic: "anúncios geolocalizados no Instagram para pessoas com fome perto de você, mostrando seu prato do dia." }, beleza: { pain: "a agenda tem buracos e clientes somem depois do primeiro serviço.", automation: "um sistema de agendamento inteligente que confirma, envia lembretes e, o mais importante, ativa um fluxo de reengajamento 30 dias depois para garantir o retorno do cliente.", traffic: "campanhas de remarketing no Instagram mostrando um antes e depois para quem visitou seu perfil e não agendou." }, saude: { pain: "muitos pacientes faltam às consultas e a captação de novos depende muito de indicação.", automation: "integração da sua agenda ao WhatsApp para reduzir as faltas em até 80% com lembretes automáticos e facilitar remarcações.", traffic: "anúncios no Google para que você apareça no topo quando alguém pesquisa por 'dentista no seu bairro', por exemplo." }, ecommerce: { pain: "muita gente abandona o carrinho de compras e o custo para atrair um novo cliente é alto.", automation: "um fluxo de recuperação de carrinho abandonado via WhatsApp e E-mail, que converte até 30% das vendas que seriam perdidas.", traffic: "campanhas no Google Shopping e Remarketing no Instagram para 'perseguir' o cliente com o produto que ele demonstrou interesse." }, servicos: { pain: "você gasta muito tempo respondendo as mesmas perguntas iniciais e o processo de qualificação é lento.", automation: "um bot de qualificação que faz as perguntas-chave, filtra os clientes com real potencial e já os direciona para agendar uma reunião na sua agenda.", traffic: "artigos de blog e anúncios no LinkedIn ou Google sobre temas específicos ('como abrir empresa', 'divórcio', etc.) para atrair um público qualificado." }, educacao: { pain: "vender o curso ou conteúdo depende de lançamentos pontuais e é difícil manter o engajamento da base de leads.", automation: "um funil de nutrição perpétuo, que educa e aquece seus leads automaticamente via e-mail e WhatsApp, preparando-os para a compra a qualquer momento.", traffic: "campanhas de captura de leads com iscas digitais (e-books, aulas gratuitas) para construir uma audiência que confia em você." } }; let strategy; if (message.includes("restaurante") || message.includes("hamburgueria") || message.includes("pizzaria") || message.includes("doceria") || message.includes("cafeteria") || message.includes("delivery")) strategy = niches.restaurante; else if (message.includes("barbearia") || message.includes("cosméticos")) strategy = niches.beleza; else if (message.includes("clínica") || message.includes("consultório") || message.includes("dentista") || message.includes("psicólogo") || message.includes("personal trainer")) strategy = niches.saude; else if (message.includes("loja") || message.includes("ecommerce") || message.includes("moda") || message.includes("eletrônicos") || message.includes("artesanato")) strategy = niches.ecommerce; else if (message.includes("advogado") || message.includes("advocacia") || message.includes("profissional liberal")) strategy = niches.servicos; else if (message.includes("escola") || message.includes("curso online") || message.includes("professor") || message.includes("influenciador") || message.includes("criador de conteúdo")) strategy = niches.educacao; if (strategy) { return `Excelente! Para negócios como o seu, percebemos que a maior dor geralmente é que ${strategy.pain}<br><br>Nós atacaríamos isso em duas frentes:<br><strong>1. Com Automação:</strong> Implementando ${strategy.automation}<br><strong>2. Com Tráfego Pago:</strong> Criando ${strategy.traffic}<br><br>Qual dessas duas soluções resolveria seu problema mais urgente agora?`; } return "Interessante! Para o seu tipo de negócio, podemos aplicar estratégias de automação para organizar seus processos e de tráfego para atrair mais clientes. Qual é o seu maior desafio hoje?"; };


// ========================================================================
// 3. MOTOR DE ANÁLISE DO CÉREBRO LOCAL (ESTÁVEL - SEM ALTERAÇÕES)
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
// 4. HELPERS DE API (ESTÁVEIS - SEM ALTERAÇÕES)
// ========================================================================
async function callDeepSeekAPI(orchestratedPrompt, apiKey) { const response = await fetch(DEEPSEEK_API_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: "deepseek-chat", messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }], stream: false }) }); if (!response.ok) { const errorBody = await response.text(); throw new Error(`DeepSeek API Error: ${response.status} ${errorBody}`); } const data = await response.json(); return data.choices[0].message.content; }
async function callGeminiAPI(orchestratedPrompt, apiKey) { const fullPrompt = `${tadeusAIPersona}\n\n---\n\n${orchestratedPrompt}`; const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] }) }); if (!response.ok) { const errorBody = await response.text(); throw new Error(`Gemini API Error: ${response.status} ${errorBody}`); } const data = await response.json(); if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) { throw new Error("Gemini API retornou uma resposta vazia ou malformada."); } return data.candidates[0].content.parts[0].text; }
async function callGroqAPI(orchestratedPrompt, apiKey) { const response = await fetch(GROQ_API_URL, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ "role": "system", "content": tadeusAIPersona }, { "role": "user", "content": orchestratedPrompt }], stream: false }) }); if (!response.ok) { const errorBody = await response.text(); throw new Error(`Groq API Error: ${response.status} ${errorBody}`); } const data = await response.json(); return data.choices[0].message.content; }

// ========================================================================
// 5. FUNÇÃO PRINCIPAL (HANDLER) - ORQUESTRADOR INTELIGENTE
// ========================================================================
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') { return { statusCode: 405, body: 'Method Not Allowed' }; }
    const { message } = JSON.parse(event.body);
    if (!message) { return { statusCode: 400, body: 'Bad Request: message is required.' }; }

    let reply = "";
    console.log("Analisando com o Cérebro Local (v8.0)...");
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
                try {
                    console.log("Executando Plano C: Groq.");
                    const groqKey = process.env.GROQ_API_KEY;
                    if (!groqKey) throw new Error("Groq API Key not configured.");
                    reply = await callGroqAPI(orchestratedPrompt, groqKey);
                } catch (groqError) {
                    console.error("Plano C (Groq) falhou:", groqError.message);
                    console.log("Planos A, B e C falharam. Recorrendo ao Cérebro Local como última tentativa de resposta.");
                    // Se todas as IAs falham, tenta a melhor resposta do cérebro local, mesmo com baixa confiança.
                    reply = localAnalysis.bestMatch ? localAnalysis.bestMatch.response : null;
                }
            }
        }
    }

    // ATUALIZADO: Lógica de Fallback Final.
    // Se, após todas as tentativas (Cérebro Local de alta confiança, todas as IAs, Cérebro Local de baixa confiança),
    // ainda não houver uma resposta, então aciona o fallback final com o WhatsApp.
    const finalReply = (reply && reply.trim() !== "") ? reply : ULTIMATE_FALLBACK_RESPONSE;
    
    return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }, 
        body: JSON.stringify({ reply: finalReply }) 
    };
};
