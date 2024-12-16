function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function detectEnemyCollision(player, enemy) {
  const playerRect = {
    x: player.x,
    y: player.y,
    width: player.width,
    height: player.height,
  };

  //Checks every hitbox of the enemy
  return enemy
    .getGlobalHitboxes()
    .some((hitbox) => detectCollision(playerRect, hitbox));
}
