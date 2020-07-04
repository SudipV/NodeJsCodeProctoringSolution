class VideoCapture {
    constructor(){
        this.mediaRecorder = null;
        this.recordedBlobs = [];
        this.stream = null;
    }

    static _startVideoCapture(){
        try {
            return navigator.mediaDevices.getUserMedia({audio: true, video: { facingMode: "user" }, mimeType: 'video/webm'});
        } catch (e) {
            console.error('navigator.getUserMedia error:', e);
        }
    }

    async _startVideoRecording(e) {
        this.stream = await VideoCapture._startVideoCapture();
        this.recordedBlobs = [];
        try {
            this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            return;
        }

        this.mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
              this.recordedBlobs.push(event.data);
            }
          });

        this.mediaRecorder.start(10);
    }

    _stopVideoRecording(e){
        try{
            this.mediaRecorder.stop();
            this.mediaRecorder = null;
            this.stream = null;
            let now = new Date();
            let foldername = now.toDateString()+'/videostream/';
            let filename = now.toTimeString()+".webm";
            let name = foldername + filename;
            uploadData(name, this.recordedBlobs, "video/webm");
        } catch(e) {
            // handle error
        }
    }
}