// Funções para cada jogo
function showGame(game) {
    document.querySelectorAll('.game-section').forEach(sec => sec.style.display = 'none');
    document.getElementById(game).style.display = 'block';
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + game).classList.add('active');
    // Inicializa o jogo correto ao trocar de aba
    if (game === 'memory' && typeof shuffleMemory === 'function') shuffleMemory();
    if (game === 'quiz' && typeof showQuiz === 'function') showQuiz();
    if (game === 'velha' && typeof startVelha === 'function') startVelha();
    if (game === 'caca' && typeof iniciarCaca === 'function') iniciarCaca();
    if (game === 'termo' && typeof iniciarTermo === 'function') iniciarTermo();
}

// Jogo da Memória
const memoryImagesAll = [
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34e.png', // maçã
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34c.png', // banana
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f347.png', // uva
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f349.png', // melancia
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f353.png', // morango
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34a.png', // laranja
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f352.png', // cereja
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f34d.png', // abacaxi
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f350.png', // pera
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f351.png', // pêssego
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f348.png', // melão
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f36a.png', // biscoito
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f355.png', // pizza
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f354.png', // hamburguer
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f32d.png', // hot dog
];

let memoryNivelAtual = 'facil';
let memoryFlipped = [], memoryMatched = [], memoryLock = false;

function selecionarNivelMemoria() {
    const select = document.getElementById('memory-nivel');
    memoryNivelAtual = select.value;
    shuffleMemory();
}
function shuffleMemory() {
    memoryFlipped = [];
    memoryMatched = [];
    memoryLock = false;
    
    // Define quantidade de pares por nível
    let numPares;
    let cols;
    if (memoryNivelAtual === 'facil') {
        numPares = 8; // 16 cartas
        cols = 4;
    } else if (memoryNivelAtual === 'medio') {
        numPares = 12; // 24 cartas
        cols = 6;
    } else {
        numPares = 15; // 30 cartas
        cols = 6;
    }
    
    // Seleciona imagens e cria pares
    let selectedImages = memoryImagesAll.slice(0, numPares);
    let arr = [...selectedImages, ...selectedImages]; // duplica para pares
    arr.sort(() => Math.random() - 0.5);
    
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    
    arr.forEach((imgUrl, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.innerHTML = '<span style="font-size:2rem;">?</span>';
        card.style.background = '#fda085';
        card.style.borderRadius = '8px';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.justifyContent = 'center';
        card.style.height = '60px';
        card.style.cursor = 'pointer';
        card.onclick = () => flipMemoryCard(card, imgUrl, i);
        board.appendChild(card);
    });
}
function flipMemoryCard(card, emoji, idx) {
    if (memoryLock || memoryMatched.includes(idx) || card.querySelector('span').dataset.flipped === 'true') return;
    card.querySelector('span').innerHTML = `<img src="${emoji}" alt="imagem" style="width:40px;height:40px;">`;
    card.querySelector('span').dataset.flipped = 'true';
    memoryFlipped.push({card, emoji, idx});
    if (memoryFlipped.length === 2) {
        memoryLock = true;
        setTimeout(() => {
            if (memoryFlipped[0].emoji === memoryFlipped[1].emoji) {
                memoryMatched.push(memoryFlipped[0].idx, memoryFlipped[1].idx);
            } else {
                memoryFlipped[0].card.querySelector('span').innerHTML = '?';
                memoryFlipped[0].card.querySelector('span').dataset.flipped = 'false';
                memoryFlipped[1].card.querySelector('span').innerHTML = '?';
                memoryFlipped[1].card.querySelector('span').dataset.flipped = 'false';
            }
            memoryFlipped = [];
            memoryLock = false;
        }, 800);
    }
}

// Quiz
const quizQuestionsFund1 = [
    {q: 'Qual é a capital do Brasil?', a: ['Brasília','Rio de Janeiro','São Paulo','Salvador'], c: 0},
    {q: 'Quanto é 7 x 8?', a: ['54','56','64','58'], c: 1},
    {q: 'Qual animal é conhecido como o rei da selva?', a: ['Leão','Tigre','Elefante','Urso'], c: 0},
    {q: 'Qual é o maior planeta do sistema solar?', a: ['Terra','Júpiter','Saturno','Marte'], c: 1},
    {q: 'Qual é o menor país do mundo?', a: ['Vaticano','Mônaco','San Marino','Liechtenstein'], c: 0},
];
const quizQuestionsFund2 = [
    {q: 'Quem escreveu "Dom Quixote"?', a: ['Machado de Assis','Miguel de Cervantes','José de Alencar','Eça de Queirós'], c: 1},
    {q: 'Qual é o elemento químico representado por H?', a: ['Hélio','Hidrogênio','Mercúrio','Fósforo'], c: 1},
    {q: 'Em que continente fica o Egito?', a: ['África','Ásia','Europa','América'], c: 0},
    {q: 'Qual é o resultado de 9 + 10?', a: ['19','21','20','18'], c: 0},
    {q: 'Qual desses animais é um mamífero?', a: ['Tubarão','Golfinho','Crocodilo','Papagaio'], c: 1},
];
const quizQuestionsMedio = [
    {q: 'Qual é o principal gás responsável pelo efeito estufa?', a: ['Oxigênio','Dióxido de Carbono','Nitrogênio','Hidrogênio'], c: 1},
    {q: 'Qual é o símbolo químico do ouro?', a: ['Au','Ag','Fe','O'], c: 0},
    {q: 'Qual é o maior oceano do mundo?', a: ['Atlântico','Índico','Pacífico','Ártico'], c: 2},
    {q: 'Quem foi o primeiro presidente do Brasil?', a: ['Getúlio Vargas','Deodoro da Fonseca','Juscelino Kubitschek','Dom Pedro II'], c: 1},
    {q: 'Qual é o animal símbolo da Austrália?', a: ['Canguru','Leão','Urso','Elefante'], c: 0},
    {q: 'Qual é o plural de "cidadão"?', a: ['Cidadãos','Cidadões','Cidadães','Cidadãs'], c: 0},
    {q: 'Qual é o maior órgão do corpo humano?', a: ['Coração','Fígado','Pele','Pulmão'], c: 2},
];
let quizQuestions = quizQuestionsFund1;
let quizQuestionsShuffled = [];
let quizNivelSelecionado = 'fund1';
let quizIndex = 0, quizScore = 0;
function showQuiz() {
    quizIndex = 0; quizScore = 0;
    // Embaralha as perguntas e mantém a resposta correta
    quizQuestionsShuffled = quizQuestions.map(q => ({...q}));
    for (let i = quizQuestionsShuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizQuestionsShuffled[i], quizQuestionsShuffled[j]] = [quizQuestionsShuffled[j], quizQuestionsShuffled[i]];
    }
    renderQuiz();
    // Atualiza visual dos botões de nível
    document.querySelectorAll('#quiz-niveis button').forEach(btn => {
        btn.style.background = '#fff';
        btn.style.color = '#ff5858';
        btn.style.borderColor = '#ff5858';
    });
    const btnAtivo = document.querySelector(`#quiz-niveis button[onclick*="${quizNivelSelecionado}"]`);
    if (btnAtivo) {
        btnAtivo.style.background = 'linear-gradient(90deg,#ff5858,#f857a6)';
        btnAtivo.style.color = '#fff';
        btnAtivo.style.borderColor = '#f857a6';
    }
}

