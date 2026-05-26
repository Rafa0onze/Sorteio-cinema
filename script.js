// Estado da aplicação
let appState = {
    rows: 5,
    seats: 10,
    selectedSeat: null,
    hallCreated: false,
    selectedSeats: new Set()
};

// DOM Elements
const rowsInput = document.getElementById('rows');
const seatsInput = document.getElementById('seats');
const rowsValue = document.getElementById('rowsValue');
const seatsValue = document.getElementById('seatsValue');
const createBtn = document.getElementById('createBtn');
const resetBtn = document.getElementById('resetBtn');
const drawBtn = document.getElementById('drawBtn');
const configSection = document.querySelector('.config-section');
const hallSection = document.getElementById('hallSection');
const resultSection = document.getElementById('resultSection');
const theaterHall = document.getElementById('theaterHall');
const newDrawBtn = document.getElementById('newDrawBtn');
const backBtn = document.getElementById('backBtn');

// Event Listeners
rowsInput.addEventListener('input', (e) => {
    appState.rows = parseInt(e.target.value);
    rowsValue.textContent = appState.rows;
});

seatsInput.addEventListener('input', (e) => {
    appState.seats = parseInt(e.target.value);
    seatsValue.textContent = appState.seats;
});

createBtn.addEventListener('click', createHall);
resetBtn.addEventListener('click', resetDraw);
drawBtn.addEventListener('click', performDraw);
newDrawBtn.addEventListener('click', performAnotherDraw);
backBtn.addEventListener('click', backToConfig);

// Gerar letra da fileira (A, B, C, ...)
function getRowLetter(index) {
    return String.fromCharCode(65 + index);
}

// Criar a sala de cinema
function createHall() {
    if (appState.rows < 1 || appState.rows > 26 || appState.seats < 1 || appState.seats > 100) {
        alert('Por favor, configure valores válidos:\n- Fileiras: 1-26\n- Assentos: 1-100');
        return;
    }

    appState.hallCreated = true;
    appState.selectedSeats.clear();
    appState.selectedSeat = null;

    renderTheaterHall();
    
    // Atualizar informações da sala
    document.getElementById('hallRows').textContent = appState.rows;
    document.getElementById('hallSeats').textContent = appState.seats;

    // Mostrar/Ocultar seções
    hallSection.style.display = 'block';
    resultSection.style.display = 'none';
}

// Renderizar a sala de cinema
function renderTheaterHall() {
    theaterHall.innerHTML = '';

    for (let rowIndex = 0; rowIndex < appState.rows; rowIndex++) {
        const rowLetter = getRowLetter(rowIndex);

        // Container da fileira
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row-label';

        // Letra da fileira
        const letterDiv = document.createElement('div');
        letterDiv.className = 'row-letter';
        letterDiv.textContent = rowLetter;

        // Container de assentos
        const seatsDiv = document.createElement('div');
        seatsDiv.className = 'seats-container';

        // Criar assentos
        for (let seatIndex = 1; seatIndex <= appState.seats; seatIndex++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = seatIndex;
            seat.dataset.row = rowLetter;
            seat.dataset.seat = seatIndex;

            seat.addEventListener('click', () => selectSeat(seat, rowLetter, seatIndex));

            // Adicionar visual se foi sorteado
            if (appState.selectedSeat && 
                appState.selectedSeat.row === rowLetter && 
                appState.selectedSeat.seat === seatIndex) {
                seat.classList.add('selected');
            }

            seatsDiv.appendChild(seat);
        }

        rowDiv.appendChild(letterDiv);
        rowDiv.appendChild(seatsDiv);
        theaterHall.appendChild(rowDiv);
    }
}

// Selecionar um assento
function selectSeat(seatElement, row, seat) {
    // Remover seleção anterior
    document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));

    // Adicionar nova seleção
    seatElement.classList.add('selected');
    appState.selectedSeat = { row, seat };
}

// Realizar sorteio
function performDraw() {
    // Gerar fileira aleatória
    const randomRowIndex = Math.floor(Math.random() * appState.rows);
    const randomRow = getRowLetter(randomRowIndex);

    // Gerar assento aleatório
    const randomSeat = Math.floor(Math.random() * appState.seats) + 1;

    // Atualizar estado
    appState.selectedSeat = { row: randomRow, seat: randomSeat };

    // Atualizar visual da sala
    renderTheaterHall();

    // Mostrar resultado
    showResult(randomRow, randomSeat);
}

// Mostrar resultado do sorteio
function showResult(row, seat) {
    document.getElementById('resultRow').textContent = row;
    document.getElementById('resultSeat').textContent = seat;
    document.getElementById('resultMessage').textContent = `🎫 Sorteado: Fileira ${row}, Assento ${seat}`;

    hallSection.style.display = 'none';
    resultSection.style.display = 'flex';
}

// Novo sorteio mantendo a configuração
function performAnotherDraw() {
    hallSection.style.display = 'block';
    resultSection.style.display = 'none';
    renderTheaterHall();
}

// Reset do sorteio
function resetDraw() {
    appState.selectedSeat = null;
    appState.selectedSeats.clear();
    appState.hallCreated = false;

    hallSection.style.display = 'none';
    resultSection.style.display = 'none';

    // Limpar teatro
    theaterHall.innerHTML = '';

    // Reset dos sliders (opcional)
    rowsInput.value = 5;
    seatsInput.value = 10;
    appState.rows = 5;
    appState.seats = 10;
    rowsValue.textContent = 5;
    seatsValue.textContent = 10;
}

// Voltar à configuração
function backToConfig() {
    appState.selectedSeat = null;
    hallSection.style.display = 'block';
    resultSection.style.display = 'none';
    renderTheaterHall();
}

// Inicialização
console.log('🎬 Aplicação de Sorteio Cinema iniciada!');
