var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);


// var port_number = server.listen(process.env.PORT || 3000);
// app.listen(port_number);

app.set( 'port', ( process.env.PORT || 5000 ));
app.use('/static', express.static(__dirname + '/static'));

//routing
app.get('/', function(request,response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

//starts the server
server.listen(app.get('port'), function() {
	console.log('Starting server on port 3000');
});


// Add the WebSocket handlers
io.on('connection', function(socket) {
});

//for testing
// setInterval(function() {
// 	io.sockets.emit('message','hi!');
// }, 1000);
//
// setInterval(function() {
// 	io.sockets.emit('message2','hi friend!');
// }, 10000);

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

var players = {};
var playerOrder = 0;
io.on('connection', function(socket) {
	socket.on('new player', function() {
		players[socket.id] = {
			x: 300,
			y: 300,
			color: colorArray[playerOrder],
			points: 0,
			collisions: [],
			target: null,
		};
		playerOrder ++
		assignTargets()

	});
	socket.on('movement', function(data) {
		var player = players[socket.id] || {};
		if (data.left) {
			player.x -= 5;
		}
		if (data.up) {
			player.y -= 5;
		}
		if (data.right) {
			player.x += 5;
		}
		if (data.down) {
			player.y += 5;
		}
	});

});

setInterval(function() {
	io.sockets.emit('state', players);

	for (var id in players){
		var player = players[id]
		collisons = updateCollisions()
		player.collisions = collisons[id];
		if (player.collisions.includes(player.target)){
			player.points ++
		}
	}
}, 1000/60);

// check for any collisions, return IDs for any users that touch user
function checkCollision(user){
	var collisions = []
	for (var id in players){
		otherUser = players[id];
		if  (user != otherUser){
			if (user.x < otherUser.x + 20 && user.x > otherUser.x - 20){
				if (user.y < otherUser.y + 20 && user.y > otherUser.y - 20){
					collisions.push(id);
			}
		}
	}
}
	return collisions
}

var currentCollisions = {};
function updateCollisions(){
	for (var id in players ){
		var player = players[id];
		currentCollisions[id] = checkCollision(player)
	}
	return currentCollisions
}


function assignTargets(){
	var targets = Object.keys(players);
	var ids =  Object.keys(players);
	while ((Object.keys(players).length>1 )&& (JSON.stringify(targets) == JSON.stringify(ids))){
		shuffle(targets);
	}

	console.log(Object.keys(players),':',targets)
	for (var id in players ){
		var player = players[id];
	}
	let i = 0;
	for (var id in players ){
		players[id].target = targets[i]
		console.log(players[id].target)
		console.log(targets[i])
		i++;
	}
}

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};




//
