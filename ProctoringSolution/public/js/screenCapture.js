class ScreenSharing {
    constructor() {
      this.stream = null;
      this.chunks = [];
      this.mediaRecorder = null;
    }
  
    static _startScreenCapture() {
      if (navigator.getDisplayMedia) {
        return navigator.getDisplayMedia({video: true});
      } else if (navigator.mediaDevices.getDisplayMedia) {
        return navigator.mediaDevices.getDisplayMedia({video: true});
      } else {
        return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'monitor'}});
      }
    }
  
    async _startCapturing(e) {
    //   console.log('Start capturing.');
      this.chunks = [];
      this.stream = await ScreenSharing._startScreenCapture();
      this.stream.addEventListener('inactive', e => {
        // console.log('Capture stream inactive - stop recording!');
        this._stopCapturing(e);
      });
      this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
      this.mediaRecorder.addEventListener('dataavailable', event => {
        if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
        }
      });
      this.mediaRecorder.start(10);
    }
  
    _stopCapturing(e) {
        console.log('Stop capturing.');
      try{
        this.mediaRecorder.stop();
        this.mediaRecorder = null;
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;

        let now = new Date();
        let foldername = now.toDateString()+'/screenrecord/';
        let filename = now.toTimeString()+".webm";
        let name = foldername + filename;
    
        uploadData(name, this.chunks, 'video/webm');
      } catch(e){
          //error handling
      }
    }
}