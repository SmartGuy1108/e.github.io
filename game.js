// Game Constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const PLAYER_SIZE = 50;
const BULLET_SIZE = 10;
const ENEMY_SIZE = 50;
const BULLET_SPEED = 7;
const ENEMY_SPEED = 3;
const GRAVITY = 0.5;

// Colors
const WHITE = "#FFFFFF";
const RED = "#FF0000";
const BLUE = "#0000FF";
const GREEN = "#228B22";

// Game Variables
let player = { x: 375, y: 500, width: PLAYER_SIZE, height: PLAYER_SIZE, angle: 0, health: 3 };
let bullets = [];
let enemies = [];
let score = 0;
let keys = { left: false, right: false, up: false, down: false, a: false, d: false, space: false };

// Key event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "ArrowDown") keys.down = true;
  if (e.key === "a") keys.a = true;
  if (e.key === "d") keys.d = true;
  if (e.key === " ") keys.space = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "ArrowDown") keys.down = false;
  if (e.key === "a") keys.a = false;
  if (e.key === "d") keys.d = false;
  if (e.key === " ") keys.space = false;
});

// Bullet Class
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  update() {
    this.x += BULLET_SPEED * Math.cos(this.angle);
    this.y += BULLET_SPEED * Math.sin(this.angle);
  }

  draw() {
    ctx.fillStyle = WHITE;
    ctx.fillRect(this.x, this.y, BULLET_SIZE, BULLET_SIZE);
  }
}

// Enemy Class
class Enemy {
  constructor() {
    this.x = Math.random() * (canvas.width - ENEMY_SIZE);
    this.y = -ENEMY_SIZE;
  }

  update() {
    this.y += ENEMY_SPEED;
    if (this.y > canvas.height) {
      this.y = -ENEMY_SIZE;
      this.x = Math.random() * (canvas.width - ENEMY_SIZE);
    }
  }

  draw() {
    ctx.fillStyle = RED;
    ctx.fillRect(this.x, this.y, ENEMY_SIZE, ENEMY_SIZE);
  }
}

// Player Class
function updatePlayer() {
  const speed = 5;
  if (keys.left && player.x > 0) player.x -= speed;
  if (keys.right && player.x < canvas.width - player.width) player.x += speed;
  if (keys.up && player.y > 0) player.y -= speed;
  if (keys.down && player.y < canvas.height - player.height) player.y += speed;
  if (keys.a) player.angle -= 0.1;
  if (keys.d) player.angle += 0.1;

  if (keys.space) {
    bullets.push(new Bullet(player.x + PLAYER_SIZE / 2, player.y, player.angle));
    keys.space = false;
  }
}

// Game Loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen

  // Update and draw player
  updatePlayer();
  ctx.save();
  ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
  ctx.rotate(player.angle);
  ctx.fillStyle = BLUE;
  ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE); // Draw player
  ctx.restore();

  // Update and draw bullets
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw();
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1); // Remove bullet if out of bounds
    }
  });

  // Update and draw enemies
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();
    // Collision check
    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.x < enemy.x + ENEMY_SIZE &&
        bullet.x + BULLET_SIZE > enemy.x &&
        bullet.y < enemy.y + ENEMY_SIZE &&
        bullet.y + BULLET_SIZE > enemy.y) {
        enemies.splice(index, 1);
        bullets.splice(bulletIndex, 1);
        score++;
        enemies.push(new Enemy()); // New enemy
      }
    });
  });

  // Display score
  ctx.fillStyle = WHITE;
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Game over logic (if needed)
  // Check collisions between player and enemies
  enemies.forEach(enemy => {
    if (player.x < enemy.x + ENEMY_SIZE &&
      player.x + PLAYER_SIZE > enemy.x &&
      player.y < enemy.y + ENEMY_SIZE &&
      player.y + PLAYER_SIZE > enemy.y) {
      alert("Game Over! Final Score: " + score);
      document.location.reload();
    }
  });

  // Loop the game
  requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
  // Create enemies
  for (let i = 0; i < 5; i++) {
    enemies.push(new Enemy());
  }
  gameLoop();
}

// Start the game on page load
startGame();
