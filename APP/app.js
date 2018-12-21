const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const fileUpload = require('express-fileupload');
const cors = require('cors');
//var requestLogger = require('./loggers/request');
const server = require('http').createServer();
const io = require('socket.io')(server);
//--------------------------------------------------------------------------------------------------------
const APIRoutes = require('./_app/global-routes');// Global routes
const connections = require('./_app/connections');// Mongodb connections
const socketMiddleware = require('./routes/middlewares/socketMiddlewares');// Socket config
const configurationMiddleware = require('./routes/middlewares/configMiddleware');// Token config
const app = express();
//--------------------------------------------------------------------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(fileUpload());
//app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));
//--------------------------------------------------------------------------------------------------------
// Authentication & Authorization
app.use((req, res, next) => { // Allow access request from any computers
  // Check for the authentication tokens
  configurationMiddleware.tokenMiddleware(req, res, (err) => {
    if (err)
      res.json(err);
    else {
      console.log('----------------------------------AUTH OK------------------------------')
      next();
    }
  });
});
//--------------------------------------------------------------------------------------------------------
// Define routes
APIRoutes.forEach((object) => {
  app.use(object.route, require(object.path));
});
//--------------------------------------------------------------------------------------------------------
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
//--------------------------------------------------------------------------------------------------------
// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
//--------------------------------------------------------------------------------------------------------
// Socket IO
socketMiddleware.socketIO(io);
// Socket.IO Server 
server.listen(4000);
module.exports = app;
