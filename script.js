// ========================================================
// ARMAN BHAIYA BIRTHDAY WEBAPP - SCRIPT
// Light Luxury Edition • 4 Themes • Web Audio • Bootstrap 5
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initFxCanvas();
  initAudioSynthesizer();
  initCakeInteractions();
  initLetterInteractions();
  initMemoryLightbox();
  initAwardsInteractions();
  initGiftBoxInteractions();
  initToastInteractions();
  initNavigation();

  // Welcome fireworks burst on page load
  setTimeout(() => {
    fireConfetti(window.innerWidth / 2, window.innerHeight * 0.35, 60);
    showToast('Janamdin Mubarak Arman Bhaiya! 👑🎂');
  }, 600);
});

// ========================================================
// 1. 4 LIGHT THEMES SWITCHER & PERSISTENCE
// ========================================================
const THEMES = ['ivory', 'rose', 'sky', 'mint'];

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('arman_bhai_theme') || 'ivory';
  applyTheme(savedTheme, false);

  const themeButtons = document.querySelectorAll('.theme-pill-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const themeName = btn.getAttribute('data-theme-name');
      if (themeName && THEMES.includes(themeName)) {
        applyTheme(themeName, true);
      }
    });
  });
}

function applyTheme(themeName, shouldToast = false) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('arman_bhai_theme', themeName);

  // Update active state on theme buttons
  const themeButtons = document.querySelectorAll('.theme-pill-btn');
  themeButtons.forEach(btn => {
    if (btn.getAttribute('data-theme-name') === themeName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Re-sync canvas particle theme colors
  updateCanvasThemeColors();

  if (shouldToast) {
    const titles = {
      ivory: 'Royal Ivory & Gold 👑',
      rose: 'Rose Pearl & Blush 🌸',
      sky: 'Sapphire Sky Breeze 💎',
      mint: 'Mint Royale & Sage 🌿'
    };
    showToast(`Theme Badal Gayi: ${titles[themeName] || themeName}`);
    fireSparkles(window.innerWidth / 2, 80);
  }
}

// ========================================================
// 2. CANVAS PARTICLES & CONFETTI ENGINE
// ========================================================
let fxCanvas, fxCtx;
let ambientParticles = [];
let confettiParticles = [];
let themeColorRgb = [184, 134, 11];

function initFxCanvas() {
  fxCanvas = document.getElementById('fx-canvas');
  if (!fxCanvas) return;
  fxCtx = fxCanvas.getContext('2d');

  function resize() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  updateCanvasThemeColors();

  // Create ambient floating gentle sparkles
  const count = Math.min(30, Math.floor(window.innerWidth / 35));
  for (let i = 0; i < count; i++) {
    ambientParticles.push({
      x: Math.random() * fxCanvas.width,
      y: Math.random() * fxCanvas.height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.35 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  requestAnimationFrame(renderCanvasLoop);
}

function updateCanvasThemeColors() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'ivory';
  const colorMap = {
    ivory: [184, 134, 11],
    rose: [212, 93, 121],
    sky: [30, 136, 229],
    mint: [15, 139, 101]
  };
  themeColorRgb = colorMap[currentTheme] || [184, 134, 11];
}

function renderCanvasLoop(time) {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  // 1. Draw Ambient Particles
  for (let i = 0; i < ambientParticles.length; i++) {
    const p = ambientParticles[i];
    p.y += p.speedY;
    p.x += p.speedX;
    p.alpha = 0.25 + 0.25 * Math.sin(time * 0.002 + p.phase);

    if (p.y < -10) {
      p.y = fxCanvas.height + 10;
      p.x = Math.random() * fxCanvas.width;
    }
    if (p.x < -10) p.x = fxCanvas.width + 10;
    if (p.x > fxCanvas.width + 10) p.x = -10;

    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    fxCtx.fillStyle = `rgba(${themeColorRgb[0]}, ${themeColorRgb[1]}, ${themeColorRgb[2]}, ${p.alpha})`;
    fxCtx.fill();
  }

  // 2. Draw Active Confetti Particles
  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const cp = confettiParticles[i];
    cp.x += cp.vx;
    cp.y += cp.vy;
    cp.vy += cp.gravity;
    cp.rotation += cp.rotationSpeed;
    cp.life -= cp.decay;

    if (cp.life <= 0 || cp.y > fxCanvas.height + 20) {
      confettiParticles.splice(i, 1);
      continue;
    }

    fxCtx.save();
    fxCtx.translate(cp.x, cp.y);
    fxCtx.rotate(cp.rotation);
    fxCtx.globalAlpha = Math.max(0, cp.life);
    fxCtx.fillStyle = cp.color;

    if (cp.shape === 'circle') {
      fxCtx.beginPath();
      fxCtx.arc(0, 0, cp.size / 2, 0, Math.PI * 2);
      fxCtx.fill();
    } else {
      fxCtx.fillRect(-cp.size / 2, -cp.size / 2, cp.size, cp.size * 0.6);
    }
    fxCtx.restore();
  }

  requestAnimationFrame(renderCanvasLoop);
}

function fireConfetti(originX, originY, count = 50) {
  const colors = [
    `rgb(${themeColorRgb[0]}, ${themeColorRgb[1]}, ${themeColorRgb[2]})`,
    '#ff6b6b', '#ffd166', '#06d6a0', '#118ab2', '#8338ec', '#ffbe0b', '#ec4899'
  ];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      gravity: 0.18,
      size: Math.random() * 8 + 6,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      life: 1,
      decay: Math.random() * 0.012 + 0.008
    });
  }
}

