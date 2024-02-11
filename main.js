class WheelItem {
    constructor(label, color, outlineColor) {
        this.label = label;
        this.color = color || '#' + Math.floor(Math.random()*16777215).toString(16); // Default or random color
        this.outlineColor = outlineColor || '#000'; // Default outline color

        //Maintenance
        /*
        drawWheel(); //Redraw the wheel
        document.getElementById('newItem').value = ''; // Reset input field
        */
    }
}

const wheel_canvas = document.getElementById('wheelCanvas');
const wheelCtx = wheel_canvas.getContext('2d');

const pointerCanvas = document.getElementById('pointerCanvas');
const pointerCtx = pointerCanvas.getContext('2d');

const centerX = wheel_canvas.width / 2;
const centerY = wheel_canvas.height / 2;
const radius = Math.min(centerX, centerY) * 0.9;

let items = [
    new WheelItem('Item 1', '#B8D430', '#708238'),
    new WheelItem('Item 2', '#3AB745', '#275D34'),
    // Add more WheelItem instances as needed
];

let currentRotation = 0;

class Wheel {
    constructor(canvas, pointerCanvas) {
        this.items = [];
        this.canvas = canvas;
        this.pointerCanvas = pointerCanvas;
        this.wheelCtx = this.canvas.getContext('2d');
        this.pointerCtx = this.pointerCanvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 0.9;
        this.currentRotation = 0;
    }

    addItem(label, color, outlineColor) {
        const item = new WheelItem(label, color, outlineColor);
        this.items.push(item);
        this.drawWheel();
        this.drawPointer(); // Ensure the pointer is redrawn over the updated wheel
    }

    removeItem(label) {
        this.items = this.items.filter(item => item.label !== label);
        this.drawWheel();
        this.drawPointer(); // Redraw the pointer after the wheel update
    }

    drawWheel() {
        // Implementation similar to your existing drawWheel function
        // Use this.wheelCtx, this.items, and other instance properties
     this.wheelCtx.clearRect(0, 0, wheel_canvas.width, wheel_canvas.height); // Clear the canvas first

    let totalItems = this.items.length;
    let anglePerItem = Math.PI * 2 / totalItems;
    this.wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height); // Clear the wheel canvas

    items.forEach((item, index) => {
        let angle = anglePerItem * index;

        this.wheelCtx.beginPath();
        this.wheelCtx.moveTo(this.centerX, centerY);
        this.wheelCtx.arc(this.centerX, this.centerY, this.radius, this.angle, this.angle + this.anglePerItem);
        this.wheelCtx.lineTo(this.centerX, this.centerY);
        this.wheelCtx.fillStyle = item.color;
        this.wheelCtx.fill();
        this.wheelCtx.strokeStyle = item.outlineColor ? item.outlineColor : '#000'; // Use provided outline or default to black
        this.wheelCtx.stroke();

      //Draw Text
        this.wheelCtx.save();
        this.wheelCtx.translate(this.centerX, this.centerY);
        this.wheelCtx.rotate(this.angle + this.anglePerItem / 2);
        this.wheelCtx.textAlign = 'right';
        this.wheelCtx.fillStyle = '#ffffff';
        this.wheelCtx.font = '16px Arial';
        this.wheelCtx.fillText(item.label, radius - 10, 10);
        this.wheelCtx.restore();
    });
  drawPointer();
    }

    drawPointer() {
        // Implementation similar to your existing drawPointer function
        // Use this.pointerCtx and other instance properties
        this.pointerCtx.clearRect(0, 0, pointerCanvas.width, pointerCanvas.height); // Clear the pointer canvas
        this.pointerCtx.fillStyle = 'red';
        this.pointerCtx.beginPath();
        this.pointerCtx.moveTo(this.centerX, this.centerY - this.radius - 20);
        this.pointerCtx.lineTo(this.centerX + 20, this.centerY - this.radius + 5);
        this.pointerCtx.lineTo(this.centerX - 20, this.centerY - this.radius + 5);
        this.pointerCtx.closePath();
        this.pointerCtx.fill();
    }

    // Additional methods for spinning the wheel, etc.
}

function addItem(label) {
    const color = '#' + Math.floor(Math.random()*16777215).toString(16);
    const outlineColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    items.push(new WheelItem(label, color, outlineColor));
    drawWheel();
    drawPointer(); // Make sure to redraw the pointer as well
    document.getElementById('newItem').value = ''; // Reset input field here
}

function removeItem(label) {
    items = items.filter(item => item.label !== label);
    drawWheel();
    drawPointer(); // Redraw the pointer after the wheel update
}

document.getElementById('addItem').addEventListener('click', function() {
    const newItemValue = document.getElementById('newItem').value.trim();
    if (newItemValue) {
        addItem(newItemValue);
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
