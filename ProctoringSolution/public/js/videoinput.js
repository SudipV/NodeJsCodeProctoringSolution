
$('#btnStop').css("display", "none");
$('#nextButton').css("display", "none");
$('#vid2').css("display", "none");

let constraintObj = { 
    audio: false, 
    video: { 
        facingMode: "user", 
    },
    mimeType: 'video/mp4'
}; 

//handle older browsers that might implement getUserMedia in some way
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
} else {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        devices.forEach(device=>{
            console.log(device.kind.toUpperCase(), device.label);
            //, device.deviceId
        })
    })
    .catch(err=>{
        console.log(err.name, err.message);
    })
}

navigator.mediaDevices.getUserMedia(constraintObj)
.then(function(mediaStreamObj) {
    //connect the media stream to the first video element
    let video = document.querySelector('video');
    if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
        // console.log(mediaStreamObj);
    } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj);
    }
    
    video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play();
    };
    
    //add listeners for saving video/audio
    let start = document.getElementById('btnStart');
    let stop = document.getElementById('btnStop');
    let vidSave = document.getElementById('vid2');
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    let chunks = [];
    
    start.addEventListener('click', (ev)=>{
        mediaRecorder.start();
        // console.log(mediaRecorder.state);
        $('#btnStart').css("display", "none");
        $('#btnStop').css("display", "block");
    })
    stop.addEventListener('click', (ev)=>{
        mediaRecorder.stop();
        // console.log(mediaRecorder.state);
        $('#btnStop').css("display", "none");
        $('#nextButton').css("display", "block");
    });
    mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }
    mediaRecorder.onstop = (ev) => {
        let name = "video.mp4";
        let blob = new Blob(chunks, { 'type' : mediaRecorder.mimeType });

        uploadData(name, chunks, mediaRecorder.mimeType);

        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        $('#vid1').css("display", "none");
        $('#vid2').css("display", "block");
        vidSave.src = videoURL;
    }
})
.catch(function(err) { 
    console.log(err.name, err.message); 
});


