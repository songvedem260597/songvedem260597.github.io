
const btnPlay = document.querySelector('.btn-play');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const avatar = document.querySelector("#bar10");
const videoBg = document.querySelector("#video");
var isPlay = false;
var offsetHeight = document.getElementById('bar10').offsetHeight;
avatar.style.animationPlayState = 'paused';
var listSongs = new Array();
var listVideoBg = [];
var closeAudioContext = true;
var i = 0;

getSong = () => {
	let songs = document.querySelectorAll(".list-music-item");
	for (let i = 0; i < songs.length; i++) {
		listSongs.push(songs[i].getAttribute("data-music"));
		listVideoBg.push(songs[i].getAttribute("data-video"));
	}
}
getSong();
// create web audio api context
var context = new (window.AudioContext || window.webkitAudioContext);
const analyser = context.createAnalyser();
const numPoints = analyser.frequencyBinCount;
const audioDataArray = new Uint8Array(numPoints);
function render() {
	analyser.getByteFrequencyData(audioDataArray);
	for (let x = 1; x <= 16; x++) {
		const ndx = ((x * numPoints) / 16) | 0;
		const audioValue = audioDataArray[ndx] / 255;
		const y = audioValue * 40;
		if (x != 9) {
			document.getElementById("bar" + x).style.height = y + offsetHeight / 6 + "vh";
			document.getElementById("bar" + x).style.width = y + offsetHeight / 6 + "vh";
		}
		else {
			const opacity = 0.4 + (y / 50);
			document.getElementById("bar" + x).style.opacity = opacity;
		}
	}
	requestAnimationFrame(render);
}
requestAnimationFrame(render);

/*--INIT--*/
videoBg.src = listVideoBg[0];
var audio = new Audio();
audio.autoplay = false;
audio.src = listSongs[0];
audio.crossOrigin = "anonymous";
audio.addEventListener("canplay", handleCanplay);
function handleCanplay() {
	const source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
}
playVideo = () => {
	videoBg.load();
	videoBg.play();
}
playSong = () => {
	audio.play();
	isPlay = true;
	avatar.style.animationPlayState = 'running';
	btnPlay.classList.remove('fa-play');
	btnPlay.classList.add('fa-pause');

}
pauseSong = () => {
	avatar.style.animationPlayState = 'paused';
	btnPlay.classList.add('fa-play');
	btnPlay.classList.remove('fa-pause');
	audio.pause();
	isPlay = false;

}

btnPlay.addEventListener('click', () => {
	if (isPlay == false) {
		playSong();
	}
	else {
		pauseSong();
	}

})
btnNext.addEventListener('click', () => {
	i = ++i < listSongs.length ? i : 0;
	audio.src = listSongs[i];
	videoBg.src = listVideoBg[i];
	setTimeout(() => {
		playVideo();
		playSong();
	}, 2000);
})
btnPrev.addEventListener('click', () => {
	i = --i >= 0 ? i : listSongs.length - 1;
	videoBg.src = listVideoBg[i];
	audio.src = listSongs[i];
	setTimeout(() => {
		playVideo();
		playSong();
	}, 2000);
})
audio.addEventListener('ended', () => {
	i = ++i < listSongs.length ? i : 0;
	audio.src = listSongs[i];
	videoBg.src = listVideoBg[i];
	setTimeout(() => {
		playVideo();
		playSong();
	}, 2000);
})

