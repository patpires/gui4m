// Lista de palavras a serem encontradas (em maiúsculas para o grid)
const palavras = ['SORRIR', 'ABRACO', 'SUPERHEROI', 'SONHOS', 'GARGALHADA', 'PARCEIROS', 'AMOR', 'PACIENCIA', 'VERDADEIRO', 'INFINITO'];
const gridSize = 15; // Tamanho do grid (15x15)
let grid, palavrasEncontradas, inicioTempo; // Variáveis de estado do jogo

// Mapa para exibir as palavras encontradas com acentos/hifens na mensagem
const mapaPalavras = {
    'SORRIR': 'SORRIR',
    'ABRACO': 'ABRAÇO',
    'SUPERHEROI': 'SUPER-HERÓI',
    'SONHOS': 'SONHOS',
    'GARGALHADA': 'GARGALHADA',
    'PARCEIROS': 'PARCEIROS',
    'AMOR': 'AMOR',
    'PACIENCIA': 'PACIÊNCIA',
    'VERDADEIRO': 'VERDADEIRO',
    'INFINITO': 'INFINITO'
};

// Função para inicializar o jogo
const inicializarJogo = () => {
    // Cria um grid vazio
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    palavrasEncontradas = []; // Reseta a lista de palavras encontradas
    inicioTempo = Date.now(); // Inicia o cronômetro

    // Coloca cada palavra no grid
    palavras.forEach(palavra => colocarPalavraNoGrid(palavra));
    preencherGrid(); // Preenche as células vazias com letras aleatórias
    desenharPuzzle(); // Desenha o grid no canvas

    // Reseta a aparência das frases e esconde a mensagem de parabéns
    document.querySelectorAll('#frases li').forEach(li => li.classList.remove('found'));
    document.getElementById('congrats').style.display = 'none';
    document.getElementById('mensagem').innerText = ''; // Limpa a mensagem
};


// Função para colocar uma palavra no grid
const colocarPalavraNoGrid = (palavra) => {
    let colocada = false;
    // Direções possíveis para colocar a palavra (horizontal, vertical, diagonal)
    const direcoes = [
        { x: 1, y: 0 },  // Horizontal direita
        { x: -1, y: 0 }, // Horizontal esquerda
        { x: 0, y: 1 },  // Vertical para baixo
        { x: 0, y: -1 }, // Vertical para cima
        { x: 1, y: 1 },  // Diagonal direita-baixo
        { x: -1, y: 1 }, // Diagonal esquerda-baixo
        { x: 1, y: -1 }, // Diagonal direita-cima
        { x: -1, y: -1 } // Diagonal esquerda-cima
    ];

    // Tenta colocar a palavra até conseguir
    while (!colocada) {
        // Escolhe uma direção e uma posição inicial aleatórias
        const direction = Math.floor(Math.random() * direcoes.length);
        const dir = direcoes[direction];
        const startX = Math.floor(Math.random() * gridSize);
        const startY = Math.floor(Math.random() * gridSize);
        let podeColocar = true;
        let coordsParaColocar = []; // Armazena as coordenadas onde a palavra seria colocada

        // Verifica se a palavra cabe e se não colide com letras diferentes
        for (let i = 0; i < palavra.length; i++) {
            const newX = startX + i * dir.x;
            const newY = startY + i * dir.y;

            // Verifica limites do grid e colisões
            if (newX < 0 || newY < 0 || newX >= gridSize || newY >= gridSize ||
                (grid[newY][newX] !== '' && grid[newY][newX] !== palavra[i])) {
                podeColocar = false;
                break;
            }
            coordsParaColocar.push({ x: newX, y: newY });
        }

        // Se pode colocar, tenta escrever e verificar
        if (podeColocar) {
            // Salva o estado atual do grid antes de tentar colocar a palavra
            const gridBackup = grid.map(row => [...row]);
            let placedWord = ''; // String para reconstruir a palavra colocada

            // Escreve a palavra no grid
            for (let i = 0; i < palavra.length; i++) {
                const { x, y } = coordsParaColocar[i];
                grid[y][x] = palavra[i];
                placedWord += grid[y][x]; // Constrói a palavra lendo do grid
            }

            // --- MODIFICAÇÃO 1: Verificação de colocação correta ---
            // Verifica se a palavra lida do grid é exatamente a palavra original
            if (placedWord === palavra) {
                colocada = true; // Palavra colocada corretamente
                // console.log(`Palavra "${palavra}" colocada em (${startX},${startY}) na direção ${JSON.stringify(dir)}`); // Opcional: log para debug
            } else {
                // Se a palavra lida não é a original, restaura o grid e tenta novamente
                grid = gridBackup;
                // console.log(`Falha ao colocar "${palavra}", tentando novamente.`); // Opcional: log para debug
            }
            // --- FIM MODIFICAÇÃO 1 ---
        }
    }
};

// Função para preencher as células vazias do grid com letras aleatórias
const preencherGrid = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (grid[y][x] === '') {
                grid[y][x] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }
};

