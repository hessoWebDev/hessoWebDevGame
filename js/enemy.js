class Enemy {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    moveDistance,
    type,
    direction = "right"
  ) {
    this.startX = x; // Starting position
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = new Image();
    this.velocity = { x: direction === "left" ? -speed : speed, y: 0 }; // Horizontal speed
    this.moveDistance = moveDistance; // Total distance to move
    this.travelled = 0; // Distance travelled so far

    if (type === "robot") {
      this.sprite.src = "./assets/sprites/robotEnemy.png";
    } else if (type === "greenMonster") {
      this.sprite.src = "./assets/sprites/greenEnemy.png";
    }
  }

  draw(ctx, camera) {
    ctx.save();

    // Check the direction the ennemy goes to change the orientation of the sprite
    if (this.velocity.x < 0) {
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.sprite,
        -(this.x - camera.offsetX + this.width),
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.sprite,
        this.x - camera.offsetX,
        this.y,
        this.width,
        this.height
      );
    }
    ctx.restore();
  }

  update(deltaTime) {
    // Move the enemy with game speed
    this.x += this.velocity.x * gameSpeed;
    this.travelled += Math.abs(this.velocity.x * gameSpeed);

    // Reverse direction if the enemy exceeds its movement range
    if (this.travelled >= this.moveDistance) {
      this.velocity.x *= -1; // Reverse direction
      this.travelled = 0; // Reset distance travelled
    }
  }
}
