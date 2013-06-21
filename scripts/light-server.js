var express = require('express'),
	app = express();


app.configure(function(){

  app.use(express.static(__dirname + './../app'));

});


app.listen(3333);
console.log('Listening on port 3333');
