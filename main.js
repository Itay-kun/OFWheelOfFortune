const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY) * 0.9;
let items = [];
let currentRotation = 0;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  const sliceAngle = (2 * Math.PI) / items.length;

  items.forEach((item, index) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, sliceAngle * index, sliceAngle * (index + 1));
    ctx.closePath();
    ctx.fillStyle = index % 2 === 0 ? '#fdd700' : '#f88';
    ctx.fill();
    ctx.stroke();

    // Add text
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(sliceAngle * index + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(item, radius - 10, 0);
    ctx.restore();
  });
}

function addItem() {
  const newItem = document.getElementById('newItem').value;
  if (newItem) {
    items.push(newItem);
    drawWheel();
    document.getElementById('newItem').value = ''; // Clear input field
  }
}

function spinWheel() {
  const spinTo = Math.floor(1024 + Math.random() * 1024);
  const duration = 4000; // Duration in ms
  const start = Date.now();

  function rotate() {
    const now = Date.now();
    const elapsed = now - start;
    if (elapsed < duration) {
      const easeInOut = elapsed / duration;
      currentRotation += (spinTo / duration) * easeInOut;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentRotation * Math.PI / 180);
      ctx.translate(-centerX, -centerY);
      drawWheel();
      ctx.restore();
      requestAnimationFrame(rotate);
    } else {
      // Spin complete
      const winningIndex = items.length - Math.floor((currentRotation % 360) / (360 / items.length));
      document.getElementById('result').textContent = "Result: " + items[winningIndex];
    }
  }

  rotate();
}

drawWheel(); // Initial draw
