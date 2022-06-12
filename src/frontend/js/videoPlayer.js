const playBtn = document.getElementById("play")
const video = document.querySelector("video")
const volumeRange = document.getElementById("volume")
const muteBtn = document.getElementById("mute")
const currentTime = document.getElementById("currentTime")
const totalTime = document.getElementById("totalTime")
const timeLine = document.getElementById("timeLine")
const fullScreenBtn = document.getElementById("fullScreen")
const videoControls = document.getElementById("videoControls")
const videoContainer = document.getElementById("videoContainer")


let volumeValue = 0.5

volumeRange.value = volumeValue;

let controlMove = null;

const handlePlay = (event) =>{
    if (video.paused){
        video.play()
    }
    else
        video.pause()
    playBtn.innerText = video.paused ? "play" : "pause"
}

const handleMute = (event) =>{
    if (Number(volumeValue) === 0)
        return;
    if (video.muted){
        video.muted = false;
        volumeRange.value = volumeValue;
    }
    else{
        video.muted = true;
        volumeValue = volumeRange.value;
        volumeRange.value = 0;
    }
    muteBtn.innerText = video.muted ? "unmute" : "mute"
}

const handleVolume = (event) =>{
    const{target:{value}} = event;
    volumeValue = value;
    video.volume = value
    if (Number(volumeValue) === 0){
        video.muted = true;
        muteBtn.innerText = "unmute";
    }
    else if (video.muted && volumeValue !== 0){
        video.muted = false;
        muteBtn.innerText = "mute"; 
    }
}

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14,19);

const handleTimeSetting = (event) =>{
    totalTime.innerText = formatTime(Math.floor(video.duration))
    timeLine.max = Math.floor(video.duration)
}

const handleTimeUpdate = (event) =>{
    timeLine.value = Math.floor(video.currentTime)
    currentTime.innerText = Math.floor(video.currentTime)
}

const handleTimeChange = (event)=>{
    video.currentTime = timeLine.value;
    currentTime.innerText = Math.floor(timeLine.value)
}

const handleFullScreen = (event) =>{
    const fullscreenObj = document.fullscreenElement;
    if (fullscreenObj){
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen"
    }else{
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen"
    }
}

const hide = () => videoControls.classList.remove("showing")

const handleMouseMove = (event) =>{

    if (controlMove){
        clearTimeout(controlMove)
        controlMove = null;
    }
    videoControls.classList.add("showing")
    controlMove = setTimeout(hide,2000);
}

const handleHide = (event) =>{
    controlsTimeout = setTimeout(hide,2000)
}

const handleContainerClick = (event) =>{
    handlePlay();
}

const handleUpdateView = (event) =>{
    const {dataset: {id}} = videoContainer;
    fetch(`/api/videos/${id}/end`,{
        method:"POST"
    })
}

if (video.readyState == 4) {
    handleTimeSetting();
}

playBtn.addEventListener("click",handlePlay);
muteBtn.addEventListener("click",handleMute);
volumeRange.addEventListener("input",handleVolume);
video.addEventListener("loadedmetadata",handleTimeSetting)
video.addEventListener("timeupdate",handleTimeUpdate)
timeLine.addEventListener("input",handleTimeChange)
fullScreenBtn.addEventListener("click",handleFullScreen)
video.addEventListener("mousemove",handleMouseMove)
video.addEventListener("mouseleave",handleHide)
videoContainer.addEventListener("click",handleContainerClick)
video.addEventListener("ended",handleUpdateView)