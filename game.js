let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

const COLORES = {
    nave: "#909fc4",
    turbo: "#ffa200",
    bala: "#facc15",
    estrellas: "#ffffff",
    borde: "#1e3a5f",
    asteroide: "#ffffff"
};

const estrellas = [];
const keys = {}; 
const balas = [];
const asteroides = [];

// Detectar teclas presionadas
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function dibujarMarco() {
    ctx.strokeStyle = COLORES.borde;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Genera estrellas aleatorias para el fondo
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

function crearAsteroideEnBorde() {
    const numLados = Math.floor(Math.random() * 7) + 10;
    const puntos = [];

    // Genera forma irregular el asteroide
    for (let j = 0; j < numLados; j++) {
        const angulo = (Math.PI * 2 * j) / numLados;
        const distancia = Math.random() * 30 + 20;
        puntos.push({
            x: Math.cos(angulo) * distancia,
            y: Math.sin(angulo) * distancia
        });
    }

    let x, y;
    let borde = Math.floor(Math.random() * 4);

    if (borde === 0) {
        x = Math.random() * canvas.width;
        y = 0;
    } else if (borde === 1) {
        x = Math.random() * canvas.width;
        y = canvas.height;
    } else if (borde === 2) {
        x = 0;
        y = Math.random() * canvas.height;
    } else {
        x = canvas.width;
        y = Math.random() * canvas.height;
    }

    let centroX = canvas.width / 2;
    let centroY = canvas.height / 2;

    let dx = centroX - x;
    let dy = centroY - y;

    let anguloCentro = Math.atan2(dy, dx);
    let anguloFinal = anguloCentro + (Math.random() - 0.5);

    let velocidad = Math.random() * 1.5 + 0.7;

    asteroides.push({
        x: x,
        y: y,
        velocidadX: Math.cos(anguloFinal) * velocidad,
        velocidadY: Math.sin(anguloFinal) * velocidad,
        puntos: puntos
    });
}

function crearAsteroidesIniciales() {
    for (let i = 0; i < 5; i++) {
        crearAsteroideEnBorde();
    }
}

// Dibujar asteroides como polígonos
function dibujarAsteroides() {
    asteroides.forEach(ast => {
        ctx.beginPath();
        ctx.moveTo(ast.x + ast.puntos[0].x, ast.y + ast.puntos[0].y);
        ast.puntos.forEach(p => {
            ctx.lineTo(ast.x + p.x, ast.y + p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = COLORES.asteroide;
        ctx.stroke();
    });
}

function actualizarAsteroides() {
    asteroides.forEach(ast => {
        ast.x += ast.velocidadX;
        ast.y += ast.velocidadY;

        // Reaparecen por el lado contrario
        if (ast.x > canvas.width) ast.x = 0;
        if (ast.x < 0) ast.x = canvas.width;
        if (ast.y > canvas.height) ast.y = 0;
        if (ast.y < 0) ast.y = canvas.height;
    });
}

function detectarColisiones() {
    for (let i = balas.length - 1; i >= 0; i--) {
        for (let j = asteroides.length - 1; j >= 0; j--) {

            let bala = balas[i];
            let ast = asteroides[j];

            let dx = bala.x - ast.x;
            let dy = bala.y - ast.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            // Si colisiona, se elimina y aparece otro
            if (distancia < 30) {
                balas.splice(i, 1);
                asteroides.splice(j, 1);
                crearAsteroideEnBorde();
                break;
            }
        }
    }
}

function colisionNaveAsteroide() {
    for (let ast of asteroides) {
        let dx = nave.x - ast.x;
        let dy = nave.y - ast.y;
        let distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < 25) {
            alert("GAME OVER");
            reiniciarJuego();
            break;
        }
    }
}

function reiniciarJuego() {
    nave.x = canvas.width / 2;
    nave.y = canvas.height / 2;
    nave.velocidadX = 0;
    nave.velocidadY = 0;
    nave.angulo = 0;
    balas.length = 0;
    asteroides.length = 0;

    crearAsteroidesIniciales();

    for (let key in keys) {
        keys[key] = false;
    }
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

        if (keys["ArrowUp"]) {
            ctx.beginPath();
            ctx.moveTo(-8, 20);
            ctx.lineTo(0, 35);
            ctx.lineTo(8, 20);
            ctx.closePath();
            ctx.fillStyle = COLORES.turbo;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(-15, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.strokeStyle = COLORES.nave;
        ctx.stroke();

        ctx.restore();
    };

    this.update = function () {
        if (keys["ArrowLeft"]) this.angulo -= 0.2;
        if (keys["ArrowRight"]) this.angulo += 0.2;

        if (keys["ArrowUp"]) {
            this.velocidadX += Math.cos(this.angulo - Math.PI / 2);
            this.velocidadY += Math.sin(this.angulo - Math.PI / 2);
        }
        this.x += this.velocidadX;
        this.y += this.velocidadY;
        // fricción
        this.velocidadX *= 0.8;
        this.velocidadY *= 0.8;
        // límites del mapa
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.cooldownDisparo > 0) this.cooldownDisparo--;
        // disparo
        if (keys[" "] && this.cooldownDisparo <= 0) {
            let offsetX = Math.cos(this.angulo - Math.PI / 2) * 10;
            let offsetY = Math.sin(this.angulo - Math.PI / 2) * 10;

            balas.push(new Bala(this.x + offsetX, this.y + offsetY, this.angulo));
            this.cooldownDisparo = 10;
        }
    };
}

function Bala(x, y, angulo) {
    this.x = x;
    this.y = y;

    this.velocidadX = Math.cos(angulo - Math.PI / 2) * 25;
    this.velocidadY = Math.sin(angulo - Math.PI / 2) * 25;

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

// Crear nave en el centro
let nave = new Nave(canvas.width / 2, canvas.height / 2);

crearAsteroidesIniciales();
crearEstrellas();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    nave.update();
    actualizarAsteroides();
    detectarColisiones();
    colisionNaveAsteroide();

    dibujarEstrellas();
    dibujarAsteroides();
    dibujarMarco();

    balas.forEach((bala, index) => {
        bala.update();
        bala.draw();
    });
    nave.draw();
    requestAnimationFrame(loop);
}

loop();