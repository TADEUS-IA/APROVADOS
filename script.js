document.addEventListener("DOMContentLoaded", function() {
    // Efeito de fundo animado
    VANTA.GLOBE({
         el: "#vanta-header", mouseControls: true, touchControls: true, gyroControls: false,
         minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
         color: '#6A00FF', color2: '#9e4bff', backgroundColor: '#0A0A0A', size: 1.20
    });

    // Animação de elementos ao rolar
    const observer = new IntersectionObserver((entries) => {
         entries.forEach(entry => {
              if (entry.isIntersecting) { entry.target.classList.add('is-visible'); }
         });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => { observer.observe(el); });

    // --- INÍCIO: NOVAS FUNCIONALIDADES E AJUSTES ---

    // AJUSTE 1: NOVA CALCULADORA DE CUSTO POR AQUISIÇÃO (CPA)
    const cpaForm = document.getElementById('cpaForm');
    if (cpaForm) {
         cpaForm.addEventListener('submit', function(event) {
              event.preventDefault();
             
              const segmento = document.getElementById('calcSegmento').value;
              const resultadoDiv = document.getElementById('resultadoCPA');

              if (!segmento) {
                   resultadoDiv.innerHTML = 'Por favor, selecione um segmento para estimar.';
                   resultadoDiv.className = 'resultado-roi negativo';
                   resultadoDiv.style.display = 'block';
                   return;
              }

              let cpa;
              // Lógica para definir o CPA baseado no segmento
              switch (segmento) {
                   case 'Barbearia':
                   case 'Hamburgueria':
                        cpa = 3.50;
                        break;
                   case 'Clinica':
                   case 'Loja':
                        cpa = 5.00;
                        break;
                   case 'Outro':
                        cpa = 2.50;
                        break;
                   default:
                        cpa = 3.50;
              }

              let resultadoHTML = `Para o segmento <strong>${segmento}</strong>, seu custo por cliente é de aproximadamente <strong>R$ ${cpa.toFixed(2).replace('.', ',')}</strong>.`;
              resultadoHTML += `<br><br><small style="font-weight: 400; font-size: 0.9rem; opacity: 0.8;">AVISO: Estes valores podem mudar de acordo com o dia, mas ficam nesta margem.</small>`;
             
              resultadoDiv.innerHTML = resultadoHTML;
              resultadoDiv.className = 'resultado-roi positivo';
              resultadoDiv.style.display = 'block';
         });
    }


    // AJUSTE 2: FORMULÁRIO DE DIAGNÓSTICO ENVIADO DIRETO PARA O WHATSAPP
    const diagnosticoForm = document.getElementById('diagnosticoForm');
    if (diagnosticoForm) {
         diagnosticoForm.addEventListener('submit', function(event) {
              event.preventDefault();
             
              // --- IMPORTANTE: COLOQUE SEU NÚMERO DE WHATSAPP AQUI ---
              // Formato: 55 + DDD + Número (tudo junto, sem espaços ou símbolos)
              const seuNumeroWhatsApp = '5511916072188';

              const nome = document.getElementById('nome').value;
              const whatsapp = document.getElementById('whatsapp').value;
              const email = document.getElementById('email').value;
              const nomeEmpresa = document.getElementById('nomeEmpresa').value;
              const segmento = document.getElementById('segmento').value;

              // /============================================================================
              // / INÍCIO DA INTEGRAÇÃO COM WEBHOOK (N8N) - PLACEHOLDER
              // /============================================================================
              // / Este é o placeholder solicitado para o Webhook.
              // / Descomente o bloco abaixo e insira a URL do seu Webhook do n8n.
              // / Os dados serão enviados em formato JSON via método POST.
              
              const webhookUrl = 'https://automacoe-n8n.bitxsu.easypanel.host/webhook-test/leads';
              const formData = {
                   nome: nome,
                   whatsapp: whatsapp,
                   email: email,
                   empresa: nomeEmpresa,
                   segmento: segmento
              };

              fetch(webhookUrl, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(formData)
              })
              .then(response => { 
                   console.log('Sucesso - Webhook n8n enviado.');
                   // Você pode adicionar tratamento de resposta aqui se necessário
                   return response.json(); // Ou response.text() dependendo do que seu webhook retorna
              })
              .then(data => {
                   console.log('Resposta n8n:', data);
              })
              .catch((error) => {
                   console.error('Erro - Webhook n8n:', error);
              });
              
              // /============================================================================
              // / FIM DA INTEGRAÇÃO COM WEBHOOK (N8N) - PLACEHOLDER
              // /============================================================================

              // Monta a mensagem para o WhatsApp (código original mantido)
              const mensagem = `
*Olá! Gostaria de solicitar um diagnóstico gratuito.*

*Nome:* ${nome}
*WhatsApp:* ${whatsapp}
*E-mail:* ${email}
*Empresa:* ${nomeEmpresa}
*Segmento:* ${segmento}
              `.trim();

              // Codifica a mensagem para ser usada na URL (código original mantido)
              const mensagemCodificada = encodeURIComponent(mensagem);

              // Cria o link do WhatsApp e abre em uma nova aba (código original mantido)
              const linkWhatsApp = `https://wa.me/${seuNumeroWhatsApp}?text=${mensagemCodificada}`;
             
              window.open(linkWhatsApp, '_blank');
             
              // Limpa o formulário e exibe mensagem de sucesso (código original mantido)
              diagnosticoForm.reset();
              const formStatus = document.getElementById('formStatus');
              formStatus.textContent = 'Ótimo! Agora é só enviar a mensagem no seu WhatsApp.';
              formStatus.style.color = 'var(--verde-neon)';
              setTimeout(() => { formStatus.textContent = ''; }, 5000); // Limpa a mensagem após 5 segundos
         });
    }

    // AJUSTE 3: CÓDIGO ORIGINAL MANTIDO
    const servicoCards = document.querySelectorAll('.servico-card');
    const modal = document.getElementById('servicoModal');
    const closeModalBtn = document.querySelector('.close-button');
    servicoCards.forEach(card => {
         const imgUrl = card.dataset.imgUrl;
         if (imgUrl) card.style.backgroundImage = `url('${imgUrl}')`;
         card.addEventListener('click', () => {
              document.getElementById('modalTitle').textContent = card.dataset.title;
              document.getElementById('modalImpulsionamento').textContent = card.dataset.impulsionamento;
              document.getElementById('modalAutomacao').textContent = card.dataset.automacao;
              document.getElementById('modalCombo').textContent = card.dataset.combo;
              modal.style.display = 'block';
         });
    });
    const closeModal = () => { if(modal) modal.style.display = 'none'; };
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target == modal) closeModal(); });

    // --- CÓDIGO ORIGINAL DO CHAT, SCROLL, ETC (MANTIDO) ---
    const chatToggleButton = document.getElementById('chat-toggle-button');
    const chatWidget = document.getElementById('chat-widget');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const backToTopButton = document.getElementById('back-to-top-btn');
    const whatsappButton = document.getElementById('whatsapp-track-button');
    const quickRepliesContainer = document.getElementById('chat-quick-replies');

    chatToggleButton.addEventListener('click', () => chatWidget.classList.toggle('hidden'));
    chatForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const userInput = chatInput.value.trim();
         if (!userInput) return;
         if (document.getElementById('chat-quick-replies')) {
              document.getElementById('chat-quick-replies').remove();
         }
         addMessage(userInput, 'sent');
         chatInput.value = '';
         getAIResponse(userInput);
    });
    const predefinedResponses = {
         'Automação': 'Excelente escolha! Nossa <strong>Automação Inteligente</strong> usa a plataforma N8N para criar fluxos de vendas, pós-venda e nutrição. Conectamos suas ferramentas, reduzimos erros e economizamos horas de trabalho, permitindo que sua empresa escale de forma previsível. Quer saber como isso se aplica ao seu negócio?',
         'Impulsionamento': 'Ótimo! Nosso <strong>Impulsionamento de Alta Performance</strong> foca em estratégia de mídia para gerar resultados. Analisamos seu público, testamos criativos e otimizamos o orçamento diariamente para reduzir seu Custo de Aquisição (CAC) e maximizar o retorno. Pronto para lançar uma campanha que vende?',
         'Valor': 'Nossos planos são desenhados para gerar retorno rápido. O plano <strong>"Automação + Tráfego"</strong> é o mais popular por integrar o melhor dos dois mundos, reduzindo o custo por venda. Quer agendar um diagnóstico gratuito para eu te mostrar o potencial de retorno para o seu caso específico?',
         'Dúvida': 'Sem problemas. Sou um agente de IA treinado para te ajudar. Pode me perguntar qualquer coisa sobre nossos serviços, como funciona a integração, quais ferramentas usamos, ou qualquer outra questão que tiver. Estou aqui para esclarecer tudo para você.'
    };
    if (quickRepliesContainer) {
         quickRepliesContainer.addEventListener('click', function(event) {
              if (event.target.classList.contains('quick-reply-btn')) {
                   const userChoice = event.target.dataset.value;
                   const botReply = predefinedResponses[userChoice];
                   addMessage(userChoice, 'sent');
                   showLoadingIndicator();
                   setTimeout(() => {
                        hideLoadingIndicator();
                        if (botReply) addMessage(botReply, 'received');
                   }, 500);
                   event.target.parentElement.remove();
              }
         });
      }
      window.addEventListener('scroll', () => {
           if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
           } else {
                backToTopButton.classList.remove('visible');
           }
      });
      function addMessage(htmlContent, type) {
         const messageElement = document.createElement('div');
         messageElement.className = `message ${type}`;
         messageElement.innerHTML = htmlContent;
         chatMessages.appendChild(messageElement);
         chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      function showLoadingIndicator() {
         const loadingElement = document.createElement('div');
         loadingElement.className = 'message loading';
         loadingElement.id = 'loading-indicator';
         loadingElement.innerHTML = '<span></span><span></span><span></span>';
         chatMessages.appendChild(loadingElement);
         chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      function hideLoadingIndicator() {
         const indicator = document.getElementById('loading-indicator');
         if (indicator) indicator.remove();
      }
      async function getAIResponse(userInput) {
         showLoadingIndicator();
         try {
              const response = await fetch('/.netlify/functions/ask-tadeus', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ message: userInput })
              });
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              const data = await response.json();
              hideLoadingIndicator();
              addMessage(data.reply, 'received');
         } catch (error) {
              console.error("Erro ao contatar a API:", error);
              hideLoadingIndicator();
              addMessage("Desculpe, estou com um problema técnico no momento. Por favor, tente novamente ou contate-nos pelo <a href='https://wa.me/message/DQJBWVDS3BJ4N1' target='_blank'>WhatsApp</a>.", 'received');
         }
      }
      whatsappButton.addEventListener('click', function(event) {
         // Manter o comportamento original de rastreamento se houver
      });
});