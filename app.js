var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var https = require('https')
var http = require('http')
var bodyParser = require('body-parser');
//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

var globalViews = 0;
//app.set('port', 80);
//app.listen(app.get('port'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write('Hello World!');
  logRequest(req, false);
  res.writeHead(302, {'Location':  'https:\/\/'+ req.headers.host + req.url});
  res.end();
}).listen(80);


https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/davidthats.me/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/davidthats.me/fullchain.pem')
}, app)
.listen(443, function () {
})


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use(logger('dev'));
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
function logRequest(req, secure) {

  if (blacklist(req)) {
    return;
  }
  var logger;
  if (req.headers.host === 'github.davidthats.me') {
    globalViews++;
    logger = fs.createWriteStream('public/gitlog.txt', {
     flags: 'a'
    });
    logger.write('========= REQ #' + globalViews + '==========\n');
  } else if (req.url !== "/") {
    logger = fs.createWriteStream('public/oddlog.txt', {
     flags: 'a'
    });
  } else {
    logger = fs.createWriteStream('public/server_log.txt', {
     flags: 'a'
    });
  }
  logger.write(secure ? '**SECURE REQUEST:\n' : '::INSECURE REQUEST:\n');
  logger.write('URL: ' + 'http(s):\/\/' + req.headers.host + req.url + "\n");
  logger.write((new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')+"\n");
  logger.write(req.method+"\n");
  logger.write(JSON.stringify(req.headers, null, 2) + "\n");
  logger.write(((req.ip === undefined) ? (req.connection.remoteAddress) : (req.ip)) + "\n");
  logger.write(JSON.stringify(req.cookies) + "\n");
  logger.write(JSON.stringify(req.body) + "\n");

  logger.write(secure ? '**END SECURE REQUEST\n' : '::END INSECURE REQUEST\n');
  logger.end();
}
function blacklist(req) {
 if (req.url.includes("favicon")) {
   return true;
 }
 if (JSON.stringify(req.headers).includes("yandex")) {
   return true;
 }
 return false;
}
app.use(function(req, res) {
  /*if (!blacklist(req)) {
    logRequest(req, true);
  } else {
   res.end();
  }*/
  logRequest(req, true);
  if (req.headers.host === 'davidthats.me') {
    res.sendFile(__dirname + '/blog.txt');
  }

  else if (req.headers.host === 'github.davidthats.me') {
    res.writeHead(302, {'Location':  'https:\/\/github.com/david-solodukhin'});
    res.end();
  }
  //  res.end();
  //logRequest(req, true);
});

//app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
//app.use(function(err, req, res, next) {
  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

module.exports = app;