function selecionarNivelQuiz(nivel) {
    quizNivelSelecionado = nivel;
    if (nivel === 'fund1') quizQuestions = quizQuestionsFund1;
    else if (nivel === 'fund2') quizQuestions = quizQuestionsFund2;
    else if (nivel === 'medio') quizQuestions = quizQuestionsMedio;
    showQuiz();
}
function renderQuiz() {
    const q = quizQuestionsShuffled[quizIndex];
    const quizDiv = document.getElementById('quiz-content');
    quizDiv.innerHTML = `
        <div style="background:#fff;border-radius:14px;box-shadow:0 2px 8px rgba(255,88,88,0.08);padding:1.5rem 1rem 1rem 1rem;animation:fadeIn 0.5s;">
            <h3 style="color:#ff5858;font-size:1.3rem;text-align:center;margin-bottom:1.2rem;">${q.q}</h3>
            <div style="display:flex;flex-direction:column;gap:1rem;">
                ${q.a.map((alt, i) => `<button class='quiz-btn' onclick='answerQuiz(${i})' style="background:#fff0f0;color:#ff5858;border:2px solid #ffb3b3;padding:0.8rem 1rem;border-radius:10px;font-size:1.05rem;font-weight:bold;transition:all 0.2s;box-shadow:0 1px 4px rgba(255,88,88,0.05);cursor:pointer;outline:none;">${alt}</button>`).join('')}
            </div>
        </div>
        <style>
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px);} to { opacity:1; transform:translateY(0);} }
        .quiz-btn:hover { background:#ffb3b3; color:#fff; border-color:#ff5858; }
        </style>
    `;
}
function answerQuiz(i) {
    const q = quizQuestionsShuffled[quizIndex];
    const quizDiv = document.getElementById('quiz-content');
    const btns = quizDiv.querySelectorAll('.quiz-btn');
    btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.c) btn.style.background = '#b6ffb3';
        if (idx === i && i !== q.c) btn.style.background = '#ffd6d6';
        btn.style.color = '#333';
        btn.style.borderColor = '#ff5858';
    });
    if (i === q.c) quizScore++;
    setTimeout(() => {
        quizIndex++;
        if (quizIndex < quizQuestionsShuffled.length) {
            renderQuiz();
        } else {
            quizDiv.innerHTML = `<div style='background:#fffbe0;border-radius:14px;box-shadow:0 2px 8px rgba(255,179,71,0.08);padding:2rem 1rem;text-align:center;animation:fadeIn 0.5s;'><h3 style='color:#ffb347;font-size:1.5rem;'>Fim do Quiz!</h3><p style='font-size:1.2rem;color:#888;'>Você acertou <b style='color:#ff5858;'>${quizScore}</b> de <b>${quizQuestionsShuffled.length}</b>.</p></div>`;
        }
    }, 900);
}

// Jogo da Velha
let velhaBoard, velhaTurn, velhaOver;
function startVelha() {
    velhaBoard = Array(9).fill('');
    velhaTurn = 'X';
    velhaOver = false;
    renderVelha();
}

function renderVelha() {
    const velha = document.getElementById('velha-board');
    velha.innerHTML = '';
    velhaBoard.forEach((v, i) => {
        const cell = document.createElement('div');
        cell.className = 'velha-cell';
        cell.style.height = '80px';
        cell.style.width = '80px';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontSize = '2.5rem';
        cell.style.background = v ? (v === 'X' ? '#ff5858' : '#ffb347') : '#fff';
        cell.style.color = v ? '#fff' : '#ffb347';
        cell.style.borderRadius = '12px';
        cell.style.cursor = v || velhaOver ? 'default' : 'pointer';
        cell.style.boxShadow = v ? '0 2px 8px rgba(255,179,71,0.10)' : '0 1px 2px rgba(0,0,0,0.04)';
        cell.style.transition = 'background 0.2s, color 0.2s, box-shadow 0.2s';
        cell.innerHTML = v ? (v === 'X' ? '<span style="font-weight:bold;">X</span>' : '<span style="font-weight:bold;">O</span>') : '';
        cell.onclick = () => moveVelha(i);
        cell.onmouseover = () => { if (!v && !velhaOver) cell.style.background = '#fffbe0'; };
        cell.onmouseout = () => { if (!v && !velhaOver) cell.style.background = '#fff'; };
        velha.appendChild(cell);
    });
    document.getElementById('velha-status').innerHTML = velhaOver ? (getVelhaWinner() ? `<span style='color:${getVelhaWinner()==='X'?'#ff5858':'#ffb347'};'>Vencedor: ${getVelhaWinner()}</span>` : '<span style="color:#888;">Empate!</span>') : `Vez de: <span style='color:${velhaTurn==='X'?'#ff5858':'#ffb347'};'>${velhaTurn}</span>`;
}

function moveVelha(i) {
    if (velhaBoard[i] || velhaOver || velhaTurn !== 'X') return;
    velhaBoard[i] = 'X';
    if (getVelhaWinner() || velhaBoard.every(x => x)) {
        velhaOver = true;
        renderVelha();
        return;
    }
    velhaTurn = 'O';
    renderVelha();
    setTimeout(() => {
        if (!velhaOver) roboMove();
    }, 500);
}

function roboMove() {
    let dificuldade = 'facil';
    const select = document.getElementById('velha-dificuldade');
    if (select) dificuldade = select.value;
    let move;
    if (dificuldade === 'facil') {
        // 60% chance de jogar aleatório, 40% de bloquear/vencer
        if (Math.random() < 0.4) {
            move = velhaMediumMove();
            if (move === null) move = velhaRandomMove();
        } else {
            move = velhaRandomMove();
        }
    } else if (dificuldade === 'medio') {
        // 60% chance de bloquear/vencer, 40% de jogar como difícil
        if (Math.random() < 0.6) {
            move = velhaMediumMove();
            if (move === null) move = velhaRandomMove();
        } else {
            move = velhaBestMove();
        }
    } else {
        // Difícil: 70% melhor jogada, 30% medium
        if (Math.random() < 0.7) {
            move = velhaBestMove();
        } else {
            move = velhaMediumMove();
            if (move === null) move = velhaRandomMove();
        }
    }
    if (move !== null && !velhaOver) {
        velhaBoard[move] = 'O';
        if (getVelhaWinner() || velhaBoard.every(x => x)) velhaOver = true;
        velhaTurn = 'X';
        renderVelha();
    }
}

function velhaRandomMove() {
    const empty = velhaBoard.map((v,i) => v ? null : i).filter(v => v !== null);
    if (empty.length === 0) return null;
    return empty[Math.floor(Math.random() * empty.length)];
}

function velhaMediumMove() {
    // Bloqueia vitória do jogador ou vence se possível
    // 1. Tenta vencer
    for (let i = 0; i < 9; i++) {
        if (!velhaBoard[i]) {
            velhaBoard[i] = 'O';
            if (getVelhaWinner() === 'O') { velhaBoard[i] = ''; return i; }
            velhaBoard[i] = '';
        }
    }
    // 2. Bloqueia jogador
    for (let i = 0; i < 9; i++) {
        if (!velhaBoard[i]) {
            velhaBoard[i] = 'X';
            if (getVelhaWinner() === 'X') { velhaBoard[i] = ''; return i; }
            velhaBoard[i] = '';
        }
    }
    return null;
}

function velhaBestMove() {
    // Minimax para o robô (O)
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
        if (!velhaBoard[i]) {
            velhaBoard[i] = 'O';
            let score = minimax(velhaBoard, 0, false);
            velhaBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMax) {
    let winner = getVelhaWinner();
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(x => x)) return 0;
    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth+1, false));
                board[i] = '';
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth+1, true));
                board[i] = '';
            }
        }
        return best;
    }
}
function getVelhaWinner() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (let w of wins) {
        if (velhaBoard[w[0]] && velhaBoard[w[0]] === velhaBoard[w[1]] && velhaBoard[w[1]] === velhaBoard[w[2]])
            return velhaBoard[w[0]];
    }
    return null;
}

