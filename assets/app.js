// --- DOM ELEMENTS ---
const musicContent = document.querySelector(".row");
const avatar = document.querySelector(".avatar img");
const avatarItemAction = document.querySelector(".avatar-action img");
const nameSong = document.querySelector(".music-play .name");
const nameItemAction = document.querySelector(".name-song-action");
const creator = document.querySelector(".music-play .creator");
const btnMode = document.querySelector(".fa-moon");
const btnPlay = document.querySelector(".fa-play");
const btnLoop = document.querySelector(".btn-loop");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const btnRandom = document.querySelector(".btn-random");
const audio = document.querySelector("#audio");
const progressBar = document.querySelector(".music-progress-bar");
const timeSong = document.querySelector(".duration-time");
const currentTimeDisplay = document.querySelector(".current-time");
const list = document.querySelector(".list-music");
const btnCloseList = document.querySelector(".btn-close");
const btnOpenList = document.querySelector(".btn-list");
const btnHeart = document.querySelector(".btn-heart i");
const songList = list.getElementsByTagName("li");

// --- DATA ---
let songIndex = 0;
let isRandom = false;
let isLightMode = false;
let isLoop = false;
let isHeart = false;

let arraySongs = [
  {
    name: "Hoa Hải Đường",
    singer: "Jack",
    path: "../assets/mp3/hoa_hai_duong.mp3",
    avatar: "../assets/avatar/hoa_hai_duong.png",
  },
  {
    name: "Enemy",
    singer: "Imagine Dragons & JID",
    path: "../assets/mp3/enemy.mp3",
    avatar: "../assets/avatar/enemy.jpg",
  },
  {
    name: "Gods",
    singer: "NewJeans (뉴진스) ",
    path: "../assets/mp3/gods.mp3",
    avatar: "../assets/avatar/gods.jpg",
  },
  {
    name: "Độc Ẩm",
    singer: "Nguyễn Kiều Anh (Feliks Alvin Remix)",
    path: "../assets/mp3/doc_am.mp3",
    avatar: "../assets/avatar/doc_am.jpg",
  },
  {
    name: "THIS WAY",
    singer: " CARA x NOWAY x KHẮC HƯNG",
    path: "../assets/mp3/this_way.mp3",
    avatar: "../assets/avatar/this_way.jpg",
  },
  {
    name: "Hoàn Hảo",
    singer: "Bray",
    path: "../assets/mp3/hoan_hao.mp3",
    avatar: "../assets/avatar/hoan_hao.jpg",
  },
  {
    name: "Người Em Cố Đô",
    singer: "Rum x Đaa x Toann",
    path: "../assets/mp3/em_co_do.mp3",
    avatar: "../assets/avatar/em_co_do.jpg",
  },
  {
    name: "Đưa em về nhàa",
    singer: "GREY D x CHILLIES",
    path: "../assets/mp3/dua_em_ve_nha.mp3",
    avatar: "../assets/avatar/dua_em_ve_nha.jpg",
  },
];

// --- INITIALIZATION ---
const init = () => {
  getSong();
  setupEventListeners();
};

