// --- DOM ELEMENTS ---
const musicContent = document.querySelector('.row')
const avatar = document.querySelector('.avatar img')
const avatarItemAction = document.querySelector('.avatar-action img')
const nameSong = document.querySelector('.music-play .name')
const nameItemAction = document.querySelector('.name-song-action')
const creator = document.querySelector('.music-play .creator')
const btnPlay = document.querySelector('.fa-play')
const btnLoop = document.querySelector('.btn-loop')
const btnNext = document.querySelector('.btn-next')
const btnPrev = document.querySelector('.btn-prev')
const btnRandom = document.querySelector('.btn-random')
const btnState = document.querySelector('.btn-state')
const audio = document.querySelector('#audio')
const progressBar = document.querySelector('.music-progress-bar')
const timeSong = document.querySelector('.duration-time')
const currentTimeDisplay = document.querySelector('.current-time')
const list = document.querySelector('.list-music')
const btnCloseList = document.querySelector('.btn-close')
const btnOpenList = document.querySelector('.btn-list')
const btnHeart = document.querySelector('.btn-heart i')
const btnMode = document.querySelector('.btn-state')
const songList = list.getElementsByTagName('li')
const containerLyrics = document.querySelector('.container-lyric-wrapper')
const wrapperLyrics = document.querySelector('.music-lyric-wrapper')
const containerAvatar = document.querySelector('.container-avatar-wrapper')
const activeElement = document.querySelector('.active')
const activeLightModeElement = document.querySelector('.active-light-mode')

// --- DATA ---

const state = {
    lyric: null,
    isRandom: false,
    isActiveSong: false,
    songIndex: 0,
    valueVolume: 0.5,
    isPlayLyrics: false,
    isLoop: false,
    isHeart: false,
    isDragging: false,
    isLightMode: false,
}

let arraySongs = [
    {
        name: 'At My Worst',
        singer: 'Pink Sweat',
        path: '../assets/mp3/at_my_worst.mp3',
        avatar: '../assets/avatar/at_my_worst.jpg',
        lrc: '../assets/lrc/at_my_worst.lrc',
    },
    {
        name: 'Somewhere Only We know',
        singer: 'Rhianne Cover',
        path: '../assets/mp3/somewhere_only_we_know.mp3',
        avatar: '../assets/avatar/somewhere_only_we_know.jpg',
        lrc: '../assets/lrc/somewhere_only_we_know.lrc',
    },
    {
        name: 'Gods',
        singer: 'NewJeans (뉴진스)',
        path: '../assets/mp3/gods.mp3',
        avatar: '../assets/avatar/gods.jpg',
        lrc: '../assets/lrc/gods.lrc',
    },
    {
        name: 'Hoa Hải Đường',
        singer: 'Jack',
        path: '../assets/mp3/hoa_hai_duong.mp3',
        avatar: '../assets/avatar/hoa_hai_duong.png',
    },
    {
        name: 'Enemy',
        singer: 'Imagine Dragons & JID',
        path: '../assets/mp3/enemy.mp3',
        avatar: '../assets/avatar/enemy.jpg',
    },

    {
        name: 'Độc Ẩm',
        singer: 'Nguyễn Kiều Anh (Feliks Alvin Remix)',
        path: '../assets/mp3/doc_am.mp3',
        avatar: '../assets/avatar/doc_am.jpg',
    },
    {
        name: 'THIS WAY',
        singer: ' CARA x NOWAY x KHẮC HƯNG',
        path: '../assets/mp3/this_way.mp3',
        avatar: '../assets/avatar/this_way.jpg',
    },
    {
        name: 'Hoàn Hảo',
        singer: 'Bray',
        path: '../assets/mp3/hoan_hao.mp3',
        avatar: '../assets/avatar/hoan_hao.jpg',
    },
    {
        name: 'Người Em Cố Đô',
        singer: 'Rum x Đaa x Toann',
        path: '../assets/mp3/em_co_do.mp3',
        avatar: '../assets/avatar/em_co_do.jpg',
    },
    {
        name: 'Đưa em về nhàa',
        singer: 'GREY D x CHILLIES',
        path: '../assets/mp3/dua_em_ve_nha.mp3',
        avatar: '../assets/avatar/dua_em_ve_nha.jpg',
    },
]

