import { async } from "regenerator-runtime"

const recordVideo = document.getElementById("preview")
const recordBtn = document.getElementById("actionBtn")

let stream = null;
let recorder = null;
let videoFile = null;

const init = async () =>{
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {width:400,height:300}
    })
    recordVideo.srcObject = stream;
    recordVideo.play();
}

init();

const handleDownload = (event) =>{
    const link = document.createElement('a');
    link.href = videoFile;
    link.download = "MyRecording.webm";
    document.body.appendChild(link);
    link.click();
}

const handleEndRecord = (event) =>{
    recordBtn.innerText = "download the file"
    recordBtn.removeEventListener("click",handleEndRecord);
    recordBtn.addEventListener("click",handleDownload);
    recorder.stop();
}

const handleStartRecord = (event) =>{
    recordBtn.innerText = "stop recording"
    recordBtn.removeEventListener("click",handleStartRecord)
    recordBtn.addEventListener("click",handleEndRecord)
    recorder = new window.MediaRecorder(stream)
    recorder.ondataavailable = (event)=>{
        console.log("data is ready")
        videoFile = URL.createObjectURL(event.data);
        recordVideo.srcObject = null;
        recordVideo.src = videoFile;
        recordVideo.loop = true
        recordVideo.play();
    }
    recorder.start();
    setTimeout(() => 
    {
        if (recorder.state === "inactive")
            return;    
        recorder.stop()
    }, 5000);
}

recordBtn.addEventListener("click",handleStartRecord)