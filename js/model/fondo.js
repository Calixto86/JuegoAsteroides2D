export class Fondo {
    constructor(cantidad = 100) {
        this.cantidad = cantidad;
        this.estrellas = [];
    }

    crear(canvas) {
        this.estrellas = [];

        for (let i = 0; i < this.cantidad; i++) {
            this.estrellas.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2
            });
        }
    }
}