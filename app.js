var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var pg = require("pg")
var db = "postgres://" + process.env.POSTGRES_USER + ":@localhost/bulletinboard";

var app = express();

// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (request, response){
	response.render('writeMessage')
})

app.get('/writeMessage', function (request, response){
	response.redirect('/')
})

app.post('/', function (request, response) {	
	pg.connect(db, function (err, client, done) {
		if(err) {
	    	throw err;
	  	}
		client.query("insert into messages (title, body) values ($1, $2)", [request.body.titles, request.body.messages], function (err){
	  		if (err) {
	  			throw err;
	  		}
	    	done()
			response.redirect('viewMessage');
		});
	});
});

app.get('/viewMessage', function (request, response) {
	pg.connect(db, function (err, client, done) {
		client.query('select title, body from messages', function (err, result) {
			if (err){
				throw err;
			}
			var messageInfo = result.rows.reverse();
			done();
			response.render('viewMessage', {messageInfo:messageInfo});					
		});
	});
});

var server = app.listen(3003, function () {
	console.log("Port" +" "+server.address().port);
});