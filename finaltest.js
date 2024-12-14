// Danh sách hình ảnh
const images = [
    { src: '/finaltest/img/bau.png', type: 'bau' },
    { src: '/finaltest/img/cua.png', type: 'cua' },
    { src: '/finaltest/img/tom.png', type: 'tom' },
    { src: '/finaltest/img/ca.png', type: 'ca' },
    { src: '/finaltest/img/huou.png', type: 'huou' },
    { src: '/finaltest/img/ga.png', type: 'ga' }
];

// Lấy các phần tử DOM
const resultImages = document.querySelectorAll('.result-image');
const resultMessage = document.getElementById('result-message');
const spinButton = document.getElementById('spin-button');
const betItems = document.querySelectorAll('.bet-item');

// Biến lưu trạng thái và dữ liệu
let bettingPoints = {
    bau: 0,
    cua: 0,
    tom: 0,
    ca: 0,
    huou: 0,
    ga: 0
};
let isSpinning = false;

// Hàm quay và hiển thị kết quả
function spinImages() {
    if (isSpinning) return; // Ngăn chặn quay liên tục
    isSpinning = true;

    let spinCount = 0;
    const spinInterval = setInterval(() => {
        for (let img of resultImages) {
            const randomIndex = Math.floor(Math.random() * images.length);
            img.src = images[randomIndex].src;
        }

        spinCount++;

        if (spinCount >= 100) {
            clearInterval(spinInterval);
            displayFinalResult();
        }
    }, 50);
}

// Hàm hiển thị kết quả cuối cùng
function displayFinalResult() {
    const finalResults = Array.from(resultImages).map(img => {
        const result = images.find(image => image.src === img.src);
        return result ? result.type : null;
    }).filter(result => result !== null);

    const betTypes = Object.keys(bettingPoints).filter(type => bettingPoints[type] > 0);

    const correctBets = [];
    for (let i = 0; i < betTypes.length; i++) {
        if (finalResults.indexOf(betTypes[i]) !== -1) {
            correctBets.push(betTypes[i]);
        }
    }

    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    let resultText = '';
    if (correctBets.length > 0) {
        resultText = "Bạn đã đoán đúng (" + correctBets.join(", ") + ")! Kết quả là (";
    } else {
        resultText = "Bạn đã đoán sai! Kết quả là (";
    }

    resultText += Object.entries(resultCounts).map(([type, count]) => `${type} ${count}`).join(", ") + ")";

    resultMessage.innerHTML = resultText;

    betTypes.forEach(type => {
        const betItem = document.querySelector(`.bet-item[data-type="${type}"]`);
        if (betItem) {
            betItem.querySelector('span').innerText = bettingPoints[type];
        }
    });

    resetBets();
    isSpinning = false;
}

// Hàm đặt cược
function placeBet(type, points) {
    if (bettingPoints[type] !== undefined) {
        bettingPoints[type] += points;
        const betItem = document.querySelector(`.bet-item[data-type="${type}"]`);
        if (betItem) {
            betItem.querySelector('span').innerText = bettingPoints[type];
        }
    }
}

// Hàm reset cược
function resetBets() {
    Object.keys(bettingPoints).forEach(type => {
        bettingPoints[type] = 0;
        const betItem = document.querySelector(`.bet-item[data-type="${type}"]`);
        if (betItem) {
            betItem.querySelector('span').innerText = "0";
        }
    });
}

// Gắn sự kiện cho nút quay
spinButton.addEventListener('click', spinImages);

// Gắn sự kiện đặt cược (giả sử bạn muốn thêm tính năng này)
betItems.forEach(item => {
    item.addEventListener('click', () => {
        const type = item.dataset.type;
        placeBet(type, 10); // Đặt cược 10 điểm mỗi lần click
    });
});
