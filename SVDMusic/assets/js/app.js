const controlPlayer = document.getElementById("control-player");
const resetLyrics = document.querySelector(".lyric-wrap");
const musicContent = document.querySelector(".ms-play-control-container");
const progressBar = document.querySelector(".progress-bar");
const rangeVolume = document.querySelector(".volume");
const btnLoop = document.querySelector(".btn-loop");
const btnRandom = document.querySelector(".btn-random");
const avatarControl = document.querySelector(".play-control-img-song");
const imgBlurSong = document.querySelector(".img-blur");
const avatar = document.querySelector(".wrapper-img-action img");
const nameSong = document.querySelector(".ms-control-info-song .name-song");
const creator = document.querySelector(".ms-control-info-song .creator");
const btnVolume = document.querySelector(".btn-volume");
const listSong = document.querySelector(".list-music");
const listRankSong = document.querySelector(".top-ranking-song");
const idSong = document.querySelector(".ms-play-control-add-play-list");
const mp3Player = document.querySelector("audio");
const detailSong = document.querySelectorAll(".list-music-item");
const songs = document.querySelectorAll(".list-music-item");

const start = document.querySelectorAll(".list-music-item");
const btnPlay = document.querySelector(".btn-play");
const btnUserPlay = document.querySelector(".btn-user-play");
const btnArtistPlay = document.querySelector(".btn-artist-play");
const btnPrev = document.querySelector(".btn-prev");
const btnNext = document.querySelector(".btn-next");
const timeSong = document.querySelector(".duration-time");
const currentTimeDisplay = document.querySelector(".current-time");

const addPlaylist = document.querySelectorAll(".add-playlist");
const removePlaylist = document.querySelectorAll(".remove-playlist");
const playLyrics = document.querySelectorAll(".play-lyrics");
const dataNumber = document.querySelectorAll(".list-music-item");
const number = document.querySelectorAll(".number-item");
const numberTop = document.querySelectorAll(".number-rank-song");
const listMusicTop = document.querySelectorAll(".list-music-top");
const songList = listSong.getElementsByTagName("li");

const state = {
  arraySongs: [],
  lyric: null,
  url: window.location.hostname + "/",
  isRandom: false,
  isActiveSong: false,
  songIndex: 0,
  valueVolume: 0.5,
};

