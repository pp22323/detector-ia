// --- Configurações Gerais ---
const body = document.body;
const sectionDetectorImagem = document.getElementById('detector-imagem');
const sectionDetectorAudio = document.getElementById('detector-audio');
const sectionQuiz = document.getElementById('quiz-ia');
const sectionDashboard = document.getElementById('dashboard');
const uploadInput = document.getElementById('upload-input');
const previewImagem = document.getElementById('preview-imagem');
const botaoAnalisar = document.getElementById('botao-analisar');
const loadingBar = document.getElementById('loading-bar');
const resultadoDiv = document.getElementById('resultado-analise');
const areaReconhecimentoVoz = document.getElementById('reconhecimento-voz');
const botaoMicrofone = document.getElementById('botao-microfone');
const textoReconhecido = document.getElementById('texto-reconhecido');
const quizContainer = document.getElementById('quiz-container');
const pontuacaoSpan = document.getElementById('pontuacao');
const botaoReiniciarQuiz = document.getElementById('botao-reiniciar-quiz');
const contadores = document.querySelectorAll('.contador-animado');
const elementosFadeIn = document.querySelectorAll('.fade-in');

let pontuacaoQuiz = 0;
let perguntasQuiz = [];
let indicePerguntaAtual = 0;

// --- Funções Utilitárias ---

function toastNotification(mensagem, tipo = 'info') {
    const notificacoesContainer = document.getElementById('notificacoes-container');
    if (!notificacoesContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', tipo);
    toast.textContent = mensagem;

    notificacoesContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 5000);
}

function animarContador(elemento, inicio, fim, duracao) {
    let contador = 0;
    const intervalo = duracao / (fim - inicio);

    function atualizarContador() {
        if (contador < fim) {
            contador++;
            elemento.textContent = contador;
            requestAnimationFrame(atualizarContador);
        } else {
            elemento.textContent = fim;
        }
    }
    atualizarContador();
}

function aplicarFadeInScroll() {
    elementosFadeIn.forEach(elemento => {
        const posicao = elemento.getBoundingClientRect().top;
        const alturaJanela = window.innerHeight;

        if (posicao < alturaJanela - 50) {
            elemento.classList.add('visible');
        }
    });
}

function adicionarHoverEffects() {
    const elementosHover = document.querySelectorAll('.hover-effect');
    elementosHover.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transform = 'scale(1.05)';
            el.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'scale(1)';
            el.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
    });
}

function gerarBackgroundAnimado() {
    const canvas = document.createElement('canvas');
    canvas.id = 'background-canvas';
    body.insertBefore(canvas, body.firstChild);
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 150;
    const particleColor = '#00bfff'; // Azul Ciano
    const particleRadius = 2;
    const maxSpeed = 1;
    const connectionDistance = 100;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = particleRadius;
            this.speedX = (Math.random() - 0.5) * maxSpeed;
            this.speedY = (Math.random() - 0.5) * maxSpeed;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.speedX *= -1;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.speedY *= -1;
            }

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 191, 255, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animate();
}

function esconderTodosSementes() {
    if (sectionDetectorImagem) sectionDetectorImagem.style.display = 'none';
    if (sectionDetectorAudio) sectionDetectorAudio.style.display = 'none';
    if (sectionQuiz) sectionQuiz.style.display = 'none';
    if (sectionDashboard) sectionDashboard.style.display = 'none';
}

function mostrarSeccao(seccao) {
    esconderTodosSementes();
    if (seccao) {
        seccao.style.display = 'block';
    }
}

// --- Detector de Imagem IA ---

function previewImagemUpload() {
    const arquivo = uploadInput.files[0];
    if (arquivo) {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            previewImagem.src = e.target.result;
            previewImagem.style.display = 'block';
            botaoAnalisar.disabled = false;
        }
        leitor.readAsDataURL(arquivo);
    } else {
        previewImagem.src = '#';
        previewImagem.style.display = 'none';
        botaoAnalisar.disabled = true;
    }
}

