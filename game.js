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

class Fondo {
    constructor() {
        this.estrellas = [];
    }
    // Genera estrellas aleatorias para el fondo
    crear() {
        for (let i = 0; i < 100; i++) {
            this.estrellas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2
            });
        }
    }

    dibujar() {
        ctx.fillStyle = COLORES.estrellas;
        this.estrellas.forEach(e => {
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

class Bala {
    constructor(x, y, angulo) {
        this.x = x;
        this.y = y;
        this.velocidadX = Math.cos(angulo - Math.PI / 2) * 25;
        this.velocidadY = Math.sin(angulo - Math.PI / 2) * 25;
    }

    update() {
        this.x += this.velocidadX;
        this.y += this.velocidadY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = COLORES.bala;
        ctx.fill();
    }
}

class Asteroide {
    constructor() {
        this.crear();
    }
    crear() {
        const numLados = Math.floor(Math.random() * 7) + 10;
        this.puntos = [];
        // Genera forma irregular el asteroide
        for (let j = 0; j < numLados; j++) {
            const angulo = (Math.PI * 2 * j) / numLados;
            const distancia = Math.random() * 30 + 20;
            this.puntos.push({
                x: Math.cos(angulo) * distancia,
                y: Math.sin(angulo) * distancia
            });
        }

        let borde = Math.floor(Math.random() * 4);
        if (borde === 0) {
            this.x = Math.random() * canvas.width;
            this.y = 0;
        } else if (borde === 1) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
        } else if (borde === 2) {
            this.x = 0;
            this.y = Math.random() * canvas.height;
        } else {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }

        let centroX = canvas.width / 2;
        let centroY = canvas.height / 2;

        let dx = centroX - this.x;
        let dy = centroY - this.y;

        let anguloCentro = Math.atan2(dy, dx);
        let anguloFinal = anguloCentro + (Math.random() - 0.5);
        let velocidad = Math.random() * 1.5 + 0.7;

        this.velocidadX = Math.cos(anguloFinal) * velocidad;
        this.velocidadY = Math.sin(anguloFinal) * velocidad;
    }

    update() {
        this.x += this.velocidadX;
        this.y += this.velocidadY;
        // Reaparecen por el lado contrario
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x + this.puntos[0].x, this.y + this.puntos[0].y);
        this.puntos.forEach(p => {
            ctx.lineTo(this.x + p.x, this.y + p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = COLORES.asteroide;
        ctx.stroke();
    }
}

class Nave {
    constructor(x, y, juego) {
        this.x = x;
        this.y = y;
        this.angulo = 0;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.cooldownDisparo = 0;
        this.juego = juego;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angulo);
        if (this.juego.keys["ArrowUp"]) {
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
    }

    update() {
        if (this.juego.keys["ArrowLeft"]) this.angulo -= 0.2;
        if (this.juego.keys["ArrowRight"]) this.angulo += 0.2;
        if (this.juego.keys["ArrowUp"]) {
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
        if (this.juego.keys[" "] && this.cooldownDisparo <= 0) {
            let offsetX = Math.cos(this.angulo - Math.PI / 2) * 10;
            let offsetY = Math.sin(this.angulo - Math.PI / 2) * 10;
            this.juego.balas.push(
                new Bala(this.x + offsetX, this.y + offsetY, this.angulo)
            );
            this.cooldownDisparo = 10;
        }
    }
}

class Juego {
    constructor() {
        this.fondo = new Fondo();
        this.balas = [];
        this.asteroides = [];
        this.keys = {};
        // Detectar teclas presionadas
        document.addEventListener("keydown", e => this.keys[e.key] = true);
        document.addEventListener("keyup", e => this.keys[e.key] = false);
        // Crear nave en el centro
        this.nave = new Nave(canvas.width / 2, canvas.height / 2, this);
        this.fondo.crear();
        this.crearAsteroidesIniciales();
    }

    crearAsteroidesIniciales() {
        for (let i = 0; i < 5; i++) {
            this.asteroides.push(new Asteroide());
        }
    }

    detectarColisiones() {
        for (let i = this.balas.length - 1; i >= 0; i--) {
            for (let j = this.asteroides.length - 1; j >= 0; j--) {
                let bala = this.balas[i];
                let ast = this.asteroides[j];
                let dx = bala.x - ast.x;
                let dy = bala.y - ast.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);
                // Si colisiona, se elimina y aparece otro
                if (distancia < 30) {
                    this.balas.splice(i, 1);
                    this.asteroides.splice(j, 1);
                    this.asteroides.push(new Asteroide());
                    break;
                }
            }
        }
    }

    colisionNaveAsteroide() {
        for (let ast of this.asteroides) {
            let dx = this.nave.x - ast.x;
            let dy = this.nave.y - ast.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia < 25) {
                alert("GAME OVER");
                this.reiniciarJuego();
                break;
            }
        }
    }

    reiniciarJuego() {
        this.nave.x = canvas.width / 2;
        this.nave.y = canvas.height / 2;
        this.nave.velocidadX = 0;
        this.nave.velocidadY = 0;
        this.nave.angulo = 0;
        this.balas = [];
        this.asteroides = [];
        this.crearAsteroidesIniciales();
        // limpiar teclas correctamente
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    dibujarMarco() {
        ctx.strokeStyle = COLORES.borde;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.nave.update();
        this.asteroides.forEach(a => a.update());
        this.detectarColisiones();
        this.colisionNaveAsteroide();
        this.fondo.dibujar();
        this.asteroides.forEach(a => a.draw());
        this.dibujarMarco();
        this.balas.forEach(bala => {
            bala.update();
            bala.draw();
        });

        this.nave.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// iniciar juego
let juego = new Juego();
juego.loop();