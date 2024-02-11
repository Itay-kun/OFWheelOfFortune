const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) * 0.9;
let items = [
  { label: 'Item 1', color: '#B8D430', outlineColor: '#708238' },
  { label: 'Item 2', color: '#3AB745', outlineColor: '#275D34' },
  // Initialize with a couple of items
];
let currentRotation = 0;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas first

    let totalItems = items.length;
    let anglePerItem = Math.PI * 2 / totalItems;

    items.forEach((item, index) => {
        let angle = anglePerItem * index;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + anglePerItem);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = item.outlineColor ? item.outlineColor : '#000'; // Use provided outline or default to black
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + anglePerItem / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(item.label, radius - 10, 10);
        ctx.restore();
    });
}

function drawPointer() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX + 20, centerY - radius + 5);
    ctx.lineTo(centerX - 20, centerY - radius + 5);
    ctx.closePath();
    ctx.fill();
}

function addItem(label) {
    const color = '#' + Math.floor(Math.random()*16777215).toString(16); // Generates a random color
    const outlineColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Generates a random outline color
    items.push({ label, color, outlineColor });
    drawWheel();
    drawPointer(); // Ensure the pointer is redrawn over the updated wheel
}

function removeItem(label) {
    items = items.filter(item => item.label !== label);
    drawWheel();
    drawPointer(); // Redraw the pointer after the wheel update
}

document.getElementById('addItem').addEventListener('click', function() {
    const newItem = document.getElementById('newItem').value;
    if (newItem) {
        addItem(newItem);
        document.getElementById('newItem').value = ''; // Clear input field after adding
    }
});

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
        document.getElementById('result').innerHTML = "Result: " + items[index].label;
        currentRotation = 0; // Reset rotation
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    rotateWheel();
}


drawWheel();
drawPointer(); // Initial draw of the pointer