// --- INITIALIZATION ---
const init = () => {
    getSong()
    setupEventListeners()
    initState()
}

const initState = () => {
    containerLyrics.style.visibility = 'hidden'
}

const setupEventListeners = () => {
    audio.addEventListener('timeupdate', updateProgressTime)
    audio.addEventListener('loadedmetadata', () => {
        const time = formatTime(audio.duration)
        timeSong.textContent = time
    })
    audio.ontimeupdate = function () {
        if (audio.duration && state.isDragging == false) {
            const progressPercent = (audio.currentTime / audio.duration) * 100
            progressBar.value = progressPercent
            var val = progressPercent
            if (val >= 90 && val <= 99) val = val - 1
            create_style(
                'input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) ' +
                    val +
                    '%, #1D2021 ' +
                    val +
                    '%, #1D2021 100%) !important;}',
            )
        }
    }

    progressBar.addEventListener('input', function (e) {
        state.isDragging = true
        var val = e.target.value
        if (val >= 90 && val <= 99) val = val - 1
        create_style(
            'input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) ' +
                val +
                '%, #1D2021 ' +
                val +
                '%, #1D2021 100%) !important;}',
        )
    })
    progressBar.onchange = function (e) {
        state.isDragging = false
        const seekTime = (audio.duration / 100) * e.target.value
        audio.currentTime = seekTime
        var val = e.target.value
        if (val >= 90 && val <= 99) val = val - 1
        create_style(
            'input[type=range]::-webkit-slider-runnable-track { background: linear-gradient(90deg, rgba(218,80,25,1) 0%, rgba(184,160,34,1) ' +
                val +
                '%, #1D2021 ' +
                val +
                '%, #1D2021 100%) !important;}',
        )
    }
    audio.addEventListener('ended', () => {
        btnHeart.classList.remove('heart')
        if (state.isLoop == true) {
            setTimeout(() => {
                loadSong()
                playSong()
            }, 2000)
        } else if (state.isLoop == false) {
            setTimeout(() => {
                nextSong()
                playSong()
            }, 2000)
        }
    })

    avatarItemAction.addEventListener('click', () => {
        document.getElementById('list-song').style.visibility = 'hidden'
    })
    btnCloseList.addEventListener('click', () => {
        document.getElementById('list-song').style.visibility = 'hidden'
    })
    btnOpenList.addEventListener('click', () => {
        document.getElementById('list-song').style.visibility = 'visible'
    })
    btnHeart.addEventListener('click', () => {
        if (state.isHeart == false) {
            btnHeart.classList.add('heart')
            state.isHeart = true
        } else {
            btnHeart.classList.remove('heart')
            state.isHeart = false
        }
    })

    btnMode.addEventListener('click', toggleMode)

    btnState.addEventListener('click', () => {
        if (state.isPlayLyrics == false) {
            state.isPlayLyrics = true
            containerAvatar.style.visibility = 'hidden'
            containerLyrics.style.visibility = 'visible'
            btnState.innerHTML = "<i class='fas fa-music'></i>"
            const iconMusic = document.querySelector('.fa-music')
            iconMusic.style.paddingRight = '5px'
        } else {
            state.isPlayLyrics = false
            containerAvatar.style.visibility = 'visible'
            containerLyrics.style.visibility = 'hidden'
            btnState.innerHTML = "<i class='fas fa-microphone'></i>"
        }
    })

    btnPlay.addEventListener('click', () => {
        if (musicContent.classList.contains('playing')) {
            pauseSong()
        } else {
            playSong()
        }
    })

    btnNext.addEventListener('click', () => {
        nextSong()
        setTimeout(() => {
            playSong()
        }, 400)
    })

    btnPrev.addEventListener('click', () => {
        prevSong()
        setTimeout(() => {
            playSong()
        }, 400)
    })

    btnRandom.addEventListener('click', () => {
        if (state.isRandom == false) {
            state.isRandom = true
            addRandomSong()
        } else if (state.isRandom == true) {
            state.isRandom = false
            removeRandomSong()
        }
    })

    btnLoop.addEventListener('click', () => {
        if (state.isLoop == false) {
            state.isLoop = true
            loopSong()
        } else if (state.isLoop == true) {
            state.isLoop = false
            removeLoopSong()
        }
    })

    list.addEventListener('click', (e) => {
        state.songIndex = e.target.closest('li').getAttribute('data-index')
        btnHeart.classList.remove('heart')
        state.isHeart = false
        loadSong(state.songIndex)
        playSong()
    })
}

