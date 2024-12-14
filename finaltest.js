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

// Spin images
function spinImages() {
    if (isSpinning) return; // Prevent multiple spins
    isSpinning = true;

    let spinCount = 0;
    const spinInterval = setInterval(() => {
        resultImages.forEach(img => {
            const randomIndex = Math.floor(Math.random() * images.length);
            img.src = images[randomIndex].src;
        });
        spinCount++;

        if (spinCount >= 50) {
            clearInterval(spinInterval);
            displayFinalResult();
        }
    }, 50);
}

// Display final result
function displayFinalResult() {
    const finalResults = Array.from(resultImages).map(img => {
        const result = images.find(image => image.src.includes(img.src.split('/').pop()));
        return result ? result.type : null;
    }).filter(result => result !== null);

    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    let resultText = 'Kết quả: ';
    resultText += Object.entries(resultCounts)
        .map(([type, count]) => `${type} (${count})`)
        .join(', ');

    resultMessage.textContent = resultText;
    isSpinning = false;
}

// Place bet
function placeBet(type) {
    if (bettingPoints[type] !== undefined) {
        bettingPoints[type] += 1;
        const betItem = document.querySelector(`.bet-item[data-type="${type}"] div`);
        if (betItem) {
            betItem.textContent = bettingPoints[type];
        }
    }
}

// Reset bets
function resetBets() {
    Object.keys(bettingPoints).forEach(type => {
        bettingPoints[type] = 0;
        const betItem = document.querySelector(`.bet-item[data-type="${type}"] div`);
        if (betItem) {
            betItem.textContent = "0";
        }
    });
}

// Event listeners
if (spinButton) {
    spinButton.addEventListener('click', spinImages);
} else {
    console.error("Spin button not found!");
}

if (resetButton) {
    resetButton.addEventListener('click', resetBets);
} else {
    console.error("Reset button not found!");
}

betItems.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;
        placeBet(type);
    });
});

