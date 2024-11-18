class Platform {
    constructor(x, y, width, height, sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = new Image();
        this.sprite.src = sprite;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}

const platforms = [
    new Platform(100, 500, 200, 20, './assets/sprites/Platform.png'),
    new Platform(400, 400, 200, 20, './assets/sprites/Platform.png'),
    new Platform(600, 400, 200, 20, './assets/sprites/Platform.png')
];