async function analisarImagem() {
    if (!uploadInput.files || uploadInput.files.length === 0) {
        toastNotification('Por favor, selecione uma imagem primeiro.', 'error');
        return;
    }

    const arquivo = uploadInput.files[0];
    const formData = new FormData();
    formData.append('imagem', arquivo);

    loadingBar.style.width = '0%';
    loadingBar.style.display = 'block';
    botaoAnalisar.disabled = true;
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.display = 'none';

    try {
        const response = await fetch("/api/analisar", {
            method: "POST",
            body: formData
        });

        // Simula o progresso da loading bar
        let progresso = 0;
        const intervaloProgresso = setInterval(() => {
            progresso += Math.random() * 5 + 5;
            if (progresso >= 100) {
                progresso = 100;
                clearInterval(intervaloProgresso);
                loadingBar.style.width = '100%';
            }
            loadingBar.style.width = `${progresso}%`;
        }, 150);

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || 'Erro ao analisar imagem.');
        }

        const resultado = await response.json();
        clearInterval(intervaloProgresso); // Garante que a animação pare
        loadingBar.style.width = '100%';
        setTimeout(() => {
            loadingBar.style.display = 'none';
            exibirResultadoImagem(resultado);
        }, 500);


    } catch (error) {
        console.error("Erro na análise da imagem:", error);
        toastNotification(`Falha na análise: ${error.message}`, 'error');
        clearInterval(intervaloProgresso); // Garante que a animação pare em caso de erro
        loadingBar.style.display = 'none';
        botaoAnalisar.disabled = false;
        resultadoDiv.innerHTML = `<p class="erro">Ocorreu um erro: ${error.message}</p>`;
        resultadoDiv.style.display = 'block';
    }
}

function exibirResultadoImagem(resultado) {
    resultadoDiv.innerHTML = ''; // Limpa resultados anteriores
    if (resultado.descricao) {
        const pDescricao = document.createElement('p');
        pDescricao.textContent = `Descrição: ${resultado.descricao}`;
        resultadoDiv.appendChild(pDescricao);
    }
    if (resultado.confianca) {
        const pConfianca = document.createElement('p');
        pConfianca.textContent = `Confiança: ${resultado.confianca.toFixed(2)}%`;
        resultadoDiv.appendChild(pConfianca);
    }
    if (resultado.tipo && resultado.tipo !== 'desconhecido') {
         const pTipo = document.createElement('p');
         pTipo.textContent = `Detectado como: ${resultado.tipo}`;
         resultadoDiv.appendChild(pTipo);
    } else if (resultado.tipo === 'desconhecido') {
         const pTipo = document.createElement('p');
         pTipo.textContent = `Não foi possível determinar o tipo com certeza.`;
         resultadoDiv.appendChild(pTipo);
    }

    resultadoDiv.style.display = 'block';
    botaoAnalisar.disabled = false;
    toastNotification('Análise concluída!', 'success');
}

// --- Detector de Áudio ---

let reconhecimentoVoz = null;
let gravando = false;

function iniciarReconhecimentoVoz() {
    if (!suportaSpeech) {
        toastNotification("Seu navegador não suporta reconhecimento de voz.", "warning");
        return;
    }

    if (reconhecimentoVoz === null) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        reconhecimentoVoz = new SpeechRecognition();
        reconhecimentoVoz.continuous = false;
        reconhecimentoVoz.lang = 'pt-BR';
        reconhecimentoVoz.interimResults = false;
        reconhecimentoVoz.maxAlternatives = 1;

        reconhecimentoVoz.onresult = (event) => {
            const ultimoResultado = event.results[event.results.length - 1][0].transcript;
            textoReconhecido.textContent = ultimoResultado;
            toastNotification('Áudio recebido!', 'success');
            // Aqui você pode adicionar a lógica para enviar o áudio para análise, se necessário
            // fetch("/api/analisar-audio", { method: "POST", body: JSON.stringify({ audio: ultimoResultado }) });
        };

        reconhecimentoVoz.onspeechend = () => {
            botaoMicrofone.classList.remove('gravando');
            gravando = false;
            toastNotification('Parou de gravar.', 'info');
        };

        reconhecimentoVoz.onstart = () => {
            gravando = true;
            botaoMicrofone.classList.add('gravando');
            toastNotification('Gravando...', 'info');
        };

        reconhecimentoVoz.onerror = (event) => {
            console.error("Erro no reconhecimento de voz:", event.error);
            toastNotification(`Erro no microfone: ${event.error}`, 'error');
            gravando = false;
            botaoMicrofone.classList.remove('gravando');
        };
    }

    if (!gravando) {
        reconhecimentoVoz.start();
    } else {
        reconhecimentoVoz.stop();
    }
}

