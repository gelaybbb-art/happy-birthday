(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const progress = $('#progressBar');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress and gentle reveal choreography.
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, {passive:true}); updateProgress();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 90}ms`; observer.observe(el); });

  // Interactive star map.
  function makeStars(canvas, count, gold=false) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d'); let w, h, stars=[], raf;
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height; canvas.width = w*dpr; canvas.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      stars = Array.from({length:count}, () => ({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.25,a:Math.random()*.65+.15,s:Math.random()*.008+.002,phase:Math.random()*6.28, gold:gold && Math.random()>.72}));
    };
    const draw = t => {
      ctx.clearRect(0,0,w,h);
      for(const s of stars){const alpha=s.a*(.72+.28*Math.sin(t*s.s+s.phase));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=s.gold?`rgba(215,183,123,${alpha})`:`rgba(225,239,239,${alpha})`;ctx.fill();}
      if(!reducedMotion) raf=requestAnimationFrame(draw);
    };
    resize(); draw(0); window.addEventListener('resize', resize);
    if(reducedMotion) return;
    cancelAnimationFrame(raf); raf=requestAnimationFrame(draw);
  }
  makeStars($('#starfield'), 180, true); makeStars($('#sparkles'), 90, true);

  // Editorial photo cards subtly respond to pointer movement.
  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    $$('.memory-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  // Message-in-a-bottle interaction.
  const modal=$('#letterModal'), bottle=$('#bottleArt'), toast=$('#toast');
  const openModal=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#closeModal').focus();confettiBurst();};
  const closeModal=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
  $('#openBottle').addEventListener('click',openModal);
  bottle.addEventListener('click',openModal);
  $('#closeModal').addEventListener('click',closeModal);
  $('#modalDone').addEventListener('click',()=>{closeModal();toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600);});
  $('#modalBackdrop').addEventListener('click',closeModal);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

  // Lightweight celebratory particles; no external library required.
  function confettiBurst(){
    const canvas=document.createElement('canvas');canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:250';document.body.appendChild(canvas);
    const c=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;c.scale(dpr,dpr);
    const bits=Array.from({length:105},()=>({x:innerWidth/2+(Math.random()-.5)*150,y:innerHeight/2+30,vx:(Math.random()-.5)*7,vy:-Math.random()*7-2,g:.12+Math.random()*.1,r:2+Math.random()*3,life:70+Math.random()*35,rot:Math.random()*6,color:Math.random()>.5?'#d7b77b':'#f1e7d4'}));
    let frame=0;function tick(){c.clearRect(0,0,innerWidth,innerHeight);bits.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.rot+=.08;p.life--;c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.globalAlpha=Math.min(1,p.life/22);c.fillStyle=p.color;c.fillRect(-p.r,-p.r/2,p.r*2,p.r);c.restore();});if(++frame<115)requestAnimationFrame(tick);else canvas.remove();}tick();
  }

  // Optional ambient sound, generated locally by the browser. Starts only after a deliberate tap.
  let audioCtx=null, noiseSource=null, gainNode=null, soundOn=false;
  const soundButton=$('#soundToggle');
  function stopSound(){if(noiseSource){try{noiseSource.stop();}catch(e){}noiseSource=null;}if(audioCtx){audioCtx.close();audioCtx=null;}soundOn=false;soundButton.innerHTML='♫ <span>sound off</span>';}
  function startSound(){
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC){soundButton.innerHTML='♫ <span>not supported</span>';return;}
    audioCtx=new AC();const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.18;
    noiseSource=audioCtx.createBufferSource();noiseSource.buffer=buffer;noiseSource.loop=true;
    const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=330;
    gainNode=audioCtx.createGain();gainNode.gain.value=.045;
    noiseSource.connect(filter);filter.connect(gainNode);gainNode.connect(audioCtx.destination);noiseSource.start();soundOn=true;soundButton.innerHTML='♫ <span>sound on</span>';
  }
  soundButton.addEventListener('click',()=>{if(soundOn)stopSound();else startSound();});
  window.addEventListener('pagehide',stopSound);

  // Cinematic intro: brief, elegant, and skippable by scrolling or tapping.
  const introLoader = document.getElementById('introLoader');
  const dismissIntro = () => { if (introLoader) introLoader.classList.add('done'); };
  window.addEventListener('load', () => setTimeout(dismissIntro, 1550), {once:true});
  if (introLoader) introLoader.addEventListener('click', dismissIntro);
  window.addEventListener('wheel', dismissIntro, {once:true, passive:true});
  window.addEventListener('touchstart', dismissIntro, {once:true, passive:true});

  // Soft cursor light on desktop, with no pointer tracking on touch devices.
  const pointerGlow = document.getElementById('pointerGlow');
  if (pointerGlow && window.matchMedia('(pointer:fine)').matches && !reducedMotion) {
    window.addEventListener('pointermove', e => {
      pointerGlow.style.left = `${e.clientX}px`;
      pointerGlow.style.top = `${e.clientY}px`;
      pointerGlow.style.opacity = '.9';
    }, {passive:true});
    document.addEventListener('pointerleave', () => pointerGlow.style.opacity = '0');
  }


  // Deep-sea bubbles: light, decorative, and generated locally.
  const bubbleField = document.getElementById('seaBubbles');
  if (bubbleField && !reducedMotion) {
    for (let i=0;i<30;i++) {
      const bubble=document.createElement('span');
      bubble.className='sea-bubble';
      const size=3+Math.random()*10;
      bubble.style.width=`${size}px`;
      bubble.style.height=`${size}px`;
      bubble.style.left=`${Math.random()*100}%`;
      bubble.style.animationDuration=`${9+Math.random()*15}s`;
      bubble.style.animationDelay=`${-Math.random()*20}s`;
      bubble.style.setProperty('--drift',`${Math.random()*120-60}px`);
      bubble.style.opacity=`${.25+Math.random()*.55}`;
      bubbleField.appendChild(bubble);
    }
  }

})();