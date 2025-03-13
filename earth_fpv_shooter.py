import pygame
import random
import math

# Initialize pygame
pygame.init()

# Constants
WIDTH, HEIGHT = 800, 600
PLAYER_SIZE = 50
BULLET_SIZE = 10
ENEMY_SIZE = 50
ENEMY_SPEED = 3
BULLET_SPEED = 7
GRAVITY = 0.5

# Colors
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)

# Create the screen
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Earth FPV Shooter Game")

# Clock for framerate
clock = pygame.time.Clock()

# Load player image (simple circle as character)
player_img = pygame.Surface((PLAYER_SIZE, PLAYER_SIZE))
player_img.fill(BLUE)

# Bullet Class
class Bullet:
    def __init__(self, x, y, angle):
        self.x = x
        self.y = y
        self.angle = angle
        self.rect = pygame.Rect(x, y, BULLET_SIZE, BULLET_SIZE)

    def update(self):
        self.x += BULLET_SPEED * math.cos(self.angle)
        self.y += BULLET_SPEED * math.sin(self.angle)
        self.rect.x = self.x
        self.rect.y = self.y

# Enemy Class
class Enemy:
    def __init__(self):
        self.x = random.randint(0, WIDTH - ENEMY_SIZE)
        self.y = random.randint(-100, -50)
        self.rect = pygame.Rect(self.x, self.y, ENEMY_SIZE, ENEMY_SIZE)
        self.speed = random.randint(2, ENEMY_SPEED)

    def update(self):
        self.y += self.speed
        if self.y > HEIGHT:
            self.y = random.randint(-100, -50)
            self.x = random.randint(0, WIDTH - ENEMY_SIZE)
        self.rect.y = self.y

# Player Class
class Player:
    def __init__(self):
        self.x = WIDTH // 2
        self.y = HEIGHT - 100
        self.rect = pygame.Rect(self.x, self.y, PLAYER_SIZE, PLAYER_SIZE)
        self.angle = 0
        self.health = 3

    def update(self, keys):
        speed = 5
        if keys[pygame.K_LEFT] and self.x > 0:
            self.x -= speed
        if keys[pygame.K_RIGHT] and self.x < WIDTH - PLAYER_SIZE:
            self.x += speed
        if keys[pygame.K_UP] and self.y > 0:
            self.y -= speed
        if keys[pygame.K_DOWN] and self.y < HEIGHT - PLAYER_SIZE:
            self.y += speed
        if keys[pygame.K_a]:
            self.angle -= 0.1
        if keys[pygame.K_d]:
            self.angle += 0.1
        
        self.rect.x = self.x
        self.rect.y = self.y

# Game loop
def game_loop():
    running = True
    player = Player()
    bullets = []
    enemies = [Enemy() for _ in range(5)]
    score = 0
    
    while running:
        screen.fill(GREEN)  # Earth background (grass)

        # Handle events
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    bullet = Bullet(player.x + PLAYER_SIZE // 2, player.y, player.angle)
                    bullets.append(bullet)
        
        # Update player and bullets
        keys = pygame.key.get_pressed()
        player.update(keys)
        
        for bullet in bullets[:]:
            bullet.update()
            pygame.draw.rect(screen, WHITE, bullet.rect)
        
        # Check bullet collisions with enemies
        for bullet in bullets[:]:
            for enemy in enemies[:]:
                if bullet.rect.colliderect(enemy.rect):
                    bullets.remove(bullet)
                    enemies.remove(enemy)
                    score += 1
                    enemies.append(Enemy())
                    break
        
        # Update enemies
        for enemy in enemies:
            enemy.update()
            pygame.draw.rect(screen, RED, enemy.rect)
        
        # Draw the player
        rotated_player = pygame.transform.rotate(player_img, math.degrees(player.angle))
        player_rect = rotated_player.get_rect(center=(player.x + PLAYER_SIZE // 2, player.y + PLAYER_SIZE // 2))
        screen.blit(rotated_player, player_rect.topleft)
        
        # Display score
        font = pygame.font.SysFont(None, 36)
        score_text = font.render(f"Score: {score}", True, WHITE)
        screen.blit(score_text, (10, 10))
        
        # Game over logic if health reaches 0
        if player.health <= 0:
            font = pygame.font.SysFont(None, 72)
            game_over_text = font.render("GAME OVER", True, RED)
            screen.blit(game_over_text, (WIDTH // 2 - 150, HEIGHT // 2 - 50))
            pygame.display.flip()
            pygame.time.wait(2000)
            running = False
        
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()

# Run the game
game_loop()
