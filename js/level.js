class Level {
    constructor(platforms, enemies) {
        this.platforms = platforms;
        this.enemies = enemies;
    }

    update(deltaTime) {
        this.enemies.forEach((enemy) => enemy.update(deltaTime));
    }

    draw(ctx, camera) {
        this.platforms.forEach((platform) => platform.draw(ctx, camera));
        this.enemies.forEach((enemy) => enemy.draw(ctx, camera));
    }
}
