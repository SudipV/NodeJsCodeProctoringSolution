const recordAudio = () =>
  
        new Promise(async resolve => {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          var options = {
            audioBitsPerSecond : 128000
            // mimeType : 'audio/mpeg'
          };
          const mediaRecorder = new MediaRecorder(stream, options);
          let audioChunks = [];

          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          const start = () => {
            audioChunks = [];
            mediaRecorder.start();
          };

          const stop = () =>
            new Promise(resolve => {
              mediaRecorder.addEventListener('stop', (data) => {
                console.log(data);
                let audioNumber = document.getElementById("stop").name;
                let name = audioNumber + ".mp3";
                uploadData(name, audioChunks, mediaRecorder.mimeType);
                const audioBlob = new Blob(audioChunks, { 'type' : mediaRecorder.mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                const play = () => audio.play();
                resolve({ audioChunks, audioBlob, audioUrl, play });
              });

              mediaRecorder.stop();
            });

          resolve({ start, stop });
        });

      const sleep = time => new Promise(resolve => setTimeout(resolve, time));

      const recordButton = document.querySelector('#record');
      const stopButton = document.querySelector('#stop');
      const playButton = document.querySelector('#play');
      const saveButton = document.querySelector('#save');
      const savedAudioMessagesContainer = document.querySelector('#saved-audio-messages');

      let recorder;
      let audio;

      recordButton.addEventListener('click', async () => {
          $('#record').css("display", "none");
          $('#stop').css("display", "block");
          $('#recordinggif').css("display", "block");
          $('#beforerecording').css("display", "none");
        recordButton.setAttribute('disabled', true);
        stopButton.removeAttribute('disabled');
        // playButton.setAttribute('disabled', true);
        // saveButton.setAttribute('disabled', true);
        if (!recorder) {
          recorder = await recordAudio();
        }
        recorder.start();
      });

      stopButton.addEventListener('click', async () => {
        $('#stop').css("display", "none");
        $('#nextButton').css("display", "block");
        $('#recordinggif').css("display", "none");
        $('#saved').css("display", "block");
        recordButton.removeAttribute('disabled');
        stopButton.setAttribute('disabled', true);
        // playButton.removeAttribute('disabled');
        // saveButton.removeAttribute('disabled');
        audio = await recorder.stop();
      });

      playButton.addEventListener('click', () => {
        audio.play();
      });

      // saveButton.addEventListener('click', () => {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(audio.audioBlob);
      //   reader.onload = () => {
      //     const base64AudioMessage = reader.result.split(',')[1];

      //     fetch('/messages', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ message: base64AudioMessage })
      //     }).then(res => {
      //       if (res.status === 201) {
      //         return populateAudioMessages();
      //       }
      //       console.log('Invalid status saving audio message: ' + res.status);
      //     });
      //   };
      // });

      // const populateAudioMessages = () => {
      //   return fetch('/messages').then(res => {
      //     if (res.status === 200) {
      //       return res.json().then(json => {
      //         json.messageFilenames.forEach(filename => {
      //           let audioElement = document.querySelector(`[data-audio-filename="${filename}"]`);
      //           if (!audioElement) {
      //             audioElement = document.createElement('audio');
      //             audioElement.src = `/messages/${filename}`;
      //             audioElement.setAttribute('data-audio-filename', filename);
      //             audioElement.setAttribute('controls', true);
      //             savedAudioMessagesContainer.appendChild(audioElement);
      //           }
      //         });
      //       });
      //     }
      //     console.log('Invalid status getting messages: ' + res.status);
      //   });
      // };

      // populateAudioMessages();