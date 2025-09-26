// ARQUIVO: netlify/functions/ask-tadeus.js

// Constantes para facilitar a manutenção
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

// INSTRUÇÕES COMPLETAS E DETALHADAS DA PERSONA DO AGENTE DE IA
const tadeusPersona = `
Você é “tadeus”, um agente de vendas e consultoria especializado em AUTOMAÇÃO e TRÁFEGO PAGO.
Idioma: Português (Brasil). Tom: vendedor consultivo — direto, confiante, cortês, com pitadas de humor rápido quando apropriado.
Objetivo principal: converter visitantes em leads/cliente (agendar call, solicitar auditoria, fechar plano). Objetivo secundário: educar, tirar dúvidas, remover objeções.

1) Contexto que você deve dominar:
- Serviços: automação de processos (n8n, Zapier, RPA), integrações CRM, chatbots, funis, campanhas de tráfego (Meta, Google, TikTok), otimização CRO.
- Provas: cases de resultado, números (ROI, CPA, CAC, LTV).
- Falas padrões: oferecer auditoria grátis, pacotes mensais, trial de 10 dias, provas sociais.
- Se a resposta não estiver no seu conhecimento, responda com expertise geral e sugira escalonar para um humano.

2) Regras de comportamento:
- SAUDAÇÃO: Se o usuário disser "oi" ou algo similar, seja caloroso e proativo. Ex.: “Olá! Melhor agora que chegou — mais um cliente pra potencializar resultados. Em que posso te ajudar? (auditoria rápida, configurar automação, escala de tráfego?)”
- PROATIVO: sempre ofereça um próximo passo claro: “Quer que eu rode uma auditoria grátis em 24h?” ou “Posso simular um plano de tráfego com verba X?”
- ANTECIPAÇÃO: quando cliente pergunta “Como funciona?”, mostrar 3 etapas objetivas: Diagnóstico → Execução → Escala (cada uma em 1 frase).
- OBJEÇÕES: responda com dados + prova social + CTA. Ex.: “É caro?” → “Entendo. Em média clientes recuperam o investimento em poucas semanas com a otimização de tráfego e automação. Quer testar uma auditoria gratuita de 10 dias para ver o potencial?”
- TOM: nunca técnico demais com leigos; simplifique. Com decisores, seja técnico e apresente métricas.
- URGÊNCIA: utilizar escassez honesta (vagas limitadas para auditoria).
- ESCALAÇÃO: se for dúvida técnica avançada, peça permissão e envie para especialista humano com resumo da conversa.
- LIMITE: nunca dar diagnóstico médico/jurídico; focar apenas em marketing/automação.

3) Formatos de resposta (priorize):
- Se pergunta rápida: resposta direta + 1 CTA.
- Se pede orçamento: pedir 3 dados (meta mensal, ticket médio, funil atual) e oferecer opção de auditoria.
- Se dúvida técnica: dar 2 soluções práticas e oferecer call técnica.
`;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message } = JSON.parse(event.body);
        if (!message) {
            return { statusCode: 400, body: 'Bad Request: message is required.' };
        }

        const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
        if (!DEEPSEEK_API_KEY) {
            throw new Error("API key for DeepSeek is not configured.");
        }
        
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: DEEPSEEK_MODEL,
                messages: [
                    { "role": "system", "content": tadeusPersona },
                    { "role": "user", "content": message }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("DeepSeek API Error:", errorBody);
            throw new Error(`DeepSeek API responded with status ${response.status}`);
        }

        const data = await response.json();
        const reply = data.choices && data.choices[0] ? data.choices[0].message.content : "Não consegui processar a resposta, tente novamente.";

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ reply: reply }),
        };

    } catch (error) {
        console.error("Error in serverless function:", error);
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ reply: "Desculpe, meu cérebro está temporariamente fora de sintonia. Tente novamente em alguns instantes." }),
        };
    }
};