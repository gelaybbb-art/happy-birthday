
(() => {
  const bubbleLayer = document.getElementById('bubbles');
  for (let i=0;i<34;i++) {
    const b=document.createElement('span'); b.className='bubble';
    const s=3+Math.random()*9; b.style.width=`${s}px`; b.style.height=`${s}px`;
    b.style.left=`${Math.random()*100}%`; b.style.animationDuration=`${9+Math.random()*14}s`;
    b.style.animationDelay=`${-Math.random()*20}s`; b.style.setProperty('--drift',`${Math.random()*90-45}px`);
    bubbleLayer.appendChild(b);
  }
  const modal=document.getElementById('letterModal');
  const devilReveal=document.getElementById('devilReveal');
  let revealTimer;
  const open=()=>{
    clearTimeout(revealTimer);
    devilReveal.classList.remove('show','hide');
    devilReveal.setAttribute('aria-hidden','true');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.getElementById('closeModal').focus();
  };
  const close=()=>{
    if(!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    devilReveal.classList.remove('hide');
    devilReveal.classList.add('show');
    devilReveal.setAttribute('aria-hidden','false');
    revealTimer=setTimeout(()=>{
      devilReveal.classList.remove('show');
      devilReveal.classList.add('hide');
      devilReveal.setAttribute('aria-hidden','true');
    },5200);
    document.getElementById('openBottle').focus();
  };
  document.getElementById('openBottle').addEventListener('click',open);
  document.getElementById('closeModal').addEventListener('click',close);
  const doneButton=document.getElementById('modalDone');
  if(doneButton) doneButton.addEventListener('click',close);
  document.getElementById('modalBackdrop').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close();});
})();
