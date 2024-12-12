// Danh sách hình ảnh cho trò chơi
const images = [
    { src: './bau.png', type: 'bau' },
    { src: './cua.png', type: 'cua' },
    { src: './tom.png', type: 'tom' },
    { src: './ca.png', type: 'ca' },
    { src: './huou.png', type: 'huou' },
    { src: './ga.png', type: 'ga' }
];

// Các biến toàn cục
let bettingPoints = { bau: 0, cua: 0, tom: 0, ca: 0, huou: 0, ga: 0 };
let isSpinning = false;

// Lấy các phần tử DOM
const resultImages = document.querySelectorAll('.result-img');
const spinButton = document.querySelector('.spin-button');
const resetButton = document.querySelector('.reset-button');
const betItems = document.querySelectorAll('.bet-item');
const resultMessage = document.getElementById('result-message');

// Hàm quay hình ảnh
function spinImages() {
    let spinCount = 0;
    const spinInterval = setInterval(() => {
        for (let img of resultImages) {
            const randomIndex = Math.floor(Math.random() * images.length);
            img.src = images[randomIndex].src;
        }

        spinCount++;

        // Sau khi quay đủ số lần, dừng lại
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
        const imgName = img.src.split('/').pop(); // Chỉ lấy tên file
        const result = images.find(image => image.src.split('/').pop() === imgName);
        return result ? result.type : null;
    }).filter(result => result !== null); // Lọc kết quả null

    // Kiểm tra nếu có kết quả hợp lệ
    if (finalResults.length === 0) {
        console.log("Không có kết quả hợp lệ!");
        return;
    }

    // Lấy các loại cược và kiểm tra kết quả của người chơi
    const betTypes = Object.keys(bettingPoints).filter(type => bettingPoints[type] > 0);
    const correctBets = [];
    betTypes.forEach(type => {
        if (finalResults.includes(type)) {
            correctBets.push(type);
        }
    });

    // Đếm số lần xuất hiện của mỗi loại hình trong kết quả
    const resultCounts = finalResults.reduce((acc, result) => {
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    // Tạo thông báo kết quả
    let resultText = "Bạn đã đoán sai (";
    const betText = betTypes.map(type => `${type} ${bettingPoints[type]}`).join(', ');
    resultText += betText + ') Kết quả là (';

    const resultList = Object.keys(resultCounts).map(type => `${type} ${resultCounts[type]}`);
    resultText += resultList.join(", ") + ")";

    console.log(resultText); // Hiển thị kết quả trong console
    resultMessage.innerHTML = resultText; // Hiển thị kết quả lên giao diện
    isSpinning = false; // Kết thúc quá trình quay
}

// Hàm xử lý đặt cược
function placeBet(event) {
    if (isSpinning) return; // Không cho phép đặt cược khi đang quay

    const betItem = event.currentTarget;
    const type = betItem.dataset.type;

    // Kiểm tra nếu điểm cược chưa đạt tối đa là 3
    if (bettingPoints[type] < 3) {
        bettingPoints[type]++;

        // Cập nhật số điểm cược hiển thị
        betItem.querySelector('div').innerText = bettingPoints[type];

        // Kiểm tra và thông báo nếu đạt tối đa cược
        if (bettingPoints[type] === 3) {
            alert(`Bạn đã đạt tối đa cược cho ${type}!`);
        }
    } else {
        alert(`Bạn không thể cược thêm cho ${type} nữa! Tối đa 3 điểm.`);
    }
}

// Hàm đặt lại điểm cược
function resetBets() {
    Object.keys(bettingPoints).forEach(type => {
        bettingPoints[type] = 0; // Đặt lại điểm cược về 0

        // Cập nhật nội dung hiển thị về 0
        const betItem = document.querySelector(`.bet-item[data-type="${type}"]`);
        if (betItem) {
            betItem.querySelector('div').innerText = '0';
        }
    });
}

// Sự kiện cho nút Quay
spinButton.addEventListener('click', () => {
    if (!isSpinning) {
        isSpinning = true; // Đánh dấu là đang quay
        spinImages();

        // Xóa thông báo trước đó khi bắt đầu quay mới
        resultMessage.innerHTML = '';
    }
});

// Sự kiện cho các hình ảnh đặt cược
betItems.forEach(item => {
    item.addEventListener('click', placeBet);
});

// Sự kiện cho nút Đặt lại
resetButton.addEventListener('click', () => {
    if (!isSpinning) {
        resetBets();
        resultMessage.innerHTML = ''; // Xóa thông báo kết quả
    }
});
