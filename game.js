let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

const COLORES = {
    nave: "#00ffff",
    bala: "#facc15",
    estrellas: "#ffffff",
    borde: "#1e3a5f"
};

function dibujarMarco() {
    ctx.strokeStyle = COLORES.borde;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

const estrellas = [];
const keys = {}; 

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const balas = [];

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
    ctx.fillStyle = COLORES.estrellas;

    estrellas.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function Nave(x, y) {
    this.x = x;
    this.y = y;
    this.angulo = 0;
    this.velocidadX = 0;
    this.velocidadY = 0;
    this.cooldownDisparo = 0;

    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angulo);

        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();

        ctx.strokeStyle = COLORES.nave;
        ctx.stroke();

        ctx.restore();
    }

    this.update = function () {
        if (keys["ArrowLeft"]) {
            this.angulo -= 0.2;
        }
        if (keys["ArrowRight"]) {
            this.angulo += 0.2;
        }

        // acelerar
        if (keys["ArrowUp"]) {
            this.velocidadX += Math.cos(this.angulo - Math.PI / 2) * 0.1;
            this.velocidadY += Math.sin(this.angulo - Math.PI / 2) * 0.1;
        }

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        this.velocidadX *= 0.98;
        this.velocidadY *= 0.98;

        // límites (wrap)
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        if (this.cooldownDisparo > 0) {
            this.cooldownDisparo--;
        }

        // disparo
        if (keys[" "] && this.cooldownDisparo <= 0) {

            let offsetX = Math.cos(this.angulo - Math.PI / 2) * 20;
            let offsetY = Math.sin(this.angulo - Math.PI / 2) * 20;

            balas.push(
                new Bala(
                    this.x + offsetX,
                    this.y + offsetY,
                    this.angulo
                )
            );

            this.cooldownDisparo = 10;
        }
    }
}

function Bala(x, y, angulo) {
    this.x = x;
    this.y = y;

    this.velocidadX = Math.cos(angulo - Math.PI / 2) * 8;
    this.velocidadY = Math.sin(angulo - Math.PI / 2) * 8;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = COLORES.bala;
        ctx.fill();
    }

    this.update = function () {
        this.x += this.velocidadX;
        this.y += this.velocidadY;
    }
}

let nave = new Nave(canvas.width / 2, canvas.height / 2);

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nave.update();

    dibujarEstrellas();
    dibujarMarco();

    balas.forEach(bala => {
        bala.update();
        bala.draw();
    });

    nave.draw();

    requestAnimationFrame(loop);
}

crearEstrellas();
loop();