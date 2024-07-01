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
    showSpeedMessage()
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

function showSpeedMessage() {
  const showSpeedWrapper = document.querySelector(".showSpeedWrapper");
  const showSpeedText = document.querySelector(".showSpeedText");

  const video = document.querySelector("video");
  showSpeedText.innerText = video.playbackRate.toString() +"x";
  if (showSpeedWrapper) {
    showSpeedWrapper.style.display = "block";
    setTimeout(() => {
      showSpeedWrapper.style.display = "none";
    }, 450); 
  } 
}


function CreateSpeedMessage() {
  const videoPlayer = document.querySelector(".html5-video-player");
if (videoPlayer) {
  const speedContainer = document.createElement("div");
  const showSpeedWrapper = document.createElement("div");
  showSpeedWrapper.classList.add("showSpeedWrapper");
  const showSpeedText = document.createElement("div");
  showSpeedText.classList.add("showSpeedText");
  // Set the styles for showSpeedText
  showSpeedText.style.display = "inline-block";
  showSpeedText.style.padding = "10px 20px";
  showSpeedText.style.fontSize = "175%";
  showSpeedText.style.background = "rgba(0, 0, 0, .5)";
  showSpeedText.style.pointerEvents = "none";
  showSpeedText.style.borderRadius = "3px";
  // Set the styles for showSpeedWrapper
  showSpeedWrapper.style.textAlign = "center";
  showSpeedWrapper.style.position = "absolute";
  showSpeedWrapper.style.left = "0";
  showSpeedWrapper.style.right = "0";
  showSpeedWrapper.style.top = "10%";
  showSpeedWrapper.style.zIndex = 19;
  showSpeedWrapper.style.display = "none"

  showSpeedWrapper.appendChild(showSpeedText);
  speedContainer.appendChild(showSpeedWrapper);
  videoPlayer.appendChild(speedContainer);

}

}
function start() {
  CreateSpeedMessage()
  addControlLinks()
}
// Add control links when window is loaded
window.addEventListener("load", () => {
  setTimeout(start, 1000);
});

