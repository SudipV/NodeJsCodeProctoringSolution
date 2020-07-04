var PORT = process.env.PORT || 4200;
const express = require('express');
const path = require('path');
var mysql = require('mysql');
const fs = require('fs');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: '1mb'}));
app.get('/', function(req,res){
    res.sendfile(path.join(__dirname, '/index.html'));
})

let studentEmail, studentAccountToken;

// for establishing connection with proctoringwebapp database 
// add your ip here https://portal.azure.com/#@robonomics.ai/resource/subscriptions/9d10dd68-a370-465c-a0ae-3c8d1bca6451/resourceGroups/Dev_ProctoringSolution_WebApp/providers/Microsoft.DBforMySQL/servers/devproctoringsolutiondb/connectionSecurity
var connection = mysql.createConnection({
  host: "devproctoringsolutiondb.mysql.database.azure.com",
  user: "admnsqlproctor@devproctoringsolutiondb", 
  password: "Rai@1234$", 
  database: "mayoorpvtschool", 
  port: 3306, 
  ssl:{ca:fs.readFileSync('./ssl-ca-crt/BaltimoreCyberTrustRoot.crt.pem')}
});

connection.connect(function(err){
    if (err) throw err;
    console.log('connected');
});

// connection.query("ALTER TABLE studentdivision ADD COLUMN token TEXT(255) NOT NULL", 
connection.query("SELECT * from studentdivision",
function (err, rows, fields) {
  if (err) throw err
  console.log('The solution is: ', rows);
});

//login email id
app.post('/emailId', (req, res)=>{
  studentEmail = req.body.emailId;
  // studentEmail = 'demoteacher@mpsabudhabi.com';
  connection.query("SELECT * FROM studentdivision WHERE schoolemailaddress = '" + studentEmail + "'", 
  function (err, rows, fields) {
    if (typeof rows[0] === 'undefined'){
      res.json({
        status: 'error',
      });
    } else {
      var formLink = rows[0].form_link;
      res.json({
        status: 'success',
        form: formLink,
      });
    }
  });
});

//register email id
app.post('/registerEmailId', (req, res)=>{
  studentEmail = req.body.emailId;
  console.log(studentEmail);
  connection.query("SELECT * FROM studentdivision WHERE schoolemailaddress = '" + studentEmail + "'", 
  function (err, rows, fields) {
    if (typeof rows[0] === 'undefined'){
      res.json({
        status: 'error',
      });
    } else {
      var formLink = rows[0].grade;
      res.json({
        status: 'success',
        form: formLink,
      });
    }
  });
});

//save token input
app.post('/token', (req, res)=>{
  studentAccountToken = req.body.token;
  console.log(req.body.token)
  // connection.query('SELECT * from studentdivision where schoolemailaddress = ' + studentEmail, 
  // function (err, rows, fields) {
    // if (err) throw err
    // console.log('The solution is: ', rows);
    // const query = rows
    // if(studentEmail !== query){
    //   alert('Data not found.');
    // }
    // else{
      connection.query('UPDATE studentdivision SET token = "' + req.body.token + '" where schoolemailaddress = "'+ studentEmail + '"',
    //  connection.query('INSERT INTO studentdivision(token) VALUES('+ req.body.token + ')',
      function (err, rows, fields) {
        if (err) throw err
        console.log('The solution is: ', rows);
      });
    // }
//   });
});

//for saving scanid document
// app.post('/uploadId', (req, res) => {
  // res.sendFile('/static/html/voiceRecord.html');
// });

//for saving location
app.post('/saveLocation', (req, res) => {
  console.log(req.body.lng);
  connection.query('UPDATE studentdivision SET location = "' + req.body.lng + ',' + req.body.lat + '" where schoolemailaddress = "'+ studentEmail + '"',
  //  connection.query('INSERT INTO studentdivision(token) VALUES('+ req.body.token + ')',
    function (err, rows, fields) {
      if (err) throw err
      console.log('The solution is: ', rows);
    });
});

app.listen(PORT);

//check blob storage here
//https://portal.azure.com/#blade/Microsoft_Azure_Storage/ContainerMenuBlade/overview/storageAccountId/%2Fsubscriptions%2F9d10dd68-a370-465c-a0ae-3c8d1bca6451%2FresourceGroups%2FDev_ProctoringSolution%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fdevproctoringwebapp/path/devproctoringsolutionblob/etag/%220x8D80B00B99D1612%22/defaultEncryptionScope/%24account-encryption-key/denyEncryptionScopeOverride//defaultId//publicAccessVal/None