// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var serveStatic = require('serve-static');  // serve static files
var socketIo = require("socket.io");        // web socket external module
var easyrtc = require("easyrtc");               // EasyRTC external module

// Set process name
process.title = "node-easyrtc";

// Get port or default to 8080
var port = process.env.PORT || 8080;

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();
app.use(serveStatic('./', {'index': ['index.html']}));

// Start Express http server
var webServer = http.createServer(app);

// Start Socket.io so it attaches itself to Express server
var socketServer = socketIo.listen(webServer, {"log level":1});

var myIceServers = [
   {
     "url":"stun:ws-turn3.xirsys.com",
     "username": "yDwDSq0mBEG9ZOOGL6dslhfYqqToC2by_2FJBhwZf49wtWA1GLB-jQbRTdMaAQggAAAAAFynwhRzdGxld2lzMTEyMQ==",
     "credential":"ef70efbe-57e5-11e9-9d4a-069f0817bf63"
   },

   {
     "url":"turn:ws-turn3.xirsys.com:80?transport=udp",
     "username": "yDwDSq0mBEG9ZOOGL6dslhfYqqToC2by_2FJBhwZf49wtWA1GLB-jQbRTdMaAQggAAAAAFynwhRzdGxld2lzMTEyMQ==",
     "credential":"ef70efbe-57e5-11e9-9d4a-069f0817bf63"
   },

   {
     "url":"turn:ws-turn3.xirsys.com:80?transport=tcp",
     "username": "yDwDSq0mBEG9ZOOGL6dslhfYqqToC2by_2FJBhwZf49wtWA1GLB-jQbRTdMaAQggAAAAAFynwhRzdGxld2lzMTEyMQ==",
     "credential":"ef70efbe-57e5-11e9-9d4a-069f0817bf63"
   },

   {
     "url":"turn:ws-turn3.xirsys.com:443?transport=tcp",
     "username": "yDwDSq0mBEG9ZOOGL6dslhfYqqToC2by_2FJBhwZf49wtWA1GLB-jQbRTdMaAQggAAAAAFynwhRzdGxld2lzMTEyMQ==",
     "credential":"ef70efbe-57e5-11e9-9d4a-069f0817bf63"
   }

];



easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function(socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function(err, connectionObj){
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function(connectionObj, roomName, roomParameter, callback) {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

//listen on port
webServer.listen(port, function () {
  console.log('listening on http://localhost:' + port);
});
