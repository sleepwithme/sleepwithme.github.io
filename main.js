function _(query) {
  return document.querySelector(query);
}

function _all(query) {
  return document.querySelectorAll(query);
}

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

let songList = [
  {
    thumbnail: "./assets/images/pr-t-0.JPG",
    audio: "./assets/songs/Aaja Nindiya Rani Aaja-me.mp3",
    songname: "Going to sleep now",
    artistname: "🎧 Mitthu 🎧",
  },
  {
    thumbnail: "./assets/images/pr-t-1.JPG",
    audio: "./assets/songs/lori-mine.mp3",
    songname: "I love sleep",
    artistname: "🎧 Mumfali 🎧",
  },

  {
    thumbnail: "./assets/images/pr-t-2.JPG",
    audio: "./assets/stories/Power of Silence.mp3",
    songname: "Power of Silence",
    artistname: "🎧 Keep listen 🎧",
  },
];

let currentSongIndex = 0;
let muteState = "unmute";
let player = _(".player"),
  toggleSongList = _(".player .toggle-list");

let main = {
  audio: _(".player .main audio"),
  thumbnail: _(".player .main img"),
  seekbar: _(".player .main input"),
  duration: _(".player .main .seekbar .time-container #duration"),
  currentDuration: _(".player .main .seekbar .time-container #current-time"),
  volumeSlider: _(".player .main .volume-container #volume-slider"),
  volumeLabel: _(".player .main .volume-container #volume-output"),
  volumeButton: _(".player .main .volume-container #volume-button"),
  songname: _(".player .main .details h2"),
  artistname: _(".player .main .details p"),
  prevControl: _(".player .main .controls .prev-control"),
  playPauseControl: _(".player .main .controls .play-pause-control"),
  nextControl: _(".player .main .controls .next-control"),
};

toggleSongList.addEventListener("click", function () {
  toggleSongList.classList.toggle("active");
  player.classList.toggle("activeSongList");
});

_(".player .player-list .list").innerHTML = songList
  .map(function (song, songIndex) {
    return `
		<div class="item" songIndex="${songIndex}">
			<div class="thumbnail">
				<img src="${song.thumbnail}">
			</div>
			<div class="details">
				<h2>${song.songname}</h2>
				<p>${song.artistname}</p>
			</div>
		</div>
	`;
  })
  .join("");

let songListItems = _all(".player .player-list .list .item");
for (let i = 0; i < songListItems.length; i++) {
  songListItems[i].addEventListener("click", function () {
    currentSongIndex = parseInt(songListItems[i].getAttribute("songIndex"));
    loadSong(currentSongIndex, 1);
    player.classList.remove("activeSongList");
  });
}

function loadSong(songIndex, mode) {
  let song = songList[songIndex];
  main.thumbnail.setAttribute("src", song.thumbnail);

  document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url("${song.thumbnail}") center no-repeat`;
  document.body.style.backgroundSize = "cover";

  main.songname.innerText = song.songname;
  main.artistname.innerText = song.artistname;
  main.audio.setAttribute("src", song.audio);
  main.seekbar.setAttribute("value", 0);
  main.seekbar.setAttribute("min", 0);
  main.seekbar.setAttribute("max", 0);

  main.audio.addEventListener("canplay", function () {
    if (mode === 1) {
      main.audio.play();
    }
    if (!main.audio.paused) {
      main.playPauseControl.classList.remove("paused");
    }
    main.seekbar.setAttribute("max", parseInt(main.audio.duration));
    main.duration.textContent = calculateTime(main.audio.duration);
    main.audio.onended = function () {
      main.nextControl.click();
    };
  });
}
setInterval(function () {
  main.seekbar.value = parseInt(main.audio.currentTime);
  main.currentDuration.textContent = calculateTime(main.audio.currentTime);
}, 1000);

main.prevControl.addEventListener("click", function () {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songList.length + currentSongIndex;
  }
  loadSong(currentSongIndex, 1);
});

main.nextControl.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex + 1) % songList.length;
  loadSong(currentSongIndex, 1);
});

main.playPauseControl.addEventListener("click", function () {
  if (main.audio.paused) {
    main.playPauseControl.classList.remove("paused");
    main.audio.play();
  } else {
    main.playPauseControl.classList.add("paused");
    main.audio.pause();
  }
});

main.seekbar.addEventListener("change", function () {
  main.audio.currentTime = main.seekbar.value;
});

_(".player .main .controls .repeat-control").addEventListener(
  "click",
  function () {
    loadSong(currentSongIndex, 1);
  }
);

main.volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  main.volumeLabel.textContent = value;
  main.audio.volume = value / 100;
});

main.volumeButton.addEventListener("click", () => {
  if (muteState === "unmute") {
    main.volumeButton.innerHTML = "<i class='fas fa-volume-mute'></i>";
    main.audio.muted = true;
    muteState = "mute";
  } else {
    main.volumeButton.innerHTML = "<i class='fas fa-volume-up'></i>";
    main.audio.muted = false;
    muteState = "unmute";
  }
});

/*FullScreen Mode*/
let fullscreen;
let fsEnter = document.getElementById("fullscr");
fsEnter.addEventListener("click", function (e) {
  e.preventDefault();
  if (!fullscreen) {
    fullscreen = true;
    document.documentElement.requestFullscreen();
    fsEnter.innerHTML = "<i class='fa fa-compress'></i>";
  } else {
    fullscreen = false;
    document.exitFullscreen();
    fsEnter.innerHTML = "<i class='fa fa-expand'></i>";
  }
});

function callme() {
  let fadeTarget = document.getElementById("loader");
  var fadeEffect = setInterval(function () {
    if (!fadeTarget.style.opacity) {
      fadeTarget.style.opacity = 1;
    }
    if (fadeTarget.style.opacity > 0) {
      fadeTarget.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
      fadeTarget.style.display = "none";
      fadeTarget.style.position = "relative";
      fadeTarget.style.zIndex = 0;
      loadSong(0, 0);
    }
  }, 50);
}
