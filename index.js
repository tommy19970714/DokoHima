var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
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
var db = pgp("postgres://hboqhlvlytycft:da7825923aaf062e0250769f17ca45e216f21b6032ff080a0772e92a291df9b3@ec2-23-21-158-253.compute-1.amazonaws.com:5432/d2ep8884kuml1u");
controller.on('direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'OK!!');
    bot.reply(message, message.text);
    var room = message.text.substr(message.text.indexOf(7), 4);
    
    console.log(room);

    var mode = message.text.substr(message.text.indexOf(7)+4,1);
    if(mode == 'd') {
        var detail = message.text.substr(message.text.indexOf(7)+5)
        query('UPDATE building7 name = $1~ WHERE detail = $2~', [room, detail]);
        query('INSERT INTO building7 VALUES($1~, $2~, $3~,now())', [room, "none", detail]);
    } else {
        var status = message.text.substr(message.text.indexOf(7)+4);
        query('UPDATE building7 name = $1~ WHERE status = $2~', [room, status]);
        query('INSERT INTO building7 VALUES($1~, $2~, $3~,now())', [room, status, "none"]);
    }
});

