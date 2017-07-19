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

controller.on('direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'OK!!');
});

var pgp = require("pg-promise")(/*options*/);
var db = pgp("postgres://hboqhlvlytycft:da7825923aaf062e0250769f17ca45e216f21b6032ff080a0772e92a291df9b3@ec2-23-21-158-253.compute-1.amazonaws.com:5432/d2ep8884kuml1u");
