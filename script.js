const palavras = ['SORRIR', 'ABRACO', 'SUPERHEROI', 'SONHOS', 'GARGALHADA', 'PARCEIROS', 'AMOR', 'PACIENCIA', 'VERDADEIRO', 'INFINITO'];
const gridSize = 15;
let grid, palavrasEncontradas, inicioTempo;

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

const inicializarJogo = () => {
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    palavrasEncontradas = [];
    inicioTempo = Date.now();

    palavras.forEach(palavra => colocarPalavraNoGrid(palavra));
    preencherGrid();
    desenharPuzzle();
    document.querySelectorAll('#frases li').forEach(li => li.classList.remove('found'));
    document.getElementById('congrats').style.display = 'none';
};

const colocarPalavraNoGrid = (palavra) => {
    let colocada = false;
    while (!colocada) {
        const direction = Math.floor(Math.random() * 8);
        let startX, startY;
        let podeColocar = true;

        if (direction === 0) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length));
            startY = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY][startX + i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY][startX + i] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 1) {
            startX = Math.floor(Math.random() * gridSize);
            startY = Math.floor(Math.random() * (gridSize - palavra.length));
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY + i][startX] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY + i][startX] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 2) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length));
            startY = Math.floor(Math.random() * (gridSize - palavra.length));
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY + i][startX + i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY + i][startX + i] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 3) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length));
            startY = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY - i][startX + i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY - i][startX + i] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 4) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            startY = Math.floor(Math.random() * gridSize);
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY][startX - i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY][startX - i] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 5) {
            startX = Math.floor(Math.random() * gridSize);
            startY = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY - i][startX] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY - i][startX] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 6) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            startY = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY - i][startX - i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY - i][startX - i] = palavra[i];
                }
                colocada = true;
            }
        } else if (direction === 7) {
            startX = Math.floor(Math.random() * (gridSize - palavra.length)) + palavra.length;
            startY = Math.floor(Math.random() * (gridSize - palavra.length));
            for (let i = 0; i < palavra.length; i++) {
                if (grid[startY + i][startX - i] !== '') {
                    podeColocar = false;
                    break;
                }
            }
            if (podeColocar) {
                for (let i = 0; i < palavra.length; i++) {
                    grid[startY + i][startX - i] = palavra[i];
                }
                colocada = true;
            }
        }
    }
};

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

const desenharPuzzle = (temporarioX = [], temporarioY = []) => {
    const canvas = document.getElementById('puzzle');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.textAlign = 'center'; // Alinhar centralizado

    const destacar = [...palavrasEncontradas];

    destacar.forEach(({ coordsX, coordsY }) => {
        coordsX.forEach((x, i) => {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(x * 25, coordsY[i] * 25, 25, 25);
        });
    });

    temporarioX.forEach((x, i) => {
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(x * 25, temporarioY[i] * 25, 25, 25);
    });

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            ctx.fillStyle = '#333';
            ctx.fillText(grid[y][x], x * 25 + 12.5, y * 25 + 18); // Alinhar centralizado
        }
    }
};

let selecionando = false;
let palavraSelecionada = '';
let startX, startY, endX, endY;

const validarSelecao = (coordsX, coordsY) => {
    const selecionadaReversa = palavraSelecionada.split('').reverse().join('');
    if (palavras.includes(palavraSelecionada) || palavras.includes(selecionadaReversa)) {
        const palavraOriginal = palavras.includes(palavraSelecionada) ? palavraSelecionada : selecionadaReversa;
        const indice = palavras.indexOf(palavraOriginal);
        const lis = document.querySelectorAll('#frases li');
        lis[indice].classList.add('found');
        palavrasEncontradas.push({ palavra: palavraOriginal, coordsX, coordsY });

        if (palavrasEncontradas.length === palavras.length) {
            const tempoGasto = Math.round((Date.now() - inicioTempo) / 1000);
            document.getElementById('tempo').innerText = tempoGasto;
            document.getElementById('congrats').style.display = 'flex';
        } else {
            document.getElementById('mensagem').innerText = `Você encontrou: ${mapaPalavras[palavraOriginal]}`;
        }
    } else {
        document.getElementById('mensagem').innerText = `Tente novamente!`;
    }
    palavraSelecionada = '';
};

document.getElementById('puzzle').addEventListener('mousedown', (e) => {
    const rect = e.target.getBoundingClientRect();
    startX = Math.floor((e.clientX - rect.left) / 25);
    startY = Math.floor((e.clientY - rect.top) / 25);
    selecionando = true;
    palavraSelecionada = '';
});

document.getElementById('puzzle').addEventListener('mousemove', (e) => {
    if (selecionando) {
        const rect = e.target.getBoundingClientRect();
        endX = Math.floor((e.clientX - rect.left) / 25);
        endY = Math.floor((e.clientY - rect.top) / 25);
        palavraSelecionada = '';
        let temporarioX = [];
        let temporarioY = [];

        if (startX === endX) {
            const minY = Math.min(startY, endY);
            const maxY = Math.max(startY, endY);
            for (let i = minY; i <= maxY; i++) {
                palavraSelecionada += grid[i][startX];
                temporarioX.push(startX);
                temporarioY.push(i);
            }
        } else if (startY === endY) {
            const minX = Math.min(startX, endX);
            const maxX = Math.max(startX, endX);
            for (let i = minX; i <= maxX; i++) {
                palavraSelecionada += grid[startY][i];
                temporarioX.push(i);
                temporarioY.push(startY);
            }
        } else if (Math.abs(startX - endX) === Math.abs(startY - endY)) {
            if (startX < endX) {
                for (let i = 0; i <= endX - startX; i++) {
                    palavraSelecionada += grid[startY + (startY < endY ? i : -i)][startX + i];
                    temporarioX.push(startX + i);
                    temporarioY.push(startY + (startY < endY ? i : -i));
                }
            } else {
                for (let i = 0; i <= startX - endX; i++) {
                    palavraSelecionada += grid[startY + (startY > endY ? -i : i)][startX - i];
                    temporarioX.push(startX - i);
                    temporarioY.push(startY + (startY > endY ? -i : i));
                }
            }
        }

        desenharPuzzle(temporarioX, temporarioY);
    }
});

document.addEventListener('mouseup', () => {
    if (selecionando) {
        validarSelecao(
            startX === endX ? Array.from({ length: Math.abs(endY - startY) + 1 }, (_, i) => startX)
            : startY === endY ? Array.from({ length: Math.abs(endX - startX) + 1 }, (_, i) => (startX < endX ? startX + i : startX - i))
            : Array.from({ length: Math.abs(endX - startX) + 1 }, (_, i) => (startX < endX ? startX + i : startX - i)),
            startY === endY ? Array.from({ length: Math.abs(endX - startX) + 1 }, (_, i) => startY)
            : startX === endX ? Array.from({ length: Math.abs(endY - startY) + 1 }, (_, i) => (startY < endY ? startY + i : startY - i))
            : Array.from({ length: Math.abs(endY - startY) + 1 }, (_, i) => (startY < endY ? startY + i : startY - i))
        );
        selecionando = false;
    }
});

const reiniciarJogo = () => {
    inicializarJogo();
};

window.onload = inicializarJogo;