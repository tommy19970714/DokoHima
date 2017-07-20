var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('index', {title : 'タイトル',
  s7308 : '眠い1',
  s7408 : '眠い2',
  s7501 : '眠い3',
  s7505 : '眠い4',
  s7506 : '眠い5',
  d7308 : '眠い6',
  d7408 : '眠い7',
  d7501 : '眠い8',
  d7505 : '眠い9',
  d7506 : '眠い10'}
);
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

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

    var mode = message.text.substr(message.text.indexOf(7)+4,3);
    if(mode.includes("d")) {
        var detail = message.text.substr(message.text.indexOf(7)+5)
        db.none("INSERT INTO building7 VALUES ('" + room + "','none','"+ detail +"', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET detail='" + detail +"'");
        db.one("SELECT * FROM building7 WHERE room='7308'").then(data => {
              console.log("---------------------------------------------")
              console.log(data);
              console.log("---------------------------------------------")
              data_array.push(data);
          });
    } else {
        var status = message.text.substr(message.text.indexOf(7)+4);
        db.none("INSERT INTO building7 VALUES ('" + room + "','"+ status +"','none', now()) ON CONFLICT ON CONSTRAINT building7_pkey DO UPDATE SET status='" + status +"'");
        db.one("SELECT * FROM building7 WHERE room='7308'").then(data => {
              console.log("---------------------------------------------")
              console.log(data);
              console.log("---------------------------------------------")
          });
    }

});
