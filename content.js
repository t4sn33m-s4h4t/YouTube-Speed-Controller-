// YouTube Speed Controller with Ad Skipping
(function() {
  'use strict';

  // Configuration
  const config = {
      maxSpeed: 16,
      minSpeed: 0.25,
      speedStep: 0.25,
      adSpeed: 16,
      skipDelay: 300 // ms delay before skipping ads
  };

  // State management
  const state = {
      currentSpeed: 1.0,
      isAdPlaying: false,
      observer: null,
      adCheckInterval: null
  };

  // DOM Elements
  const elements = {
      get video() { return document.querySelector('video'); },
      get controlsContainer() { return document.querySelector('.ytp-left-controls'); },
      get adContainer() { return document.querySelector('.ytp-ad-module'); },
      get skipButton() { return document.querySelector('.ytp-skip-ad-button, .ytp-skip-button'); },
      get adPlayer() { return document.querySelector('.ad-showing, .ad-interrupting'); }
  };

  // Load saved speed from storage
  function loadSpeed() {
      chrome.storage.local.get(['ytSpeed'], (result) => {
          const savedSpeed = parseFloat(result.ytSpeed);
          if (!isNaN(savedSpeed) && savedSpeed >= config.minSpeed && savedSpeed <= config.maxSpeed) {
              state.currentSpeed = savedSpeed;
          }
          initializeController();
      });
  }

  // Save speed to storage
  function saveSpeed(speed) {
      chrome.storage.local.set({ ytSpeed: speed });
  }

  // Core speed functions
  function setSpeed(speed) {
      if (!elements.video) return;
      
      speed = Math.max(config.minSpeed, Math.min(speed, config.maxSpeed));
      state.currentSpeed = speed;
      elements.video.playbackRate = speed;
      saveSpeed(speed);
      updateSpeedDisplay();
      showSpeedNotification(speed);
  }

  function changeSpeed(increment) {
      setSpeed(state.currentSpeed + increment);
  }

  // UI Functions
  function updateSpeedDisplay() {
      const speedDisplay = document.querySelector('#speedDisplay');
      if (speedDisplay) {
          speedDisplay.textContent = state.currentSpeed.toFixed(2);
      }
  }

  function showSpeedNotification(speed) {
    const showSpeedWrapper = document.querySelector('.showSpeedWrapper');
    const showSpeedText = document.querySelector('.showSpeedText');
    
    if (showSpeedWrapper && showSpeedText) {
        showSpeedText.textContent = `${speed.toFixed(2)}×`;
        showSpeedWrapper.style.display = 'block';
        setTimeout(() => { showSpeedWrapper.style.display = 'none'; }, 450);
    } else {
        createSpeedMessage();
        showSpeedNotification(speed); // Retry after creating elements
    }
  }

  function createSpeedMessage() {
    const videoPlayer = document.querySelector('.html5-video-player');
    if (videoPlayer && !document.querySelector('.showSpeedWrapper')) {
        const speedContainer = document.createElement('div');
        const showSpeedWrapper = document.createElement('div');
        showSpeedWrapper.className = 'showSpeedWrapper';

        const showSpeedText = document.createElement('div');
        showSpeedText.className = 'showSpeedText';
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
            zIndex: '19',
            display: 'none',
        });

        showSpeedWrapper.appendChild(showSpeedText);
        speedContainer.appendChild(showSpeedWrapper);
        videoPlayer.appendChild(speedContainer);
    }
  }

  // Control Panel with corrected button order
  function createControlLink(text, onClick, id = '') {
      const link = document.createElement('a');
      link.textContent = text;
      Object.assign(link.style, {
          color: 'white',
          fontSize: '14px',
          padding: '5px 8px',
          cursor: 'pointer',
          fontWeight: '600',
          margin: '0 2px',
          userSelect: 'none'
      });
      
      if (id) link.id = id;
      link.addEventListener('click', (e) => {
          e.preventDefault();
          onClick();
      });
      return link;
  }

  function addControlPanel() {
      // Remove existing panel if present
      const existingPanel = document.querySelector('.ytp-speed-panel');
      if (existingPanel) existingPanel.remove();

      const panel = document.createElement('div');
      panel.className = 'ytp-speed-panel';
      Object.assign(panel.style, {
          display: 'flex',
          alignItems: 'center',
          background: '#ff0000ad',
          borderRadius: '30px',
          padding: '0 5px',
          margin: 'auto 10px',
          height: '80%'
      });

      // Correct order: - on left, speed in middle, + on right
      panel.append(
          createControlLink('-', () => changeSpeed(-config.speedStep)),
          createControlLink(state.currentSpeed.toFixed(2), () => {}, 'speedDisplay'),
          createControlLink('+', () => changeSpeed(config.speedStep))
      );

      if (elements.controlsContainer) {
          elements.controlsContainer.appendChild(panel);
      }
  }

  // Ad Handling Functions
  function handleAdStart() {
      if (!elements.adPlayer || state.isAdPlaying) return;
      
      state.isAdPlaying = true;
      const prevSpeed = state.currentSpeed;
      
      setTimeout(() => {
          if (elements.skipButton) {
              elements.skipButton.click();
          } else if (elements.video) {
              elements.video.playbackRate = config.adSpeed;
              startAdEndDetection();
          }
      }, config.skipDelay);
  }

  function handleAdEnd() {
      if (!state.isAdPlaying) return;
      
      state.isAdPlaying = false;
      setSpeed(state.currentSpeed); // Restores previous speed
      stopAdEndDetection();
  }

  function startAdEndDetection() {
      stopAdEndDetection();
      state.adCheckInterval = setInterval(() => {
          if (!elements.adPlayer && elements.video) {
              handleAdEnd();
          }
      }, 500);
  }

  function stopAdEndDetection() {
      if (state.adCheckInterval) {
          clearInterval(state.adCheckInterval);
          state.adCheckInterval = null;
      }
  }

  // Observer Setup
  function setupObservers() {
      // Cleanup existing observers
      if (state.observer) state.observer.disconnect();
      
      // Watch for ads
      if (elements.adContainer) {
          state.observer = new MutationObserver((mutations) => {
              if (elements.adPlayer) {
                  handleAdStart();
              } else if (state.isAdPlaying) {
                  handleAdEnd();
              }
          });

          state.observer.observe(elements.adContainer, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: ['class']
          });
      }
      
      // Initial check
      if (elements.adPlayer) handleAdStart();
  }

  // Event Listeners
  function setupEventListeners() {
      document.addEventListener('keydown', (e) => {
          if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
              switch (e.key.toLowerCase()) {
                  case 'x': changeSpeed(config.speedStep); break;
                  case 'z': changeSpeed(-config.speedStep); break;
              }
          }
      });
  }

  // Main Initialization
  function initializeController() {
      createSpeedMessage(); // Ensure notification elements exist
      addControlPanel();
      setupObservers();
      setupEventListeners();
      
      // Apply saved speed if video is ready
      if (elements.video && elements.video.readyState > 0) {
          elements.video.playbackRate = state.currentSpeed;
      }
  }

  // Start when ready
  if (document.readyState === 'complete') {
      loadSpeed();
  } else {
      window.addEventListener('load', loadSpeed);
  }

  // Handle extension refresh
  chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'refresh') {
          initializeController();
      }
  });
})();