// Inicialização
window.onload = function() {
    showGame('memory');
    shuffleMemory();
    showQuiz();
    startVelha();
    iniciarForca();
    iniciarNumero();
};

// Jogo da Forca
const forcaPalavras = [
    'BANANA','CACHORRO','ESCOLA','COMPUTADOR','BRASIL','FUTEBOL','GATO','LIVRO','AMARELO','FLORESTA','PRAIA','SORVETE','CADERNO','JANELA','BICICLETA','CENOURA','PIRULITO','SAPATO','TIGRE','VIOLAO'
];
let forcaPalavra = '', forcaAcertos = [], forcaErros = [], forcaMaxErros = 6;
function iniciarForca() {
    forcaPalavra = forcaPalavras[Math.floor(Math.random()*forcaPalavras.length)];
    forcaAcertos = [];
    forcaErros = [];
    renderForca();
}
function renderForca() {
    const palavra = forcaPalavra.split('').map(l => forcaAcertos.includes(l) ? l : '_').join(' ');
    document.getElementById('forca-palavra').textContent = palavra;
    // Letras do alfabeto
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const letrasDiv = document.getElementById('forca-letras');
    letrasDiv.innerHTML = '';
    letras.forEach(l => {
        const btn = document.createElement('button');
        btn.textContent = l;
        btn.disabled = forcaAcertos.includes(l) || forcaErros.includes(l) || forcaAcertos.length + forcaErros.length >= forcaPalavra.length + forcaMaxErros;
        btn.style.background = forcaAcertos.includes(l) ? '#b6ffb3' : forcaErros.includes(l) ? '#ffd6d6' : '#fff';
        btn.style.color = '#e17055';
        btn.style.border = '1.5px solid #e17055';
        btn.style.borderRadius = '8px';
        btn.style.padding = '0.5rem 0.8rem';
        btn.style.margin = '0.1rem';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
        btn.onclick = () => jogarForca(l);
        letrasDiv.appendChild(btn);
    });
    let status = '';
    if (forcaAcertos.length === new Set(forcaPalavra.split('')).size) {
        status = '<b style="color:#27ae60;">Parabéns! Você acertou!</b>';
    } else if (forcaErros.length >= forcaMaxErros) {
        status = `<b style='color:#ff5858;'>Você perdeu! Palavra: ${forcaPalavra}</b>`;
    } else {
        status = `Erros: <b>${forcaErros.length}</b> de <b>${forcaMaxErros}</b>`;
    }
    document.getElementById('forca-status').innerHTML = status;

    // Desenhar tabuleiro e boneco com detalhes
    const tabuleiro = document.getElementById('forca-tabuleiro');
    tabuleiro.innerHTML = `
    <svg width="120" height="160" viewBox="0 0 120 160">
        <!-- Fundo azul claro -->
        <rect x="0" y="0" width="120" height="160" fill="#e3f6fd"/>
        <!-- Grama -->
        <ellipse cx="60" cy="155" rx="55" ry="12" fill="#b6eab7"/>
        <!-- Nuvem -->
        <ellipse cx="30" cy="30" rx="15" ry="7" fill="#fff" opacity="0.7"/>
        <ellipse cx="45" cy="32" rx="10" ry="5" fill="#fff" opacity="0.6"/>
        <!-- Base -->
        <rect x="10" y="145" width="100" height="10" rx="4" fill="#e17055"/>
        <!-- Poste -->
        <rect x="36" y="20" width="8" height="125" rx="4" fill="#e17055"/>
        <!-- Topo -->
        <rect x="36" y="16" width="56" height="8" rx="4" fill="#e17055"/>
        <!-- Corda -->
        <rect x="88" y="20" width="4" height="22" rx="2" fill="#e17055"/>
        <!-- Grades -->
        <rect x="20" y="155" width="4" height="-15" fill="#e17055" opacity="0.3"/>
        <rect x="35" y="155" width="4" height="-10" fill="#e17055" opacity="0.3"/>
        <rect x="50" y="155" width="4" height="-12" fill="#e17055" opacity="0.3"/>
        <rect x="65" y="155" width="4" height="-8" fill="#e17055" opacity="0.3"/>
        <rect x="80" y="155" width="4" height="-14" fill="#e17055" opacity="0.3"/>
        <rect x="95" y="155" width="4" height="-11" fill="#e17055" opacity="0.3"/>
        <!-- Cabeça -->
        ${(forcaErros.length>0)?'<circle cx="90" cy="52" r="12" stroke="#e17055" stroke-width="4" fill="#fff"/>':''}
        <!-- Corpo -->
        ${(forcaErros.length>1)?'<line x1="90" y1="64" x2="90" y2="100" stroke="#e17055" stroke-width="4"/>':''}
        <!-- Braço esquerdo -->
        ${(forcaErros.length>2)?'<line x1="90" y1="75" x2="75" y2="90" stroke="#e17055" stroke-width="4"/>':''}
        <!-- Braço direito -->
        ${(forcaErros.length>3)?'<line x1="90" y1="75" x2="105" y2="90" stroke="#e17055" stroke-width="4"/>':''}
        <!-- Perna esquerda -->
        ${(forcaErros.length>4)?'<line x1="90" y1="100" x2="78" y2="125" stroke="#e17055" stroke-width="4"/>':''}
        <!-- Perna direita -->
        ${(forcaErros.length>5)?'<line x1="90" y1="100" x2="102" y2="125" stroke="#e17055" stroke-width="4"/>':''}
    </svg>
    `;
}
function jogarForca(letra) {
    if (forcaPalavra.includes(letra)) {
        forcaAcertos.push(letra);
    } else {
        forcaErros.push(letra);
    }
    renderForca();
}

// Jogo do Número Secreto
let numeroSecreto = 0, tentativasNumero = 0;
function iniciarNumero() {
    numeroSecreto = Math.floor(Math.random()*100)+1;
    tentativasNumero = 0;
    const status = document.getElementById('numero-status');
    status.textContent = '';
    status.className = '';
    document.getElementById('numero-input').value = '';
}
function tentarNumero() {
    const val = parseInt(document.getElementById('numero-input').value);
    const status = document.getElementById('numero-status');
    if (isNaN(val) || val < 1 || val > 100) {
        status.textContent = 'Digite um número entre 1 e 100!';
        status.className = 'erro';
        return;
    }
    tentativasNumero++;
    if (val === numeroSecreto) {
        status.innerHTML = `✅ <b>Parabéns! Você acertou em ${tentativasNumero} tentativas!</b>`;
        status.className = 'acerto';
    } else if (val < numeroSecreto) {
        status.innerHTML = '🔼 O número secreto é <b>maior</b>!';
        status.className = 'erro';
    } else {
        status.innerHTML = '🔽 O número secreto é <b>menor</b>!';
        status.className = 'erro';
    }
}

// Jogo do Dado
function rolarDado() {
    const dado = Math.floor(Math.random() * 6) + 1;
    const imagens = [
        'https://upload.wikimedia.org/wikipedia/commons/1/1b/Dice-1-b.svg',
        'https://upload.wikimedia.org/wikipedia/commons/5/5f/Dice-2-b.svg',
        'https://upload.wikimedia.org/wikipedia/commons/b/b1/Dice-3-b.svg',
        'https://upload.wikimedia.org/wikipedia/commons/f/fd/Dice-4-b.svg',
        'https://upload.wikimedia.org/wikipedia/commons/0/08/Dice-5-b.svg',
        'https://upload.wikimedia.org/wikipedia/commons/2/26/Dice-6-b.svg'
    ];
    const img = document.getElementById('dado-img');
    if (img) {
        img.style.transform = 'rotate(0deg) scale(1)';
        setTimeout(() => {
            img.src = imagens[dado-1];
            img.alt = 'Dado ' + dado;
            img.style.transform = 'rotate(' + (Math.random()*360) + 'deg) scale(1.1)';
        }, 100);
    }
}

