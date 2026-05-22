// script.js

// --- Variáveis Globais ---
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const uploadImage = document.getElementById('uploadImage');
const fileNameDisplay = document.getElementById('fileName');
const fileSizeDisplay = document.getElementById('fileSize');
const analyzeButton = document.getElementById('analyzeButton');
const resultContainer = document.getElementById('resultContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');
const quizContainer = document.getElementById('quizContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const restartQuizButton = document.getElementById('restartQuizButton');

let currentImageFile = null;
let currentAnalysisResult = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let userScore = 0;

// --- Funções de Utilidade ---

/**
 * Exibe uma mensagem toast com feedback visual.
 * @param {string} message - A mensagem a ser exibida.
 * @param {'success' | 'error' | 'info'} type - O tipo de mensagem (afeta a cor).
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}

/**
 * Adiciona um efeito de fade-in a um elemento.
 * @param {HTMLElement} element - O elemento a ser animado.
 */
function fadeInElement(element) {
    element.style.opacity = '0';
    element.style.display = 'block'; // Garante que o display esteja ativo para a transição
    requestAnimationFrame(() => {
        setTimeout(() => {
            element.style.opacity = '1';
        }, 20); // Pequeno delay para garantir que a opacidade inicial seja aplicada
    });

    element.addEventListener('transitionend', () => {
        element.style.opacity = ''; // Limpa o estilo para evitar conflitos
    });
}

/**
 * Adiciona um efeito de glow a um elemento.
 * @param {HTMLElement} element - O elemento a ser animado.
 */
function addGlowEffect(element) {
    element.classList.add('glow-effect');
    element.addEventListener('animationend', () => {
        element.classList.remove('glow-effect');
    }, { once: true });
}

/**
 * Exibe a barra de progresso animada.
 * @param {number} duration - Duração da animação em milissegundos.
 */
function animateProgressBar(duration = 2000) {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        requestAnimationFrame(() => {
            setTimeout(() => {
                progressBar.style.transition = `width ${duration}ms ease-in-out`;
                progressBar.style.width = '100%';
            }, 20);
        });
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    return Promise.resolve();
}

/**
 * Cria um elemento de botão com microanimações.
 * @param {string} text - O texto do botão.
 * @param {Function} onClick - A função a ser chamada ao clicar.
 * @param {string} className - Classes CSS adicionais para o botão.
 * @returns {HTMLButtonElement} O elemento de botão criado.
 */
function createAnimatedButton(text, onClick, className = '') {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `animated-button ${className}`;
    button.addEventListener('click', onClick);

    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 0 15px rgba(100, 200, 255, 0.8)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = 'none';
    });

    button.addEventListener('click', () => {
        addGlowEffect(button);
    });

    return button;
}

// --- Manipulação de Imagem e Preview ---

/**
 * Atualiza o preview da imagem selecionada.
 * @param {File} file - O arquivo de imagem.
 */
function updateImagePreview(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadImage.src = e.target.result;
            uploadImage.style.display = 'block';
            previewContainer.style.display = 'block';

            // Exibe detalhes do arquivo
            fileNameDisplay.textContent = file.name;
            fileSizeDisplay.textContent = formatBytes(file.size);
            document.getElementById('fileDetails').style.display = 'flex';

            // Adiciona efeito de fade-in ao preview
            fadeInElement(uploadImage);
        }
        reader.readAsDataURL(file);
    } else {
        uploadImage.src = '#';
        uploadImage.style.display = 'none';
        fileNameDisplay.textContent = '';
        fileSizeDisplay.textContent = '';
        document.getElementById('fileDetails').style.display = 'none';
        previewContainer.style.display = 'none';
    }
}

/**
 * Formata o tamanho do arquivo em bytes para KB, MB, etc.
 * @param {number} bytes - O tamanho em bytes.
 * @param {number} decimals - O número de casas decimais.
 * @returns {string} O tamanho formatado.
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// --- Análise de Imagem ---

/**
 * Prepara o formulário para envio via FormData.
 * @param {File} file - O arquivo de imagem.
 * @returns {FormData} O objeto FormData.
 */
function createFormData(file) {
    const formData = new FormData();
    formData.append('image', file);
    return formData;
}

/**
 * Exibe o resultado da análise.
 * @param {object} data - Os dados do resultado da análise.
 */