// Função para desenhar o puzzle no canvas
// temporarioX e temporarioY são usados para destacar a seleção atual do usuário
const desenharPuzzle = (temporarioX = [], temporarioY = []) => {
    const canvas = document.getElementById('puzzle');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    ctx.font = '20px Arial';
    ctx.textAlign = 'center'; // Alinhar texto centralizado na célula
    ctx.textBaseline = 'middle'; // Alinhar texto verticalmente centralizado

    const cellSize = canvas.width / gridSize; // Tamanho de cada célula do grid

    // Destaca as palavras já encontradas
    const destacar = [...palavrasEncontradas];
    destacar.forEach(({ coordsX, coordsY }) => {
        coordsX.forEach((x, i) => {
            ctx.fillStyle = 'yellow'; // Cor de destaque para palavras encontradas
            ctx.fillRect(x * cellSize, coordsY[i] * cellSize, cellSize, cellSize);
        });
    });

    // Destaca a seleção temporária do usuário (enquanto arrasta o mouse/dedo)
    temporarioX.forEach((x, i) => {
        ctx.fillStyle = 'lightgray'; // Cor de destaque para seleção temporária
        ctx.fillRect(x * cellSize, temporarioY[i] * cellSize, cellSize, cellSize);
    });

    // Desenha as letras no grid
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = '#333'; // Cor do texto
            // Calcula a posição central da célula para desenhar o texto
            ctx.fillText(grid[y][x], x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
        }
    }
};

let selecionando = false; // Flag para saber se o usuário está selecionando
let startX, startY, endX, endY; // Coordenadas de início e fim da seleção

// --- MODIFICAÇÃO 2: Função auxiliar para obter o caminho da seleção ---
// Esta função calcula as coordenadas e a palavra selecionada
// Funciona tanto para mouse quanto para touch
const getSelectionPath = (sX, sY, eX, eY) => {
    let palavra = '';
    let coordsX = [];
    let coordsY = [];

    // Verifica se a seleção é horizontal, vertical ou diagonal
    if (sX === eX) { // Vertical
        const minY = Math.min(sY, eY);
        const maxY = Math.max(sY, eY);
        for (let i = minY; i <= maxY; i++) {
            // Verifica se a coordenada está dentro dos limites antes de acessar o grid
            if (i >= 0 && i < gridSize && sX >= 0 && sX < gridSize) {
                 palavra += grid[i][sX];
                 coordsX.push(sX);
                 coordsY.push(i);
            }
        }
    } else if (sY === eY) { // Horizontal
        const minX = Math.min(sX, eX);
        const maxX = Math.max(sX, eX);
        for (let i = minX; i <= maxX; i++) {
             // Verifica se a coordenada está dentro dos limites antes de acessar o grid
            if (sY >= 0 && sY < gridSize && i >= 0 && i < gridSize) {
                palavra += grid[sY][i];
                coordsX.push(i);
                coordsY.push(sY);
            }
        }
    } else if (Math.abs(sX - eX) === Math.abs(sY - eY)) { // Diagonal
        const deltaX = eX > sX ? 1 : -1;
        const deltaY = eY > sY ? 1 : -1;
        const length = Math.abs(sX - eX);
        for (let i = 0; i <= length; i++) {
            const currentX = sX + i * deltaX;
            const currentY = sY + i * deltaY;
             // Verifica se a coordenada está dentro dos limites antes de acessar o grid
            if (currentY >= 0 && currentY < gridSize && currentX >= 0 && currentX < gridSize) {
                palavra += grid[currentY][currentX];
                coordsX.push(currentX);
                coordsY.push(currentY);
            }
        }
    }
    // Se não for horizontal, vertical ou diagonal, retorna vazio
    return { palavra, coordsX, coordsY };
};
// --- FIM MODIFICAÇÃO 2 ---


// Função para validar a palavra selecionada
const validarSelecao = (coordsX, coordsY, palavraSelecionada) => {
    // Verifica se a palavra selecionada (ou sua inversa) está na lista de palavras a encontrar
    const selecionadaReversa = palavraSelecionada.split('').reverse().join('');
    if (palavras.includes(palavraSelecionada) || palavras.includes(selecionadaReversa)) {
        // Encontra a palavra original (sem ser reversa)
        const palavraOriginal = palavras.includes(palavraSelecionada) ? palavraSelecionada : selecionadaReversa;
        const indice = palavras.indexOf(palavraOriginal); // Pega o índice na lista original

        // Verifica se a palavra já foi encontrada para evitar duplicidade
        const jaEncontrada = palavrasEncontradas.some(item => item.palavra === palavraOriginal);

        if (!jaEncontrada) {
            // Marca a frase correspondente como encontrada
            const lis = document.querySelectorAll('#frases li');
            lis[indice].classList.add('found');

            // Adiciona a palavra encontrada à lista de palavras encontradas
            palavrasEncontradas.push({ palavra: palavraOriginal, coordsX, coordsY });

            // Desenha o puzzle novamente para destacar a palavra encontrada
            desenharPuzzle();

            // Verifica se todas as palavras foram encontradas
            if (palavrasEncontradas.length === palavras.length) {
                const tempoGasto = Math.round((Date.now() - inicioTempo) / 1000); // Calcula o tempo em segundos
                document.getElementById('tempo').innerText = tempoGasto; // Exibe o tempo
                document.getElementById('congrats').style.display = 'flex'; // Mostra a mensagem de parabéns
            } else {
                // Exibe a mensagem de que a palavra foi encontrada (usando o mapa para acentos/hifens)
                document.getElementById('mensagem').innerText = `Você encontrou: ${mapaPalavras[palavraOriginal]}`;
            }
        } else {
             // Se a palavra já foi encontrada, apenas limpa a seleção temporária
             document.getElementById('mensagem').innerText = `"${mapaPalavras[palavraOriginal]}" já foi encontrada!`;
             desenharPuzzle(); // Redesenha sem a seleção temporária
        }
    } else {
        // Se a palavra não foi encontrada, exibe uma mensagem de erro
        document.getElementById('mensagem').innerText = `Tente novamente!`;
        // Redesenha o puzzle sem a seleção temporária
        desenharPuzzle();
    }
};

