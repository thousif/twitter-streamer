/**
* MODULE DEPEDENCIES
**/

var express = require('express'),
	app = express(),                     // creates an express app.
	http = require('http'),
	server = http.createServer(app),   	//Create the HTTP server with the express app as an argument
	Twit = require('twit'),
	io = require('socket.io').listen(server),
	utils = require('util')
	
	server.listen(8080);
	app.use(express.static(__dirname + '/public'));
	
	
	
	app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	});

  /*	app.get('/', function(req, res) {   //ignore this code
     var seatext = req.param('searchtext');
	 console.log(seatext);
	});  */
 	
	// IMPORTANT!!
//You will need to get your own key. Don't worry, it's free. But I cannot provide you one
//since it will instantiate a connection on my behalf and will drop all other streaming connections.
//Check out: https://dev.twitter.com/ You should be able to create an application and grab the following
//credentials from the API Keys section of that application.

	var T = new Twit({
    consumer_key:         'AKmmwQbKybRNa8xUUghcx3YVD',
	consumer_secret:      'faLtkYwZw6pyd6qexXpZcUGH5BPkz9Ylk7Zpkq8x42aTa5nhzJ',
	access_token:         '590110252-tAXMCceYz7I22Zleuri0ZJDLdC4MewR9uJj4T43k',
	access_token_secret:  'ilQ3nYPSmEwbg9Tsk0pimf1eg2e0ss1WUzYWS6rF7IWRt'
	})

io.sockets.on('connection', function (socket) {       // implementing socket connection handler
	
	console.log('Connected');
	
  /*	app.param('searchtext', function(req, res,next,name) {
		var seatext = searchtext;
		req.name = seatext;
		next();
	});  //ignore this code */
	var stream = T.stream('statuses/filter', { track: 'chennaifloods' });    // IMPORTANT!! replace text "chennaifloods" with your desired word to stream through
																			 // twitter about the search word.
	stream.on('tweet', function (tweet) {
    console.log('tweet');
    io.sockets.emit('stream',tweet);

	});
	stream.on('connect', function(request) {
		console.log('[CONNECTING] Twitter Stream connection attempted.');
	});

	stream.on('connected', function(response) {
		console.log('[CONNECTED] Twitter Stream connection successful.');
	});
});
