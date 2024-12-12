const images = [
    { src: 'img/bau.png', type: 'bau' },
    { src: 'img/cua.png', type: 'cua' },
    { src: 'img/tom.png', type: 'tom' },
    { src: 'img/ca.png', type: 'ca' },
    { src: 'img/huou.png', type: 'huou' },
    { src: 'img/ga.png', type: 'ga' }
];

// Quay và hiển thị kết quả
function spinImages() {
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
    }, 50); // Thay đổi hình mỗi 50ms
}

// Hàm hiển thị kết quả cuối cùng
function displayFinalResult() {
    // Lấy kết quả cuối cùng từ các hình ảnh
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

    // Đếm số lần xuất hiện của mỗi loại hình trong kết quả
    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    // Tạo thông báo kết quả
    let resultText = '';
    if (correctBets.length > 0) {
        resultText = "Bạn đã đoán đúng (";
        for (let i = 0; i < correctBets.length; i++) {
            resultText += correctBets[i];
            if (i < correctBets.length - 1) {
                resultText += ", ";
            }
        }
        resultText += `)! Kết quả là (`;
    } else {
        resultText = "Bạn đã đoán sai! Kết quả là (";
    }

    let finalResultText = "";
    for (let i = 0; i < finalResults.length; i++) {
        finalResultText += `${finalResults[i]} ${resultCounts[finalResults[i]]}`;
        if (i < finalResults.length - 1) {
            finalResultText += ", ";
        }
    }
    resultText += finalResultText + ")";

    resultMessage.innerHTML = resultText;

    betTypes.forEach(type => {
        const betItem = document.querySelector(`.bet-item[data-type="${type}"]`);
        if (betItem) {
            betItem.querySelector('div').innerText = bettingPoints[type];
        }
    });

    resetBets();

    isSpinning = false;
}