// --- MODIFICAÇÃO 2: Eventos de Mouse e Touch ---

// Evento de pressionar o botão do mouse (início da seleção)
document.getElementById('puzzle').addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect(); // Pega a posição do canvas na tela
    const cellSize = rect.width / gridSize; // Calcula o tamanho da célula
    // Calcula as coordenadas do grid baseadas na posição do clique
    startX = Math.floor((e.clientX - rect.left) / cellSize);
    startY = Math.floor((e.clientY - rect.top) / cellSize);
    selecionando = true; // Inicia o estado de seleção
    document.getElementById('mensagem').innerText = ''; // Limpa a mensagem anterior
});

// Evento de mover o mouse (durante a seleção)
document.getElementById('puzzle').addEventListener('mousemove', (e) => {
    if (selecionando) {
        const rect = e.target.getBoundingClientRect();
        const cellSize = rect.width / gridSize;
        // Calcula as coordenadas atuais do grid
        endX = Math.floor((e.clientX - rect.left) / cellSize);
        endY = Math.floor((e.clientY - rect.top) / cellSize);

        // Obtém o caminho da seleção atual
        const { palavra, coordsX, coordsY } = getSelectionPath(startX, startY, endX, endY);
        // Desenha o puzzle destacando a seleção temporária
        desenharPuzzle(coordsX, coordsY);
    }
});

// Evento de soltar o botão do mouse (fim da seleção)
document.addEventListener('mouseup', () => {
    if (selecionando) {
        selecionando = false; // Finaliza o estado de seleção
        // Obtém o caminho final da seleção
        const { palavra, coordsX, coordsY } = getSelectionPath(startX, startY, endX, endY);
        // Valida a palavra selecionada
        validarSelecao(coordsX, coordsY, palavra);
    }
});

// Evento de tocar na tela (início da seleção touch)
document.getElementById('puzzle').addEventListener('touchstart', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do touch (ex: scroll, zoom)
    const rect = e.target.getBoundingClientRect();
    const cellSize = rect.width / gridSize;
    // Calcula as coordenadas do grid baseadas na posição do toque
    startX = Math.floor((e.touches[0].clientX - rect.left) / cellSize);
    startY = Math.floor((e.touches[0].clientY - rect.top) / cellSize);
    selecionando = true; // Inicia o estado de seleção
    document.getElementById('mensagem').innerText = ''; // Limpa a mensagem anterior
});

// Evento de mover o dedo na tela (durante a seleção touch)
document.getElementById('puzzle').addEventListener('touchmove', (e) => {
    if (selecionando) {
        e.preventDefault(); // Previne o comportamento padrão do touch
        const rect = e.target.getBoundingClientRect();
        const cellSize = rect.width / gridSize;
        // Calcula as coordenadas atuais do grid baseadas na posição do toque
        endX = Math.floor((e.touches[0].clientX - rect.left) / cellSize);
        endY = Math.floor((e.touches[0].clientY - rect.top) / cellSize);

        // Obtém o caminho da seleção atual
        const { palavra, coordsX, coordsY } = getSelectionPath(startX, startY, endX, endY);
        // Desenha o puzzle destacando a seleção temporária
        desenharPuzzle(coordsX, coordsY);
    }
});

// Evento de levantar o dedo da tela (fim da seleção touch)
document.addEventListener('touchend', () => {
    if (selecionando) {
        selecionando = false; // Finaliza o estado de seleção
        // Obtém o caminho final da seleção
        const { palavra, coordsX, coordsY } = getSelectionPath(startX, startY, endX, endY);
        // Valida a palavra selecionada
        validarSelecao(coordsX, coordsY, palavra);
    }
});

// --- FIM MODIFICAÇÃO 2 ---


// Função para reiniciar o jogo
const reiniciarJogo = () => {
    inicializarJogo(); // Chama a função de inicialização
};

// Inicializa o jogo quando a página carrega
window.onload = inicializarJogo;
