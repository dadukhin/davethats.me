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
app.use(express.static(path.join(__dirname, 'public')));


http.createServer(function (req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write('Hello World!');
  console.log('--INSECURE REQUEST:');
  console.log('URL: ' + 'https:\/\/' + req.headers.host + req.url);
  console.log(req.headers);
  console.log(req.connection.remoteAddress);
  console.log(JSON.stringify(req.cookies));
  console.log(req.body);
  console.log('--END INSECURE REQUEST');
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


app.use(function(req, res) {
  console.log('**SECURE REQUEST:');
  console.log('URL: ' + 'https:\/\/' + req.headers.host + req.url);
  console.log(req.headers);
  console.log(req.ip);
  console.log(JSON.stringify(req.cookies));
  console.log(JSON.stringify(req.body));

  if (req.headers.host === 'github.davidthats.me') {
    globalViews++;
    console.log('========= REQ #' + globalViews + '==========');
    res.writeHead(302, {'Location':  'https:\/\/github.com/david-solodukhin'});
    res.end();
  }
  console.log('** END SECURE REQUEST');
});


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
