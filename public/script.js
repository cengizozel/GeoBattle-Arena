const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let x = canvas.width/2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    if(x + dx > canvas.width-10 || x + dx < 0) {
        dx = -dx;
    }
    if(y + dy > canvas.height-10 || y + dy < 0) {
        dy = -dy;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();