function displayAnalysisResult(data) {
    resultContainer.innerHTML = ''; // Limpa resultados anteriores

    const resultTitle = document.createElement('h3');
    resultTitle.textContent = "Análise da Imagem:";
    resultTitle.className = 'result-title';
    resultContainer.appendChild(resultTitle);

    if (data.error) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `Erro na análise: ${data.error}`;
        errorMsg.style.color = 'red';
        resultContainer.appendChild(errorMsg);
        showToast(`Análise falhou: ${data.error}`, 'error');
        return;
    }

    if (data.predictions && data.predictions.length > 0) {
        data.predictions.forEach(prediction => {
            const predictionElement = document.createElement('div');
            predictionElement.className = 'prediction-item';

            const label = document.createElement('span');
            label.textContent = `${prediction.label}: `;
            label.className = 'prediction-label';

            const value = document.createElement('span');
            value.textContent = prediction.value.toFixed(2); // Assumindo que é um valor numérico
            value.className = 'prediction-value';

            predictionElement.appendChild(label);
            predictionElement.appendChild(value);
            resultContainer.appendChild(predictionElement);
        });
        fadeInElement(resultContainer);
        showToast('Análise concluída com sucesso!', 'success');
    } else {
        const noResult = document.createElement('p');
        noResult.textContent = 'Nenhuma predição encontrada.';
        resultContainer.appendChild(noResult);
        showToast('Análise concluída, mas sem resultados claros.', 'info');
    }
}

/**
 * Gerencia o estado de carregamento.
 * @param {boolean} isLoading - Define se o carregamento está ativo.
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        loadingOverlay.style.display = 'flex';
        analyzeButton.disabled = true;
        analyzeButton.classList.add('loading');
        // Simula uma barra de progresso animada durante o carregamento
        animateProgressBar(3000).then(() => {
            if (isLoading) { // Verifica se o estado de loading ainda está ativo
                // Adiciona um feedback visual de "processando" se a barra terminar
                const processingIndicator = document.createElement('span');
                processingIndicator.textContent = 'IA Analisando...';
                processingIndicator.id = 'processingIndicator';
                processingIndicator.style.animation = 'blink 1s infinite';
                analyzeButton.appendChild(processingIndicator);
            }
        });
    } else {
        loadingOverlay.style.display = 'none';
        analyzeButton.disabled = false;
        analyzeButton.classList.remove('loading');
        const processingIndicator = document.getElementById('processingIndicator');
        if (processingIndicator) {
            processingIndicator.remove();
        }
    }
}

/**
 * Realiza a análise da imagem via fetch.
 */