// Jogo do Click Rápido
let clickCount = 0;
let clickTempo = 15;
let clickInterval = null;
let clickAtivo = false;
function clickRapido() {
    if (!clickAtivo) {
        clickAtivo = true;
        clickCount = 0;
        clickTempo = 15;
        document.getElementById('click-contador').textContent = clickCount;
        document.getElementById('click-tempo').textContent = 'Tempo: 15s';
        document.getElementById('click-btn').disabled = false;
        clickInterval = setInterval(() => {
            clickTempo--;
            document.getElementById('click-tempo').textContent = 'Tempo: ' + clickTempo + 's';
            if (clickTempo <= 0) {
                clearInterval(clickInterval);
                document.getElementById('click-btn').disabled = true;
                document.getElementById('click-tempo').innerHTML = '<span style="color:#ff5858;font-weight:bold;">Tempo esgotado!</span>';
                document.getElementById('click-contador').style.color = '#ff5858';
                clickAtivo = false;
            }
        }, 1000);
    }
    if (clickTempo > 0) {
        clickCount++;
        document.getElementById('click-contador').textContent = clickCount;
        document.getElementById('click-contador').style.color = '#00b894';
    }
}
function resetClickRapido() {
    clearInterval(clickInterval);
    clickCount = 0;
    clickTempo = 15;
    clickAtivo = false;
    document.getElementById('click-contador').textContent = clickCount;
    document.getElementById('click-contador').style.color = '#00b894';
    document.getElementById('click-tempo').textContent = 'Tempo: 15s';
    document.getElementById('click-btn').disabled = false;
}

