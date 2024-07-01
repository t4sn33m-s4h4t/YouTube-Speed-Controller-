// Set playback speed within range

function setPlaybackSpeed(speed) {
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = Math.max(0.25, Math.min(speed, 10));
    
    
    let playbackRateObj = {
      data: speed.toString(), 
      creation: Date.now() 
  };
  sessionStorage.setItem('yt-player-playback-rate', JSON.stringify(playbackRateObj));
    updateSpeedDisplay();
  }
  
}

// Change speed by increment
function changeSpeed(increment) {
  const video = document.querySelector("video");
  if (video) {
    setPlaybackSpeed(video.playbackRate + increment)
  };
}

// Update speed display
function updateSpeedDisplay() {
  const speedDisplay = document.querySelector("#speedDisplay");
  const video = document.querySelector("video");
  if (speedDisplay && video) {
    speedDisplay.textContent = video.playbackRate.toFixed(2);
  }
}

// Create control link element
function createControlLink(text, iconClass, onClick, id) {
  const link = document.createElement("a");
  link.innerHTML = iconClass ? `<i class="${iconClass}"></i> ${text}` : text;
  Object.assign(link.style, { 
    color: "white", 
    fontSize: "14px", 
    padding: "5px", 
    cursor: "pointer", 
    fontWeight: "600"
  });

  if (id) link.id = id;
  link.addEventListener("click", (event) => { event.preventDefault(); onClick(); });
  return link;
}

// Add control links to YouTube player
function addControlLinks() {
  if (sessionStorage.getItem('yt-player-playback-rate')) {
    
    setPlaybackSpeed(Number(JSON.parse(sessionStorage.getItem('yt-player-playback-rate')).data))
  }
  const controlsContainer = document.querySelector(".ytp-left-controls");
  if (!controlsContainer) return;

  const controlWrapper = document.createElement("div");
  controlWrapper.style.display = "flex";
  controlWrapper.style.flexDirection = "row-reverse";
  controlWrapper.style.alignItems = "center";
  controlWrapper.style.marginRight = "10px";
  controlWrapper.style.background = "#ff0000ad";
  controlWrapper.style.borderRadius = "30px";
  controlWrapper.style.margin = "auto 10px";
  controlWrapper.style.height = "80%";
  controlWrapper.style.padding = "0 5px";
  controlWrapper.classList.add("unselectable");

  controlWrapper.append(
    createControlLink("+", "fas fa-plus", () => changeSpeed(0.25)),
    createControlLink("1.00x", "", () => {}, "speedDisplay"),
    createControlLink("-", "fas fa-minus", () => changeSpeed(-0.25))
  );

  controlsContainer.appendChild(controlWrapper);
  updateSpeedDisplay();

  controlWrapper.addEventListener("selectstart", (e) => e.preventDefault());
}

// Keydown event listener for speed control
document.addEventListener("keydown", (event) => {
  if (event.shiftKey) {
    if (event.key.toLowerCase() === "x") changeSpeed(0.25);
    if (event.key.toLowerCase() === "z") changeSpeed(-0.25);
    if (event.key === ">"){
      if ((document.querySelector('.ytp-bezel-text').innerText === "2x") || (document.querySelector("video").playbackRate > 2)) {
        setPlaybackSpeed(2)
      }
       updateSpeedDisplay()
      };
      if (event.key === "<") {
        updateSpeedDisplay()
      }
  }
});

// Add control links when window is loaded
window.addEventListener("load", () => {
  setTimeout(addControlLinks, 1000);
});
