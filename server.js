var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var ROOMDATA_FILE = path.join(__dirname, 'roomdata.json');

var room_no = ['7506','7505','7501','7408','7306'];
var room_array = new Array(room_no.length);

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

function updateAllRoom(callback) {
  db.any("SELECT * FROM building7")
    .then(data => {
      data.map(function(element){
        if(room_no.indexOf(element.room) >= 0){
          room_array[room_no.indexOf(element.room)] = element;
        }
      });
      callback();
    })
    .catch(function(error) {
      console.error("updateAllRoom error");
    });
}

function getMessages(callback) {
  db.any("SELECT * FROM messages ORDER BY time DESC")
    .then(data => {
      console.log(data);
      callback(data);
    })
    .catch(function(error) {
      console.error("updateAllRoom error");
    });
}

app.get('/api/roomdata', function(req, res) {
  updateAllRoom(function(){
    var dataJSON = JSON.stringify(room_array);
    res.send(dataJSON);
  });
});

app.get('/api/messagesData', function(req, res) {
  getMessages(function(messages){
    var dataJSON = JSON.stringify(messages);
    res.send(dataJSON);
  });
});

const server = app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});

//-----------------------------------------socket----------------------------------------//

const io = require('socket.io')(server);
const socket = io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('room', function(msg){
    console.log(msg);
  });
});


//-----------------------------------------slack----------------------------------------//
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: "xoxb-214617764931-HUDSOTjYAnarrRM6O5tADU0o"
}).startRTM(function(err, bot, payload){
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});
var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://hboqhlvlytycft:da7825923aaf062e0250769f17ca45e216f21b6032ff080a0772e92a291df9b3@ec2-23-21-158-253.compute-1.amazonaws.com:5432/d2ep8884kuml1u?ssl=true");
controller.on('direct_message,direct_mention,mention', function(bot, message) {
  bot.reply(message, 'OK!!');
  bot.reply(message, message.text);
  var room = message.text.substr(message.text.indexOf(7), 4);

  if(room_no.indexOf(room) != -1){
    console.log(room + "is registed");
    var mode = message.text.substr(message.text.indexOf(7)+4,3);
    if(mode.includes("d")) {
      var detail = message.text.substr(message.text.indexOf(7)+5)
      db.none("INSERT INTO building7 VALUES ('" + room + "','none','"+ detail +"', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET detail='" + detail +"'")
      .catch(error => {console.error(room + "couldn't insert")});
      io.emit('room', 'bot recieved!');

    } else {
      var status = message.text.substr(message.text.indexOf(7)+4);
      db.none("INSERT INTO building7 VALUES ('" + room + "','"+ status +"','none', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET status='" + status +"'")
      .catch(error => {console.error(room + "couldn't insert")});
      io.emit('room', 'bot recieved!');
    }
  } else {
    db.none("insert into messages(message, time) values('"+ message.text +"', now())");
    console.log("push message : " + message.text);
    var emitJson = [{ id: '0', message: message.text, time: new Date() }];
    io.emit('message', emitJson);
  }
});
