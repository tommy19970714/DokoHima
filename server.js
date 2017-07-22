var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var room_arry = ['7308', '7408', '7501', '7505', '7506'];

var COMMENTS_FILE = path.join(__dirname, 'comments.json');
var ROOMDATA_FILE = path.join(__dirname, 'roomdata.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.locals.s7308 = 'none';
app.locals.d7308 = 'none';
app.locals.s7408 = 'none';
app.locals.d7408 = 'none';
app.locals.s7501 = 'none';
app.locals.d7501 = 'none';
app.locals.s7505 = 'none';
app.locals.d7505 = 'none';
app.locals.s7506 = 'none';
app.locals.d7506 = 'none';

function roomUpdate(room) {
  switch (room) {
    case '7308' :
      db.one("SELECT * FROM building7 WHERE room='7308'").then(data => {
        app.locals.s7308 = data.status;
        app.locals.d7308 = data.detail;
      });
      break;
    case '7408' :
      db.one("SELECT * FROM building7 WHERE room='7408'").then(data => {
        app.locals.s7408 = data.status;
        app.locals.d7408 = data.detail;
      });
      break;
    case '7501' :
      db.one("SELECT * FROM building7 WHERE room='7501'").then(data => {
        app.locals.s7501 = data.status;
        app.locals.d7501 = data.detail;
      });
      break;
    case '7505' :
      db.one("SELECT * FROM building7 WHERE room='7505'").then(data => {
        app.locals.s7505 = data.status;
        app.locals.d7505 = data.detail;
      });
      break;
    case '7506' :
      db.one("SELECT * FROM building7 WHERE room='7506'").then(data => {
        app.locals.s7506 = data.status;
        app.locals.d7506 = data.detail;
      });
      break;
  }
};

function updateAllRoom() {
  roomUpdate(7308);
  roomUpdate(7408);
  roomUpdate(7501);
  roomUpdate(7505);
  roomUpdate(7506);
};

app.get('/api/roomdata', function(req, res) {
  //response.contentType('application/json');
  var data = [
    { room: '7308', status: app.locals.s7308, detail: app.locals.d7308 },
    { room: '7408', status: app.locals.s7408, detail: app.locals.d7408 },
    { room: '7501', status: app.locals.s7501, detail: app.locals.d7501 },
    { room: '7505', status: app.locals.s7505, detail: app.locals.d7505 },
    { room: '7506', status: app.locals.s7506, detail: app.locals.d7506 }
  ];
  var dataJSON = JSON.stringify(data);
  res.send(dataJSON);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
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

    console.log(room);
    if(room_arry.indexOf(room) != -1){
      console.log(room + "is registed");
      var mode = message.text.substr(message.text.indexOf(7)+4,3);
      if(mode.includes("d")) {
          var detail = message.text.substr(message.text.indexOf(7)+5)
          db.none("INSERT INTO building7 VALUES ('" + room + "','none','"+ detail +"', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET detail='" + detail +"'");
          roomUpdate(room);
      } else {
          var status = message.text.substr(message.text.indexOf(7)+4);
          db.none("INSERT INTO building7 VALUES ('" + room + "','"+ status +"','none', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET status='" + status +"'");
          roomUpdate(room);
      }
    }
});
