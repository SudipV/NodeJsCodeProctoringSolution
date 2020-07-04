Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpeg',
    jpeg_quality: 90
   });
   Webcam.attach( '#my_camera' );
   $("#nextButton").css("display", "none");
  
//   <!-- Code to handle taking the snapshot and displaying it locally -->
  function take_snapshot() {   
   // take snapshot and get image data
   Webcam.snap( function(data_uri) {
    // display results in page
    $("#my_camera").css("display", "none");
    $("#nextButton").css("display", "block");
    $("#clickPicture").css("display", "none");
    document.getElementById('results').innerHTML = '<img src="'+data_uri+'"/>';
    var raw_image_data = (data_uri.replace(/^data\:image\/\w+\;base64\,/, ''));
    // console.log(raw_image_data);
    
    var byteCharacters = atob(raw_image_data);
    var byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);

    var name = "photo.jpg";
    var type = "image/jpeg";
    uploadData(name, [byteArray], type);
    });
  }