async function analyzeImage() {
    if (!currentImageFile) {
        showToast("Por favor, selecione uma imagem primeiro.", "error");
        return;
    }

    setLoadingState(true);
    resultContainer.innerHTML = ''; // Limpa resultados anteriores
    document.getElementById('fileDetails').style.display = 'none'; // Esconde detalhes durante análise

    try {
        const formData = createFormData(currentImageFile);
        const response = await fetch("/api/analisar", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Tenta obter JSON, senão {}
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentAnalysisResult = data;
        displayAnalysisResult(data);

    } catch (error) {
        console.error("Erro ao analisar imagem:", error);
        displayAnalysisResult({ error: error.message });
        showToast(`Falha na análise: ${error.message}`, 'error');
    } finally {
        setLoadingState(false);
        // Atualiza o estado do detector de imagem para "IA Analisando" e depois sucesso/erro
        updateImageDetectorState(currentAnalysisResult ? (currentAnalysisResult.error ? 'error' : 'success') : 'error');
    }
}

/**
 * Atualiza o estado visual do detector de imagem.
 * @param {'idle' | 'uploading' | 'analyzing' | 'success' | 'error'} state - O estado atual.
 */
function updateImageDetectorState(state) {
    const detectorElement = document.getElementById('imageDetector');
    const progressContainer = document.getElementById('progressBarContainer');
    const statusMessage = document.getElementById('statusMessage');

    // Reseta estilos
    detectorElement.className = 'image-detector-container';
    statusMessage.textContent = '';
    progressContainer.style.display = 'none';

    switch (state) {
        case 'uploading':
            statusMessage.textContent = 'Carregando imagem...';
            break;
        case 'analyzing':
            statusMessage.textContent = 'IA Analisando...';
            progressContainer.style.display = 'block';
            animateProgressBar(3000); // Inicia a barra de progresso
            break;
        case 'success':
            statusMessage.textContent = 'Análise Concluída!';
            detectorElement.classList.add('state-success');
            addGlowEffect(detectorElement); // Efeito glow no sucesso
            break;
        case 'error':
            statusMessage.textContent = 'Erro na Análise!';
            detectorElement.classList.add('state-error');
            showToast('Ocorreu um erro durante a análise.', 'error');
            break;
        case 'idle':
        default:
            // Estado inicial ou após erro/limpeza
            break;
    }
}

// --- Quiz ---

/**
 * Carrega as perguntas do quiz.
 */
async function loadQuizQuestions() {
    // Em um cenário real, isso viria de uma API ou arquivo JSON.
    // Aqui, simulamos com dados estáticos e pegamos as imagens do diretório /images/quiz/
    const imageUrls = Array.from({ length: 20 }, (_, i) => `/images/quiz/image_${i + 1}.jpg`); // Assumindo nomes sequenciais
    const questionTexts = [
        "Qual destes animais é um felino?",
        "Identifique a fruta:",
        "Qual destes é um meio de transporte?",
        "Qual destes é um instrumento musical?",
        "Qual destes é um objeto de cozinha?",
        "Identifique o tipo de construção:",
        "Qual destes é um elemento da natureza?",
        "Qual destes é um acessório de vestuário?",
        "Identifique o inseto:",
        "Qual destes é um esporte?",
        "Qual destes é um móvel?",
        "Identifique a bebida:",
        "Qual destes é um mamífero marinho?",
        "Qual destes é um objeto de escritório?",
        "Identifique o tipo de flor:",
        "Qual destes é um ponto turístico?",
        "Qual destes é um eletrodoméstico?",
        "Identifique o veículo:",
        "Qual destes é um órgão do corpo humano?",
        "Qual destes é um corpo celeste?"
    ];

    if (imageUrls.length !== questionTexts.length) {
        console.error("Erro: Número de imagens e textos de pergunta do quiz não correspondem.");
        return [];
    }

    quizQuestions = [];
    for (let i = 0; i < questionTexts.length; i++) {
        const options = [];
        // Adiciona a imagem correta e mais 3 incorretas aleatoriamente
        const correctImageIndex = i;
        options.push(imageUrls[correctImageIndex]);

        // Garante que pegamos imagens diferentes e que não adicionamos a correta de novo
        while (options.length < 4) {
            const randomIndex = Math.floor(Math.random() * imageUrls.length);
            if (!options.includes(imageUrls[randomIndex])) {
                options.push(imageUrls[randomIndex]);
            }
        }

        // Embaralha as opções
        options.sort(() => Math.random() - 0.5);

        quizQuestions.push({
            question: questionTexts[i],
            options: options,
            correctAnswer: imageUrls[correctImageIndex]
        });
    }
    // Embaralha as perguntas também
    quizQuestions.sort(() => Math.random() - 0.5);
    return quizQuestions;
}

/**
 * Renderiza a pergunta atual do quiz.
 */
function renderQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        displayQuizResult();
        return;
    }

    const questionData = quizQuestions[currentQuestionIndex];
    quizContainer.innerHTML = ''; // Limpa a pergunta anterior

    const questionElement = document.createElement('div');
    questionElement.className = 'quiz-question';

    const questionText = document.createElement('h3');
    questionText.textContent = questionData.question;
    questionElement.appendChild(questionText);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'quiz-options';

    questionData.options.forEach(imageUrl => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option-button';
        optionButton.style.backgroundImage = `url('${imageUrl}')`;
        optionButton.dataset.imageUrl = imageUrl;

        optionButton.addEventListener('click', () => handleQuizAnswer(optionButton, imageUrl, questionData.correctAnswer));
        optionsContainer.appendChild(optionButton);
    });

    questionElement.appendChild(optionsContainer);
    quizContainer.appendChild(questionElement);
    fadeInElement(quizContainer);
}

/**
 * Lida com a resposta do usuário a uma pergunta do quiz.
 * @param {HTMLButtonElement} selectedButton - O botão clicado pelo usuário.
 * @param {string} selectedImageUrl - A URL da imagem selecionada.
 * @param {string} correctAnswerUrl - A URL da resposta correta.
 */
function handleQuizAnswer(selectedButton, selectedImageUrl, correctAnswerUrl) {
    const optionButtons = quizContainer.querySelectorAll('.quiz-option-button');
    optionButtons.forEach(btn => btn.disabled = true); // Desabilita todos os botões para evitar cliques múltiplos

    let isCorrect = false;
    if (selectedImageUrl === correctAnswerUrl) {
        userScore++;
        selectedButton.classList.add('correct');
        showToast('Correto!', 'success');
        isCorrect = true;
    } else {
        selectedButton.classList.add('incorrect');
        showToast('Incorreto.', 'error');
        // Destaca a resposta correta
        optionButtons.forEach(btn => {
            if (btn.dataset.imageUrl === correctAnswerUrl) {
                btn.classList.add('correct');
            }
        });
    }

    // Feedback visual
    setTimeout(() => {
        selectedButton.classList.add('answered');
        if (isCorrect) {
            addGlowEffect(selectedButton);
        } else {
            selectedButton.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
        }
    }, 500);

    currentQuestionIndex++;
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length) {
            renderQuizQuestion();
        } else {
            displayQuizResult();
        }
    }, 2000); // Espera um pouco para o feedback visual
}

/**
 * Exibe o resultado final do quiz.
 */
