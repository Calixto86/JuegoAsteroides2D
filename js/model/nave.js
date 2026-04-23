import { Bala } from "./bala.js";

export class Nave {
    constructor(x, y, estadoJuego) {
        this.estadoJuego = estadoJuego;
        this.x = x;
        this.y = y;
        this.angulo = 0;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.cooldownDisparo = 0;
        this.radioColision = 18;
    }

    update(canvas) {
        if (this.estadoJuego.keys["ArrowLeft"]) {
            this.angulo -= 0.2;
        }

        if (this.estadoJuego.keys["ArrowRight"]) {
            this.angulo += 0.2;
        }

        if (this.estadoJuego.keys["ArrowUp"]) {
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

        if (this.estadoJuego.keys[" "] && this.cooldownDisparo <= 0) {
            const offsetX = Math.cos(this.angulo - Math.PI / 2) * 10;
            const offsetY = Math.sin(this.angulo - Math.PI / 2) * 10;

            this.estadoJuego.balas.push(
                new Bala(this.x + offsetX, this.y + offsetY, this.angulo)
            );

            this.cooldownDisparo = 10;
        }
    }

    resetearPosicion(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.velocidadX = 0;
        this.velocidadY = 0;
        this.angulo = 0;
    }
}