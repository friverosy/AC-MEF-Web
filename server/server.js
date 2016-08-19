var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

app.get('/login', function(req, res) {
  res.sendfile('client/views/login.html');
});

app.get('/status', function(req, res){
    res.status(200).send("I'm alive!");
});

// app.use(loopback.urlNotFound());
//
// app.use(function(req, res, next) {
//   if (req.method != 'GET') return next();
//   res.sendfile(path.resolve('../client/index.html'));
// });

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    //Comment this app.start line and add following lines
    //app.start();
    app.io = require('socket.io')(app.start());
    app.io.on('connection', function(socket){
      console.log('a user connected');
      socket.on('record created', function(msg){
        console.log('record: ' + msg);
      });
      socket.on('disconnect', function(){
          console.log('user disconnected');
      });
    });
  }
});
