#ROBONOMICS-AI
#DIGITAL PROCTORING APP

#Introduction
This document will explain the code structure of a digital proctoring app developed under the  Robonomics-AI platform. 

#Tech stack used -
NODEjs (Server)
HTML, CSS,  VANILLA JAVASCRIPT (Client)

#First thing first, How to run? 
Clone the repository
Inside the project folder, Run command in terminal, nodemon server.js
Open in browser http://localhost:4200/

This is what the file structure of code looks like, explanation about each file: 
1. Server.js is the main file of the entire folder, which runs the server and our app listens to the port. It contains POST, GET, PUT APIs to interact with our client files.
2. Index.html contains the code which renders the code for everything we see when the user lands on the first page of the app and further subsequent navigation.
3. Public folder contains - 
JS file , which is used for adding all the functionality to the app and creating interaction between server and client
Css folder contain styling file, which add cosmetics to our screens
Html folder contains the primary DOM of how and where tags are rendered and talks with browser
Images contain all the image sources required to embed to make our app  look nicer and interactive.

#Going deep into the flow and code: 
HTML, IMAGES, and CSS folders are inherently speaking for itself, there would be no jargon in understanding what files render and do by looking through them. 
JS folder explained:
Main.js - this file contains code for:
 1. Google authentication, (sign-in, signout)
 2. Fetching grade after student types email address,
 3. Locktab,
 4. Location,
 5. Show/hide Bot. 

audioRecord.js - takes three audioInput from screens and contains callback uploadData (this function is written in importBlob), which takes the chunks to blob and saves it there
Easytimer and html2canvas files are used for taking screenshots and video streaming after every  (some required milliseconds, now sets to 15 sec) 
screenCature, uploadphoto, videocapture, videoinput are explained afterwards.

#IMPORTANT Categorisation : 
Our app constitutes two parts: 
1. Login (index.html contains all the code, display none and after successful login using code in main.js for signin we show/hide component for two page navigation)
2. Registration screens [apart from all the code from above point does the saving, talking(apis), and rendering on frontend(browser), naming of files will explains what the file do.] 
BLOB interaction is through importBlob.js which contains key and api for communication with azure container host. 

LOGIN contains following features and you will find the strings connecting the interaction between the code, functionality, and what you see working(End app)
1. Login button - google authentication, sign-in function in main.js file, which in turn after successful login hide some elements and show components, send emailID through an api to server that is fetching dynamic form link from sql database, signout button will simply bring you back to login page again) 
2. After you are signed in, ScreenCapture.js and videoCapture.js comes into picture, and will send the streaming to blob after mentioned number of seconds, you have to be sure, student sign out, as sign out will trigger stoppage of web live streaming and screen sharing portion) 
3. Location is called when the student lands on the forms page to give a test and saves it in sql, basically, savelocation(in main.js) is called and which posts an api to server.js file that interacts with sql database to run insert/update query.

#REGISTERATION: It contains all the 9 screens for taking data input from students. 
1. Audio input has 3 screens that use audiorecord.js to save it in a blob. 
2. Clicking a picture uses uploadPhoto.js code
3. Capturing Video takes videoInput of the student ( videocapture is used in login while proctoring for live web streaming)
4. Scanid have code in main.js to take file input and store it in blob 
5. On registration(register.html) first screen, grade is fetched from the sql database client[post api in main.js) server(server.js receives to run a query and fetch grade when column field is equal to entered emailID) interaction 
For register and login button you have to toggle the button in index.html
Also, you have to add the redirect url of the server for authentication

Link to the complete document: https://docs.google.com/document/d/1B0pNGxRtGlDcuzarRmPiukD-obP8HEUbnjQ_65jyxwg/edit#heading=h.mbjsiz6n6jlo