// --- Quiz Real ou IA ---

function carregarPerguntasQuiz() {
    perguntasQuiz = [
        {
            imagem: 'img/quiz/1_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/2_ia.jpg',
            resposta: 'ia'
        },
         {
            imagem: 'img/quiz/3_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/4_ia.jpg',
            resposta: 'ia'
        },
        {
            imagem: 'img/quiz/5_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/6_ia.jpg',
            resposta: 'ia'
        },
         {
            imagem: 'img/quiz/7_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/8_ia.jpg',
            resposta: 'ia'
        },
        {
            imagem: 'img/quiz/9_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/10_ia.jpg',
            resposta: 'ia'
        },
         {
            imagem: 'img/quiz/11_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/12_ia.jpg',
            resposta: 'ia'
        },
        {
            imagem: 'img/quiz/13_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/14_ia.jpg',
            resposta: 'ia'
        },
        {
            imagem: 'img/quiz/15_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/16_ia.jpg',
            resposta: 'ia'
        },
         {
            imagem: 'img/quiz/17_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/18_ia.jpg',
            resposta: 'ia'
        },
        {
            imagem: 'img/quiz/19_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/20_ia.jpg',
            resposta: 'ia'
        },
         {
            imagem: 'img/quiz/21_real.jpg',
            resposta: 'real'
        },
        {
            imagem: 'img/quiz/22_ia.jpg',
            resposta: 'ia'
        }
    ];
    // Embaralha as perguntas
    for (let i = perguntasQuiz.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [perguntasQuiz[i], perguntasQuiz[j]] = [perguntasQuiz[j], perguntasQuiz[i]];
    }
    indicePerguntaAtual = 0;
    pontuacaoQuiz = 0;
    pontuacaoSpan.textContent = pontuacaoQuiz;
}

function mostrarPerguntaQuiz() {
    if (indicePerguntaAtual < perguntasQuiz.length) {
        const pergunta = perguntasQuiz[indicePerguntaAtual];
        const quizImagem = document.getElementById('quiz-imagem');
        const botoesResposta = document.querySelectorAll('.botao-resposta');

        quizImagem.src = pergunta.imagem;
        botoesResposta.forEach(botao => {
            botao.onclick = () => verificarResposta(botao.dataset.resposta === pergunta.resposta);
            botao.disabled = false;
            botao.classList.remove('correta', 'incorreta');
        });
        quizContainer.style.animation = 'fadeIn 0.5s ease-in-out';
        setTimeout(() => {
             quizContainer.style.animation = '';
        }, 500);
    } else {
        mostrarResultadoQuiz();
    }
}

function verificarResposta(acertou) {
    const botoesResposta = document.querySelectorAll('.botao-resposta');
    botoesResposta.forEach(botao => {
        botao.disabled = true;
        const respostaCorreta = perguntasQuiz[indicePerguntaAtual].resposta;
        if (botao.dataset.resposta === respostaCorreta) {
            botao.classList.add('correta');
        } else {
            botao.classList.add('incorreta');
        }
    });

    if (acertou) {
        pontuacaoQuiz++;
        pontuacaoSpan.textContent = pontuacaoQuiz;
        toastNotification('Correto!', 'success');
    } else {
        toastNotification('Incorreto.', 'error');
    }

    indicePerguntaAtual++;
    setTimeout(mostrarPerguntaQuiz, 1500);
}