function fireSparkles(originX, originY, count = 25) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.5;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.05,
      size: Math.random() * 4 + 2,
      rotation: 0,
      rotationSpeed: 0,
      color: `rgb(${themeColorRgb[0]}, ${themeColorRgb[1]}, ${themeColorRgb[2]})`,
      shape: 'circle',
      life: 1,
      decay: 0.025
    });
  }
}

// ========================================================
// 3. WEB AUDIO SYNTHESIZER (HAPPY BIRTHDAY MELODY & FX)
// ========================================================
let audioCtx = null;
let isMusicPlaying = false;
let musicTimer = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Happy Birthday melody frequencies (Hz) & relative durations
const MELODY_NOTES = [
  { freq: 261.63, dur: 0.35 }, // C4
  { freq: 261.63, dur: 0.25 }, // C4
  { freq: 293.66, dur: 0.6  }, // D4
  { freq: 261.63, dur: 0.6  }, // C4
  { freq: 349.23, dur: 0.6  }, // F4
  { freq: 329.63, dur: 1.1  }, // E4

  { freq: 261.63, dur: 0.35 }, // C4
  { freq: 261.63, dur: 0.25 }, // C4
  { freq: 293.66, dur: 0.6  }, // D4
  { freq: 261.63, dur: 0.6  }, // C4
  { freq: 392.00, dur: 0.6  }, // G4
  { freq: 349.23, dur: 1.1  }, // F4

  { freq: 261.63, dur: 0.35 }, // C4
  { freq: 261.63, dur: 0.25 }, // C4
  { freq: 523.25, dur: 0.6  }, // C5
  { freq: 440.00, dur: 0.6  }, // A4
  { freq: 349.23, dur: 0.6  }, // F4
  { freq: 329.63, dur: 0.6  }, // E4
  { freq: 293.66, dur: 1.0  }, // D4

  { freq: 466.16, dur: 0.35 }, // Bb4
  { freq: 466.16, dur: 0.25 }, // Bb4
  { freq: 440.00, dur: 0.6  }, // A4
  { freq: 349.23, dur: 0.6  }, // F4
  { freq: 392.00, dur: 0.6  }, // G4
  { freq: 349.23, dur: 1.3  }  // F4
];

function initAudioSynthesizer() {
  const musicBtn = document.getElementById('music-btn');
  const mobileMusicBtn = document.getElementById('mobile-music-btn');

  if (musicBtn) {
    musicBtn.addEventListener('click', toggleMusicPlay);
  }
  if (mobileMusicBtn) {
    mobileMusicBtn.addEventListener('click', toggleMusicPlay);
  }

  // Automatic song playback on website load
  startAutoPlaySong();
}

function startAutoPlaySong() {
  const attemptPlay = () => {
    if (isMusicPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        if (!isMusicPlaying) {
          playBirthdayMelody();
        }
      }).catch(() => {});
    } else {
      playBirthdayMelody();
    }
  };

  // 1. Attempt immediate playback as page loads
  setTimeout(attemptPlay, 400);

  // 2. Also register one-time listeners for first user gesture (touch, scroll, click)
  // This bypasses mobile and browser autoplay restrictions instantly!
  const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
  const onFirstGesture = () => {
    attemptPlay();
    unlockEvents.forEach(evt => {
      window.removeEventListener(evt, onFirstGesture, { capture: true });
      document.removeEventListener(evt, onFirstGesture, { capture: true });
    });
  };

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, onFirstGesture, { capture: true, once: true });
    document.addEventListener(evt, onFirstGesture, { capture: true, once: true });
  });
}