// Caça-Palavras
const cacaPalavrasNiveis = {
    facil: {
        tamanho: 6,
        temas: {
            animais: ['GATO', 'RATO', 'PATO', 'SAPO', 'URSO', 'LOBO', 'ONCA', 'COBRA', 'PEIXE', 'COELHO', 'PORCO', 'PANDA', 'TOURO', 'VEADO', 'CISNE'],
            frutas: ['MACA', 'UVA', 'PERA', 'KIWI', 'MANGA', 'FIGO', 'CAJU', 'MELAO', 'JAMBO', 'NECTARINA', 'ACAI', 'LICHIA', 'DAMASCO', 'CEREJA', 'AMORA'],
            cores: ['AZUL', 'ROSA', 'ROXO', 'VERDE', 'CINZA', 'RUBRO', 'CORAL', 'CREME', 'BRONZE', 'INDIGO', 'PRATA', 'OURO', 'JADE', 'AMBAR', 'PEROLA'],
            paises: ['BRASIL', 'CHILE', 'PERU', 'CUBA', 'EGITO', 'CHINA', 'RUSSIA', 'ITALIA', 'GRECIA', 'TURQUIA', 'IRAQUE', 'SIRIA', 'QATAR', 'NEPAL', 'GANA'],
            esportes: ['JUDO', 'BOXE', 'TENIS', 'GOLF', 'SURF', 'LUTA', 'REMO', 'YOGA', 'RUGBY', 'BEISEBOL', 'RALLY', 'PESCA', 'CACA', 'ARCO', 'DARDO'],
            profissoes: ['JUIZ', 'CHEFE', 'ATOR', 'PINTOR', 'PADEIRO', 'CHEF', 'GUIA', 'MODELO', 'PILOTO', 'DETETIVE', 'BIOLOGO', 'FISICO', 'GESTOR', 'AUDITOR', 'ZELADOR'],
            veiculos: ['CARRO', 'MOTO', 'NAVIO', 'AVIAO', 'TREM', 'BARCA', 'JIPE', 'KOMBI', 'LANCHA', 'IATE', 'BALAO', 'TROLE', 'BUGGY', 'KART', 'VAN'],
            comidas: ['BOLO', 'SOPA', 'PIZZA', 'ARROZ', 'FEIJAO', 'PÃO', 'OVO', 'MILHO', 'QUEIJO', 'CARNE', 'PEIXE', 'MACARRAO', 'SALADA', 'TACO', 'NHOQUE'],
            objetos: ['MESA', 'CADEIRA', 'LIVRO', 'CANETA', 'RELOGIO', 'COPO', 'PRATO', 'LAPIS', 'BOLSA', 'CHAVE', 'PORTA', 'JANELA', 'ESPELHO', 'CAIXA', 'VELA'],
            natureza: ['FOLHA', 'FLOR', 'RIO', 'PEDRA', 'ARVORE', 'LAGO', 'NUVEM', 'CHUVA', 'PRAIA', 'AREIA', 'ONDA', 'GELO', 'NEVE', 'VENTO', 'TERRA'],
            corpo: ['BRACO', 'PERNA', 'OLHO', 'NARIZ', 'BOCA', 'MAO', 'PE', 'DEDO', 'UNHA', 'CABELO', 'PELE', 'OSSO', 'NERVO', 'VEIA', 'DENTE'],
            escola: ['LOUSA', 'GIZ', 'PROVA', 'ALUNO', 'AULA', 'NOTA', 'TURMA', 'MAPA', 'REGUA', 'COLA', 'TINTA', 'SERIE', 'HORARIO', 'LANCHE', 'FILA'],
            musica: ['NOTA', 'RITMO', 'BANDA', 'CORO', 'OPERA', 'CLAVE', 'PAUSA', 'FUGA', 'GRAVE', 'AGUDO', 'DUETO', 'CORAL', 'SOLO', 'VERSO', 'REFRÃO'],
            tecnologia: ['MOUSE', 'TELA', 'TECLA', 'CHIP', 'WIFI', 'CABO', 'USB', 'APP', 'EMAIL', 'SITE', 'BYTE', 'PIXEL', 'LOGIN', 'SENHA', 'VIRUS'],
            roupas: ['BLUSA', 'CALCA', 'SAIA', 'BOTA', 'LUVA', 'BONÉ', 'MEIA', 'SHORT', 'CINTO', 'LENCO', 'XALE', 'COLETE', 'AVENTAL', 'TANGA', 'BLAZER']
        }
    },
    medio: {
        tamanho: 8,
        temas: {
            animais: ['ELEFANTE', 'TIGRE', 'LEAO', 'ZEBRA', 'MACACO', 'CAVALO', 'GIRAFA', 'RAPOSA', 'CORUJA', 'AGUIA', 'JACARE', 'FOCA', 'TUBARAO', 'GOLFINHO', 'BALEIA'],
            frutas: ['MELANCIA', 'ABACAXI', 'MORANGO', 'LARANJA', 'LIMAO', 'BANANA', 'CAQUI', 'MAMAO', 'ABACATE', 'GOIABA', 'PESSEGO', 'AMEIXA', 'ROMÃ', 'MIRTILO', 'TAMARINDO'],
            cores: ['AMARELO', 'LARANJA', 'VIOLETA', 'MARROM', 'BRANCO', 'PRETO', 'VERDECLARO', 'AZULMARINHO', 'VERMELHO', 'ROSAESCURO', 'LILAS', 'BEGE', 'CHOCOLATE', 'VINHO', 'MOSTARDA'],
            paises: ['JAPAO', 'INDIA', 'FRANCA', 'ALEMANHA', 'MEXICO', 'CANADA', 'ESPANHA', 'SUICA', 'COLOMBIA', 'VENEZUELA', 'URUGUAI', 'PARAGUAI', 'EQUADOR', 'BOLIVIA', 'PANAMÁ'],
            esportes: ['FUTEBOL', 'BASQUETE', 'VOLEI', 'NATACAO', 'CICLISMO', 'ATLETISMO', 'CORRIDA', 'HIPISMO', 'ESGRIMA', 'TIRO', 'SALTO', 'ARREMESSO', 'MARCHA', 'TRIATLO', 'DECA'],
            profissoes: ['MEDICO', 'PROFESSOR', 'ENFERMEIRO', 'POLICIAL', 'BOMBEIRO', 'DENTISTA', 'GERENTE', 'SECRETARIO', 'MECANICO', 'ELETRICISTA', 'PEDREIRO', 'MOTORISTA', 'GARCOM', 'FAXINEIRO', 'VENDEDOR'],
            veiculos: ['CAMINHAO', 'ONIBUS', 'HELICOPTERO', 'BICICLETA', 'SKATE', 'BARCO', 'PATINS', 'JETSKI', 'CARROCA', 'TRICICLO', 'JEGUE', 'BONDINHO', 'FUNICULAR', 'ESCUNA', 'VELEIRO'],
            comidas: ['MACARRAO', 'HAMBURGUER', 'SALADA', 'LASANHA', 'FEIJOADA', 'CHURRASCO', 'MOQUECA', 'PICANHA', 'CAMARAO', 'SUSHI', 'YAKISOBA', 'CREPE', 'PANQUECA', 'RISOTO', 'POLENTA'],
            objetos: ['TELEFONE', 'COMPUTADOR', 'TELEVISAO', 'GELADEIRA', 'FOGAO', 'CADERNO', 'MOCHILA', 'TESOURA', 'GRAMPEADOR', 'LÂMPADA', 'VENTILADOR', 'SOFA', 'CORTINA', 'TAPETE', 'TRAVESSEIRO'],
            natureza: ['MONTANHA', 'CACHOEIRA', 'OCEANO', 'DESERTO', 'FLORESTA', 'VULCAO', 'GELEIRA', 'CAVERNA', 'CANYON', 'ILHA', 'RECIFE', 'LAGOA', 'PENHASCO', 'CORDILHEIRA', 'PLANALTO'],
            corpo: ['CABECA', 'OMBRO', 'JOELHO', 'COTOVELO', 'ESTOMAGO', 'CORACAO', 'PULMAO', 'FIGADO', 'RINS', 'BEXIGA', 'CEREBRO', 'LARINGE', 'FARINGE', 'ESOFAGO', 'INTESTINO'],
            escola: ['PROFESSOR', 'DIRETORA', 'BIBLIOTECA', 'RECREIO', 'CANTINA', 'QUADRO', 'CARTEIRA', 'CORREDOR', 'PATIO', 'LABORATORIO', 'AUDITORIO', 'SECRETARIA', 'INSPETORA', 'MERENDEIRA', 'ZELADOR'],
            musica: ['VIOLAO', 'GUITARRA', 'BATERIA', 'TECLADO', 'FLAUTA', 'SAXOFONE', 'TROMPETE', 'TROMBONE', 'CLARINETE', 'PIANO', 'HARPA', 'GAITA', 'PANDEIRO', 'TAMBOR', 'TRIANGULO'],
            tecnologia: ['INTERNET', 'PROGRAMA', 'ARQUIVO', 'SISTEMA', 'SOFTWARE', 'HARDWARE', 'SERVIDOR', 'REDE', 'BACKUP', 'FIREWALL', 'BROWSER', 'DOWNLOAD', 'UPLOAD', 'STREAMING', 'BLUETOOTH'],
            roupas: ['VESTIDO', 'JAQUETA', 'CASACO', 'SAPATO', 'TENIS', 'BERMUDA', 'MOLETOM', 'SANDALIA', 'CHINELO', 'CHAPEU', 'VISEIRA', 'LEGGING', 'MACACAO', 'PONCHO', 'KIMONO']
        }
    },
    dificil: {
        tamanho: 10,
        temas: {
            animais: ['BORBOLETA', 'CROCODILO', 'RINOCERONTE', 'CAMELO', 'PAPAGAIO', 'TARTARUGA', 'LEOPARDO', 'GUEPARDO', 'MORCEGO', 'ESQUILO', 'TAMANDUÁ', 'PREGUICA', 'CAPIVARA', 'ARARA', 'TUCANO'],
            frutas: ['TANGERINA', 'MELAO', 'FRAMBOESA', 'JABUTICABA', 'PITANGA', 'CARAMBOLA', 'PHYSALIS', 'TAMARILLO', 'LICHIA', 'MANGABA', 'CUPUACU', 'BACURI', 'ARAÇA', 'SAPOTI', 'PEQUI'],
            cores: ['TURQUESA', 'MAGENTA', 'DOURADO', 'PRATEADO', 'CARMESIM', 'BORDÔ', 'SALMAO', 'LAVANDA', 'PISTACHE', 'MENTA', 'COBALTO', 'FERRUGEM', 'CEREJA', 'PÊSSEGO', 'ALABASTRO'],
            paises: ['AUSTRALIA', 'TAILANDIA', 'ARGENTINA', 'PORTUGAL', 'SUECIA', 'MARROCOS', 'VIETNA', 'FILIPINAS', 'MALASIA', 'SINGAPURA', 'INDONESIA', 'CAMBODJA', 'MONGOLIA', 'PAQUISTAO', 'MYANMAR'],
            esportes: ['HANDEBOL', 'PATINACAO', 'GINASTICA', 'CAPOEIRA', 'KARATE', 'TAEKWONDO', 'WRESTLING', 'BOBSLED', 'SKELETON', 'CURLING', 'PENTATLO', 'HEPTATLO', 'DECATLO', 'BIATLO', 'SKELETON'],
            profissoes: ['ENGENHEIRO', 'ARQUITETO', 'JORNALISTA', 'VETERINARIO', 'ASTRONAUTA', 'GEOLOGO', 'METEOROLOGISTA', 'OCEANOGRAFO', 'CARTOGRAFO', 'HISTORIADOR', 'SOCIOLOGO', 'ANTROPOLOGO', 'FARMACEUTICO', 'BIOMEDICO', 'AGRONOMO'],
            veiculos: ['SUBMARINO', 'FOGUETE', 'LOCOMOTIVA', 'AMBULANCIA', 'TRATOR', 'ESCAVADEIRA', 'RETROESCAVADEIRA', 'BULLDOZER', 'GUINDASTRE', 'EMPILHADEIRA', 'CAMINHONETE', 'QUADRICICLO', 'SNOWMOBILE', 'PLANADOR', 'ULTRALEVE'],
            comidas: ['ESPAGUETE', 'BRIGADEIRO', 'PANQUECA', 'TAPIOCA', 'COXINHA', 'EMPANADA', 'PAELLA', 'CASSOULET', 'BOUILLABAISSE', 'RATATOUILLE', 'COUSCOUS', 'HUMMUS', 'FALAFEL', 'KEBAB', 'BAKLAVA'],
            objetos: ['MICROFONE', 'ASPIRADOR', 'VENTILADOR', 'BATEDEIRA', 'LIQUIDIFICADOR', 'TORRADEIRA', 'CHALEIRA', 'CAFETEIRA', 'PANELA', 'FRIGIDEIRA', 'ESPREMEDOR', 'DESCASCADOR', 'RALADOR', 'ESCORREDOR', 'PENEIRA'],
            natureza: ['TEMPESTADE', 'TERREMOTO', 'TSUNAMI', 'FURACAO', 'RELAMPAGO', 'TORNADO', 'AVALANCHE', 'DESLIZAMENTO', 'INUNDACAO', 'ENCHENTE', 'ESTIAGEM', 'ECLIPSE', 'AURORA', 'NEBLINA', 'GEADA'],
            corpo: ['PULSO', 'TORNOZELO', 'QUADRIL', 'COSTELA', 'VERTEBRA', 'CLAVICULA', 'FEMUR', 'TIBIA', 'RADIO', 'ULNA', 'PATELA', 'ESCÁPULA', 'ESTERNO', 'MANDIBULA', 'MAXILAR'],
            escola: ['GEOGRAFIA', 'HISTORIA', 'MATEMATICA', 'CIENCIAS', 'EDUCACAO', 'PORTUGUES', 'LITERATURA', 'FILOSOFIA', 'SOCIOLOGIA', 'QUIMICA', 'FISICA', 'BIOLOGIA', 'ARTES', 'REDACAO', 'INGLES'],
            musica: ['MELODIA', 'HARMONIA', 'SINFONIA', 'PARTITURA', 'ORQUESTRA', 'SONATA', 'CONCERTO', 'PRELUDIO', 'FANTASIA', 'NOCTURNO', 'SERENATA', 'CANTATA', 'ARABESCO', 'RAPSÓDIA', 'BALADA'],
            tecnologia: ['ALGORITMO', 'NAVEGADOR', 'APLICATIVO', 'PROGRAMACAO', 'PROCESSADOR', 'MEMORIA', 'ARMAZENAMENTO', 'COMPILADOR', 'DEBUGGER', 'FRAMEWORK', 'BIBLIOTECA', 'INTERFACE', 'DATABASE', 'KERNEL', 'TERMINAL'],
            roupas: ['CAMISETA', 'PIJAMA', 'GRAVATA', 'UNIFORME', 'AGASALHO', 'SUETER', 'CARDIGÃ', 'PARKA', 'ANORAK', 'TRENCHCOAT', 'BLAZER', 'PALETÓ', 'SMOKING', 'FRAQUE', 'QUIMONO']
        }
    },
    extremo: {
        tamanho: 12,
        temas: {
            animais: ['HIPOPOTAMO', 'ORNITORRINCO', 'DINOSSAURO', 'PINGUIM', 'FLAMINGO', 'FORMIGA', 'CHIMPANZE', 'ORANGOTANGO', 'CANGURU', 'DROMEDARIO', 'SALAMANDRA', 'CAMALEON', 'IGUANA', 'AVESTRUZ', 'CASUAR'],
            frutas: ['MARACUJA', 'CAQUI', 'CARAMBOLA', 'GOIABA', 'ACEROLA', 'GRAVIOLA', 'JACA', 'SERIGUELA', 'UMBU', 'CAJÁ', 'MURICI', 'BURITI', 'ARATICUM', 'MANGOSTAO', 'RAMBUTAN'],
            cores: ['ESMERALDA', 'SAFIRA', 'AMETISTA', 'CIANO', 'BEGE', 'OCRE', 'ULTRAMAR', 'CARMIM', 'CELADON', 'CHARTREUSE', 'FUCHSIA', 'SEPIA', 'SIENA', 'VERDIGRIS', 'BISTRE'],
            paises: ['FINLANDIA', 'NORUEGA', 'DINAMARCA', 'BELGICA', 'HOLANDA', 'AUSTRIA', 'ESLOVAQUIA', 'ESLOVENIA', 'CROACIA', 'SÉRVIA', 'BULGÁRIA', 'ROMÊNIA', 'HUNGRIA', 'POLÔNIA', 'LITUANIA'],
            esportes: ['LEVANTAMENTO', 'MERGULHO', 'ESCALADA', 'MARATONA', 'ESGRIMA', 'TRIATLO', 'PARAQUEDISMO', 'BUNGEE', 'RAFTING', 'CANYONING', 'ALPINISMO', 'SLACKLINE', 'PARKOUR', 'KITESURF', 'WAKEBOARD'],
            profissoes: ['BIBLIOTECARIO', 'PSICOLOGO', 'NUTRICIONISTA', 'FISIOTERAPEUTA', 'ADVOGADO', 'PROGRAMADOR', 'DESIGNER', 'CONTADOR', 'ECONOMISTA', 'ADMINISTRADOR', 'FONOAUDIOLOGO', 'TERAPEUTA', 'PEDAGOGO', 'ELETRICISTA', 'MARCENEIRO'],
            veiculos: ['MOTOCICLETA', 'TELEFORICO', 'MONOTRILHO', 'HIDROAVIAO', 'AERONAVE', 'TRANVIA', 'METROVIARIO', 'TELEFÉRICO', 'TELETRANSPORTE', 'HOVERCRAFTS', 'ANFIBIO', 'CARRUAGEM', 'CHARRETE', 'DILIGENCIA', 'BERLINDA'],
            comidas: ['STROGONOFF', 'CARRETEIRO', 'RABADA', 'VATAPA', 'QUINDIM', 'ACARAJE', 'BOBÓ', 'MOQUECA', 'BAIÃO', 'FAROFA', 'ESCONDIDINHO', 'EMPADAO', 'TORRESMO', 'TUTU', 'VACA'],
            objetos: ['MICROSCÓPIO', 'TELESCOPIO', 'TERMOMETRO', 'CALCULADORA', 'CRONOMETRO', 'ESTETOSCOPIO', 'OTOSCÓPIO', 'OFTALMOSCOPIO', 'BAROMETRO', 'HIGROMETRO', 'MANOMETRO', 'ANEMOMETRO', 'PLUVIOMETRO', 'LUXIMETRO', 'VOLTIMETRO'],
            natureza: ['BIODIVERSIDADE', 'ECOSSISTEMA', 'FOTOSSINTESE', 'ATMOSFERA', 'GEOLOGIA', 'VEGETACAO', 'SEDIMENTACAO', 'EROSAO', 'INTEMPERISMO', 'ESTRATIFICACAO', 'MINERALIZACAO', 'CRISTALIZACAO', 'FOSSILIZACAO', 'DECOMPOSICAO', 'EVAPORACAO'],
            corpo: ['PANTURRILHA', 'ANTEBRACO', 'CLAVICULA', 'DIAFRAGMA', 'CEREBRO', 'PANCREAS', 'TIROIDE', 'HIPOFISE', 'TIREOIDE', 'SUPRARRENAL', 'DUODENO', 'APENDICE', 'MENINGES', 'MEDULA', 'HIPOCAMPO'],
            escola: ['ALFABETIZACAO', 'CONHECIMENTO', 'APRENDIZADO', 'DISCIPLINA', 'VESTIBULAR', 'FORMATURA', 'CERTIFICADO', 'DIPLOMA', 'CONSELHO', 'COORDENACAO', 'PEDAGOGIA', 'DIDATICA', 'METODOLOGIA', 'AVALIACAO', 'CURRICULAR'],
            musica: ['COMPOSITOR', 'INSTRUMENTISTA', 'PENTAGRAMA', 'MAESTRO', 'ACORDE', 'TONALIDADE', 'MODULACAO', 'TRANSPOSICAO', 'IMPROVISACAO', 'ARRANJO', 'CONTRAPONTO', 'POLIFONIA', 'MONODIA', 'HOMOFONIA', 'DISSONANCIA'],
            tecnologia: ['INTELIGENCIA', 'CRIPTOGRAFIA', 'CYBERSEGURANCA', 'ENGENHARIA', 'VIRTUALIDADE', 'AUTOMACAO', 'ROBOTICA', 'APRENDIZADO', 'COMPUTACAO', 'BLOCKCHAIN', 'NUVEM', 'ANALÍTICA', 'ALGORITMO', 'CODIFICACAO', 'DEBUGAR'],
            roupas: ['SOBRETUDO', 'CARDIGÃ', 'ECHARPE', 'CACHECOL', 'SUSPENSORIO', 'PULSEIRA', 'BRACELETE', 'TORNOZELEIRA', 'TIARA', 'BANDANA', 'TURBANTE', 'CAFTÃ', 'DASHIKI', 'SARI', 'PAREO']
        }
    }
};

