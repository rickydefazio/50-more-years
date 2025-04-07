const { animate } = anime;

let countdown;
let clicked = false;
const startDate = '07/30/2022';
const targetDate = '07/30/2072';

function initCharAnimation() {
  animate('.char', {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    rotate: {
      from: '-1turn',
      delay: 0
    },
    delay: (_, i) => i * 50,
    ease: 'inOutCirc',
    loopDelay: 1000,
    loop: true
  });
}

const confettiConfig = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#e74c3c', '#ff88a1', '#ff5a79', '#ff9494', '#ffc0cb'],
  zIndex: 1000,
  disableForReducedMotion: true
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Set up countdown toggle
  document.getElementById('toggleBtn').addEventListener('click', () => {
    if (!clicked) {
      clicked = true;
      document.getElementById('toggleBtn').textContent = 'Hide My Fate';
      startCountdown(targetDate);
    } else {
      clicked = false;
      document.getElementById('toggleBtn').textContent =
        'Show My Remaining Sentence';
      clearCountdown();
    }
  });

  initCharAnimation();
});

function clearCountdown() {
  document.getElementById('output').innerHTML = '';
  if (countdown) clearInterval(countdown);
}

function startCountdown(inputDate) {
  calculateCountdown(inputDate);
  countdown = setInterval(() => calculateCountdown(inputDate), 1000);
}

function calculateCountdown(inputDate) {
  const [month, day, year] = inputDate.split('/');
  const endDate = new Date(`${year}-${month}-${day}`);

  const now = new Date();
  let diff = endDate - now;

  // If date is in the past
  if (diff < 0) {
    clearCountdown();
    // TODO: Create an 'Easter Egg' for partner to find
    document.getElementById('output').innerHTML = `
      <h2>Congratulations! You're free! 🎉</h2>
    `;
    return;
  }

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  diff -= years * (1000 * 60 * 60 * 24 * 365);

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  diff -= months * (1000 * 60 * 60 * 24 * 30);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  document.getElementById('output').innerHTML = `
    <div class="time-box">
      <span id="years" class="time">${years}</span>
      <span class="label">Years</span>
    </div>
    <div class="time-box">
      <span id="months" class="time">${months}</span>
      <span class="label">Months</span>
    </div>
    <div class="time-box">
      <span id="days" class="time">${days}</span>
      <span class="label">Days</span>
    </div>
    <div class="time-box">
      <span id="hours" class="time">${hours}</span>
      <span class="label">Hours</span>
    </div>
    <div class="time-box">
      <span id="minutes" class="time">${minutes}</span>
      <span class="label">Minutes</span>
    </div>
    <div class="time-box">
      <span id="seconds" class="time">${seconds}</span>
      <span class="label">Seconds</span>
    </div>
  `;
}
