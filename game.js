const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLORES = {
    nave: "#909fc4",
    turbo: "#ffa200",
    bala: "#facc15",
    estrellas: "#ffffff",
    borde: "#1e3a5f",
    asteroide: "#ffffff",
    textoHUD: "#ffffff",
    gameOverFondo: "rgba(0, 0, 0, 0.82)",
    gameOverTexto: "#ff4d4d",
    pausaTexto: "#facc15"
};

class Fondo {
    constructor(cantidad = 100) {
        this.cantidad = cantidad;
        this.estrellas = [];
    }

    crear() {
        this.estrellas = [];

        for (let i = 0; i < this.cantidad; i++) {
            this.estrellas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2
            });
        }
    }

    dibujar() {
        ctx.fillStyle = COLORES.estrellas;

        this.estrellas.forEach(estrella => {
            ctx.beginPath();
            ctx.arc(estrella.x, estrella.y, estrella.r, 0, Math.PI * 2);
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
        this.activa = true;
    }

    update() {
        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (
            this.x > canvas.width ||
            this.x < 0 ||
            this.y > canvas.height ||
            this.y < 0
        ) {
            this.activa = false;
        }
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
        this.activo = true;
        this.crear();
    }

    crear() {
        const numLados = Math.floor(Math.random() * 7) + 10;
        this.puntos = [];
        this.radioColision = 0;

        for (let j = 0; j < numLados; j++) {
            const angulo = (Math.PI * 2 * j) / numLados;
            const distancia = Math.random() * 30 + 20;

            if (distancia > this.radioColision) {
                this.radioColision = distancia;
            }

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

        const centroX = canvas.width / 2;
        const centroY = canvas.height / 2;

        const dx = centroX - this.x;
        const dy = centroY - this.y;

        const anguloCentro = Math.atan2(dy, dx);
        const anguloFinal = anguloCentro + (Math.random() - 0.5);
        const velocidad = Math.random() * 1.5 + 0.7;

        this.velocidadX = Math.cos(anguloFinal) * velocidad;
        this.velocidadY = Math.sin(anguloFinal) * velocidad;
    }

    update() {
        if (!this.activo) return;

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        if (!this.activo) return;

        ctx.beginPath();
        ctx.moveTo(this.x + this.puntos[0].x, this.y + this.puntos[0].y);

        this.puntos.forEach(punto => {
            ctx.lineTo(this.x + punto.x, this.y + punto.y);
        });

        ctx.closePath();
        ctx.strokeStyle = COLORES.asteroide;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Nave {
    constructor(x, y, juego) {
        this.juego = juego;
        this.x = x;
        this.y = y;
        this.angulo = 0;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.cooldownDisparo = 0;
        this.radioColision = 18;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angulo);

        if (this.juego.tiempoInvulnerable > 0) {
            ctx.globalAlpha = 0.5;
        }

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
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    update() {
        if (this.juego.keys["ArrowLeft"]) {
            this.angulo -= 0.2;
        }

        if (this.juego.keys["ArrowRight"]) {
            this.angulo += 0.2;
        }

        if (this.juego.keys["ArrowUp"]) {
            this.velocidadX += Math.cos(this.angulo - Math.PI / 2);
            this.velocidadY += Math.sin(this.angulo - Math.PI / 2);
        }

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        this.velocidadX *= 0.8;
        this.velocidadY *= 0.8;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        if (this.cooldownDisparo > 0) {
            this.cooldownDisparo--;
        }

        if (this.juego.keys[" "] && this.cooldownDisparo <= 0) {
            const offsetX = Math.cos(this.angulo - Math.PI / 2) * 10;
            const offsetY = Math.sin(this.angulo - Math.PI / 2) * 10;

            this.juego.balas.push(
                new Bala(this.x + offsetX, this.y + offsetY, this.angulo)
            );

            this.cooldownDisparo = 10;
        }
    }

    resetearPosicion() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.angulo = 0;
    }
}

class HUD {
    constructor(juego) {
        this.juego = juego;
    }

    dibujarMarco() {
        ctx.strokeStyle = COLORES.borde;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    dibujarHUD() {
        ctx.save();
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.fillStyle = COLORES.textoHUD;
        ctx.textAlign = "left";
        ctx.fillText("PUNTAJE: " + this.juego.puntaje, 20, 30);
        ctx.fillText("VIDAS: " + this.juego.vidas, 20, 55);
        ctx.fillText("RECORD: " + this.juego.mejorPuntaje, 20, 80);
        ctx.restore();
    }

    dibujarPantallaInicio() {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.fillText("ASTEROIDES 2D", canvas.width / 2, canvas.height / 2 - 30);

        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillText("PRESIONA INICIAR", canvas.width / 2, canvas.height / 2 + 20);
        ctx.restore();
    }

    dibujarPantallaPausa() {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = COLORES.pausaTexto;
        ctx.textAlign = "center";
        ctx.font = '22px "Press Start 2P", monospace';
        ctx.fillText("PAUSA", canvas.width / 2, canvas.height / 2);
        ctx.restore();
    }

    dibujarPantallaFin() {
        ctx.save();
        ctx.fillStyle = COLORES.gameOverFondo;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = COLORES.gameOverTexto;
        ctx.textAlign = "center";
        ctx.font = '26px "Press Start 2P", monospace';
        ctx.fillText("FIN DEL JUEGO", canvas.width / 2, canvas.height / 2 - 10);

        ctx.fillStyle = "#ffffff";
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.fillText("PRESIONA REINICIAR", canvas.width / 2, canvas.height / 2 + 35);
        ctx.restore();
    }
}

class Juego {
    constructor() {
        this.keys = {};
        this.balas = [];
        this.asteroides = [];

        this.puntaje = 0;
        this.vidas = 3;
        this.juegoIniciado = false;
        this.juegoPausado = false;
        this.finDelJuego = false;
        this.puedeRecibirDanio = true;
        this.tiempoInvulnerable = 0;
        this.mejorPuntaje = Number(localStorage.getItem("mejorPuntaje")) || 0;

        this.fondo = new Fondo();
        this.hud = new HUD(this);
        this.nave = new Nave(canvas.width / 2, canvas.height / 2, this);

        this.btnIniciar = document.getElementById("btnIniciar");
        this.btnPausar = document.getElementById("btnPausar");
        this.btnReiniciar = document.getElementById("btnReiniciar");

        this.configurarEventos();
        this.fondo.crear();
        this.crearAsteroidesIniciales();
    }

    configurarEventos() {
        document.addEventListener("keydown", e => {
            this.keys[e.key] = true;
        });

        document.addEventListener("keyup", e => {
            this.keys[e.key] = false;
        });

        if (this.btnIniciar) {
            this.btnIniciar.addEventListener("click", () => {
                if (!this.juegoIniciado) {
                    this.juegoIniciado = true;
                    this.juegoPausado = false;
                    this.finDelJuego = false;
                }
            });
        }

        if (this.btnPausar) {
            this.btnPausar.addEventListener("click", () => {
                if (!this.juegoIniciado || this.finDelJuego) return;
                this.juegoPausado = !this.juegoPausado;
            });
        }

        if (this.btnReiniciar) {
            this.btnReiniciar.addEventListener("click", () => {
                this.reiniciarJuego();
            });
        }
    }

    guardarMejorPuntaje() {
        if (this.puntaje > this.mejorPuntaje) {
            this.mejorPuntaje = this.puntaje;
            localStorage.setItem("mejorPuntaje", this.mejorPuntaje);
        }
    }

    crearAsteroidesIniciales(cantidad = 5) {
        this.asteroides = [];
        for (let i = 0; i < cantidad; i++) {
            this.asteroides.push(new Asteroide());
        }
    }

    detectarColisionesBalasAsteroides() {
        for (let i = this.balas.length - 1; i >= 0; i--) {
            const bala = this.balas[i];

            for (let j = this.asteroides.length - 1; j >= 0; j--) {
                const asteroide = this.asteroides[j];

                if (!bala.activa || !asteroide.activo) continue;

                const dx = bala.x - asteroide.x;
                const dy = bala.y - asteroide.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < asteroide.radioColision) {
                    bala.activa = false;
                    asteroide.activo = false;
                    this.puntaje += 10;
                    this.guardarMejorPuntaje();
                    break;
                }
            }
        }

        this.balas = this.balas.filter(bala => bala.activa);
        this.asteroides = this.asteroides.filter(asteroide => asteroide.activo);

        if (this.asteroides.length === 0 && !this.finDelJuego) {
            this.crearAsteroidesIniciales(5);
        }
    }

    detectarColisionNaveAsteroides() {
        if (!this.puedeRecibirDanio || this.finDelJuego) return;

        for (let i = 0; i < this.asteroides.length; i++) {
            const asteroide = this.asteroides[i];
            if (!asteroide.activo) continue;

            const dx = this.nave.x - asteroide.x;
            const dy = this.nave.y - asteroide.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < this.nave.radioColision + asteroide.radioColision * 0.6) {
                this.vidas--;
                asteroide.activo = false;

                if (this.vidas <= 0) {
                    this.vidas = 0;
                    this.finDelJuego = true;
                    this.juegoIniciado = false;
                    this.guardarMejorPuntaje();
                } else {
                    this.nave.resetearPosicion();
                    this.puedeRecibirDanio = false;
                    this.tiempoInvulnerable = 120;
                }

                break;
            }
        }

        this.asteroides = this.asteroides.filter(asteroide => asteroide.activo);

        if (this.asteroides.length === 0 && !this.finDelJuego) {
            this.crearAsteroidesIniciales(5);
        }
    }

    reiniciarJuego() {
        this.puntaje = 0;
        this.vidas = 3;
        this.juegoIniciado = false;
        this.juegoPausado = false;
        this.finDelJuego = false;
        this.puedeRecibirDanio = true;
        this.tiempoInvulnerable = 0;

        this.balas = [];
        this.nave = new Nave(canvas.width / 2, canvas.height / 2, this);

        this.fondo.crear();
        this.crearAsteroidesIniciales();

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    actualizar() {
        if (this.tiempoInvulnerable > 0) {
            this.tiempoInvulnerable--;
        } else {
            this.puedeRecibirDanio = true;
        }

        this.nave.update();

        this.balas.forEach(bala => bala.update());
        this.asteroides.forEach(asteroide => asteroide.update());

        this.detectarColisionesBalasAsteroides();
        this.detectarColisionNaveAsteroides();
    }

    dibujar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.fondo.dibujar();
        this.hud.dibujarMarco();
        this.hud.dibujarHUD();

        this.asteroides.forEach(asteroide => asteroide.draw());
        this.balas.forEach(bala => bala.draw());
        this.nave.draw();

        if (this.finDelJuego) {
            this.hud.dibujarPantallaFin();
        } else if (!this.juegoIniciado) {
            this.hud.dibujarPantallaInicio();
        } else if (this.juegoPausado) {
            this.hud.dibujarPantallaPausa();
        }
    }

    loop() {
        this.dibujar();

        if (!this.finDelJuego && this.juegoIniciado && !this.juegoPausado) {
            this.actualizar();
        }

        requestAnimationFrame(() => this.loop());
    }
}

const juego = new Juego();
juego.loop();