let cacaGrid = [];
let cacaNivelAtual = 'facil';
let cacaTemaAtual = 'animais';
let cacaPalavrasEncontradas = [];
let cacaPalavrasAtuais = []; // Armazena as palavras do jogo atual

function selecionarNivelCaca() {
    const select = document.getElementById('caca-nivel');
    cacaNivelAtual = select.value;
    iniciarCaca();
}

function selecionarTemaCaca() {
    const select = document.getElementById('caca-tema');
    cacaTemaAtual = select.value;
    iniciarCaca();
}

function iniciarCaca() {
    const config = cacaPalavrasNiveis[cacaNivelAtual];
    const tamanho = config.tamanho;
    const todasPalavras = config.temas[cacaTemaAtual];
    
    // Determina quantas palavras usar baseado no nível
    let numPalavras;
    if (cacaNivelAtual === 'facil') numPalavras = 5;
    else if (cacaNivelAtual === 'medio') numPalavras = 6;
    else if (cacaNivelAtual === 'dificil') numPalavras = 5;
    else numPalavras = 6; // extremo
    
    // Embaralha e seleciona palavras aleatórias
    const palavrasEmbaralhadas = [...todasPalavras].sort(() => Math.random() - 0.5);
    const palavras = palavrasEmbaralhadas.slice(0, numPalavras);
    
    cacaPalavrasEncontradas = [];
    cacaPalavrasAtuais = palavras; // Salva as palavras do jogo atual
    cacaGrid = [];
    
    // Criar grid vazio
    for (let i = 0; i < tamanho; i++) {
        cacaGrid[i] = [];
        for (let j = 0; j < tamanho; j++) {
            cacaGrid[i][j] = '';
        }
    }
    
    // Inserir palavras no grid
    palavras.forEach(palavra => {
        let colocada = false;
        let tentativas = 0;
        while (!colocada && tentativas < 100) {
            const direcao = Math.floor(Math.random() * 4); // 0=horizontal, 1=vertical, 2=diagonal ↘, 3=diagonal ↙
            const linha = Math.floor(Math.random() * tamanho);
            const coluna = Math.floor(Math.random() * tamanho);
            
            if (podeColocarPalavra(palavra, linha, coluna, direcao, tamanho)) {
                colocarPalavra(palavra, linha, coluna, direcao);
                colocada = true;
            }
            tentativas++;
        }
    });
    
    // Preencher células vazias com letras aleatórias
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < tamanho; i++) {
        for (let j = 0; j < tamanho; j++) {
            if (cacaGrid[i][j] === '') {
                cacaGrid[i][j] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }
    
    renderizarCaca();
    atualizarStatusCaca();
}

function podeColocarPalavra(palavra, linha, coluna, direcao, tamanho) {
    const len = palavra.length;
    
    if (direcao === 0) { // Horizontal
        if (coluna + len > tamanho) return false;
        for (let i = 0; i < len; i++) {
            if (cacaGrid[linha][coluna + i] !== '' && cacaGrid[linha][coluna + i] !== palavra[i]) {
                return false;
            }
        }
    } else if (direcao === 1) { // Vertical
        if (linha + len > tamanho) return false;
        for (let i = 0; i < len; i++) {
            if (cacaGrid[linha + i][coluna] !== '' && cacaGrid[linha + i][coluna] !== palavra[i]) {
                return false;
            }
        }
    } else if (direcao === 2) { // Diagonal ↘
        if (linha + len > tamanho || coluna + len > tamanho) return false;
        for (let i = 0; i < len; i++) {
            if (cacaGrid[linha + i][coluna + i] !== '' && cacaGrid[linha + i][coluna + i] !== palavra[i]) {
                return false;
            }
        }
    } else if (direcao === 3) { // Diagonal ↙
        if (linha + len > tamanho || coluna - len < -1) return false;
        for (let i = 0; i < len; i++) {
            if (cacaGrid[linha + i][coluna - i] !== '' && cacaGrid[linha + i][coluna - i] !== palavra[i]) {
                return false;
            }
        }
    }
    
    return true;
}

function colocarPalavra(palavra, linha, coluna, direcao) {
    const len = palavra.length;
    
    if (direcao === 0) { // Horizontal
        for (let i = 0; i < len; i++) {
            cacaGrid[linha][coluna + i] = palavra[i];
        }
    } else if (direcao === 1) { // Vertical
        for (let i = 0; i < len; i++) {
            cacaGrid[linha + i][coluna] = palavra[i];
        }
    } else if (direcao === 2) { // Diagonal ↘
        for (let i = 0; i < len; i++) {
            cacaGrid[linha + i][coluna + i] = palavra[i];
        }
    } else if (direcao === 3) { // Diagonal ↙
        for (let i = 0; i < len; i++) {
            cacaGrid[linha + i][coluna - i] = palavra[i];
        }
    }
}

function renderizarCaca() {
    const gridElement = document.getElementById('caca-grid');
    const tamanho = cacaGrid.length;
    
    // Define o tamanho das células baseado no nível
    let cellSize = '40px';
    if (tamanho > 8) cellSize = '35px';
    if (tamanho > 10) cellSize = '30px';
    
    gridElement.style.gridTemplateColumns = `repeat(${tamanho}, ${cellSize})`;
    gridElement.innerHTML = '';
    
    for (let i = 0; i < tamanho; i++) {
        for (let j = 0; j < tamanho; j++) {
            const cell = document.createElement('div');
            cell.textContent = cacaGrid[i][j];
            cell.style.cssText = `
                width: ${cellSize};
                height: ${cellSize};
                background: #fff;
                border: 2px solid #9b59b6;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: ${tamanho > 10 ? '0.9rem' : '1.1rem'};
                color: #9b59b6;
                box-shadow: 0 1px 3px rgba(155,89,182,0.08);
            `;
            cell.dataset.row = i;
            cell.dataset.col = j;
            gridElement.appendChild(cell);
        }
    }
}

function atualizarStatusCaca() {
    const config = cacaPalavrasNiveis[cacaNivelAtual];
    let numPalavras;
    if (cacaNivelAtual === 'facil') numPalavras = 5;
    else if (cacaNivelAtual === 'medio') numPalavras = 6;
    else if (cacaNivelAtual === 'dificil') numPalavras = 5;
    else numPalavras = 6;
    
    const total = numPalavras;
    const encontradas = cacaPalavrasEncontradas.length;
    
    document.getElementById('caca-status').innerHTML = `Palavras encontradas: ${encontradas}/${total}`;
    
    if (encontradas === total) {
        document.getElementById('caca-status').innerHTML = '🎉 Parabéns! Você encontrou todas as palavras!';
    }
}

function reiniciarCaca() {
    iniciarCaca();
    document.getElementById('caca-input').value = '';
}

// Event listener para o formulário de caça-palavras
document.getElementById('caca-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('caca-input');
    const palavra = input.value.toUpperCase().trim();
    
    if (!palavra) return;
    
    const config = cacaPalavrasNiveis[cacaNivelAtual];
    
    if (cacaPalavrasEncontradas.includes(palavra)) {
        document.getElementById('caca-status').innerHTML = '⚠️ Você já encontrou essa palavra!';
        setTimeout(() => atualizarStatusCaca(), 2000);
    } else if (cacaPalavrasAtuais.includes(palavra)) {
        cacaPalavrasEncontradas.push(palavra);
        marcarPalavraNoGrid(palavra);
        document.getElementById('caca-status').innerHTML = `✅ Palavra "${palavra}" encontrada!`;
        setTimeout(() => atualizarStatusCaca(), 1500);
    } else {
        document.getElementById('caca-status').innerHTML = '❌ Palavra não está no caça-palavras!';
        setTimeout(() => atualizarStatusCaca(), 2000);
    }
    
    input.value = '';
});

