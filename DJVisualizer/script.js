
const btnPlay = document.querySelector('.btn-play');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const avatar = document.querySelector("#bar10");
const videoBg = document.querySelector("#video");
const nameSong = document.querySelector(".wrap-title-song");
const image = document.querySelectorAll('.glitch-image');
var isPlay = false;
var offsetHeight = document.getElementById('bar10').offsetHeight;
avatar.style.animationPlayState = 'paused';
var songIndex = 0;
var listSongs = new Array();
var listVideoBg = [];
var closeAudioContext = true;
var audio = new Audio();
audio.autoplay = false;

startApp();

function startApp() {
	loadSong = (song) =>{
		song = songIndex;
		let detailSong = document.querySelectorAll(".list-music-item");
		videoBg.src = listVideoBg[songIndex];
		videoBg.load();
		audio.src = listSongs[songIndex];
		let name = detailSong[songIndex].getAttribute("data-name");
		nameSong.innerHTML= `<marquee width="100%" direction="left" loop ="2" ><p>Bài hát: ${name}. Chúc các bạn nghe nhạc vui vẻ!</p></marquee>`;
		for(let i = 0; i< image.length; i++ ){
			image[i].src= detailSong[songIndex].getAttribute("data-img");
		}
	}
	getSong = () => {
		let songs = document.querySelectorAll(".list-music-item");
		for (let i = 0; i < songs.length; i++) {
			listSongs.push(songs[i].getAttribute("data-music"));
			listVideoBg.push(songs[i].getAttribute("data-video"));
		}
		loadSong();
	}
	getSong();
	

	function unlockAudioContext(context) {
		if (context.state !== 'suspended') return;
		const body = document.body;
		const events = ['touchstart','touchend', 'mousedown','keydown'];
		events.forEach(e => body.addEventListener(e, unlock, false));
		function unlock() { context.resume().then(clean); }
		function clean() { events.forEach(e => body.removeEventListener(e, unlock)); }
	}

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
	
	// create web audio api context
	const context = new (window.AudioContext || window.webkitAudioContext);
	unlockAudioContext(context);
	const analyser = context.createAnalyser();
	const numPoints = analyser.frequencyBinCount;
	const audioDataArray = new Uint8Array(numPoints);
	audio.crossOrigin = "anonymous";
	audio.addEventListener("canplay", handleCanplay);
	function handleCanplay() {
		const source = context.createMediaElementSource(audio);
		source.connect(analyser);
		analyser.connect(context.destination);
	}
	playVideo =()=>{
		videoBg.load();
		videoBg.play();
	}
	playSong =()=>{
		avatar.style.animationPlayState = 'running';
		btnPlay.classList.remove('fa-play');
		btnPlay.classList.add('fa-pause');
		audio.play();
		isPlay = true;
		
	}
	pauseSong =()=>{
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
		else{
			pauseSong();
		}
	
	})
	btnNext.addEventListener('click', () => {
		songIndex = ++songIndex < listSongs.length ? songIndex : 0;
		audio.src = listSongs[songIndex];
		videoBg.src = listVideoBg[songIndex];
		loadSong(songIndex);
		setTimeout(() => {
			playVideo();
			playSong();
		}, 2000);
	})
	btnPrev.addEventListener('click', () => {
		songIndex = --songIndex >= 0 ? songIndex : listSongs.length-1;
		videoBg.src = listVideoBg[songIndex];
		audio.src = listSongs[songIndex];
		loadSong(songIndex);
		setTimeout(() => {
			playVideo();
			playSong();
		}, 2000);
		
		
	})
	audio.addEventListener('ended', () => {
		songIndex = ++songIndex < listSongs.length ? songIndex : 0;
		audio.src = listSongs[songIndex];
		videoBg.src = listVideoBg[songIndex];
		loadSong(songIndex);
		setTimeout(() => {
			playVideo();
			playSong();
		}, 2000);
	})

}

