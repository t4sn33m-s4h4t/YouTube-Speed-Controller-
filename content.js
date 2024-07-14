// YouTube Playback Speed Controller and Ad Skipper Extension

// Core Functionality to Handle Video Changes
function handleVideoChange() {
  setSessionStorageSpeedToVideo();
}

// Observer to Detect Video Source Changes
function observeYouTubeVideoChange() {
  const videoElement = document.querySelector('video');
  if (!videoElement) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
        handleVideoChange();
      }
    }
  });

  observer.observe(videoElement, { attributes: true });
}

// Initialization Function
function initializeExtension() {
  createSpeedMessage();
  addControlLinks();
  observeYouTubeVideoChange();
  monitorAds();
}

// Delayed Initialization on Window Load
window.addEventListener('load', () => {
  setTimeout(initializeExtension, 1000);
});

// Set Playback Speed and Update Session Storage
function setPlaybackSpeed(speed) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = Math.max(0.25, Math.min(speed, 10));
    sessionStorage.setItem('yt-player-playback-rate', JSON.stringify({ data: speed.toString(), creation: Date.now() }));
    updateSpeedDisplay();
  }
}

// Change Speed by Given Increment
function changeSpeed(increment) {
  const video = document.querySelector('video');
  if (video) {
    setPlaybackSpeed(video.playbackRate + increment);
    showSpeedMessage();
  }
}

// Update Speed Display Element
function updateSpeedDisplay() {
  const speedDisplay = document.querySelector('#speedDisplay');
  const video = document.querySelector('video');
  if (speedDisplay && video) {
    speedDisplay.textContent = video.playbackRate.toFixed(2);
  }
}

// Create Control Link for Speed Adjustment
function createControlLink(text, iconClass, onClick, id) {
  const link = document.createElement('a');
  link.innerHTML = iconClass ? `<i class="${iconClass}"></i> ${text}` : text;
  Object.assign(link.style, {
    color: 'white',
    fontSize: '14px',
    padding: '5px',
    cursor: 'pointer',
    fontWeight: '600',
  });

  if (id) link.id = id;
  link.addEventListener('click', (event) => { event.preventDefault(); onClick(); });
  return link;
}

// Apply Saved Playback Speed from Session Storage
function setSessionStorageSpeedToVideo() {
  const speedData = sessionStorage.getItem('yt-player-playback-rate');
  if (speedData) {
    setPlaybackSpeed(Number(JSON.parse(speedData).data));
  }
}

// Add Speed Control Links to YouTube Player
function addControlLinks() {
  setSessionStorageSpeedToVideo();

  const controlsContainer = document.querySelector('.ytp-left-controls');
  if (!controlsContainer) return;

  const controlWrapper = document.createElement('div');
  Object.assign(controlWrapper.style, {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginRight: '10px',
    background: '#ff0000ad',
    borderRadius: '30px',
    margin: 'auto 10px',
    height: '80%',
    padding: '0 5px',
  });
  controlWrapper.classList.add('unselectable');

  controlWrapper.append(
    createControlLink('+', 'fas fa-plus', () => changeSpeed(0.25)),
    createControlLink('1.00x', '', () => {}, 'speedDisplay'),
    createControlLink('-', 'fas fa-minus', () => changeSpeed(-0.25)),
  );

  controlsContainer.appendChild(controlWrapper);
  updateSpeedDisplay();

  controlWrapper.addEventListener('selectstart', (e) => e.preventDefault());
}

// Keydown Event Listener for Speed Control
document.addEventListener('keydown', (event) => {
  if (event.shiftKey) {
    switch (event.key.toLowerCase()) {
      case 'x':
        changeSpeed(0.25);
        break;
      case 'z':
        changeSpeed(-0.25);
        break;
      case '>':
        const video = document.querySelector('video');
        const bezelText = document.querySelector('.ytp-bezel-text');
        if (video && bezelText && (bezelText.innerText === '2x' || video.playbackRate > 2)) {
          setPlaybackSpeed(2);
        }
        updateSpeedDisplay();
        break;
      case '<':
        updateSpeedDisplay();
        break;
    }
  }
});

// Show Speed Message Temporarily
function showSpeedMessage() {
  const showSpeedWrapper = document.querySelector('.showSpeedWrapper');
  const showSpeedText = document.querySelector('.showSpeedText');
  const video = document.querySelector('video');
  if (showSpeedWrapper && showSpeedText && video) {
    showSpeedText.innerText = `${video.playbackRate}x`;
    showSpeedWrapper.style.display = 'block';
    setTimeout(() => { showSpeedWrapper.style.display = 'none'; }, 450);
  }
}

// Create Speed Message Display
function createSpeedMessage() {
  const videoPlayer = document.querySelector('.html5-video-player');
  if (videoPlayer) {
    const speedContainer = document.createElement('div');
    const showSpeedWrapper = document.createElement('div');
    showSpeedWrapper.classList.add('showSpeedWrapper');

    const showSpeedText = document.createElement('div');
    showSpeedText.classList.add('showSpeedText');
    Object.assign(showSpeedText.style, {
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: '175%',
      background: 'rgba(0, 0, 0, .5)',
      pointerEvents: 'none',
      borderRadius: '3px',
    });
    Object.assign(showSpeedWrapper.style, {
      textAlign: 'center',
      position: 'absolute',
      left: '0',
      right: '0',
      top: '10%',
      zIndex: 19,
      display: 'none',
    });

    showSpeedWrapper.appendChild(showSpeedText);
    speedContainer.appendChild(showSpeedWrapper);
    videoPlayer.appendChild(speedContainer);
  }
}

// Ad Skipping and Speed Adjustment for Ads

// Function to Skip Skippable Ads
function skipAd() {
  const skipButton = document.querySelector('.ytp-skip-ad-button');
  if (skipButton) {
    skipButton.click();
  }
}

// Function to Set Playback Rate for Unskippable Ads
function setAdPlaybackRate(rate) {
  const video = document.querySelector('video');
  if (video) {
    video.playbackRate = rate;
  }
}

// Monitor Ads and Apply Appropriate Actions
function monitorAds() {
  const adContainer = document.querySelector('.video-ads.ytp-ad-module');
  
  if (adContainer) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const isSkippableAd = document.querySelector('.ytp-skip-ad-button');
          
          if (isSkippableAd) {
            skipAd();
          } else {
            setAdPlaybackRate(16);
          }
        } else if (mutation.removedNodes.length) {
          setSessionStorageSpeedToVideo();
        }
      }
    });
    
    observer.observe(adContainer, { childList: true, subtree: true });
  }
}





