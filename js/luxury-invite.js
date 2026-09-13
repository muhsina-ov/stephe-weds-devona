/**
 * Stephen & Devona Wedding Invitation Scripts
 * Cloudflare Pages Ready & Mobile Optimized
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const overlay = document.getElementById('weiOverlay');
  const videoWrap = document.getElementById('weiVideoWrap');
  const video = document.getElementById('weiVideo');
  const audio = document.getElementById('weiAudio');
  const audioBtn = document.getElementById('weiAudioBtn');
  const iconPause = document.getElementById('weiIconPause');
  const iconPlay = document.getElementById('weiIconPlay');
  
  let sequenceStarted = false;
  let audioPlaying = false;

  // 1. Interactive Wax Seal Opening
  function startOpeningSequence() {
    if (sequenceStarted) return;
    sequenceStarted = true;

    // Fade out initial envelope overlay
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1200);

    // Fade in video wrap & play opening video
    videoWrap.classList.add('wei-video-in');
    
    if (video) {
      const videoPromise = video.play();
      if (videoPromise !== undefined) {
        videoPromise.catch(() => {
          // If video autoplay is blocked, immediately end sequence
          endSequence();
        });
      }
    }

    // Also start hero background video so it is ready immediately
    const heroBgVideo = document.getElementById('heroBgVideo');
    if (heroBgVideo) {
      heroBgVideo.play().catch(() => {});
    }

    // Play background music
    if (audio) {
      audio.volume = 0.85;
      const audioPromise = audio.play();
      if (audioPromise !== undefined) {
        audioPromise.then(() => {
          audioPlaying = true;
          updateAudioUi(true);
        }).catch(() => {
          audioPlaying = false;
          updateAudioUi(false);
        });
      }
    }
  }

  function endSequence() {
    // Fade out video wrap smoothly
    videoWrap.classList.remove('wei-video-in');
    videoWrap.classList.add('wei-video-out');
    setTimeout(() => {
      videoWrap.style.display = 'none';
    }, 1200);

    // Ensure hero video is playing continuously
    const heroBgVideo = document.getElementById('heroBgVideo');
    if (heroBgVideo && heroBgVideo.paused) {
      heroBgVideo.play().catch(() => {});
    }

    // Show floating audio toggle button
    if (audioBtn) {
      audioBtn.classList.add('active-visible');
    }
  }

  if (overlay) {
    overlay.addEventListener('click', startOpeningSequence);
    overlay.addEventListener('touchstart', startOpeningSequence, { passive: true });
  }

  if (video) {
    // Transition out 0.8s before video finishes
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.8 && !video.dataset.fading) {
        video.dataset.fading = '1';
        endSequence();
      }
    });

    video.addEventListener('ended', () => {
      endSequence();
    });

    video.load();
  }

  // 2. Audio Toggle Controls
  function updateAudioUi(isPlaying) {
    if (!audioBtn || !iconPlay || !iconPause) return;
    if (isPlaying) {
      iconPlay.style.display = 'none';
      iconPause.style.display = 'block';
      audioBtn.classList.add('audio-pulsing');
    } else {
      iconPlay.style.display = 'block';
      iconPause.style.display = 'none';
      audioBtn.classList.remove('audio-pulsing');
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!audio) return;
      if (audio.paused) {
        audio.play().then(() => {
          audioPlaying = true;
          updateAudioUi(true);
        }).catch(() => {});
      } else {
        audio.pause();
        audioPlaying = false;
        updateAudioUi(false);
      }
    });

    audio.loop = true;
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });
  }

  // 3. Live Wedding Countdown to Oct 7, 2026, 10:00 AM IST
  const targetDate = new Date('2026-10-07T10:00:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minsEl = document.getElementById('timerMins');
    const secsEl = document.getElementById('timerSecs');

    if (diff <= 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minsEl) minsEl.innerText = '00';
      if (secsEl) secsEl.innerText = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minsEl) minsEl.innerText = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 4. Lightbox Modal for Official Cards
  const modal = document.getElementById('luxuryModal');
  const modalImg = document.getElementById('luxuryModalImg');
  const modalClose = document.getElementById('modalCloseBtn');
  const triggers = document.querySelectorAll('[data-lightbox-src]');

  triggers.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox-src');
      if (modal && modalImg && src) {
        modalImg.src = src;
        modal.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });
});