function toggleMusicPlay() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (isMusicPlaying) {
    stopMusic();
    showToast('Music paused 🔇');
  } else {
    playBirthdayMelody();
    showToast('Birthday Dhun Playing! 🎶🎂');
  }
}

function playTone(freq, duration, type = 'triangle', gainLevel = 0.22) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Soft envelope to avoid clicks
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(gainLevel, ctx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playBirthdayMelody() {
  if (isMusicPlaying) return;

  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  isMusicPlaying = true;
  updateMusicUi(true);

  let noteIndex = 0;
  function scheduleNextNote() {
    if (!isMusicPlaying) return;

    if (noteIndex >= MELODY_NOTES.length) {
      noteIndex = 0;
      musicTimer = setTimeout(scheduleNextNote, 1200);
      return;
    }

    const note = MELODY_NOTES[noteIndex];
    playTone(note.freq, note.dur, 'triangle', 0.22);
    // Add warm bell harmonic
    playTone(note.freq * 2, note.dur * 0.7, 'sine', 0.08);

    noteIndex++;
    musicTimer = setTimeout(scheduleNextNote, (note.dur + 0.06) * 1000);
  }

  scheduleNextNote();
}

function stopMusic() {
  isMusicPlaying = false;
  if (musicTimer) clearTimeout(musicTimer);
  updateMusicUi(false);
}

function updateMusicUi(playing) {
  const wave = document.getElementById('music-wave');
  const icon = document.getElementById('music-icon');
  const text = document.getElementById('music-text');
  const mobileIcon = document.querySelector('#mobile-music-btn i');

  if (playing) {
    if (wave) wave.classList.add('playing');
    if (icon) icon.className = 'fa-solid fa-volume-high text-danger';
    if (text) text.textContent = 'Pause';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-volume-high text-danger';
  } else {
    if (wave) wave.classList.remove('playing');
    if (icon) icon.className = 'fa-solid fa-music';
    if (text) text.textContent = 'Music';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-music';
  }
}

// Sound FX Helpers
function playWhooshSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function playFanfareSound() {
  const notes = [261.63, 329.63, 392.00, 523.25];
  notes.forEach((f, idx) => {
    setTimeout(() => {
      playTone(f, 0.28, 'triangle', 0.25);
    }, idx * 90);
  });
}

function playClinkSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  playTone(1800, 0.45, 'sine', 0.22);
  playTone(2400, 0.3, 'triangle', 0.12);
}

function playGiftChime() {
  const notes = [330, 392, 494, 659];
  notes.forEach((f, idx) => {
    setTimeout(() => {
      playTone(f, 0.35, 'sine', 0.2);
    }, idx * 75);
  });
}

function playHeartPop() {
  playTone(587.33, 0.15, 'sine', 0.18);
}

// ========================================================
// 4. LAYER 2: INTERACTIVE CAKE & CANDLE BLOWING
// ========================================================
function initCakeInteractions() {
  const candles = document.querySelectorAll('.candle-unit');
  const blowBtn = document.getElementById('blow-cake-btn');
  const relightBtn = document.getElementById('relight-cake-btn');
  const fireworksBtn = document.getElementById('blast-fireworks-btn');
  const wishBox = document.getElementById('wish-reveal-box');

  // Individual Candle Click
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      if (!candle.classList.contains('blown')) {
        candle.classList.add('blown');
        playWhooshSound();
        const rect = candle.getBoundingClientRect();
        fireSparkles(rect.left + rect.width / 2, rect.top);
        checkAllCandlesBlown();
      }
    });
  });

  // Blow All Button
  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      candles.forEach((c, idx) => {
        setTimeout(() => {
          c.classList.add('blown');
          playWhooshSound();
        }, idx * 80);
      });

      setTimeout(() => {
        finishCakeCelebration();
      }, candles.length * 85);
    });
  }

  // Relight Button
  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      candles.forEach(c => c.classList.remove('blown'));
      if (wishBox) wishBox.classList.remove('show');
      relightBtn.style.display = 'none';
      if (blowBtn) blowBtn.style.display = 'inline-block';
      showToast('Candles phir se jal gayi hain! 🔥');
      playTone(440, 0.2, 'sine', 0.2);
    });
  }

  // Fireworks Button
  if (fireworksBtn) {
    fireworksBtn.addEventListener('click', (e) => {
      const rect = fireworksBtn.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top, 70);
      playFanfareSound();
      showToast('Shandaar Aatishbazi! 🎆👑');
    });
  }

  function checkAllCandlesBlown() {
    const allBlown = Array.from(candles).every(c => c.classList.contains('blown'));
    if (allBlown) {
      finishCakeCelebration();
    }
  }

  function finishCakeCelebration() {
    if (wishBox) wishBox.classList.add('show');
    if (blowBtn) blowBtn.style.display = 'none';
    if (relightBtn) relightBtn.style.display = 'inline-block';

    const cakeCard = document.querySelector('.cake-main-card');
    if (cakeCard) {
      const rect = cakeCard.getBoundingClientRect();
      fireConfetti(rect.left + rect.width / 2, rect.top + 80, 80);
    }
    playFanfareSound();
    showToast('Wish Qubool Hui! Janamdin Mubarak Arman Bhai! 🎂✨');
  }
}

