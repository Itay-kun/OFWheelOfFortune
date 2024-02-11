class LuckyWheelItem {
    constructor(label, color= '#' + Math.floor(Math.random()*16777215).toString(16);, outlineColor='#000') {
        this.label = label;
        this.color = color //|| '#' + Math.floor(Math.random()*16777215).toString(16); // Default or random color
        this.outlineColor = outlineColor //|| '#000'; // Default outline color
    }
}

class luckyWheel {
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

    addItem(label,  color= '#' + Math.floor(Math.random()*16777215).toString(16);, outlineColor='#000') {
        const item = new LuckyWheelItem(label, color, outlineColor);
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
        this.wheelCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas first

        let totalItems = this.items.length;
        let anglePerItem = Math.PI * 2 / totalItems;

        this.items.forEach((item, index) => {
            let angle = anglePerItem * index;

            this.wheelCtx.beginPath();
            this.wheelCtx.moveTo(this.centerX, this.centerY);
            this.wheelCtx.arc(this.centerX, this.centerY, this.radius, angle, angle + anglePerItem);
            this.wheelCtx.lineTo(this.centerX, this.centerY);
            this.wheelCtx.fillStyle = item.color;
            this.wheelCtx.fill();
            this.wheelCtx.strokeStyle = item.outlineColor ? item.outlineColor : '#000'; // Use provided outline or default to black
            this.wheelCtx.stroke();

            // Draw Text
            this.wheelCtx.save();
            this.wheelCtx.translate(this.centerX, this.centerY);
            this.wheelCtx.rotate(angle + anglePerItem / 2);
            this.wheelCtx.textAlign = 'right';
            this.wheelCtx.fillStyle = '#ffffff';
            this.wheelCtx.font = '16px Arial';
            this.wheelCtx.fillText(item.label, this.radius - 10, 10);
            this.wheelCtx.restore();
        });
        this.drawPointer();
    }

    drawPointer() {
        this.pointerCtx.clearRect(0, 0, this.pointerCanvas.width, this.pointerCanvas.height); // Clear the pointer canvas
        this.pointerCtx.fillStyle = 'red';
        this.pointerCtx.beginPath();
        this.pointerCtx.moveTo(this.centerX, this.centerY - this.radius - 20);
        this.pointerCtx.lineTo(this.centerX + 20, this.centerY - this.radius + 5);
        this.pointerCtx.lineTo(this.centerX - 20, this.centerY - this.radius + 5);
        this.pointerCtx.closePath();
        this.pointerCtx.fill();
    }

    spinWheel() {
        let spinAngleStart = Math.random() * 10 + 10;
        let spinTime = 0;
        let spinTimeTotal = Math.random() * 3 + 4 * 1000; // Random spin time between 4-7 seconds

        const rotateWheel = () => {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }
            let spinAngle = spinAngleStart - this.easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            this.currentRotation += (spinAngle * Math.PI / 180);
            this.wheelCtx.save();
            this.wheelCtx.translate(this.centerX, this.centerY);
            this.wheelCtx.rotate(this.currentRotation);
            this.wheelCtx.translate(-this.centerX, -this.centerY);
            this.drawWheel();
            this.wheelCtx.restore();
            requestAnimationFrame(rotateWheel);
        };

        const stopRotateWheel = () => {
            let degrees = this.currentRotation * 180 / Math.PI + 90;
            let arcd = 360 / this.items.length;
            let index = Math.floor((360 - degrees % 360) / arcd);
            console.log("Result: " + this.items[index].label);
            this.currentRotation = 0; // Reset rotation
        };

        rotateWheel();
    }

    easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }
}

const wheel_canvas = document.getElementById('wheelCanvas');
const pointerCanvas = document.getElementById('pointerCanvas');
const wheel = new luckyWheel(wheel_canvas, pointerCanvas);

const wheel_canvas = document.getElementById('wheelCanvas');
const pointerCanvas = document.getElementById('pointerCanvas');
const wheel = new luckyWheel(wheel_canvas, pointerCanvas);

// Call the drawWheel method of the luckyWheel instance
wheel.drawWheel();
// Call the drawPointer method of the luckyWheel instance
wheel.drawPointer();

document.getElementById('spinButton').addEventListener('click', function() {
    wheel.spinWheel();
});

document.getElementById('addItemButton').addEventListener('click', function() {
    const newItemValue = document.getElementById('newItem').value.trim();
    if (newItemValue) {
        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        const outlineColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        wheel.addItem(newItemValue, color, outlineColor);
        document.getElementById('newItem').value = ''; // Reset input field here
    }
});
