const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) * 0.9;
let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4']; // Starting items
let animationRequestId;

function drawWheel() {
    let totalItems = items.length;
    let anglePerItem = Math.PI * 2 / totalItems;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each segment
    items.forEach((item, index) => {
        let angle = anglePerItem * index;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + anglePerItem);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = index % 2 === 0 ? '#B8D430' : '#3AB745';
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + anglePerItem / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(item, radius - 10, 10);
        ctx.restore();
    });

    // Draw the pointer
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX + 20, centerY - radius + 5);
    ctx.lineTo(centerX - 20, centerY - radius + 5);
    ctx.fill();
}

function addItem() {
    const newItem = document.getElementById('newItem').value.trim();
    if (newItem) {
        items.push(newItem);
        drawWheel();
        document.getElementById('newItem').value = ''; // Clear the input field
    }
}

function spinWheel() {
    let spinAngleStart = Math.random() * 10 + 10;
    let spinTime = 0;
    let spinTimeTotal = Math.random() * 3 + 4 * 1000; // Random spin time between 4-7 seconds

    function rotateWheel() {
        spinTime += 30;
        if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
            return;
        }
        let spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        currentRotation += (spinAngle * Math.PI / 180);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);
        ctx.translate(-centerX, -centerY);
        drawWheel();
        ctx.restore();
        animationRequestId = requestAnimationFrame(rotateWheel);
    }

    function stopRotateWheel() {
        cancelAnimationFrame(animationRequestId);
        let degrees = currentRotation * 180 / Math.PI + 90;
        let arcd = 360 / items.length;
        let index = Math.floor((360 - degrees % 360) / arcd);
        document.getElementById('result').innerHTML = "Result: " + items[index];
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    rotateWheel();
}

drawWheel(); // Initial draw
