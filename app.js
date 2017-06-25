var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
const menus = require('./routes/menus');
const roles = require('./routes/roles');
const privileges = require('./routes/privileges');
const priFilter = require('./filters/pri-filter');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret:'12345',
	cookie:{maxAge:30*60*1000},
	resave:false,
	saveUninitialized:true
}));
app.use(express.static(path.join(__dirname, 'public')));

//登录过滤器
app.use('/',function(req,res,next){
	if(req.originalUrl == '/login'){
		return next();
	}
	if(req.session.user){
		next();
	}else{
		res.redirect('/login.html');
	}
});
//权限过滤器
app.use('/*',priFilter);

app.use('/', index);
app.use('/users', users);
app.use('/menus',menus);
app.use('/roles',roles);
app.use('/pris',privileges);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
