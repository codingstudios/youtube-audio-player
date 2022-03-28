var player = document.getElementById("player");
let progress = document.getElementById("progress");
let playbtn = document.getElementById("playbtn");
var query = new URLSearchParams(window.location.search).get("q");
var title = document.getElementById('title');
const playIcon = playbtn.innerHTML;
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" style="fill: rgba(255, 255, 255, 1);transform: ;msFilter:;"><path d="M8 7h3v10H8zm5 0h3v10h-3z"></path></svg>';

var playpause = function () {
  if(player.src == `${document.URL}/audio/`)return;
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

window.onload = () => {
if(query) fetch(`/info/${query}`).then(r => r.json()).then(r => { title.textContent = r.title; }).catch(err => console.log(err));
}

playbtn.addEventListener("click", playpause);

player.onplay = function () {
  playbtn.innerHTML = pauseIcon;
}

player.onpause = function () {
  playbtn.innerHTML = playIcon;
}

player.ontimeupdate = function () {
  let ct = player.currentTime;
  current.innerHTML = timeFormat(ct);
  let duration = player.duration;
  prog = Math.floor((ct * 100) / duration);
  progress.style.setProperty("--progress", prog + "%");
}

function timeFormat(ct) {
  minutes = Math.floor(ct / 60);
  seconds = Math.floor(ct % 60);

  if (seconds < 10) {
    seconds = "0"+seconds;
  }

  return minutes + ":" + seconds;
}
