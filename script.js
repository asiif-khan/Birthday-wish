/* script.js - 39209.mp4 Interaction Script */
document.addEventListener("DOMContentLoaded", () => {
  const config = window.birthdayConfig || {
    name: "Friend",
    musicSrc: "audio/birthday.mp3",
    loadingTitle: "Initializing Surprise...",
    loadingButtonText: "Found 1 Result 🎉",
    envelopeMessage: ["Hey..."],
    messageCardText: "You are amazing.",
    choiceQuestion: "Celebrating?",
    choiceButtons: { left: "100%", right: "FOREVER" },
    musicTitle: "Us ❤️",
    musicSubtitle: "Birthday Vibe",
    musicQuote: "A year older and happier.",
    proposalQuestion: "Are you ready?",
    proposalButtons: { yes: "YES", no: "NO" },
    celebrationTitle: "Yayyyyy",
    celebrationMessages: ["Officially..."],
    celebrationButtonText: "Replay"
  };

  // State
  let currentScreenIndex = 0;
  const screens = [
    "screen-loading",
    "screen-envelope",
    "screen-message",
    "screen-choice",
    "screen-music",
    "screen-proposal",
    "screen-celebration"
  ];

  // Background Particles Engine
  const bgCanvas = document.getElementById("bg-canvas");
  const bgCtx = bgCanvas?.getContext("2d");
  let bgParticles = [];
  let isMotionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resizeBgCanvas() {
    if (!bgCanvas) return;
    const rect = bgCanvas.parentElement.getBoundingClientRect();
    bgCanvas.width = rect.width;
    bgCanvas.height = rect.height;
  }

  class HeartParticle {
    constructor() {
      this.reset(true);
    }
    reset(initY = false) {
      if (!bgCanvas) return;
      this.x = Math.random() * bgCanvas.width;
      this.y = initY ? Math.random() * bgCanvas.height : bgCanvas.height + 20;
      this.size = Math.random() * 8 + 4; // Heart size
      this.speed = Math.random() * 0.5 + 0.15;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
      this.rotation = Math.random() * 0.4 - 0.2;
    }
    update() {
      this.y -= this.speed;
      this.angle += this.wobbleSpeed;
      this.x += Math.sin(this.angle) * 0.15;
      if (this.y < -20) this.reset();
    }
    draw() {
      if (!bgCtx) return;
      bgCtx.save();
      bgCtx.globalAlpha = this.opacity;
      bgCtx.translate(this.x, this.y);
      bgCtx.rotate(this.rotation);
      bgCtx.fillStyle = "#ff5ba5";
      bgCtx.beginPath();
      // Draw small heart
      const size = this.size;
      bgCtx.moveTo(0, 0);
      bgCtx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
      bgCtx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
      bgCtx.fill();
      bgCtx.restore();
    }
  }

  function initBgParticles() {
    if (isMotionReduced || !bgCanvas) return;
    bgParticles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      bgParticles.push(new HeartParticle());
    }
  }

  function animateBg() {
    if (isMotionReduced || !bgCanvas || !bgCtx) return;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgParticles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateBg);
  }

  // Confetti celebration physics
  const confettiCanvas = document.getElementById("confetti-canvas");
  const confettiCtx = confettiCanvas?.getContext("2d");
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    const rect = confettiCanvas.parentElement.getBoundingClientRect();
    confettiCanvas.width = rect.width;
    confettiCanvas.height = rect.height;
  }

  class ConfettiItem {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 8 + 5;
      const colors = ["#ff2d55", "#ffd57a", "#b666d2", "#ffffff", "#ff8fa4"];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = Math.random() * 8 - 4;
      this.speedY = Math.random() * -12 - 4;
      this.gravity = 0.3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.opacity = 1;
      this.decay = Math.random() * 0.01 + 0.005;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }
    draw() {
      if (!confettiCtx) return;
      confettiCtx.save();
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate(this.rotation * Math.PI / 180);
      confettiCtx.fillStyle = this.color;
      confettiCtx.globalAlpha = this.opacity;
      confettiCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      confettiCtx.restore();
    }
  }

  function triggerConfetti(x, y, count = 40) {
    if (isMotionReduced) return;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiItem(x, y));
    }
    if (!confettiAnimationId) animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiParticles = confettiParticles.filter(p => p.opacity > 0);
    confettiParticles.forEach(p => {
      p.update();
      p.draw();
    });

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
    }
  }

  // Audio system
  let audio = null;
  const musicToggle = document.getElementById("music-toggle");
  const audioHint = document.getElementById("audio-hint");
  const recordDisk = document.getElementById("record-disk");
  const playButton = document.getElementById("play-button");
  const eqVisualizer = document.getElementById("eq-visualizer");
  let isPlaying = false;

  function initAudio() {
    if (!config.musicSrc) {
      if (musicToggle) musicToggle.style.display = "none";
      if (playButton) playButton.style.display = "none";
      return;
    }

    audio = new Audio(config.musicSrc);
    audio.loop = true;

    audio.addEventListener("error", () => {
      console.warn("Audio file issue. Music controls disabled.");
      if (musicToggle) musicToggle.style.display = "none";
      if (playButton) playButton.style.display = "none";
      audio = null;
    });

    // Top Right global music toggle
    if (musicToggle) {
      musicToggle.addEventListener("click", togglePlayback);
    }

    // Music Screen Player button
    if (playButton) {
      playButton.addEventListener("click", togglePlayback);
    }
  }

  function togglePlayback() {
    if (!audio) return;
    if (!isPlaying) {
      audio.play().then(() => {
        isPlaying = true;
        updateAudioUI(true);
        showAudioHint("Playing 🎵");
      }).catch(err => {
        console.error("Audio blocked:", err);
        showAudioHint("Blocked ❌");
      });
    } else {
      audio.pause();
      isPlaying = false;
      updateAudioUI(false);
      showAudioHint("Paused 🔇");
    }
  }

  function updateAudioUI(playState) {
    if (musicToggle) {
      if (playState) musicToggle.classList.add("playing");
      else musicToggle.classList.remove("playing");
    }
    if (recordDisk) {
      if (playState) recordDisk.classList.add("playing");
      else recordDisk.classList.remove("playing");
    }
    if (eqVisualizer) {
      if (playState) eqVisualizer.classList.add("playing");
      else eqVisualizer.classList.remove("playing");
    }
    if (playButton) {
      playButton.textContent = playState ? "❤️ Playing..." : "❤️ Play Song";
    }
  }

  function showAudioHint(text) {
    if (!audioHint) return;
    audioHint.textContent = text;
    audioHint.style.opacity = "1";
    setTimeout(() => {
      audioHint.style.opacity = "0";
    }, 1500);
  }

  // Hydrate configurations
  function hydrate() {
    // Screen 1
    const loaderTitle = document.getElementById("loader-title");
    if (loaderTitle) loaderTitle.textContent = config.loadingTitle;
    
    const loaderBtn = document.getElementById("loader-btn");
    if (loaderBtn) loaderBtn.textContent = config.loadingButtonText;

    // Screen 2 (Envelope message)
    const envBody = document.getElementById("envelope-body");
    if (envBody && config.envelopeMessage) {
      envBody.innerHTML = "";
      config.envelopeMessage.forEach(line => {
        const p = document.createElement("p");
        p.className = "body-text-dark";
        p.style.marginBottom = "10px";
        p.textContent = line.replace("[NAME]", config.name);
        envBody.appendChild(p);
      });
    }

    // Screen 3
    const msgCardText = document.getElementById("msg-card-text");
    if (msgCardText) msgCardText.textContent = config.messageCardText.replace("[NAME]", config.name);

    // Screen 4
    const choiceQuestion = document.getElementById("choice-question");
    if (choiceQuestion) choiceQuestion.textContent = config.choiceQuestion;
    
    const choiceLeft = document.getElementById("choice-left");
    if (choiceLeft) choiceLeft.textContent = config.choiceButtons.left;
    
    const choiceRight = document.getElementById("choice-right");
    if (choiceRight) choiceRight.textContent = config.choiceButtons.right;

    // Screen 5
    const musicTitle = document.getElementById("music-title");
    if (musicTitle) musicTitle.textContent = config.musicTitle;
    
    const musicSubtitle = document.getElementById("music-subtitle");
    if (musicSubtitle) musicSubtitle.textContent = config.musicSubtitle;
    
    const musicQuote = document.getElementById("music-quote");
    if (musicQuote) musicQuote.textContent = config.musicQuote;

    // Screen 6
    const proposalQuestion = document.getElementById("proposal-question");
    if (proposalQuestion) proposalQuestion.textContent = config.proposalQuestion;
    
    const yesBtn = document.getElementById("yes-btn");
    if (yesBtn) yesBtn.textContent = config.proposalButtons.yes;
    
    const noBtn = document.getElementById("no-btn");
    if (noBtn) noBtn.textContent = config.proposalButtons.no;

    // Screen 7
    const celebrateTitle = document.getElementById("celebrate-title");
    if (celebrateTitle) celebrateTitle.textContent = config.celebrationTitle;

    const celebrateBody = document.getElementById("celebrate-body");
    if (celebrateBody && config.celebrationMessages) {
      celebrateBody.innerHTML = "";
      config.celebrationMessages.forEach(line => {
        const p = document.createElement("p");
        p.className = "body-text-light";
        p.style.marginBottom = "12px";
        p.textContent = line;
        celebrateBody.appendChild(p);
      });
    }

    const celebrateBtn = document.getElementById("celebrate-btn");
    if (celebrateBtn) celebrateBtn.textContent = config.celebrationButtonText;
  }

  // Transitions State Controller
  function showScreen(index) {
    const prevScreenId = screens[currentScreenIndex];
    const newScreenId = screens[index];

    const prevScreenEl = document.getElementById(prevScreenId);
    const newScreenEl = document.getElementById(newScreenId);

    if (prevScreenEl) {
      prevScreenEl.classList.remove("active");
      prevScreenEl.classList.add("exit");
      const cleanExit = () => {
        prevScreenEl.classList.remove("exit");
        prevScreenEl.removeEventListener("transitionend", cleanExit);
      };
      prevScreenEl.addEventListener("transitionend", cleanExit);
    }

    if (newScreenEl) {
      newScreenEl.classList.add("active");
    }

    currentScreenIndex = index;
    triggerScreenLogic(newScreenId);
  }

  function nextScreen() {
    if (currentScreenIndex < screens.length - 1) {
      showScreen(currentScreenIndex + 1);
    }
  }

  function triggerScreenLogic(screenId) {
    if (screenId === "screen-loading") {
      runProgressLoader();
    }
    if (screenId === "screen-celebration") {
      // Trigger ongoing confetti bursts
      let count = 0;
      const interval = setInterval(() => {
        if (count > 8 || currentScreenIndex !== 6) {
          clearInterval(interval);
          return;
        }
        triggerConfetti(Math.random() * window.innerWidth, window.innerHeight - 20, 20);
        count++;
      }, 400);
    }
  }

  // Loader bar simulation
  function runProgressLoader() {
    const fill = document.getElementById("loader-bar-fill");
    const percent = document.getElementById("loader-percent");
    const btn = document.getElementById("loader-btn");
    if (!fill || !percent || !btn) return;

    fill.style.width = "0%";
    percent.textContent = "0%";
    btn.style.display = "none";

    let progress = 0;
    const duration = 2500; // 2.5 seconds
    const intervalTime = 40;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        percent.textContent = "100%";
        fill.style.width = "100%";
        setTimeout(() => {
          btn.style.display = "inline-block";
        }, 300);
      } else {
        percent.textContent = `${Math.floor(progress)}%`;
        fill.style.width = `${progress}%`;
      }
    }, intervalTime);
  }

  // Runaway "No" button logic
  const noBtn = document.getElementById("no-btn");
  if (noBtn) {
    const escape = (e) => {
      const container = document.querySelector(".app-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();

      // Restrict coordinate bounds within phone viewport mockup
      const maxX = containerRect.width - btnRect.width - 24;
      const maxY = containerRect.height - btnRect.height - 24;

      const randomX = Math.max(12, Math.random() * maxX);
      const randomY = Math.max(12, Math.random() * maxY);

      noBtn.style.position = "absolute";
      noBtn.style.left = `${randomX}px`;
      noBtn.style.top = `${randomY}px`;
    };

    noBtn.addEventListener("mouseover", escape);
    noBtn.addEventListener("touchstart", escape, { passive: true });
  }

  // Navigation Click Bindings
  document.querySelectorAll("[data-action='next']").forEach(button => {
    button.addEventListener("click", nextScreen);
  });

  const celebrateBtn = document.getElementById("celebrate-btn");
  if (celebrateBtn) {
    celebrateBtn.addEventListener("click", () => {
      if (audio) {
        audio.pause();
      }
      window.location.href = "index.html";
    });
  }

  // Bootstraps
  hydrate();
  resizeBgCanvas();
  resizeConfettiCanvas();
  initBgParticles();
  initAudio();
  animateBg();
  showScreen(0);

  window.addEventListener("resize", () => {
    resizeBgCanvas();
    resizeConfettiCanvas();
  });
});
