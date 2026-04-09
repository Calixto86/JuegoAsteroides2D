let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');



function dibujarMarco() {
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

const estrellas = [];
const keys = {};//guarda el estado del teclado
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);


function crearEstrellas() {
    for (let i = 0; i < 100; i++) {
        estrellas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2
        });
    }
}

function dibujarEstrellas() {
    ctx.fillStyle = "white";

    estrellas.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.velocityX = 0;
    this.velocityY = 0;



    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.strokeStyle = "#00ffff";
        ctx.stroke();
        ctx.restore();
    }

    this.update = function () {
        if (keys["ArrowLeft"]) {
            this.angle -= 0.2;
        }
        if (keys["ArrowRight"]) {
            this.angle += 0.2;
        }
        //acelera hacia adelante
        if (keys["ArrowUp"]) {
            this.velocityX += Math.cos(this.angle - Math.PI / 2) * 0.1;
            this.velocityY += Math.sin(this.angle - Math.PI / 2) * 0.1;
        }
        //aplicamos moviemiento
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= 0.98;
        this.velocityY *= 0.98;

        // Controlar que no sobrepase los limites
        if (this.x > canvas.width)
            this.x = 0;
        if (this.x < 0)
            this.x = canvas.width;
        if (this.y > canvas.height)
            this.y = 0;
        if (this.y < 0)
            this.y = canvas.height;

    }
}

let ship = new Ship(canvas.width / 2, canvas.height / 2);

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship.update();

    dibujarEstrellas();
    dibujarMarco();
    ship.draw();

    requestAnimationFrame(loop);
}
crearEstrellas();
loop();



