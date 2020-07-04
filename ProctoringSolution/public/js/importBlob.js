var maxBlockSize = 256 * 1024; //Each file will be split in 256 KB.
var numberOfBlocks = 1;
var selectedFile = null;
var currentFilePointer = 0;
var totalBytesRemaining = 0;
var blockIds = new Array();
var blockIdPrefix = "block-";
var submitUri = null;
var bytesUploaded = 0;
var baseUrl = 'https://devproctoringwebapp.blob.core.windows.net';

//Read the file and find out how many blocks we would need to split it.
function uploadData(name, chunks, type) {
    maxBlockSize = 256 * 1024;
    currentFilePointer = 0;
    totalBytesRemaining = 0;
    numberOfBlocks = 1;
    selectedFile = null;
    blockIds = new Array();
    submitUri = null;
    bytesUploaded = 0;

    selectedFile = new Blob(chunks, { 'type' : type });

    var fileSize = selectedFile.size;
    if (fileSize < maxBlockSize) {
        maxBlockSize = fileSize;
        // console.log("max block size = " + maxBlockSize);
    }
    totalBytesRemaining = fileSize;
    if (fileSize % maxBlockSize == 0) {
        numberOfBlocks = fileSize / maxBlockSize;
    } else {
        numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
    }

    // console.log("total blocks = " + numberOfBlocks);

    var containerName = 'devproctoringsolutionblob';
    var token = createSharedAccessToken();
    var uid = getUID();
    var initialUri = baseUrl + '/' + containerName + '/' + uid + '/' + name;
    submitUri = initialUri + token;

    console.log('>Name:', name);
    console.log('>Size:',selectedFile.size);
    console.log('>Type:',selectedFile.type);
    // console.log('>token', uid);
    // console.log(initialUri);
    // console.log(submitUri);
    $.post( "/token", { "token": decodeURIComponent(uid)} );

    uploadFileInBlocks();
}

var reader = new FileReader();

reader.onloadend = function (evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        var uri = submitUri + '&comp=block&blockid=' + blockIds[blockIds.length - 1];
        var requestData = new Uint8Array(evt.target.result);
        $.ajax({
            url: uri,
            type: "PUT",
            data: requestData,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            },
            success: function (data, status) {
                // console.log(data);
                // console.log(status);

                bytesUploaded += requestData.length;

                // var percentComplete = ((parseFloat(bytesUploaded) / parseFloat(selectedFile.size)) * 100).toFixed(2);
                // console.log(percentComplete);
                uploadFileInBlocks();
            },
            error: function (xhr, desc, err) {
                console.log(desc);
                console.log(err);
            }
        });
    }
};

function uploadFileInBlocks() {
    if (totalBytesRemaining > 0) {
        // console.log("current file pointer = " + currentFilePointer + " bytes read = " + maxBlockSize);

        var fileContent = selectedFile.slice(currentFilePointer, currentFilePointer + maxBlockSize);
        var blockId = blockIdPrefix + pad(blockIds.length, 6);

        // console.log("block id = " + blockId);

        blockIds.push(btoa(blockId));
        reader.readAsArrayBuffer(fileContent);
        currentFilePointer += maxBlockSize;
        totalBytesRemaining -= maxBlockSize;
        if (totalBytesRemaining < maxBlockSize) {
            maxBlockSize = totalBytesRemaining;
        }
    } else {
        commitBlockList();
    }
}

function commitBlockList() {
    var uri = submitUri + '&comp=blocklist';
    var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
    for (var i = 0; i < blockIds.length; i++) {
        requestBody += '<Latest>' + blockIds[i] + '</Latest>';
    }
    requestBody += '</BlockList>';

    $.ajax({
        url: uri,
        type: "PUT",
        data: requestBody,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-ms-blob-content-type', selectedFile.type);
        },
        success: function (data, status) {
            // console.log(data);
            // console.log('>Commit Status', status);
        },
        error: function (xhr, desc, err) {
            console.log(desc);
            console.log(err);
        }
    });
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

function createSharedAccessToken() {
    var accountname = 'devproctoringwebapp';
    var signedpermissions = 'wc';
    var signedservice = 'b';
    var signedresourcetype = 'o';
    var signedIP = '';
    var signedProtocol = 'https';
    var signedversion = '2019-10-10';

    var startTime = new Date();
    signedstart = startTime.toISOString().split('.')[0] + "Z";

    var endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + 5);
    signedexpiry = endTime.toISOString().split('.')[0] + "Z";

    var stringToSign = accountname + '\n' +
            signedpermissions + '\n' +
            signedservice + '\n' +
            signedresourcetype + '\n' +
            signedstart + '\n' +
            signedexpiry + '\n' +
            signedIP + '\n' +
            signedProtocol + '\n' +
            signedversion + '\n';

    var stringToSignUTF8 = CryptoJS.enc.Utf8.parse(stringToSign);

    var key = 'aNfhcn6RWlQWx6/19Ym3kSpkqgrpDuJ4+PKrhrgVmvS/fF1HLrp7r/pQtUMFDmbUA0HFaYLjAUA1SsOiOlFgng==';
    var keyBase64 = CryptoJS.enc.Base64.parse(key);

    var hash = CryptoJS.HmacSHA256(stringToSignUTF8, keyBase64);
    var signatureBase64 = CryptoJS.enc.Base64.stringify(hash);
    signature = encodeURIComponent(signatureBase64);

    return '?sv=' + signedversion +
        '&ss=' + signedservice +
        '&srt=' + signedresourcetype +
        '&sp=' + signedpermissions +
        '&se=' + signedexpiry +
        '&st=' + signedstart +
        '&spr=' + signedProtocol +
        '&sig=' + signature;
}

function getUID(){
    // console.log(encodeURIComponent(btoa(sessionStorage.getItem("emailId"))));
    // console.log(sessionStorage.getItem("emailId"));
    return encodeURIComponent(btoa(sessionStorage.getItem("emailId")));
}