function marcarPalavraNoGrid(palavra) {
    const tamanho = cacaGrid.length;
    
    // Procurar a palavra no grid em todas as direções
    for (let i = 0; i < tamanho; i++) {
        for (let j = 0; j < tamanho; j++) {
            // Horizontal
            if (verificarDirecao(palavra, i, j, 0, 1)) {
                destacarCelulas(palavra.length, i, j, 0, 1);
                return;
            }
            // Vertical
            if (verificarDirecao(palavra, i, j, 1, 0)) {
                destacarCelulas(palavra.length, i, j, 1, 0);
                return;
            }
            // Diagonal ↘
            if (verificarDirecao(palavra, i, j, 1, 1)) {
                destacarCelulas(palavra.length, i, j, 1, 1);
                return;
            }
            // Diagonal ↙
            if (verificarDirecao(palavra, i, j, 1, -1)) {
                destacarCelulas(palavra.length, i, j, 1, -1);
                return;
            }
        }
    }
}

function verificarDirecao(palavra, linha, coluna, deltaLinha, deltaColuna) {
    const tamanho = cacaGrid.length;
    
    for (let i = 0; i < palavra.length; i++) {
        const l = linha + i * deltaLinha;
        const c = coluna + i * deltaColuna;
        
        if (l < 0 || l >= tamanho || c < 0 || c >= tamanho) return false;
        if (cacaGrid[l][c] !== palavra[i]) return false;
    }
    
    return true;
}

