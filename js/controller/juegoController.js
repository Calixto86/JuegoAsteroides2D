import { EstadoJuego } from "../model/estadojuego.js";
import { Fondo } from "../model/fondo.js";
import { Nave } from "../model/nave.js";
import { Asteroide } from "../model/asteroide.js";
import { CanvasView } from "../view/canvasView.js";
import { HUDView } from "../view/hudView.js";
import { InputController } from "./inputController.js";

export class JuegoController {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.COLORES = {
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

        this.estado = new EstadoJuego();
        this.fondo = new Fondo();
        this.nave = new Nave(this.canvas.width / 2, this.canvas.height / 2, this.estado);

        this.canvasView = new CanvasView(this.canvas, this.ctx, this.COLORES);
        this.hudView = new HUDView(this.canvas, this.ctx, this.COLORES);

        this.inputController = new InputController(this.estado, {
            onIniciar: () => this.iniciarJuego(),
            onPausar: () => this.pausarJuego(),
            onReiniciar: () => this.reiniciarJuego()
        });
    }

    iniciar() {
        this.inputController.configurar();
        this.fondo.crear(this.canvas);
        this.crearAsteroidesIniciales();
        this.loop();
    }

    iniciarJuego() {
        if (!this.estado.juegoIniciado) {
            this.estado.juegoIniciado = true;
            this.estado.juegoPausado = false;
            this.estado.finDelJuego = false;
        }
    }

    pausarJuego() {
        if (!this.estado.juegoIniciado || this.estado.finDelJuego) return;
        this.estado.juegoPausado = !this.estado.juegoPausado;
    }

    crearAsteroidesIniciales(cantidad = 5) {
        this.estado.asteroides = [];
        for (let i = 0; i < cantidad; i++) {
            this.estado.asteroides.push(new Asteroide(this.canvas));
        }
    }

    distanciaEntre(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    detectarColisionesBalasAsteroides() {
        for (let i = this.estado.balas.length - 1; i >= 0; i--) {
            const bala = this.estado.balas[i];

            for (let j = this.estado.asteroides.length - 1; j >= 0; j--) {
                const asteroide = this.estado.asteroides[j];

                if (!bala.activa || !asteroide.activo) continue;

                const distancia = this.distanciaEntre(
                    bala.x, bala.y,
                    asteroide.x, asteroide.y
                );

                if (distancia < asteroide.radioColision) {
                    bala.activa = false;
                    asteroide.activo = false;
                    this.estado.puntaje += 10;
                    this.estado.guardarMejorPuntaje();
                    break;
                }
            }
        }

        this.estado.balas = this.estado.balas.filter(bala => bala.activa);
        this.estado.asteroides = this.estado.asteroides.filter(asteroide => asteroide.activo);

        if (this.estado.asteroides.length === 0 && !this.estado.finDelJuego) {
            this.crearAsteroidesIniciales(5);
        }
    }

    detectarColisionNaveAsteroides() {
        if (!this.estado.puedeRecibirDanio || this.estado.finDelJuego) return;

        for (let i = 0; i < this.estado.asteroides.length; i++) {
            const asteroide = this.estado.asteroides[i];
            if (!asteroide.activo) continue;

            const distancia = this.distanciaEntre(
                this.nave.x, this.nave.y,
                asteroide.x, asteroide.y
            );

            if (distancia < this.nave.radioColision + asteroide.radioColision * 0.6) {
                this.estado.vidas--;
                asteroide.activo = false;

                if (this.estado.vidas <= 0) {
                    this.estado.vidas = 0;
                    this.estado.finDelJuego = true;
                    this.estado.juegoIniciado = false;
                    this.estado.guardarMejorPuntaje();
                } else {
                    this.nave.resetearPosicion(this.canvas);
                    this.estado.puedeRecibirDanio = false;
                    this.estado.tiempoInvulnerable = 120;
                }

                break;
            }
        }

        this.estado.asteroides = this.estado.asteroides.filter(asteroide => asteroide.activo);

        if (this.estado.asteroides.length === 0 && !this.estado.finDelJuego) {
            this.crearAsteroidesIniciales(5);
        }
    }

    reiniciarJuego() {
        this.estado.reiniciarEstado();
        this.nave = new Nave(this.canvas.width / 2, this.canvas.height / 2, this.estado);
        this.fondo.crear(this.canvas);
        this.crearAsteroidesIniciales();
    }

    actualizar() {
        if (this.estado.tiempoInvulnerable > 0) {
            this.estado.tiempoInvulnerable--;
        } else {
            this.estado.puedeRecibirDanio = true;
        }

        this.nave.update(this.canvas);

        this.estado.balas.forEach(bala => bala.update(this.canvas));
        this.estado.asteroides.forEach(asteroide => asteroide.update(this.canvas));

        this.detectarColisionesBalasAsteroides();
        this.detectarColisionNaveAsteroides();
    }

    dibujar() {
        this.canvasView.limpiar();
        this.canvasView.dibujarFondo(this.fondo);
        this.canvasView.dibujarMarco();
        this.hudView.dibujarHUD(this.estado);

        this.canvasView.dibujarAsteroides(this.estado.asteroides);
        this.canvasView.dibujarBalas(this.estado.balas);
        this.canvasView.dibujarNave(
            this.nave,
            this.estado.keys["ArrowUp"],
            this.estado.tiempoInvulnerable
        );

        if (this.estado.finDelJuego) {
            this.hudView.dibujarPantallaFin();
        } else if (!this.estado.juegoIniciado) {
            this.hudView.dibujarPantallaInicio();
        } else if (this.estado.juegoPausado) {
            this.hudView.dibujarPantallaPausa();
        }
    }

    loop() {
        this.dibujar();

        if (!this.estado.finDelJuego && this.estado.juegoIniciado && !this.estado.juegoPausado) {
            this.actualizar();
        }

        requestAnimationFrame(() => this.loop());
    }
}