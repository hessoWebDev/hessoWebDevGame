class Camera {
    constructor(player, canvas) {
        this.player = player;
        this.canvas = canvas;
        this.offsetX = 0;
    }

    update() {
        // Adjust the offset to keep the player centered
        this.offsetX = Math.max(0, this.player.x - this.canvas.width / 2);

        // Optional: Clamp the offset to level width (if background repeats infinitely, this is unnecessary)
        const levelWidth = 2000; // Replace with your level width
        this.offsetX = Math.min(this.offsetX, levelWidth - this.canvas.width);
    }
}
