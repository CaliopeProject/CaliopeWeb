var express = require('express');
var sockjs  = require('sockjs');
var http    = require('http');

var sock = sockjs.createServer({});

var pool = [];

sock.on('connection', function(conn) {
  pool.push(conn);

  conn.on('data', function(message) {
    var id = conn.id;
    var i  = 0;
    for(i; i < pool.length; i++){
      pool[i].write(JSON.stringify({ id: id, text : message}));
    }
  });
});

var app = express();
app.configure(function(){

  app.use(express.static(__dirname + './../app'));

});

var server = http.createServer(app);
sock.installHandlers(server, {prefix:'/sock'});
console.log('Listening on port 3333');
server.listen(3333);
