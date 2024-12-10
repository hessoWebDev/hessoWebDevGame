class Platform {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // Determine the platform sprite based on the type
    this.sprite = new Image();
    if (type === "metal") {
      this.sprite.src = "./assets/sprites/platformMetal.png";
    } else if (type === "copper") {
      this.sprite.src = "./assets/sprites/Regular_PlatformCopper.png";
    } else if (type === "default") {
      this.sprite.src = "./assets/sprites/platform.png"; // Default platform
    }
  }

  draw(ctx, camera) {
    ctx.drawImage(
      this.sprite,
      this.x - camera.offsetX,
      this.y,
      this.width,
      this.height
    );
  }
}
