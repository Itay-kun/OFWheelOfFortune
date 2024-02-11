const wheel_canvas = document.getElementById('wheelCanvas');
const wheelCtx = wheel_canvas.getContext('2d');
const centerX = wheel_canvas.width / 2;
const centerY = wheel_canvas.height / 2;
const radius = Math.min(centerX, centerY) * 0.9;
let items = [
  { label: 'Item 1', color: '#B8D430', outlineColor: '#708238' },
  { label: 'Item 2', color: '#3AB745', outlineColor: '#275D34' },
  // Initialize with a couple of items
];
let currentRotation = 0;

function drawWheel() {
    wheelCtx.clearRect(0, 0, wheel_canvas.width, wheel_canvas.height); // Clear the canvas first

    let totalItems = items.length;
    let anglePerItem = Math.PI * 2 / totalItems;
    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height); // Clear the wheel canvas

    items.forEach((item, index) => {
        let angle = anglePerItem * index;

        wheelCtx.beginPath();
        wheelCtx.moveTo(centerX, centerY);
        wheelCtx.arc(centerX, centerY, radius, angle, angle + anglePerItem);
        wheelCtx.lineTo(centerX, centerY);
        wheelCtx.fillStyle = item.color;
        wheelCtx.fill();
        wheelCtx.strokeStyle = item.outlineColor ? item.outlineColor : '#000'; // Use provided outline or default to black
        wheelCtx.stroke();

      //Draw Text
        wheelCtx.save();
        wheelCtx.translate(centerX, centerY);
        wheelCtx.rotate(angle + anglePerItem / 2);
        wheelCtx.textAlign = 'right';
        wheelCtx.fillStyle = '#ffffff';
        wheelCtx.font = '16px Arial';
        wheelCtx.fillText(item.label, radius - 10, 10);
        wheelCtx.restore();
    });
  drawPointer();
}

function drawPointer() {
    pointerCtx.clearRect(0, 0, pointerCanvas.width, pointerCanvas.height); // Clear the pointer canvas
    pointerCtx.fillStyle = 'red';
    pointerCtx.beginPath();
    pointerCtx.moveTo(centerX, centerY - radius - 20);
    pointerCtx.lineTo(centerX + 20, centerY - radius + 5);
    pointerCtx.lineTo(centerX - 20, centerY - radius + 5);
    pointerCtx.closePath();
    pointerCtx.fill();
}

/*function addItem(label) {
    const color = '#' + Math.floor(Math.random()*16777215).toString(16); // Generates a random color
    const outlineColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Generates a random outline color
    items.push({ label, color, outlineColor });
    drawWheel();
    drawPointer(); // Ensure the pointer is redrawn over the updated wheel
}*/

function addItem() {
    const newItemValue = document.getElementById('newItem').value.trim();
    if (newItemValue) {
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        items.push({ label: newItemValue, color: color });
        drawWheel();
        document.getElementById('newItem').value = ''; // Reset input field
    }
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
        wheelCtx.save();
        wheelCtx.translate(centerX, centerY);
        wheelCtx.rotate(currentRotation);
        wheelCtx.translate(-centerX, -centerY);
        drawWheel();
        wheelCtx.restore();
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
