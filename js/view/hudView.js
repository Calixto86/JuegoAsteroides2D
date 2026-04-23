export class HUDView {
    constructor(canvas, ctx, colores) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.colores = colores;
    }

    dibujarHUD(estadoJuego) {
        this.ctx.save();
        this.ctx.font = '16px "Press Start 2P", monospace';
        this.ctx.fillStyle = this.colores.textoHUD;
        this.ctx.textAlign = "left";
        this.ctx.fillText("PUNTAJE: " + estadoJuego.puntaje, 20, 30);
        this.ctx.fillText("VIDAS: " + estadoJuego.vidas, 20, 55);
        this.ctx.fillText("RECORD: " + estadoJuego.mejorPuntaje, 20, 80);
        this.ctx.restore();
    }

    dibujarPantallaInicio() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "center";
        this.ctx.font = '24px "Press Start 2P", monospace';
        this.ctx.fillText("ASTEROIDES 2D", this.canvas.width / 2, this.canvas.height / 2 - 30);

        this.ctx.font = '12px "Press Start 2P", monospace';
        this.ctx.fillText("PRESIONA INICIAR", this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.restore();
    }

    dibujarPantallaPausa() {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colores.pausaTexto;
        this.ctx.textAlign = "center";
        this.ctx.font = '22px "Press Start 2P", monospace';
        this.ctx.fillText("PAUSA", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }

    dibujarPantallaFin() {
        this.ctx.save();
        this.ctx.fillStyle = this.colores.gameOverFondo;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = this.colores.gameOverTexto;
        this.ctx.textAlign = "center";
        this.ctx.font = '26px "Press Start 2P", monospace';
        this.ctx.fillText("FIN DEL JUEGO", this.canvas.width / 2, this.canvas.height / 2 - 10);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = '12px "Press Start 2P", monospace';
        this.ctx.fillText("PRESIONA REINICIAR", this.canvas.width / 2, this.canvas.height / 2 + 35);
        this.ctx.restore();
    }
}