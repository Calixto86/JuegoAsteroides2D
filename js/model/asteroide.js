export class Asteroide {
    constructor(canvas) {
        this.activo = true;
        this.crear(canvas);
    }

    crear(canvas) {
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

        const borde = Math.floor(Math.random() * 4);

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

    update(canvas) {
        if (!this.activo) return;

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
}