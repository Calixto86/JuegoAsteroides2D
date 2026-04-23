export class EstadoJuego {
    constructor() {
        this.puntaje = 0;
        this.vidas = 3;
        this.juegoIniciado = false;
        this.juegoPausado = false;
        this.finDelJuego = false;
        this.puedeRecibirDanio = true;
        this.tiempoInvulnerable = 0;
        this.mejorPuntaje = Number(localStorage.getItem("mejorPuntaje")) || 0;

        this.keys = {};
        this.balas = [];
        this.asteroides = [];
    }

    guardarMejorPuntaje() {
        if (this.puntaje > this.mejorPuntaje) {
            this.mejorPuntaje = this.puntaje;
            localStorage.setItem("mejorPuntaje", this.mejorPuntaje);
        }
    }

    reiniciarEstado() {
        this.puntaje = 0;
        this.vidas = 3;
        this.juegoIniciado = false;
        this.juegoPausado = false;
        this.finDelJuego = false;
        this.puedeRecibirDanio = true;
        this.tiempoInvulnerable = 0;

        this.balas = [];
        this.asteroides = [];

        for (const key in this.keys) {
            this.keys[key] = false;
        }
    }
}