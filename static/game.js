/*
Todo
implement collision detection
implement points system
  who chasing who
  tracking points somehow
  leaderboard
*/





var socket = io();
// socket.on('message', function(data) {
//   console.log(data);
// });
//
// socket.on('message2', function(data) {
//   console.log(data);
// });


//wasd input handler
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

document.addEventListener('keydown', function(event) {
  switch(event.keyCode) {
    case 65: //A
      movement.left = true;
      break;
    case 87: //W
      movement.up = true;
      break;
    case 68: //D
      movement.right = true;
      break;
    case 83: //S
      movement.down = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch(event.keyCode) {
    case 65: //A
      movement.left = false;
      break;
    case 87: //W
      movement.up = false;
      break;
    case 68: //D
      movement.right = false;
      break;
    case 83: //S
      movement.down = false;
      break;
  }
});


function moveup() {
  movement.up = true;
}

function movedown() {
  movement.down = true;
}

function moveleft() {
  movement.left = true;
}

function moveright() {
  movement.right = true;
}

function stop(){
  movement.left = false;
  movement.up = false;
  movement.right = false;
  movement.down = false;
}

socket.emit('new player');

setInterval(function(){
  socket.emit('movement',movement);

}, 1000 / 60);




var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var points = document.getElementById('points'); //for displaying points
socket.on('state', function(players) {

  context.clearRect(0,0,800,600);

  // render players
  for (var id in players) {
    var player = players[id];
    context.fillStyle = player['color'];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
  //
  // render point bar
  var y = 20;
  var totalScore = 0
  console.log(totalScore)
  for (var id in players){
    console.log(totalScore)
    // var player = players[id];
    var score = players[id]['points'];
    console.log(score)
    totalScore += score;
  }
  for (var id in players) {
    console.log(totalScore)
    y += 20
    var player = players[id];
    var scoreProp = (player.points)/((totalScore)+1)
    context.beginPath();
    context.strokeStyle = player['color'];
    context.lineCap = "round";
    context.lineWidth = 10;
    context.moveTo(20, y);
    context.lineTo((800*scoreProp), y);
    console.log(scoreProp)
    context.stroke();
  }

  updateStats(players)
  console.log(players)
});

function updateStats(players){
  var points = document.getElementById('points')
  if (typeof(players[socket.id])!== 'undefined'){
    user = players[socket.id]
    var points = document.getElementById('points')
    points.innerHTML = user.points;
    var collision = document.getElementById('collision');
    collision.innerHTML = user.collisions;
    var collision = document.getElementById('target');
    collision.innerHTML = user.target;
    collision.style.color = players[user.target].color;
    var avoid = document.getElementById('avoid');
    userToAvoid = Object.keys(players).find(a => {return players[a].target == socket.id})
    avoid.innerHTML = userToAvoid;
    avoid.style.color = players[userToAvoid].color;
    // console.log(userToAvoid)

  }
}