function mostrarResultadoQuiz() {
    const quizResultado = document.getElementById('quiz-resultado');
    const pontuacaoFinal = document.getElementById('pontuacao-final');
    pontuacaoFinal.textContent = `${pontuacaoQuiz} de ${perguntasQuiz.length}`;
    quizResultado.style.display = 'block';
    quizResultado.style.animation = 'fadeIn 0.5s ease-in-out';
    toastNotification(`Quiz finalizado! Sua pontuação: ${pontuacaoQuiz}/${perguntasQuiz.length}`, 'info');
}

function reiniciarQuiz() {
    carregarPerguntasQuiz();
    document.getElementById('quiz-resultado').style.display = 'none';
    mostrarPerguntaQuiz();
    toastNotification('Quiz reiniciado!', 'info');
}

// --- Dashboard Animado ---

function animarDashboard() {
    contadores.forEach(contador => {
        const valorFinal = parseInt(contador.dataset.valor);
        if (valorFinal) {
            animarContador(contador, 0, valorFinal, 2000);
        }
    });
}

// --- Inicialização ---

function inicializar() {
    // Event Listeners
    if (uploadInput && sectionDetectorImagem) {
        uploadInput.addEventListener('change', previewImagemUpload);
        botaoAnalisar.addEventListener('click', analisarImagem);
        botaoAnalisar.disabled = true; // Começa desabilitado
    }

    if (botaoMicrofone && sectionDetectorAudio) {
        botaoMicrofone.addEventListener('click', iniciarReconhecimentoVoz);
    }

    if (botaoReiniciarQuiz && sectionQuiz) {
        botaoReiniciarQuiz.addEventListener('click', reiniciarQuiz);
    }

    window.addEventListener('scroll', aplicarFadeInScroll);

    // Navegação entre seções (Exemplo - pode ser adaptado para botões reais)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const seccaoId = link.getAttribute('href');
            const seccao = document.querySelector(seccaoId);
            if (seccao) {
                mostrarSeccao(seccao);
                // Animações específicas ao mostrar seções
                if (seccaoId === '#dashboard') {
                    animarDashboard();
                }
                if (seccaoId === '#quiz-ia') {
                    if (perguntasQuiz.length === 0) {
                         carregarPerguntasQuiz();
                    }
                     mostrarPerguntaQuiz();
                }
                if (seccaoId === '#detector-imagem') {
                    if (previewImagem.src && previewImagem.src !== '#') {
                         botaoAnalisar.disabled = false;
                    }
                }
                 if (seccaoId === '#detector-audio') {
                    if (suportaSpeech && reconhecimentoVoz && gravando) {
                        // Se já estava gravando, para a animação visual do botão
                       botaoMicrofone.classList.remove('gravando');
                       gravando = false;
                       reconhecimentoVoz.stop();
                    }
                }
            }
        });
    });

    // Inicializa estado dos botões e previews
    previewImagemUpload(); // Para garantir que o estado inicial esteja correto

    // Chama as funções de inicialização
    aplicarFadeInScroll();
    adicionarHoverEffects();
    gerarBackgroundAnimado(); // Adiciona o background animado
    if (sectionQuiz) carregarPerguntasQuiz(); // Carrega as perguntas do quiz no início
     if (sectionDashboard) animarDashboard(); // Tenta animar o dashboard se já estiver visível

    toastNotification('DeepVision IA carregado!', 'info');
}

// Chama a função de inicialização principal
inicializar();

// Adiciona um listener para garantir que o background se ajuste ao redimensionar
window.addEventListener('resize', () => {
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
     aplicarFadeInScroll(); // Reavalia elementos fade-in após redimensionamento
});
