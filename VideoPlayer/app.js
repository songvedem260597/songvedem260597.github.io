const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");
const source1080 = document.getElementById('source-1080');
const source720 = document.getElementById('source-720');
const source480 = document.getElementById('source-480');
var video = document.getElementById('player');
var arrayVideo = [];
var videoIndex = 0;

getVideos = async () =>{
    var videos = document.querySelectorAll(".list-video-item");
    for(let i = 0 ; i < videos.length ; i++){
        var quality = new Object();
        quality.fullhd = videos[i].getAttribute('data-src-1080');
        quality.hd = videos[i].getAttribute('data-src-720');
        quality.sd = videos[i].getAttribute('data-src-480');
        arrayVideo.push(quality);
    }
    video.src = arrayVideo[videoIndex].hd;
    source1080.setAttribute('src',arrayVideo[videoIndex].fullhd );
    source720.setAttribute('src',arrayVideo[videoIndex].hd );
    source480.setAttribute('src',arrayVideo[videoIndex].sd );
    
};
getVideos ();


playVideo =()=>{
    video.load();
    video.play();
}

video.addEventListener('end', () => {
    videoIndex = ++videoIndex < arrayVideo.length ? videoIndex : 0;
    video.src = arrayVideo[videoIndex].hd;
    source1080.setAttribute('src',arrayVideo[videoIndex].fullhd );
    source720.setAttribute('src',arrayVideo[videoIndex].hd );
    source480.setAttribute('src',arrayVideo[videoIndex].sd );
    playVideo();
})

btnNext.addEventListener('click', () => {
    videoIndex = ++videoIndex < arrayVideo.length ? videoIndex : 0;
    video.src = arrayVideo[videoIndex].hd;
    source1080.setAttribute('src',arrayVideo[videoIndex].fullhd );
    source720.setAttribute('src',arrayVideo[videoIndex].hd );
    source480.setAttribute('src',arrayVideo[videoIndex].sd );
    playVideo();
})

btnPrev.addEventListener('click', () => {
    videoIndex = --videoIndex >= 0 ? videoIndex : arrayVideo.length -1;
    console.log(videoIndex);
    video.src = arrayVideo[videoIndex].hd;
    source1080.setAttribute('src',arrayVideo[videoIndex].fullhd );
    source720.setAttribute('src',arrayVideo[videoIndex].hd );
    source480.setAttribute('src',arrayVideo[videoIndex].sd );
    playVideo();
})

