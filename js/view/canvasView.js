export class CanvasView {
    constructor(canvas, ctx, colores) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.colores = colores;
    }

    limpiar() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    dibujarFondo(fondo) {
        this.ctx.fillStyle = this.colores.estrellas;

        fondo.estrellas.forEach(estrella => {
            this.ctx.beginPath();
            this.ctx.arc(estrella.x, estrella.y, estrella.r, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    dibujarMarco() {
        this.ctx.strokeStyle = this.colores.borde;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    dibujarAsteroides(asteroides) {
        asteroides.forEach(asteroide => {
            if (!asteroide.activo) return;

            this.ctx.beginPath();
            this.ctx.moveTo(
                asteroide.x + asteroide.puntos[0].x,
                asteroide.y + asteroide.puntos[0].y
            );

            asteroide.puntos.forEach(punto => {
                this.ctx.lineTo(
                    asteroide.x + punto.x,
                    asteroide.y + punto.y
                );
            });

            this.ctx.closePath();
            this.ctx.strokeStyle = this.colores.asteroide;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }

    dibujarBalas(balas) {
        balas.forEach(bala => {
            this.ctx.beginPath();
            this.ctx.arc(bala.x, bala.y, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colores.bala;
            this.ctx.fill();
        });
    }

    dibujarNave(nave, mostrandoTurbo, tiempoInvulnerable) {
        this.ctx.save();
        this.ctx.translate(nave.x, nave.y);
        this.ctx.rotate(nave.angulo);

        if (tiempoInvulnerable > 0) {
            this.ctx.globalAlpha = 0.5;
        }

        if (mostrandoTurbo) {
            this.ctx.beginPath();
            this.ctx.moveTo(-8, 20);
            this.ctx.lineTo(0, 35);
            this.ctx.lineTo(8, 20);
            this.ctx.closePath();
            this.ctx.fillStyle = this.colores.turbo;
            this.ctx.fill();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(0, -15);
        this.ctx.lineTo(-15, 15);
        this.ctx.lineTo(15, 15);
        this.ctx.closePath();
        this.ctx.strokeStyle = this.colores.nave;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.restore();
    }
}