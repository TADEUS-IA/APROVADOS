// ARQUIVO: netlify/functions/track-meta.js (V2 - Reenvio Forçado)

// ARQUIVO: netlify/functions/track-meta.js
// OBJETIVO: Central de rastreamento para PageView, Cliques e Formulários via API (Server-Side)

const META_GRAPH_URL = "https://graph.facebook.com/v19.0";

exports.handler = async (event) => {
    // Permissões de segurança (CORS) para seu site falar com esse backend
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
    if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

    try {
        const data = JSON.parse(event.body);
        const eventName = data.eventName || "PageView";
        const sourceUrl = data.sourceUrl || "https://tadeus.ai";
        
        // Pega as chaves que você já configurou na Netlify (não precisa configurar de novo)
        const PIXEL_ID = process.env.META_PIXEL_ID;
        const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
        const TEST_CODE = process.env.META_TEST_CODE;

        if (!PIXEL_ID || !ACCESS_TOKEN) {
            return { statusCode: 500, headers, body: JSON.stringify({ error: "Meta Config Missing" }) };
        }

        // Pega IP e Navegador reais (Netlify Headers)
        const clientIp = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || '0.0.0.0';
        const userAgent = event.headers['user-agent'] || 'Unknown';

        // Monta o pacote para o Facebook
        const payload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    event_source_url: sourceUrl,
                    action_source: "website",
                    user_data: {
                        client_ip_address: clientIp,
                        client_user_agent: userAgent
                    }
                }
            ]
        };

        if (TEST_CODE) payload.test_event_code = TEST_CODE;

        // Envia para a Meta
        await fetch(`${META_GRAPH_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

    } catch (error) {
        console.error("Tracking Error:", error);
        return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
};