const parseLyric = (text) => {
    const lines = text.split('#').filter((line) => /\[\d{2}:\d{2}.\d{2,3}\]/.test(line))
    const result = lines.map((line) => {
        const [timeTag, value] = line.split(']')
        const [minutes, seconds] = timeTag.slice(1).split(':').map(parseFloat)
        const timeInSeconds = minutes * 60 + seconds
        return [timeInSeconds, value.trim()]
    })
    result.sort((a, b) => a[0] - b[0])
    return result
}

const appendLyric = (lyric) => {
    lyric.forEach((v, i) => {
        $("<p id='line-" + i + "'>")
            .html(v[1])
            .appendTo('.lyric-wrap')
            .on('click', () => handleClickLyric(v[0]))
    })
}

const resetContainerLyric = () => {
    wrapperLyrics.innerHTML = '<div class="lyric-wrap"></div>'
}

const handleClickLyric = (timestamp) => {
    if (typeof audio !== 'undefined') {
        audio.currentTime = timestamp
    }
}

const getLrc = (url) => {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.text()
        })
        .then((data) => {
            let text = data
                .replace(/\n/g, '#')
                .replace(/\r/g, '')
                .replace(/######/g, '#')
                .replace(/####/g, '#')
                .replace(/###/g, '#')
                .replace(/##/g, '#')
            state.lyric = parseLyric(text)
            appendLyric(state.lyric)
        })
        .catch((error) => {
            document.getElementsByClassName('lyric-wrap')[0].innerHTML = "<p class='empty-lyrics'> Bài hát hiện tại chưa có lời </p>"
        })
}

const loadSong = (song) => {
    song = state.songIndex
    audio.src = arraySongs[song].path
    nameSong.textContent = arraySongs[song].name
    nameItemAction.textContent = arraySongs[song].name
    document.title = arraySongs[song].name + ', ' + arraySongs[song].singer
    creator.textContent = arraySongs[song].singer
    avatar.src = arraySongs[song].avatar
    resetContainerLyric()
    getLrc(arraySongs[song].lrc)
    avatarItemAction.src = arraySongs[song].avatar
}

const getSong = () => {
    list.innerHTML = ''
    for (let i = 0; i < arraySongs.length; i++) {
        const name = arraySongs[i].name
        const creator = arraySongs[i].singer
        const music = arraySongs[i].path
        const avatar = arraySongs[i].avatar
        list.innerHTML += `<li class="list-music-item" data-name='${name}' data-creator='${creator}' data-music='${music}'
			data-avatar='${avatar}' data-index='${i}'>
			<div class="list-music-item-info">
			<img class="avatar-item" height='50' src="${avatar}"/>
			<div class="song-item-info" >
			<p class="name-song-item">${name}</p>
			<p class="creator">${creator}</p>
			</div>
			</div>

			</li>`
    }
    loadSong()
}

const create_style = (css) => {
    ;(head = document.head), (oldstyles = head.querySelector('#range-style')), (style = document.createElement('style'))
    if (oldstyles != null) {
        oldstyles.remove()
    }
    style.id = 'range-style'
    head.appendChild(style)

    style.type = 'text/css'
    if (style.styleSheet) {
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css))
    }
}

const updateLyrics = () => {
    const currentTime = audio.currentTime
    if (audio.duration) {
        for (let i = 0, l = state.lyric.length; i < l; i++) {
            const [timestamp, text] = state.lyric[i]

            if (currentTime > timestamp) {
                const lineId = `#line-${i}`
                const currentLine = $(lineId)

                if (currentLine.length > 0) {
                    const anchor = currentLine.position().top
                    $('.current-line').attr('class', '')
                    currentLine.attr('class', 'current-line')
                    $('.lyric-wrap').css('top', `${-anchor}px`)
                }
            }
        }
    }
}

const toggleMode = () => {
    // True is Light Mode - False is Dark Mode
    const elements = [
        document.body,
        document.querySelector('.music-player-wrap'),
        document.querySelector('.btn-list'),
        document.querySelector('.btn-mode'),
        document.querySelector('.btn-play'),
        document.querySelector('.btn-heart'),
        document.querySelector('.btn-close'),
        document.querySelector('.name'),
        document.querySelector('.music-list'),
        document.querySelector('.vip-2'),
        ...document.querySelectorAll('.name-song-item'),
    ]

    const classListMethod = state.isLightMode ? 'add' : 'remove'

    elements.forEach((element) => {
        element.classList[classListMethod]('light-theme')
        element.classList[classListMethod]('light-music-wrap')
        element.classList[classListMethod]('light-btn-wrap')
        element.classList[classListMethod]('light-btn-play-wrap')
        element.classList[classListMethod]('light-text-color')
    })

    // Special case for '::before' pseudo-element
    if (state.isLightMode) {
        document.querySelector('.music-player-wrap').classList.add('light-music-wrap::before')
        activeElement.classList.add('active-light-mode')
        activeLightModeElement.classList.remove('active')
        btnMode.classList.remove('fa-moon')
        btnMode.classList.add('fa-sun')
    } else {
        document.querySelector('.music-player-wrap').classList.remove('light-music-wrap::before')
        activeElement.classList.remove('active-light-mode')
        activeLightModeElement.classList.add('active')
        btnMode.classList.add('fa-moon')
        btnMode.classList.remove('fa-sun')
    }

    state.isLightMode = !state.isLightMode
    playSong()
}

const formatTime = (second) => {
    let hours = Math.floor(second / 3600)
    let minutes = Math.floor((second - hours * 3600) / 60)
    let seconds = Math.floor(second - hours * 3600 - minutes * 60)
    hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours
    if (minutes < 10) {
        minutes = '0' + minutes
    }
    if (seconds < 10) {
        seconds = '0' + seconds
    }
    return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds
}

const loopSong = () => {
    btnLoop.classList.remove('bx-remove-loop')
    btnLoop.classList.add('bx-add-loop')
    if (state.songIndex > arraySongs.length - 1) {
        state.songIndex = 0
    }
}

const removeLoopSong = () => {
    btnLoop.classList.add('bx-remove-loop')
    btnLoop.classList.remove('bx-add-loop')
    if (state.songIndex > arraySongs.length - 1) {
        state.songIndex = 0
    }
}

const playSong = () => {
    musicContent.classList.add('playing')
    avatar.style.animationPlayState = 'running'
    avatarItemAction.style.animationPlayState = 'running'
    btnPlay.classList.remove('fa-play')
    btnPlay.classList.add('fa-pause')
    audio.play()
}
const pauseSong = () => {
    musicContent.classList.remove('playing')
    avatar.style.animationPlayState = 'paused'
    avatarItemAction.style.animationPlayState = 'paused'
    btnPlay.classList.add('fa-play')
    btnPlay.classList.remove('fa-pause')
    audio.pause()
}

const addRandomSong = () => {
    state.songIndex = Math.floor(Math.random() * 101)
    btnRandom.classList.remove('bx-remove-random')
    btnRandom.classList.add('bx-add-random')
    if (state.songIndex > arraySongs.length - 1) {
        state.songIndex = 0
    }
}

const removeRandomSong = () => {
    btnRandom.classList.add('bx-remove-random')
    btnRandom.classList.remove('bx-add-random')
    if (state.songIndex > arraySongs.length - 1) {
        state.songIndex = 0
    }
}
const nextSong = () => {
    state.songIndex++
    if (state.songIndex > arraySongs.length - 1) {
        state.songIndex = 0
    }
    loadSong(state.songIndex)
}

const prevSong = () => {
    state.songIndex--
    if (state.songIndex < 0) {
        state.songIndex = arraySongs.length - 1
    }
    loadSong(state.songIndex)
}

const updateProgressTime = (e) => {
    const { currentTime, duration } = e.srcElement
    currentTimeDisplay.textContent = formatTime(currentTime)
}

audio.addEventListener('timeupdate', updateLyrics)
// --- RUN INITIALIZATION ---
init()
