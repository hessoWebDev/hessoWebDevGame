class Camera {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.offsetX = 0;
    }

    update() {
        // Center the player on the canvas
        this.offsetX = Math.max(0, this.player.x - this.canvas.width / 2);
    }
}
