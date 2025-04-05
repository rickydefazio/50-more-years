const { animate } = anime;

let countdown;
let clicked = false;
const startDate = '07/30/2022';
const targetDate = '07/30/2072';

function initCharAnimation() {
  animate('h1 > strong > span.char', {
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

function createAchievementData() {
  const milestoneYears = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50];
  // TODO: Add additional data for each milestone year (e.g., description, etc...)
  const achievementData = milestoneYears.map(year => ({ year }));

  return achievementData;
}

const achievementData = createAchievementData();

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

  // Set up achievements toggle
  let achievementsShown = false;
  document
    .getElementById('toggleAchievementsBtn')
    .addEventListener('click', () => {
      const achievementsTitle = document.getElementById('achievements-title');
      const achievementsContent = document.getElementById(
        'achievements-content'
      );

      const toggleBtn = document.getElementById('toggleAchievementsBtn');

      if (!achievementsShown) {
        achievementsShown = true;
        achievementsContent.classList.remove('hidden');
        toggleBtn.textContent = 'Hide My Romantic Accomplishments';

        achievementsTitle.scrollIntoView({ behavior: 'smooth' });

        // Fire confetti when achievements are shown
        triggerConfetti();
      } else {
        achievementsShown = false;
        achievementsContent.classList.add('hidden');
        toggleBtn.textContent = 'Reveal My Trophy Cabinet';
      }
    });

  generateAchievementBadges();
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

  // Update unlocked achievements whenever the countdown is calculated
  updateAchievements();

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

/**
 * Generates all achievement badges and adds them to the page
 */
function generateAchievementBadges() {
  const achievementsContainer = document.getElementById(
    'achievements-container'
  );

  // Clear existing badges
  achievementsContainer.innerHTML = '';

  // Create a badge for each achievement
  achievementData.forEach(achievement => {
    const badge = document.createElement('div');
    badge.className = 'achievement-badge';
    badge.id = `achievement-${achievement.year}`;
    badge.setAttribute('data-year', achievement.year);

    badge.innerHTML = `
      <div class="achievement-badge-content">
        <div class="achievement-year">${achievement.year}</div>
        <div class="achievement-text">Year</div>
      </div>
    `;

    achievementsContainer.appendChild(badge);
  });

  // Update which badges are unlocked
  updateAchievements();
}

/**
 * Updates the unlocked achievements based on time passed since start date
 */
function updateAchievements() {
  const [startMonth, startDay, startYear] = startDate.split('/');
  const sentenceStartDate = new Date(`${startYear}-${startMonth}-${startDay}`);
  const now = new Date();

  // Calculate years passed (approximate, not exact to the day)
  const millisecondsPassed = now - sentenceStartDate;
  const daysPassed = millisecondsPassed / (1000 * 60 * 60 * 24);
  const yearsPassed = daysPassed / 365.25;

  // Unlock achievements for completed years
  const completedYears = Math.floor(yearsPassed);

  // Update badge display
  achievementData.forEach(achievement => {
    const badge = document.getElementById(`achievement-${achievement.year}`);
    if (badge) {
      if (achievement.year <= completedYears) {
        badge.classList.add('unlocked');
      } else {
        badge.classList.remove('unlocked');
      }
    }
  });
}

/**
 * Creates and fires a confetti animation when achievements are revealed
 */
function triggerConfetti() {
  // Get the achievements button position for the confetti origin
  const button = document.getElementById('toggleAchievementsBtn');
  const rect = button.getBoundingClientRect();
  const buttonCenter = rect.left + rect.width / 2;

  // Calculate the x-origin (0 to 1 where 0 is left edge and 1 is right edge)
  const xOrigin = buttonCenter / window.innerWidth;

  // Prepare the confetti configuration
  const customConfig = {
    ...confettiConfig,
    origin: { y: rect.bottom / window.innerHeight, x: xOrigin }
  };

  // Launch confetti
  confetti(customConfig);

  // Fire a second burst after a slight delay for more effect
  setTimeout(() => {
    confetti({
      ...customConfig,
      particleCount: 50,
      spread: 60,
      origin: {
        y: (rect.top + rect.height / 2) / window.innerHeight,
        x: xOrigin
      }
    });
  }, 300);
}
