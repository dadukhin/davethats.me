var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')
var https = require('https')
var http = require('http')

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

var globalViews = 0;
//app.set('port', 80);
//app.listen(app.get('port'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write('Hello World!');
  res.writeHead(302, {'Location':  'https:\/\/'+ req.headers.host + req.url});
  res.end();
  logRequest(req, false);
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


  console.log(secure ? '**SECURE REQUEST' : '::INSECURE REQUEST:');
  console.log('URL: ' + 'http(s):\/\/' + req.headers.host + req.url);
  console.log((new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':'));
  console.log(req.headers);
  console.log(req.ip);
  console.log(JSON.stringify(req.cookies));
  console.log(JSON.stringify(req.body));


  if (req.headers.host === 'github.davidthats.me') {
    globalViews++;
    console.log('========= REQ #' + globalViews + '==========');
  }
  console.log(secure ? '**END SECURE REQUEST' : '::END INSECURE REQUEST');

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

app.use(express.static(path.join(__dirname, 'public')));
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
