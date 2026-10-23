const celebrateBtn = document.getElementById('celebrateBtn');

const colors = ['#ff6fae', '#8a62d6', '#ffd166', '#70d6ff', '#95e1a3'];

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', (Math.random() * 220 - 110) + 'px');
    piece.style.animationDelay = (Math.random() * 0.7) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3800);
  }
}

function floatHearts() {
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = ['💖', '💗', '💜', '✨', '💕'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (18 + Math.random() * 24) + 'px';
    heart.style.animationDelay = (Math.random() * 1.2) + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 4500);
  }
}

celebrateBtn.addEventListener('click', () => {
  celebrateBtn.textContent = 'Your wish is on its way! 💫';
  launchConfetti();
  floatHearts();
  setTimeout(() => {
    celebrateBtn.textContent = 'Make another wish ✨';
  }, 2500);
});

// A few gentle sparkles when the page opens.
window.addEventListener('load', () => {
  setTimeout(launchConfetti, 350);
});