function displayQuizResult() {
    quizContainer.innerHTML = '';
    const resultElement = document.createElement('div');
    resultElement.className = 'quiz-result';

    const title = document.createElement('h3');
    title.textContent = 'Quiz Finalizado!';
    resultElement.appendChild(title);

    const scoreMessage = document.createElement('p');
    scoreMessage.textContent = `Sua pontuação: ${userScore} de ${quizQuestions.length}`;
    resultElement.appendChild(scoreMessage);

    // Feedback visual baseado na pontuação
    if (userScore === quizQuestions.length) {
        scoreMessage.style.color = 'green';
        scoreMessage.style.fontWeight = 'bold';
        showToast('Excelente! Você acertou tudo!', 'success');
    } else if (userScore >= quizQuestions.length / 2) {
        scoreMessage.style.color = 'orange';
        showToast('Bom trabalho!', 'info');
    } else {
        scoreMessage.style.color = 'red';
        showToast('Continue tentando!', 'error');
    }

    // Botão de reiniciar
    restartQuizButton.style.display = 'block';
    fadeInElement(restartQuizButton);

    resultElement.appendChild(restartQuizButton);
    quizContainer.appendChild(resultElement);
    fadeInElement(quizContainer);
}

/**
 * Reinicia o quiz.
 */
function restartQuiz() {
    userScore = 0;
    currentQuestionIndex = 0;
    scoreDisplay.textContent = `Pontuação: 0/${quizQuestions.length}`;
    restartQuizButton.style.display = 'none';
    loadQuizQuestions().then(questions => {
        if (questions.length > 0) {
            renderQuizQuestion();
        }
    });
}

/**
 * Inicializa o quiz.
 */
async function initializeQuiz() {
    await loadQuizQuestions();
    if (quizQuestions.length > 0) {
        scoreDisplay.textContent = `Pontuação: 0/${quizQuestions.length}`;
        scoreDisplay.style.display = 'block';
        quizContainer.style.display = 'block';
        renderQuizQuestion();
        fadeInElement(quizContainer);
    } else {
        quizContainer.innerHTML = '<p>Não foi possível carregar as perguntas do quiz.</p>';
        quizContainer.style.display = 'block';
    }
}

// --- Inicialização e Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Esconde elementos que serão exibidos dinamicamente
    previewContainer.style.display = 'none';
    resultContainer.innerHTML = '';
    resultContainer.style.display = 'none';
    loadingOverlay.style.display = 'none';
    toastContainer.style.display = 'block'; // O container de toast é sempre visível
    quizContainer.style.display = 'none';
    scoreDisplay.style.display = 'none';
    restartQuizButton.style.display = 'none';
    document.getElementById('fileDetails').style.display = 'none';


    // Manipulador para o input de arquivo
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        currentImageFile = file;
        if (file) {
            updateImagePreview(file);
            resultContainer.style.display = 'none'; // Esconde resultado anterior ao trocar imagem
            document.getElementById('fileDetails').style.display = 'flex'; // Mostra detalhes
            updateImageDetectorState('uploading'); // Atualiza estado do detector
            // Simula o fim do carregamento
            setTimeout(() => updateImageDetectorState('idle'), 1000);
        } else {
            updateImagePreview(null);
            updateImageDetectorState('idle');
        }
    });

    // Adiciona evento de drag-and-drop para o input de arquivo
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files; // Atribui os arquivos ao input
                fileInput.dispatchEvent(new Event('change')); // Dispara o evento change
            }
        });
    }

    // Manipulador para o botão ANALISAR
    analyzeButton.addEventListener('click', () => {
        updateImageDetectorState('analyzing'); // Mostra "IA Analisando" e barra de progresso
        analyzeImage().then(() => {
            // O estado de success/error é definido dentro de analyzeImage
        });
    });

    // Botão para iniciar o quiz
    const startQuizButton = document.getElementById('startQuizButton');
    if (startQuizButton) {
        startQuizButton.addEventListener('click', () => {
            document.getElementById('mainDashboard').style.display = 'none'; // Esconde dashboard principal
            fadeInElement(quizContainer); // Mostra container do quiz
            initializeQuiz();
        });
    }

    // Botão de reiniciar quiz
    restartQuizButton.addEventListener('click', restartQuiz);

    // Configuração inicial de UX - Efeitos de fade-in
    document.querySelectorAll('.fade-in-element').forEach(fadeInElement);

    // Cria e adiciona um botão de análise animado (exemplo)
    const customAnalyzeButton = createAnimatedButton("Analisar Imagem", analyzeImage, "custom-analyze-btn");
    // Substitui o botão original ou adiciona em outro lugar se preferir
    // analyzeButton.parentNode.replaceChild(customAnalyzeButton, analyzeButton);

    // Inicializa o quiz (se houver um botão para iniciá-lo)
    // initializeQuiz(); // Descomente se quiser carregar o quiz imediatamente
});
