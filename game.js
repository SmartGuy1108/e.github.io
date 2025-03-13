let score = 0;
let timeLeft = 30;
let gameInterval;
let zombieInterval;
let isGameActive = false;

const holes = document.querySelectorAll('.hole');
const scoreboard = document.getElementById('scoreboard');
const timer = document.getElementById('timer');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', startGame);

function startGame() {
  if (isGameActive) return;
  isGameActive = true;
  score = 0;
  timeLeft = 30;
  scoreboard.textContent = `Score: ${score}`;
  timer.textContent = `Time: ${timeLeft}s`;

  startButton.disabled = true;

  gameInterval = setInterval(updateTimer, 1000);
  zombieInterval = setInterval(showZombie, 1000);
}

function updateTimer() {
  timeLeft--;
  timer.textContent = `Time: ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    clearInterval(zombieInterval);
    alert(`Game Over! Your final score is ${score}`);
    isGameActive = false;
    startButton.disabled = false;
  }
}

function showZombie() {
  const hole = holes[Math.floor(Math.random() * holes.length)];
  const randomZombieOrAnimal = Math.random() < 0.8; // 80% zombies, 20% cute animals
  const entity = document.createElement('div');

  if (randomZombieOrAnimal) {
    entity.classList.add('zombie');
    entity.addEventListener('click', hitZombie);
  } else {
    entity.classList.add('cuteAnimal');
    entity.addEventListener('click', missZombie);
  }

  hole.innerHTML = ''; // Clear any existing zombie or animal
  hole.appendChild(entity);

  // Hide the zombie or animal after a short time
  setTimeout(() => {
    hole.removeChild(entity);
  }, 1500);
}

function hitZombie(event) {
  score += 10;
  scoreboard.textContent = `Score: ${score}`;
  event.target.removeEventListener('click', hitZombie);
}

function missZombie(event) {
  alert('Oops! You hit a cute animal!');
}