const initializeApp = () => {
  if (start.length === 0) {
    controlPlayer.classList.add("hidden");
  } else {
    window.onload = async () => await module.getSong();
  }

  if (avatar != null) {
    avatar.style.animationPlayState = "paused";
  }

  for (let i = 0; i < addPlaylist.length; i++) {
    addPlaylist[i].addEventListener("click", (e) => {
      addPlaylist[i].innerHTML = "playlist_add_check";
    });
  }

  for (let i = 0; i < addPlaylist.length; i++) {
    addPlaylist[i].addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }

  for (let i = 0; i < removePlaylist.length; i++) {
    removePlaylist[i].addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
  for (let i = 0; i < playLyrics.length; i++) {
    playLyrics[i].addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
  module.setRankingSongNumbers();
  module.setSongIds();
};

const domInteraction = {
  setupMediaSession: () => {
    const { nameSong, creator, avatar } = state;
    if ("mediaSession" in navigator && nameSong && creator && avatar) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: nameSong.textContent,
        artist: creator.textContent,
        artwork: [
          {
            src: avatar.src,
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: avatar.src,
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: avatar.src,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: avatar.src,
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: avatar.src,
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: avatar.src,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        module.prevSong();
        module.playSong();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        module.nextSong();
        module.playSong();
      });
    }
  },
  updateActiveSong: (song) => {
    for (let i = 0; i < songList.length; i++) {
      songList[i].classList.remove("active-song-play");
    }
    if (!state.isActiveSong) {
      songList[song].classList.add("active-song-play");
    }
  },
  playSong: () => {
    musicContent.classList.add("playing");
    if (avatar != null) {
      avatar.style.animationPlayState = "running";
    }
    btnPlay.classList.remove("fa-play");
    btnPlay.classList.add("fa-pause");
    mp3Player.play();
  },
  pauseSong: () => {
    musicContent.classList.remove("playing");
    avatar.style.animationPlayState = "paused";
    btnPlay.classList.add("fa-play");
    btnPlay.classList.remove("fa-pause");
    mp3Player.pause();
  },
  nextSong: () => {
    state.songIndex++;
    domInteraction.resetLyricContainer();
    if (state.songIndex > state.arraySongs.length - 1) {
      state.songIndex = 0;
    }
    module.loadSong(state.songIndex);
  },
  resetLyricContainer: () => {
    resetLyrics.innerHTML = '<div class="lyric"></div>';
  },
  prevSong: () => {
    state.songIndex--;
    domInteraction.resetLyricContainer();
    if (state.songIndex < 0) {
      state.songIndex = state.arraySongs.length - 1;
    }
    module.loadSong(state.songIndex);
  },
  addLoopSong: () => {
    btnLoop.classList.add("add-color-btn");
    musicContent.classList.add("looping");
    mp3Player.loop = true;
  },
  removeLoopSong: () => {
    btnLoop.classList.remove("add-color-btn");
    musicContent.classList.remove("looping");
    mp3Player.loop = false;
  },
  addRandomSong: () => {
    btnRandom.classList.add("add-color-btn");
  },
  removeRandomSong: () => {
    btnRandom.classList.remove("add-color-btn");
  },
  addVolume: () => {
    musicContent.classList.add("volume");
    btnVolume.classList.add("fa-volume-up");
    btnVolume.classList.remove("fa-volume-mute");
    btnVolume.classList.remove("add-color-btn");
    mp3Player.volume = state.valueVolume;
  },
  muteVolume: () => {
    musicContent.classList.remove("volume");
    btnVolume.classList.remove("fa-volume-up");
    btnVolume.classList.add("fa-volume-mute");
    btnVolume.classList.add("add-color-btn");
    state.valueVolume = mp3Player.volume;
    mp3Player.volume = 0;
  },
};

const module = {
  getSong: async () => {
    state.arraySongs = [...songs].map((song) =>
      song.getAttribute("data-music")
    );
    module.loadSong();
  },

  loadSong: async () => {
    const { songIndex, arraySongs } = state;
    const song = songIndex;
    mp3Player.src = arraySongs[song];
    mp3Player.addEventListener("loadedmetadata", () => {
      const time = module.formatTime(mp3Player.duration);
      timeSong.textContent = time;
    });
    nameSong.textContent = detailSong[song].getAttribute("data-name");
    creator.textContent = detailSong[song].getAttribute("data-creator");
    avatar.src = detailSong[song].getAttribute("data-avatar");
    avatarControl.src = detailSong[song].getAttribute("data-avatar");
    imgBlurSong.src = detailSong[song].getAttribute("data-img");
    module.getLrc(detailSong[song].getAttribute("data-lrc"));
    idSong.innerHTML = `<a href="${state.url}${detailSong[song].getAttribute(
      "data-id"
    )}.html"><span class="play-lyrics material-icons-outlined">mic_none</span></a>`;

    document.title = `${detailSong[song].getAttribute(
      "data-name"
    )}, ${detailSong[song].getAttribute("data-creator")}`;
    domInteraction.setupMediaSession();
    domInteraction.updateActiveSong(song);
    module.scrollbar();
  },

  appendLyric: (lyric) => {
    lyric.forEach((v, i) => {
      $("<p id='line-" + i + "'>")
        .html(v[1])
        .appendTo(".lyric")
        .on("click", () => module.handleClickLyric(v[0]));
    });
  },
  handleClickLyric: (timestamp) => {
    if (typeof mp3Player !== "undefined") {
      mp3Player.currentTime = timestamp;
    }
  },
  getLrc: (url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        var text = data
          .replace(/\n/g, "#")
          .replace(/\r/g, "")
          .replace(/######/g, "#")
          .replace(/####/g, "#")
          .replace(/###/g, "#")
          .replace(/##/g, "#");
        state.lyric = module.parseLyric(text);
        module.appendLyric(state.lyric);
      })
      .catch((error) => {
        document.getElementsByClassName("lyric-wrap")[0].innerHTML =
          "<p class='alert-song'> Bài hát hiện tại chưa có lời </p>";
      });
  },
  formatTime: (second) => {
    let hours = Math.floor(second / 3600);
    let minutes = Math.floor((second - hours * 3600) / 60);
    let seconds = Math.floor(second - hours * 3600 - minutes * 60);
    hours = hours < 10 ? (hours > 0 ? "0" + hours : 0) : hours;
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return (hours !== 0 ? hours + ":" : "") + minutes + ":" + seconds;
  },

  parseLyric: (text) => {
    const lines = text
      .split("#")
      .filter((line) => /\[\d{2}:\d{2}.\d{2,3}\]/.test(line));

    const result = lines.map((line) => {
      const [timeTag, value] = line.split("]");
      const [minutes, seconds] = timeTag.slice(1).split(":").map(parseFloat);
      const timeInSeconds = minutes * 60 + seconds;
      return [timeInSeconds, value.trim()];
    });
    result.sort((a, b) => a[0] - b[0]);
    return result;
  },

  updateLyrics: () => {
    const currentTime = mp3Player.currentTime;

    for (let i = 0, l = state.lyric.length; i < l; i++) {
      const [timestamp, text] = state.lyric[i];

      if (currentTime > timestamp) {
        const lineId = `#line-${i}`;
        const currentLine = $(lineId);

        if (currentLine.length > 0) {
          const anchor = currentLine.position().top;
          $(".current-line").attr("class", "");
          currentLine.attr("class", "current-line");
          $(".lyric").css("top", `${115 - anchor}px`);
        }
      }
    }
  },

  setRankingSongNumbers: () => {
    for (let i = 0; i < numberTop.length; i++) {
      const ranking = i % 3 === 0 ? 1 : (i % 3) + 1;
      numberTop[i].innerHTML = "#" + ranking + "st";
      numberTop[i].classList.add("number-" + ranking);
      listMusicTop[i].setAttribute("data-index", ranking - 1);
    }
  },
  setSongIds: () => {
    for (let i = 0; i < songs.length; i++) {
      number[i].innerHTML = i + 1;
      dataNumber[i].setAttribute("data-index", i);
    }
  },
  scrollbar: () => {
    var line = $(".current-line"),
      scrollTop = $(".lyric").scrollTop(),
      anchor = line.offset().top;
    $(".lyric-wrap").animate(
      {
        scrollTop: anchor,
      },
      1000,
      "swing"
    );
    if (anchor - 50 != scrollTop) {
      if (line.length && anchor >= 50) {
        $(".lyric-wrap").animate(
          {
            scrollTop: anchor - 50,
          },
          1000,
          "swing"
        );
      }
    }
  },
};

btnPlay.addEventListener("click", () => {
  if (musicContent.classList.contains("playing")) {
    domInteraction.pauseSong();
  } else {
    domInteraction.playSong();
  }
});

btnNext.addEventListener("click", () => {
  domInteraction.nextSong();
  setTimeout(() => {
    domInteraction.playSong();
  }, 2000);
});

btnPrev.addEventListener("click", () => {
  domInteraction.prevSong();
  setTimeout(() => {
    domInteraction.playSong();
  }, 2000);
});

btnVolume.addEventListener("click", () => {
  if (musicContent.classList.contains("volume")) {
    domInteraction.muteVolume();
  } else {
    domInteraction.addVolume();
  }
});

mp3Player.addEventListener("loadedmetadata", function () {
  const time = module.formatTime(mp3Player.duration);
  timeSong.textContent = time;
});

mp3Player.ontimeupdate = function () {
  var current = mp3Player.currentTime;
  currentTimeDisplay.textContent = module.formatTime(current);
  if (mp3Player.duration) {
    const progressPercent = Math.floor(
      (mp3Player.currentTime / mp3Player.duration) * 100
    );
    progressBar.value = progressPercent;
  }
};

progressBar.onchange = function (e) {
  const seekTime = (audio.duration / 100) * e.target.value;
  audio.currentTime = seekTime;
};

mp3Player.addEventListener("ended", () => {
  avatar.style.animationPlayState = "paused";
  if (state.isRandom == true) {
    let valueRandom;
    do {
      valueRandom = Math.floor(Math.random() * state.arraySongs.length);
    } while (valueRandom === state.songIndex);
    state.songIndex = valueRandom;
    domInteraction.nextSong();
    setTimeout(() => {
      domInteraction.playSong();
    }, 2000);
  } else {
    domInteraction.nextSong();
    setTimeout(() => {
      domInteraction.playSong();
    }, 2000);
  }
});

rangeVolume.onchange = function (e) {
  state.valueVolume = e.target.value / 100;
  mp3Player.volume = state.valueVolume;
};

if (listRankSong) {
  listRankSong.addEventListener("click", (e) => {
    state.songIndex = e.target.closest("li").getAttribute("data-index");
    idSong.innerHTML =
      '<a href="' +
      url +
      "" +
      e.target.closest("li").getAttribute("data-id") +
      '.html"><span class="play-lyrics material-icons-outlined">mic_none</span></a>';
    domInteraction.resetLyricContainer();
    module.loadSong(state.songIndex);
    domInteraction.playSong();
  });
}

if (listSong) {
  listSong.addEventListener("click", (e) => {
    state.songIndex = e.target.closest("li").getAttribute("data-index");
    idSong.innerHTML =
      '<a href="' +
      state.url +
      "" +
      e.target.closest("li").getAttribute("data-id") +
      '.html"><span class="play-lyrics material-icons-outlined">mic_none</span></a>';
    domInteraction.resetLyricContainer();
    module.loadSong(state.songIndex);
    domInteraction.playSong();
  });
}

mp3Player.addEventListener("timeupdate", module.updateLyrics);

initializeApp();