// ========================================================
// 5. LAYER 3: DIL KI BAAT (PARCHMENT LETTER)
// ========================================================
function initLetterInteractions() {
  const heartBtn = document.getElementById('letter-heart-btn');
  const dateEl = document.getElementById('letter-date');

  // Set friendly current month/year
  if (dateEl) {
    const now = new Date();
    const options = { month: 'long', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  if (heartBtn) {
    heartBtn.addEventListener('click', (e) => {
      playHeartPop();
      spawnFlyingHearts(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
      showToast('Aapka pyar Arman Bhaiya tak pahunch gaya! ❤️✨');
    });
  }
}

function spawnFlyingHearts(x, y) {
  const hearts = ['❤️', '💖', '👑', '✨', '💐'];
  for (let i = 0; i < 7; i++) {
    const heart = document.createElement('div');
    heart.className = 'flying-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x + (Math.random() - 0.5) * 80}px`;
    heart.style.top = `${y + (Math.random() - 0.5) * 40}px`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1400);
  }
}

// ========================================================
// 6. LAYER 4: MEMORY VAULT & BOOTSTRAP LIGHTBOX
// ========================================================
function initMemoryLightbox() {
  const modalEl = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('modal-zoom-img');
  const modalCaption = document.getElementById('modal-caption-text');
  const polaroids = document.querySelectorAll('.polaroid-card');

  if (!modalEl || typeof bootstrap === 'undefined') return;
  const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

  polaroids.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-full-src');
      const caption = card.getAttribute('data-caption');

      if (modalImg && src) {
        modalImg.src = src;
      }
      if (modalCaption && caption) {
        modalCaption.textContent = caption;
      }

      bsModal.show();
      playTone(400, 0.15, 'sine', 0.1);
    });
  });
}

// ========================================================
// 7. LAYER 5: AWARDS (HALL OF FAME)
// ========================================================
function initAwardsInteractions() {
  const claimButtons = document.querySelectorAll('.claim-award-btn');

  claimButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const box = btn.closest('.award-box');
      const awardName = btn.getAttribute('data-name') || 'Brotherhood Trophy';

      if (box && !box.classList.contains('claimed')) {
        box.classList.add('claimed');
        btn.innerHTML = '<i class="fa-solid fa-circle-check me-2"></i> Claimed! 👑';
        btn.disabled = true;

        const rect = btn.getBoundingClientRect();
        fireConfetti(rect.left + rect.width / 2, rect.top, 40);
        playFanfareSound();
        showToast(`${awardName} trophy Arman Bhaiya ke naam! 🏆`);
      }
    });
  });
}

// ========================================================
// 8. LAYER 6: MYSTERY GIFT BOX
// ========================================================
function initGiftBoxInteractions() {
  const giftWrapper = document.getElementById('gift-box-wrapper');
  const giftCube = document.getElementById('gift-cube');
  const giftPrize = document.getElementById('gift-prize-card');
  const giftPrompt = document.getElementById('gift-prompt-text');
  const acceptBtn = document.getElementById('accept-pass-btn');

  let isGiftOpen = false;

  if (giftWrapper) {
    giftWrapper.addEventListener('click', () => {
      if (!isGiftOpen) {
        isGiftOpen = true;
        if (giftCube) giftCube.classList.add('open');
        if (giftPrize) giftPrize.classList.add('show');
        if (giftPrompt) {
          giftPrompt.innerHTML = '<span class="text-success">✨ Gift Khul Gaya! Pass Unlock Ho Chuka Hai 👑</span>';
        }

        const rect = giftWrapper.getBoundingClientRect();
        fireConfetti(rect.left + rect.width / 2, rect.top + 50, 75);
        playGiftChime();
        showToast('Special Brotherhood Pass Unlocked! 🎁👑');
      }
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      acceptBtn.innerHTML = '<i class="fa-solid fa-handshake me-2"></i> Pass Activated & Saved! ❤️';
      acceptBtn.classList.remove('btn-theme-primary');
      acceptBtn.classList.add('btn-success');
      acceptBtn.disabled = true;
      playFanfareSound();
      showToast('Life-Long Brotherhood Pass Hamesha Ke Liye Valid! 🤝');
    });
  }
}

