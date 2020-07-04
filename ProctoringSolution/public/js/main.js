
//call to lock the tab and save time
lockTab();

let screenCapture = null;
let videoCapture = null;
let timer = null;
let imgSrc;

//----------------------get the form data --------------------------//
let uri = window.location.origin

//--------------------upload file--------------------//


$("#profile-img").change(function(){
  readURL(this);
});


function readURL(input) {
  if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function (e) {
          imgSrc = e.target.result;
          $('#profile-img-tag').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
      //save to blob
      var raw_image_data = (imgSrc.replace(/^data\:image\/\w+\;base64\,/, ''));
      // console.log(raw_image_data);
      
      var byteCharacters = atob(raw_image_data);
      var byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
  
      var name = input.files[0].name;
      var type = input.files[0].type;
      uploadData(name, [byteArray], type);
  }
}

// $(".custom-file-input").on("change", function() {
//     var fileName = $(this).val().split("\\").pop();
//     $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
// });

  // const fileSelector = document.getElementById('file-selector');
  // fileSelector.addEventListener('change', (event) => {
  //   const fileList = event.target.files;
  //   console.log(fileList);
  // });

  // const status = document.getElementById('status');
  //     const output = document.getElementById('output');
  //     if (window.FileList && window.File && window.FileReader) {
  //       document.getElementById('customFile').addEventListener('change', event => {
  //         output.src = '';
  //         status.textContent = '';
  //         const file = event.target.files[0];
  //         if (!file.type) {
  //           status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
  //           return;
  //         }
  //         if (!file.type.match('image.*')) {
  //           status.textContent = 'Error: The selected file does not appear to be an image.'
  //           return;
  //         }
  //         const reader = new FileReader();
  //         reader.addEventListener('load', event => {
  //           output.src = event.target.result;
  //         });
  //         reader.readAsDataURL(file);
  //       }); 
  //     }
  
  
  //----------------------fetch Grade and post inputgmail -----------//
  //setup before functions
  let typingTimer;                //timer identifier
  let doneTypingInterval = 4000;  //time in ms (4 seconds)
  let myInput = document.getElementById('studentEmail');
  
  //on keyup, start the countdown
  myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer);
      if (myInput.value) {
          typingTimer = setTimeout(doneTyping, doneTypingInterval);
      }
  });
  
  //user is "finished typing," do something
  function doneTyping () {
      //do something
      fetchGrade();
  }
  
  // $("#userDetail").submit(function (event) {
  //   $.post('/inputEmail', $("#userDetail").serialize(), function (data) {
  //     //  console.log(data) //data is the response from the backend
  //     window.location.href = './clickPhoto.html';
  //   });
  //   event.preventDefault();
  // });
function fetchGrade(){

  // var $input = $('#studentEmail');
  //on keyup, start the countdown
  // $input.on('keydown', function () {
  // let registerEmailId = $('#studentEmail').val();
    // getLocation();
    sessionStorage.setItem("emailId", document.getElementById('studentEmail').value);
    // if('geolocation' in navigator){
    //   var lat, lng;
    //   navigator.geolocation.getCurrentPosition(position => {
    //   lat = position.coords.latitude;
    //   lng = position.coords.longitude;
    //   console.log('available');
    //   sessionStorage.setItem("lat", lat);
    //   $.post( "/saveLocation", { "lat": lat, "lng": lng} );
    //   // console.log(json);
    //   });
    // }
    // else{
    //   console.log('NA');
    //   sessionStorage.setItem("lat", "na");
    //   $.post( "/saveLocation", { "lat": 'NA', "lng": 'NA'} );
    // }
    $.post( "/registerEmailId", { "emailId": document.getElementById('studentEmail').value}, function(data){
    if(data.status == "success"){
      document.getElementById("grade").innerHTML = data.form;
      // location.href='./scanid.html';
      setTimeout(()=>{
        location.href='./scanid.html';
      }, 4000)
    }
    else if(data.status == "error"){
      alert("EmailId not Found");
      // signOut();
    }
  //  });
});

}

//----------------------restrict new tab-----------------------------//

// let timeloggedOut = [];
function lockTab(){
    document.addEventListener("visibilitychange", function(){
        if(document.visibilityState === 'hidden'){
            alert('We are sorry you logged in to some other screen. Your actions are been recorded.');
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            // timeloggedOut.push(time);
        }
        else{
            //do nothing
        }
    })
}

//--------------------------login/signout--------------------------------------//

async function onSignIn(googleUser) {
    $(".g-form").css("display","block");
    // $(".openBot").css("display","block");
    $(".signout").css("display","block");
    $(".g-signin2").css("display","none");
    $('.navbar').css("display", "block");
    $(".welcome").css("display","none");
    $(".heading").css("display","none");
    getLocation();
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    
    let emailId = profile.getEmail();

    $.post( "/emailId", { "emailId": emailId}, function(data){
      if(data.status == "success"){
        sessionStorage.setItem("emailID", emailId);
        $('#google_form').attr('src', data.form);
      
        timer = new easytimer.Timer();
        timer.start({precision: 'seconds', startValues: {seconds: 0}, target: {seconds: 15}});
       
        timer.addEventListener('secondsUpdated', function (e) {

          if(timer.getTimeValues().seconds == 1){
            videoCapture = new VideoCapture();
            videoCapture._startVideoRecording();
          }

          if(timer.getTimeValues().seconds == 7){
            videoCapture._stopVideoRecording();
            videoCapture = null;
          }
        });
        timer.addEventListener('targetAchieved', function (e) {
          timer.reset();
        });

        screenCapture = new ScreenSharing();
        screenCapture._startCapturing();
      }
      else if(data.status == "error"){
        alert("Exam not Found");
        signOut();
      }
    });
}

function signOut(){
  $(".g-form").css("display","none");
  // $(".openbot").css("display","none");
  $(".signout").css("display","none");
  $(".g-signin2").css("display","block");
  $(".heading").css("display","block");
  $(".welcome").css("display","block");
  // $('.navbar').css("display", "none");
  
  $(".card").css("display","block");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      timer.stop();
      timer = null;
      screenCapture._stopCapturing();
      screenCapture = null;
      sessionStorage.clear("emailId");
      // console.log('User signed out.');
    });
  }

//--------------------------openBOt----------------------//
function openBot(){
    var x = document.getElementsByClassName("openBot");
    if (x[0].style.display === "none") {
      x[0].style.display = "block";
    } else {
      x[0].style.display = "none";
    }
}

//--------------------getLocation after signin----------------------------//

function getLocation(){
    $(".openTab").css("display", "block");
    if('geolocation' in navigator){
      var lat, lng;
      navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      console.log('available');
      sessionStorage.setItem("lat", lat);
      $.post( "/saveLocation", { "lat": lat, "lng": lng} );
      // console.log(json);
      });
    }
    else{
      console.log('NA');
      sessionStorage.setItem("lat", 'na');
      $.post( "/saveLocation", { "lat": 'NA', "lng": 'NA'} );
    }
  }

  