const setupEventListeners = () => {
  audio.addEventListener("timeupdate", updateProgressTime);
  audio.addEventListener("loadedmetadata", () => {
    const time = formatTime(audio.duration);
    timeSong.textContent = time;
  });
  audio.ontimeupdate = function () {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.value = progressPercent;
      var val = progressPercent;
      if (val >= 90 && val <= 99) val = val - 1;
      if (isLightMode == false)
        create_style(
          "input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) " +
            val +
            "%, #1D2021 " +
            val +
            "%, #1D2021 100%) !important;}"
        );
      else
        create_style(
          "input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) " +
            val +
            "%, var(--bg-light) " +
            val +
            "%, var(--bg-light) 100%) !important;box-shadow: inset 2px 2px 3px 1px rgba(var(--shadow-color), .1), inset -2px -2px 3px 0px rgba(var(--light-color), .1)!important; border-color:#f1f1f1 !important;}"
        );
    }
  };
  progressBar.onchange = function (e) {
    const seekTime = (audio.duration / 100) * e.target.value;
    audio.currentTime = seekTime;
    var val = e.target.value;
    if (val >= 90 && val <= 99) val = val - 1;
    if (isLightMode == false)
      create_style(
        "input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) " +
          val +
          "%, #1D2021 " +
          val +
          "%, #1D2021 100%) !important;}"
      );
    else
      create_style(
        "input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) " +
          val +
          "%, var(--bg-light) " +
          val +
          "%,  var(--bg-light) 100%) !important;box-shadow: inset 2px 2px 3px 1px rgba(var(--shadow-color), .3), inset -2px -2px 3px 0px rgba(var(--light-color), .1) !important; border-color:#f1f1f1  !important;}"
      );
  };
  audio.addEventListener("ended", () => {
    btnHeart.classList.remove("heart");
    if (isLoop == true) {
      setTimeout(() => {
        loadSong();
        playSong();
      }, 2000);
    } else if (isLoop == false) {
      setTimeout(() => {
        nextSong();
        playSong();
      }, 2000);
    }
  });

  avatarItemAction.addEventListener("click", () => {
    document.getElementById("list-song").style.visibility = "hidden";
  });
  btnCloseList.addEventListener("click", () => {
    document.getElementById("list-song").style.visibility = "hidden";
  });
  btnOpenList.addEventListener("click", () => {
    document.getElementById("list-song").style.visibility = "visible";
  });
  btnHeart.addEventListener("click", () => {
    if (isHeart == false) {
      btnHeart.classList.add("heart");
      isHeart = true;
    } else {
      btnHeart.classList.remove("heart");
      isHeart = false;
    }
  });

  btnMode.addEventListener("click", () => {
    if (isLightMode == false) {
      document.querySelector(".active").classList.add("active-light-mode");
      document.querySelector(".active-light-mode").classList.remove("active");
      playSong();
      btnMode.classList.remove("fa-moon");
      btnMode.classList.add("fa-sun");
      isLightMode = true;
      addLightMode();
    } else {
      document.querySelector(".active-light-mode").classList.add("active");
      document.querySelector(".active").classList.remove("active-light-mode");
      btnMode.classList.add("fa-moon");
      btnMode.classList.remove("fa-sun");
      isLightMode = false;
      removeLightMode();
    }
  });
  btnPlay.addEventListener("click", () => {
    if (musicContent.classList.contains("playing")) {
      pauseSong();
    } else {
      playSong();
    }
  });
  btnNext.addEventListener("click", () => {
    nextSong();
    setTimeout(() => {
      playSong();
    }, 400);
  });
  btnPrev.addEventListener("click", () => {
    prevSong();
    setTimeout(() => {
      playSong();
    }, 400);
  });
  btnRandom.addEventListener("click", () => {
    if (isRandom == false) {
      isRandom = true;
      addRandomSong();
    } else if (isRandom == true) {
      isRandom = false;
      removeRandomSong();
    }
  });
  btnLoop.addEventListener("click", () => {
    if (isLoop == false) {
      isLoop = true;
      loopSong();
    } else if (isLoop == true) {
      isLoop = false;
      removeLoopSong();
    }
  });
  list.addEventListener("click", (e) => {
    songIndex = e.target.closest("li").getAttribute("data-index");
    btnHeart.classList.remove("heart");
    isHeart = false;
    loadSong(songIndex);
    playSong();
  });
};

const loadSong = (song) => {
  song = songIndex;
  audio.src = arraySongs[song].path;
  nameSong.textContent = arraySongs[song].name;
  nameItemAction.textContent = arraySongs[song].name;
  document.title = arraySongs[song].name + ", " + arraySongs[song].singer;
  creator.textContent = arraySongs[song].singer;
  avatar.src = arraySongs[song].avatar;
  avatarItemAction.src = arraySongs[song].avatar;
};

const getSong = () => {
  list.innerHTML = "";
  for (let i = 0; i < arraySongs.length; i++) {
    const name = arraySongs[i].name;
    const creator = arraySongs[i].singer;
    const music = arraySongs[i].path;
    const avatar = arraySongs[i].avatar;
    list.innerHTML += `<li class="list-music-item" data-name='${name}' data-creator='${creator}' data-music='${music}'
			data-avatar='${avatar}' data-index='${i}'>
			<div class="list-music-item-info">
			<img class="avatar-item" height='50' src="${avatar}"/>
			<div class="song-item-info" >
			<p class="name-song-item">${name}</p>
			<p class="creator">${creator}</p>
			</div>
			</div>

			</li>`;
  }
  loadSong();
};