// ========================================================
// 9. LAYER 7: VIRTUAL TOAST (CHEERS!)
// ========================================================
const BROTHER_TOASTS = [
  "“Arman bhai ke naam ek jaam! Jinhone har mushkil waqt me mera haath thama aur mujhe ladna sikhaya. Aap hamesha haste raho aur kamyabi ke naye records banao! Cheers Arman! 🥂”",
  "“Duniya me lakho rishte bante hain, par bade bhai jaisa sahara koi nahi ban sakta. Arman Bhaiya aap meri strength ho! To eternal happiness & health! 🥂”",
  "“Late night chai ke chuskiyon se lekar life ke bade decisions tak, jinke bina koi baat poori nahi hoti. Ek toast humare sabse pyare Arman Bhai ke naam! 🥂”",
  "“Bhagwan kare is saal aapke saare dream projects safal hon, bank account full rahe aur hamesha face pe yehi smile bani rahe! Cheers Bhai! 🥂”"
];

function initToastInteractions() {
  const clinkBtn = document.getElementById('clink-btn');
  const nextToastBtn = document.getElementById('next-toast-btn');
  const glassesRow = document.getElementById('glasses-row');
  const counterEl = document.getElementById('toast-counter-val');
  const quoteEl = document.getElementById('toast-quote-text');

  let toastCount = 0;
  let quoteIndex = 0;

  function doClink() {
    toastCount++;
    if (counterEl) counterEl.textContent = toastCount;

    if (glassesRow) {
      glassesRow.classList.add('clinking');
      setTimeout(() => {
        glassesRow.classList.remove('clinking');
      }, 350);
    }

    playClinkSound();

    if (glassesRow) {
      const rect = glassesRow.getBoundingClientRect();
      fireSparkles(rect.left + rect.width / 2, rect.top + 20, 20);
    }

    showToast(`Cheers to Arman Bhaiya! (${toastCount} baar🥂)`);
  }

  if (clinkBtn) clinkBtn.addEventListener('click', doClink);
  if (glassesRow) glassesRow.addEventListener('click', doClink);

  if (nextToastBtn && quoteEl) {
    nextToastBtn.addEventListener('click', () => {
      quoteIndex = (quoteIndex + 1) % BROTHER_TOASTS.length;
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = BROTHER_TOASTS[quoteIndex];
        quoteEl.style.opacity = '1';
      }, 200);
      playTone(520, 0.15, 'sine', 0.15);
    });
  }
}

// ========================================================
// 10. NAVIGATION, SCROLLSPY & BACK TO TOP
// ========================================================
function initNavigation() {
  const mainNav = document.getElementById('main-nav');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  // Navbar scrolled shadow
  window.addEventListener('scroll', () => {
    if (mainNav) {
      if (window.scrollY > 40) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }
    updateActiveNavLink();
  }, { passive: true });

  // Back to top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Close mobile nav collapse when clicking nav-links
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navCollapse = document.getElementById('navbarContent');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section.layer[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const scrollPos = window.scrollY + 120;

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

// ========================================================
// 11. WHATSAPP SHARING
// ========================================================
function initWhatsAppShare() {
  const shareBtn = document.getElementById('nav-share-btn');
  const finalShareBtn = document.getElementById('final-whatsapp-btn');

  const shareText = encodeURIComponent(
    "👑 Janamdin Mubarak ho Arman Bhaiya! 🎂\nMaine aapke liye ek special birthday celebration website banayi hai.\nDekhiye yahan: " + window.location.href
  );
  const waUrl = `https://wa.me/?text=${shareText}`;

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(waUrl, '_blank');
    });
  }

  if (finalShareBtn) {
    finalShareBtn.href = waUrl;
  }
}

// ========================================================
// 12. TOAST NOTIFICATION HELPER
// ========================================================
let toastTimeout = null;

function showToast(message, duration = 3000) {
  const toastEl = document.getElementById('app-toast');
  const textEl = document.getElementById('toast-text');
  if (!toastEl || !textEl) return;

  textEl.textContent = message;
  toastEl.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}
