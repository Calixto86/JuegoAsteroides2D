export class Bala {
    constructor(x, y, angulo) {
        this.x = x;
        this.y = y;
        this.velocidadX = Math.cos(angulo - Math.PI / 2) * 25;
        this.velocidadY = Math.sin(angulo - Math.PI / 2) * 25;
        this.activa = true;
    }

    update(canvas) {
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
}