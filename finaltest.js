// Dữ liệu hình ảnh
const images = [
    { src: '/finaltest/img/bau.png', type: 'bau' },
    { src: '/finaltest/img/cua.png', type: 'cua' },
    { src: '/finaltest/img/tom.png', type: 'tom' },
    { src: '/finaltest/img/ca.png', type: 'ca' },
    { src: '/finaltest/img/huou.png', type: 'huou' },
    { src: '/finaltest/img/ga.png', type: 'ga' }
];

// DOM elements
const resultImages = document.querySelectorAll('.result-img');
const spinButton = document.querySelector('.spin-button');
const resetButton = document.querySelector('.reset-button');
const resultMessage = document.getElementById('result-message');
const betItems = document.querySelectorAll('.bet-item');

// Variables
let bettingPoints = {
    bau: 0,
    cua: 0,
    tom: 0,
    ca: 0,
    huou: 0,
    ga: 0
};
let isSpinning = false;
let totalBets = 0;

// Spin images logic
function spinImages() {
    if (isSpinning) return; // Prevent multiple spins
    isSpinning = true;

    // Disable buttons and betting during spinning
    spinButton.disabled = true;
    resetButton.disabled = true;
    betItems.forEach(item => item.classList.add('disabled'));

    let spinCount = 0;
    const spinInterval = setInterval(() => {
        resultImages.forEach(img => {
            const randomIndex = Math.floor(Math.random() * images.length);
            img.src = images[randomIndex].src;
        });
        spinCount++;

        if (spinCount >= 100) {
            clearInterval(spinInterval);
            displayFinalResult();
        }
    }, 50);
}

// Display final result
function displayFinalResult() {
    // Get the result types from images
    const finalResults = Array.from(resultImages).map(img => {
        const result = images.find(image => image.src.includes(img.src.split('/').pop()));
        return result ? result.type : null;
    }).filter(result => result !== null);

    // Count occurrences of each result type
    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    // Determine if bets were correct
    const correctBets = Object.keys(bettingPoints).filter(type => bettingPoints[type] > 0 && resultCounts[type]);

    let resultText = '';
    if (correctBets.length > 0) {
        resultText = `Bạn đã đoán đúng với kết quả: ${finalResults.join(', ')}`;
    } else {
        resultText = `Bạn đã đoán sai với kết quả: ${finalResults.join(', ')}`;
    }
    resultMessage.textContent = resultText;

    // Re-enable buttons and betting
    spinButton.disabled = false;
    resetButton.disabled = false;
    betItems.forEach(item => item.classList.remove('disabled'));

    isSpinning = false;
}

// Place a bet
function placeBet(type) {
    if (isSpinning || totalBets >= 3) return; // Disable betting during spinning or if max bets reached

    if (bettingPoints[type] < 3) {
        bettingPoints[type] += 1;
        totalBets += 1;

        const betItem = document.querySelector(`.bet-item[data-type="${type}"] div`);
        if (betItem) {
            betItem.textContent = bettingPoints[type];
        }
    }
}

// Reset all bets
function resetBets() {
    if (isSpinning) return; // Disable reset during spinning

    Object.keys(bettingPoints).forEach(type => {
        bettingPoints[type] = 0;
        const betItem = document.querySelector(`.bet-item[data-type="${type}"] div`);
        if (betItem) {
            betItem.textContent = "0";
        }
    });
    totalBets = 0;
}

// Event listeners
if (spinButton) {
    spinButton.addEventListener('click', spinImages);
}

if (resetButton) {
    resetButton.addEventListener('click', resetBets);
}

betItems.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;
        placeBet(type);
    });
});
