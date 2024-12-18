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

    this.debug = false; // To check the hitboxes of ennemies

    if (type === "robot") {
      this.sprite.src = "./assets/sprites/robotEnemy.png";
      this.hitboxes = [
        { xOffset: 0, yOffset: 0, width: 50, height: 50 }, // One zone (rectangular)
      ];
    } else if (type === "greenMonster") {
      this.sprite.src = "./assets/sprites/greenEnemy.png";
      this.hitboxes = [
        { xOffset: 25, yOffset: 5, width: 50, height: 50 }, // Main body
        { xOffset: 5, yOffset: 50, width: 85, height: 50 }, // Feets
      ];
    } else {
      this.hitboxes = [
        { xOffset: 0, yOffset: 0, width: this.width, height: this.height }, // By default, all the rectangle
      ];
    }
  }

  // Returns the hitboxes with their global position in the game
  getGlobalHitboxes() {
    if (this.velocity.x < 0) {
      // If moving left, reverse the hitbox offsets
      return this.hitboxes.map((hitbox) => ({
        x: this.x + this.width - hitbox.xOffset - hitbox.width,
        y: this.y + hitbox.yOffset,
        width: hitbox.width,
        height: hitbox.height,
      }));
    } else {
      // If moving right, use the original hitbox offsets
      return this.hitboxes.map((hitbox) => ({
        x: this.x + hitbox.xOffset,
        y: this.y + hitbox.yOffset,
        width: hitbox.width,
        height: hitbox.height,
      }));
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

      if (this.debug) {
        // Debug : draw hitboxes
        this.getGlobalHitboxes().forEach((hitbox) => {
          ctx.strokeStyle = "red";
          ctx.strokeRect(
            -(hitbox.x + hitbox.width - camera.offsetX),
            hitbox.y,
            hitbox.width,
            hitbox.height
          );
        });
      }
    } else {
      ctx.drawImage(
        this.sprite,
        this.x - camera.offsetX,
        this.y,
        this.width,
        this.height
      );

      if (this.debug) {
        // Debug : draw hitboxes
        this.getGlobalHitboxes().forEach((hitbox) => {
          ctx.strokeStyle = "red";
          ctx.strokeRect(
            hitbox.x - camera.offsetX,
            hitbox.y,
            hitbox.width,
            hitbox.height
          );
        });
      }
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
