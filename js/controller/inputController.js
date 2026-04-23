export class InputController {
    constructor(estadoJuego, callbacks = {}) {
        this.estadoJuego = estadoJuego;
        this.callbacks = callbacks;

        this.btnIniciar = document.getElementById("btnIniciar");
        this.btnPausar = document.getElementById("btnPausar");
        this.btnReiniciar = document.getElementById("btnReiniciar");
    }

    configurar() {
        document.addEventListener("keydown", e => {
            this.estadoJuego.keys[e.key] = true;
        });

        document.addEventListener("keyup", e => {
            this.estadoJuego.keys[e.key] = false;
        });

        if (this.btnIniciar) {
            this.btnIniciar.addEventListener("click", () => {
                if (this.callbacks.onIniciar) {
                    this.callbacks.onIniciar();
                }
            });
        }

        if (this.btnPausar) {
            this.btnPausar.addEventListener("click", () => {
                if (this.callbacks.onPausar) {
                    this.callbacks.onPausar();
                }
            });
        }

        if (this.btnReiniciar) {
            this.btnReiniciar.addEventListener("click", () => {
                if (this.callbacks.onReiniciar) {
                    this.callbacks.onReiniciar();
                }
            });
        }
    }
}