function destacarCelulas(tamanho, linha, coluna, deltaLinha, deltaColuna) {
    const gridElement = document.getElementById('caca-grid');
    const cells = gridElement.children;
    const gridSize = cacaGrid.length;
    
    for (let i = 0; i < tamanho; i++) {
        const l = linha + i * deltaLinha;
        const c = coluna + i * deltaColuna;
        const index = l * gridSize + c;
        
        if (cells[index]) {
            cells[index].style.background = 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)';
            cells[index].style.color = '#fff';
            cells[index].style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (cells[index]) cells[index].style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Jogo Termo
const termoPalavras = [
    'BRASA', 'CAMPO', 'DENTE', 'FESTA', 'GRAMA', 'HOTEL', 'LIMAO', 'LUGAR', 
    'METAL', 'NORTE', 'PRATO', 'RISCO', 'SAMBA', 'TARDE', 'VERDE', 'ZEBRA',
    'BARRO', 'CARNE', 'DANCE', 'EXAME', 'FORCA', 'GRITO', 'INVERNO', 'JUNTA',
    'KISMET', 'LETRA', 'MOTOR', 'NEXO', 'ORDEM', 'PONTE', 'QUINTA', 'RITMO',
    'SENSO', 'TERRA', 'UNICO', 'VALOR', 'MUNDO', 'XADREZ', 'ZEBRA', 'AMIGO',
    'BRAVO', 'CESTA', 'DOIDO', 'ESCOLA', 'FILME', 'GOSTO', 'HUMOR', 'LINHA'
];

let termoPalavraAtual = '';
let termoTentativas = [];
let termoTentativaAtual = 0;
let termoMaxTentativas = 6;
let termoJogoAtivo = true;

function iniciarTermo() {
    termoPalavraAtual = termoPalavras[Math.floor(Math.random() * termoPalavras.length)];
    termoTentativas = [];
    termoTentativaAtual = 0;
    termoJogoAtivo = true;
    
    document.getElementById('termo-input').value = '';
    document.getElementById('termo-input').disabled = false;
    document.getElementById('termo-status').innerHTML = '';
    
    renderizarBoardTermo();
}

function renderizarBoardTermo() {
    const board = document.getElementById('termo-board');
    board.innerHTML = '';
    
    for (let i = 0; i < termoMaxTentativas; i++) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:0.4rem;justify-content:center;';
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.style.cssText = `
                width:60px;
                height:60px;
                border:2px solid #26a69a;
                border-radius:8px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:1.8rem;
                font-weight:bold;
                background:#fff;
                color:#333;
            `;
            
            if (termoTentativas[i]) {
                const letra = termoTentativas[i].palavra[j];
                const status = termoTentativas[i].status[j];
                
                cell.textContent = letra;
                
                if (status === 'correto') {
                    cell.style.background = '#66bb6a';
                    cell.style.color = '#fff';
                    cell.style.borderColor = '#66bb6a';
                } else if (status === 'posicao') {
                    cell.style.background = '#ffca28';
                    cell.style.color = '#fff';
                    cell.style.borderColor = '#ffca28';
                } else {
                    cell.style.background = '#9e9e9e';
                    cell.style.color = '#fff';
                    cell.style.borderColor = '#9e9e9e';
                }
            }
            
            row.appendChild(cell);
        }
        
        board.appendChild(row);
    }
}

function verificarPalavraTermo(palavra) {
    if (palavra.length !== 5) {
        document.getElementById('termo-status').innerHTML = '<span style="color:#e53935;">⚠️ A palavra deve ter exatamente 5 letras!</span>';
        setTimeout(() => {
            document.getElementById('termo-status').innerHTML = '';
        }, 2000);
        return;
    }
    
    if (!termoJogoAtivo) {
        document.getElementById('termo-status').innerHTML = '<span style="color:#ff9800;">⚠️ O jogo já terminou! Clique em "Novo Jogo"</span>';
        return;
    }
    
    const status = [];
    const palavraArray = termoPalavraAtual.split('');
    const palpiteArray = palavra.split('');
    const usadas = Array(5).fill(false);
    
    // Primeiro passa: marca as letras corretas
    for (let i = 0; i < 5; i++) {
        if (palpiteArray[i] === palavraArray[i]) {
            status[i] = 'correto';
            usadas[i] = true;
        }
    }
    
    // Segunda passa: marca as letras que existem mas estão na posição errada
    for (let i = 0; i < 5; i++) {
        if (status[i]) continue; // Já marcada como correta
        
        let encontrou = false;
        for (let j = 0; j < 5; j++) {
            if (!usadas[j] && palpiteArray[i] === palavraArray[j]) {
                status[i] = 'posicao';
                usadas[j] = true;
                encontrou = true;
                break;
            }
        }
        
        if (!encontrou) {
            status[i] = 'errado';
        }
    }
    
    termoTentativas.push({ palavra, status });
    termoTentativaAtual++;
    
    renderizarBoardTermo();
    
    // Verifica vitória
    if (palavra === termoPalavraAtual) {
        document.getElementById('termo-status').innerHTML = `<span style="color:#66bb6a;">🎉 Parabéns! Você acertou em ${termoTentativaAtual} tentativa(s)!</span>`;
        document.getElementById('termo-input').disabled = true;
        termoJogoAtivo = false;
    } else if (termoTentativaAtual >= termoMaxTentativas) {
        document.getElementById('termo-status').innerHTML = `<span style="color:#e53935;">😔 Fim de jogo! A palavra era: <strong>${termoPalavraAtual}</strong></span>`;
        document.getElementById('termo-input').disabled = true;
        termoJogoAtivo = false;
    }
    
    document.getElementById('termo-input').value = '';
}

function reiniciarTermo() {
    iniciarTermo();
}

// Event listener para o formulário do Termo
document.getElementById('termo-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('termo-input');
    const palavra = input.value.toUpperCase().trim();
    
    if (palavra) {
        verificarPalavraTermo(palavra);
    }
});

// Inicializa o jogo Termo quando a página carrega
if (typeof iniciarTermo === 'function') {
    iniciarTermo();
}
