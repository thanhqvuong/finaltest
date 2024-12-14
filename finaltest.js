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

// Quay hình ảnh
function spinImages() {
    if (isSpinning) return; // Ngăn người dùng kích hoạt lại
    isSpinning = true;

    // Disable các nút khi đang quay
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

// Hiển thị kết quả cuối cùng
function displayFinalResult() {
    // Lấy danh sách kết quả cuối
    const finalResults = Array.from(resultImages).map(img => {
        const result = images.find(image => img.src.includes(image.src.split('/').pop()));
        return result ? result.type : null;
    }).filter(result => result !== null);

    // Đếm số lần xuất hiện của từng loại trong kết quả
    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    // So sánh với cược của người chơi
    let correctBets = 0;
    Object.keys(bettingPoints).forEach(type => {
        if (bettingPoints[type] > 0 && resultCounts[type]) {
            correctBets += Math.min(bettingPoints[type], resultCounts[type]);
        }
    });

    let resultText = '';
    if (correctBets > 0) {
        resultText = `Bạn đã đoán đúng với kết quả: ${formatFinalResults(finalResults)}`;
    } else {
        resultText = `Bạn đã đoán sai với kết quả: ${formatFinalResults(finalResults)}`;
    }

    resultMessage.textContent = resultText;

    // Enable các nút sau khi quay xong
    spinButton.disabled = false;
    resetButton.disabled = false;
    betItems.forEach(item => item.classList.remove('disabled'));

    isSpinning = false;
}

// Định dạng chuỗi kết quả
function formatFinalResults(results) {
    const counts = results.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(counts).map(([type, count]) => `${type} ${count}`).join(', ');
}

// Đặt cược
function placeBet(type) {
    if (isSpinning || totalBets >= 3) return; // Ngăn đặt cược khi đang quay hoặc vượt giới hạn cược

    if (bettingPoints[type] < 3) {
        bettingPoints[type] += 1;
        totalBets += 1;

        const betItem = document.querySelector(`.bet-item[data-type="${type}"] div`);
        if (betItem) {
            betItem.textContent = bettingPoints[type];
        }
    }
}

// Đặt lại cược
function resetBets() {
    if (isSpinning) return; // Ngăn đặt lại khi đang quay

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