const create_style = (css) => {
  (head = document.head),
    (oldstyles = head.querySelector("#range-style")),
    (style = document.createElement("style"));
  if (oldstyles != null) {
    oldstyles.remove();
  }
  style.id = "range-style";
  head.appendChild(style);

  style.type = "text/css";
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
};

const formatTime = (second) => {
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
};

const loopSong = () => {
  btnLoop.classList.remove("bx-remove-loop");
  btnLoop.classList.add("bx-add-loop");
  if (songIndex > arraySongs.length - 1) {
    songIndex = 0;
  }
};

const removeLoopSong = () => {
  btnLoop.classList.add("bx-remove-loop");
  btnLoop.classList.remove("bx-add-loop");
  if (songIndex > arraySongs.length - 1) {
    songIndex = 0;
  }
};
const playSong = () => {
  musicContent.classList.add("playing");
  avatar.style.animationPlayState = "running";
  avatarItemAction.style.animationPlayState = "running";
  btnPlay.classList.remove("fa-play");
  btnPlay.classList.add("fa-pause");
  audio.play();
};
const pauseSong = () => {
  musicContent.classList.remove("playing");
  avatar.style.animationPlayState = "paused";
  avatarItemAction.style.animationPlayState = "paused";
  btnPlay.classList.add("fa-play");
  btnPlay.classList.remove("fa-pause");
  audio.pause();
};

const addRandomSong = () => {
  songIndex = Math.floor(Math.random() * 101);
  btnRandom.classList.remove("bx-remove-random");
  btnRandom.classList.add("bx-add-random");
  if (songIndex > arraySongs.length - 1) {
    songIndex = 0;
  }
};

const removeRandomSong = () => {
  btnRandom.classList.add("bx-remove-random");
  btnRandom.classList.remove("bx-add-random");
  if (songIndex > arraySongs.length - 1) {
    songIndex = 0;
  }
};
const nextSong = () => {
  songIndex++;
  if (songIndex > arraySongs.length - 1) {
    songIndex = 0;
  }
  loadSong(songIndex);
};

const prevSong = () => {
  songIndex--;
  if (songIndex < 0) {
    songIndex = arraySongs.length - 1;
  }
  loadSong(songIndex);
};

const addLightMode = (e) => {
  document.body.classList.add("light-theme");
  document
    .querySelector(".music-player-wrap")
    .classList.add("light-music-wrap::before");
  document
    .querySelector(".music-player-wrap")
    .classList.add("light-music-wrap");
  document.querySelector(".btn-list").classList.add("light-btn-wrap");
  document.querySelector(".btn-mode").classList.add("light-btn-wrap");
  document.querySelector(".btn-play").classList.add("light-btn-play-wrap");
  document.querySelector(".btn-heart").classList.add("light-btn-wrap");
  document.querySelector(".btn-close").classList.add("light-btn-wrap");
  document.querySelector(".name").classList.add("light-text-color");
  document.querySelector(".music-list").classList.add("light-music-wrap");
  document.querySelector(".vip-2").classList.add("text-light");

  let nameSongItem = document.querySelectorAll(".name-song-item");
  for (let i = 0; i < nameSongItem.length; i++) {
    nameSongItem[i].classList.add("light-text-color");
  }
};
const removeLightMode = () => {
  document.body.classList.remove("light-theme");
  document
    .querySelector(".music-player-wrap")
    .classList.remove("light-music-wrap::before");
  document
    .querySelector(".music-player-wrap")
    .classList.remove("light-music-wrap");
  document.querySelector(".btn-list").classList.remove("light-btn-wrap");
  document.querySelector(".btn-mode").classList.remove("light-btn-wrap");
  document.querySelector(".btn-play").classList.remove("light-btn-play-wrap");
  document.querySelector(".btn-heart").classList.remove("light-btn-wrap");
  document.querySelector(".btn-close").classList.remove("light-btn-wrap");
  document.querySelector(".name").classList.remove("light-text-color");
  document.querySelector(".vip-2").classList.remove("text-light");
  document.querySelector(".music-list").classList.remove("light-music-wrap");
  let nameSongItem = document.querySelectorAll(".name-song-item");
  for (let i = 0; i < nameSongItem.length; i++) {
    nameSongItem[i].classList.remove("light-text-color");
  }
};
const updateProgressTime = (e) => {
  const { currentTime, duration } = e.srcElement;
  currentTimeDisplay.textContent = formatTime(currentTime);
};

// --- RUN INITIALIZATION ---
init();
