class Player {
  constructor(x, y, width, height, spritePaths) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = { x: 0, y: 0 };
    this.isJumping = false;
    this.gravity = 0.5;
    this.speed = 5;
    this.direction = "right"; // Default direction

    // Jump Sound
    this.jumpSound = new Audio("./assets/Audio/jump.wav");
    this.jumpSound.volume = 0.9;

    // Animation properties
    this.sprites = spritePaths.map((path) => {
      const img = new Image();
      img.src = path;
      return img;
    });
    this.currentFrame = 0; // Current frame index
    this.frameTimer = 0; // Timer to control frame switching
    this.frameInterval = 100; // Time (ms) per frame
  }

  draw(ctx) {
    ctx.save();

    const sprite = this.sprites[this.currentFrame]; // Get the current frame

    // Flip the canvas horizontally if facing left
    if (this.direction === "left") {
      ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    } else {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprite, 0, 0, this.width, this.height);
    }

    ctx.restore();
  }

  update(platforms, deltaTime) {
    // Apply gravity
    this.velocity.y += this.gravity * gameSpeed;
    this.y += this.velocity.y * gameSpeed;

    // Horizontal movement
    this.x = Math.max(0, this.x + this.velocity.x * gameSpeed);

    // Collision with platforms (only when falling)
    platforms.forEach((platform) => {
      if (
        this.velocity.y > 0 && // Falling
        this.y + this.height >= platform.y &&
        this.y + this.height <= platform.y + platform.height &&
        this.x + this.width >= platform.x &&
        this.x <= platform.x + platform.width
      ) {
        this.isJumping = false;
        this.y = platform.y - this.height;
        this.velocity.y = 0;
      }
    });

    // Update animation frame (only when moving horizontally)
    if (this.velocity.x !== 0) {
      this.frameTimer += deltaTime;
      if (this.frameTimer >= this.frameInterval) {
        this.currentFrame = (this.currentFrame + 1) % this.sprites.length;
        this.frameTimer = 0; // Reset timer
      }
    } else {
      this.currentFrame = 0; // Reset to the first frame when idle
    }
  }

  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocity.y = -12; // Adjust jump height
      this.jumpSound.play();
    }
  }
}

// Player controls
const keys = {
  w: false,
  a: false,
  d: false,
};

window.addEventListener("keydown", (e) => {
  switch (e.code) {
    // Jump keys: W and ArrowUp
    case "KeyW":
    case "ArrowUp":
    case "Space":
      if (!keys.w && !keys.ArrowUp) player.jump();
      keys.w = e.code === "KeyW";
      keys.ArrowUp = e.code === "ArrowUp";
      break;

    // Move left keys: A and ArrowLeft
    case "KeyA":
    case "ArrowLeft":
      if (e.code === "KeyA") keys.a = true;
      if (e.code === "ArrowLeft") keys.ArrowLeft = true;
      player.velocity.x = -player.speed;
      player.direction = "left";
      break;

    // Move right keys: D and ArrowRight
    case "KeyD":
    case "ArrowRight":
      if (e.code === "KeyD") keys.d = true;
      if (e.code === "ArrowRight") keys.ArrowRight = true;
      player.velocity.x = player.speed;
      player.direction = "right";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.code) {
    // Jump keys: W and ArrowUp
    case "KeyW":
    case "ArrowUp":
    case "Space":
      if (e.code === "KeyW") keys.w = false;
      if (e.code === "ArrowUp") keys.ArrowUp = false;
      break;

    // Move left keys: A and ArrowLeft
    case "KeyA":
    case "ArrowLeft":
      if (e.code === "KeyA") keys.a = false;
      if (e.code === "ArrowLeft") keys.ArrowLeft = false;
      if (!keys.d && !keys.ArrowRight) player.velocity.x = 0;
      break;

    // Move right keys: D and ArrowRight
    case "KeyD":
    case "ArrowRight":
      if (e.code === "KeyD") keys.d = false;
      if (e.code === "ArrowRight") keys.ArrowRight = false;
      if (!keys.a && !keys.ArrowLeft) player.velocity.x = 0;
      break;
  }
});
