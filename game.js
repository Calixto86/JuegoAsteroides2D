let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

const COLORES = {
    nave: "#00ffff",
    bala: "#facc15",
    estrellas: "#ffffff",
    borde: "#1e3a5f",
    asteroide: "#ffffff"
};

function dibujarMarco() {
    ctx.strokeStyle = COLORES.borde;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

const estrellas = [];
const keys = {}; 
const balas = [];
const asteroides = [];  

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
    ctx.fillStyle = COLORES.estrellas;
    estrellas.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
    });
}

function crearAsteroides() {
    for (let i = 0; i < 5; i++) {  // definimos el número de asteroides
        const numLados = Math.floor(Math.random() * 7) + 10;  // Genera entre 7 y 10 lados
        const puntos = [];
        
        // Crear puntos aleatorios para el polígono
        for (let j = 0; j < numLados; j++) {
            const angulo = (Math.PI * 2 * j) / numLados;
            const distancia = Math.random() * 30 + 20;  // Aleatorio entre 20 y 50 píxeles
            puntos.push({
                x: Math.cos(angulo) * distancia,
                y: Math.sin(angulo) * distancia
            });
        }

        // Crear asteroides con posiciones aleatorias
        asteroides.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            velocidadX: Math.random() * 0.5 - 0.5,  // Velocidades aleatorias
            velocidadY: Math.random() * 0.5 - 0.5,
            puntos: puntos  // Guardar los puntos generados para el polígono
        });
    }
}

// Función para dibujar los asteroides
function dibujarAsteroides() {
    asteroides.forEach(asteroide => {
        ctx.beginPath();
        ctx.moveTo(asteroide.x + asteroide.puntos[0].x, asteroide.y + asteroide.puntos[0].y);
        
        // Dibuja el polígono con los puntos
        asteroide.puntos.forEach(punto => {
            ctx.lineTo(asteroide.x + punto.x, asteroide.y + punto.y);
        });
        
        ctx.closePath();
        ctx.strokeStyle = COLORES.asteroide;
        ctx.stroke();
    });
}

// Función para actualizar la posición de los asteroides
function actualizarAsteroides() {
    asteroides.forEach(asteroide => {
        asteroide.x += asteroide.velocidadX;
        asteroide.y += asteroide.velocidadY;

        // Si un asteroide se sale de la pantalla, aparece del otro lado
        if (asteroide.x > canvas.width) asteroide.x = 0;
        if (asteroide.x < 0) asteroide.x = canvas.width;
        if (asteroide.y > canvas.height) asteroide.y = 0;
        if (asteroide.y < 0) asteroide.y = canvas.height;
    });
}

// Función para la nave (Ship)
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
    };

    this.update = function () {
        if (keys["ArrowLeft"]) {
            this.angulo -= 0.2;
        }
        if (keys["ArrowRight"]) {
            this.angulo += 0.2;
        }

        // Acelera
        if (keys["ArrowUp"]) {
            this.velocidadX += Math.cos(this.angulo - Math.PI / 2) * 0.1;
            this.velocidadY += Math.sin(this.angulo - Math.PI / 2) * 0.1;
        }

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        this.velocidadX *= 0.98;
        this.velocidadY *= 0.98;

        // Limitar la nave para que no se salga
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        if (this.cooldownDisparo > 0) {
            this.cooldownDisparo--;
        }

        // Disparar
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
    };
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
    };

    this.update = function () {
        this.x += this.velocidadX;
        this.y += this.velocidadY;
    };
}

let nave = new Nave(canvas.width / 2, canvas.height / 2);

crearAsteroides();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nave.update();

    dibujarEstrellas();
    dibujarAsteroides();
    dibujarMarco();

    balas.forEach(bala => {
        bala.update();
        bala.draw();
    });

    nave.draw();

    actualizarAsteroides(); 

    requestAnimationFrame(loop);
}

crearEstrellas();
loop();