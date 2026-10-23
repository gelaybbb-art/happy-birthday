const button = document.getElementById('surpriseBtn');
const message = document.getElementById('surpriseMessage');
const colors = ['#e8b1c5', '#b65f7f', '#f3d7a4', '#fff8fb', '#c9a9d5'];

function celebrate() {
  for (let i = 0; i < 95; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    piece.style.animationDelay = Math.random() * 0.7 + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}
button.addEventListener('click', () => {
  message.hidden = false;
  button.innerHTML = 'Surprise opened with love <span>♥</span>';
  celebrate();
  message.scrollIntoView({behavior:'smooth', block:'center'});
});
