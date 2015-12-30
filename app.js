var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 1337;
var rooms = [];
var sockets = [];
var model = require('./models/user.js')
var gameModel = require('./models/gameModel.js')
var Room = model.Room;
var User = model.User;
var Round = gameModel.Round;
var Game = gameModel.Game;
var RoleMap = gameModel.RoleMap;
var Lobby = new Room('Main Room');


//Holds different game information
var ServerGames = {
}





app.use(require('./routes/static.js'))


io.on('connection', function(socket){

	console.log("New User has logged on");

	socket.emit('initialSetup',{
		lobby: Lobby,
		rooms: rooms
	})

	socket.on('newUser',function(data,cb){
		if(Lobby.users.indexOf(data.name) !== -1){
			cb({bool: false, message: "That username is already taken!"})
		}else{
			var user = new User(socket.id,data.name);
			socket.user = user;
			Lobby.addUser(user);			
			cb({bool: true, user: user})
			io.emit('updated',{lobby: Lobby, rooms: rooms})
			// socket.emit('rooms',{rooms: rooms})	
			io.to(socket.id).emit('privateMessage',{message: "This is a private message"})
		}

	})


	socket.on('newRoom',function(data,cb){
		if(findRoom(data.room,rooms)){

			cb({bool: false, message: "That room already exists.  Either join it or create a new one!"})
		}else if(socket.currentRoom){

			cb({bool: false, message: "You've already joined a room!"})

		}else{
			ServerGames[data.room] = new Round();
			// console.log(ServerGames)
			var room = new Room(data.room,socket.user)
			room.addUser(socket.user)
			// console.log("Room: ", room)
			socket.currentRoom = room;
			rooms.push(room);
			socket.join(data.room)
			io.emit('rooms',{rooms: rooms})
			io.to(socket.id).emit('currentRoom',{currentRoom: room})
			cb({bool: true, rooms: rooms, newRoom: data.room})
			// console.log('Rooms: ',rooms)
		}
	})

	socket.on('disconnect',function(data){
		if(socket.user){
			Lobby.removeUser(socket.user)
			if(socket.currentRoom){
				socket.currentRoom.removeUser(socket.user);
			}
			if(socket.currentRoom){	
				var room = findRoom(socket.currentRoom.name,rooms);
				io.emit('updated',{lobby: Lobby, rooms: rooms})
				io.to(socket.currentRoom.name).emit('updatedCurrentRoom',{currentRoom: room})
			}
		}
	})

	socket.on('joinRoom',function(data,cb){
		var room = findRoom(data.room.name,rooms);
		room.addUser(socket.user)
		//This allows to easily check if user is already in a room.
		socket.currentRoom = room
		//Joins a socket room
		socket.join(data.room.name);
		io.to(data.room.name).emit('updatedCurrentRoom',{currentRoom: room})
		io.emit('updated',{lobby: Lobby, rooms: rooms})
		cb({bool: true, currentRoom: room.name})
	})

	socket.on('startGame',function(game){
		console.log("GAME: ",game)
		var newGameOptions = createGameOptions(game)
		var room = socket.currentRoom;
		var usersAndRolesMap = new RoleMap();
		// console.log('usersAndRolesMap: ', usersAndRolesMap)
		var usersArray = room.users;
		var rolesArray = newGameOptions.roles;
		// console.log(rolesArray)
		var game = new Game(usersArray,newGameOptions.Lady,rolesArray,room.name,newGameOptions.rounds);
		usersArray.forEach(function(thisUser){
			var roleIdx = Math.floor(Math.random()*rolesArray.length);
			usersAndRolesMap.addUser(thisUser,rolesArray[roleIdx]);
			rolesArray=rolesArray.slice(0,roleIdx).concat(rolesArray.slice(roleIdx+1))
		})

		if(game.Lady.inUse){
			game.Lady.currentHolder = game.players[game.initialLadyIdx()]
		}
		
		//CLEAN THIS UP w/ HELPER FUNCTION

		var percivalInfo = shuffle(usersAndRolesMap.rolesArray.filter(function(user){
			return user.role === "Merlin" || user.role === "Morgana";
		})).map(function(user){
			return user.name;
		})
	
		var merlinInfo = shuffle(usersAndRolesMap.rolesArray.filter(function(user){
			var merlinArray = ["Minion of Mordred","Morgana","Assassin",'Oberon']
			return merlinArray.indexOf(user.role) !== -1;
		})).map(function(user){
			return user.name;
		})

		var evilInfo = shuffle(usersAndRolesMap.rolesArray.filter(function(user){
			var evilArray = ["Minion of Mordred","Morgana","Assassin","Mordred"]
			return evilArray.indexOf(user.role) !== -1;
		})).map(function(user){
			return user.name;
		})


		ServerGames[room.name].addInfo(game,usersAndRolesMap.rolesArray);
		console.log('ServerGames: ',ServerGames)
		
		usersAndRolesMap.rolesArray.forEach(function(user){
			var userData = {role: user.role};
			if(user.role==="Merlin"){
				userData.message = "As Merlin you know the Identity of all Evil players except for Mordred (if you are playing with him).  The following players are all evil, but their exact role you do not know: "
				userData.data = merlinInfo;
			}else if(user.role==="Percival"){
				userData.message = "As Percival you know the Identity of Merlin.  If you are playing with Morgana you will know the Identity of both Merlin and Morgana, but not which one is which.  The following players in no particular order are either Merlin or Morgana: "
				userData.data = percivalInfo;
			}else if(user.role === "Oberon"){
				userData.message = "As Oberon you are Evil but you are not known to any of the other Evil players, nor do you know of them.  Merlin however does know your allegiance, but not your specific Role."
			}else if(user.role==="Minion of Mordred"){
				userData.message = "As a Minion of Mordred you know the identity of the other Evil players, but not their specific role.  The Evil players are: "
				userData.data = evilInfo;
			}else if(user.role==="Assassin"){
				userData.message = "As the Assassin you are Evil and you get to decide who you think Merlin is at the end of the game.  You also know the identity of the other Evil players, excluding Oberon if you are playing with him.  The following players are also Evil: "
				userData.data = evilInfo;
			}else if(user.role==="Morgana"){
				userData.message = "As Morgana you are Evil and you appear as Merlin to Percival.  You also know the identity of the other Evil players, excluding Oberon if you are playing with him.  The following players are also Evil: "
				userData.data = evilInfo;
			}else if(user.role==="Mordred"){
				userData.message = "As Mordred you are Evil and you remain hidden to Merlin.  You also know the identity of the other Evil players, excluding Oberon if you are playing with him.  The following players are also Evil: "
				userData.data = evilInfo;	
			}else if(user.role==="Loyal Servant of Arthur"){
				userData.message = "As a Loyal Servant of Arthur you must try to flush out the Evil players and make sure that Quests pass."
			}

			io.to(user.id).emit('yourRole',userData);


		})

		io.emit('game',game)
		
		io.emit('setGameState',game)

		// console.log('percivalInfo: ', percivalInfo)
		// console.log('merlinInfo: ', merlinInfo)
		// console.log('evilInfo: ', evilInfo)


	})

})


app.get('/',function(req,res,next){
	res.status(200).sendfile('index.html')
})


server.listen(port,function(req,res,next){
	console.log("Listening on port ",port)
})


 var findRoom = function(roomName,roomsArray){
	return roomsArray.filter(function(room){
		return room.name === roomName;
	})[0]
}

var shuffle = function(array) {
  var currentIdx = array.length, 
      tempVal, 
      randIdx;

  // While there remain elements to shuffle...
  while (0 !== currentIdx) {

    // Pick a remaining element...
    randIdx = Math.floor(Math.random() * currentIdx);
    currentIdx -= 1;

    // And swap it with the current element.
    tempVal = array[currentIdx];
    array[currentIdx] = array[randIdx];
    array[randIdx] = tempVal;
  }

  return array;
}

var createGameOptions = function(gameOptions){
	var Lady = gameOptions.Lady;
	var roles = [];
	var rounds;
	var goodRoles = ['Merlin','Percival'];
	var evilRoles = ['Morgana','Mordred','Oberon','Assassin'];
	var evilCount = 0;
	var goodCount = 0;
	var size = gameOptions.size;
	var totalEvil;
	var totalGood;

// Number of players:	5	6	7	8	9	10
// 		Mission 1	2	2	2	3	3	3
// 		Mission 2	3	3	3	4	4	4
// 		Mission 3	2	4	3	4	4	4
// 		Mission 4	3	3	4*	5*	5*	5*
// 		Mission 5	3	4	4	5	5	5


	var possibleRounds = [
	[2,3,2,3,3],
	[2,3,4,3,4],
	[2,3,3,4,4],
	[3,4,4,5,5]
	]

	for(var key in gameOptions){
		// console.log("GAME OPTS: ",gameOptions)		
		if(gameOptions[key]){
			if(goodRoles.indexOf(key) > -1){
				goodCount++;
				roles.push(key)
			}else if(evilRoles.indexOf(key) > -1){
				evilCount++;
				roles.push(key);
			}
		}
	}


	if(size<7){
		totalEvil = 2;
	}
	else if(size < 10){
		totalEvil = 3;
	}else if(size === 10){
		totalEvil = 4;
	}else{
		console.log("Invalid Game")
	}

	if(size===5){
		rounds = possibleRounds[0]
	}else if(size===6){
		rounds = possibleRounds[1]
	}else if(size ===7){
		rounds = possibleRounds[2]
	}else{
		rounds = possibleRounds[3]
	}

	totalGood = size-totalEvil;

	while(evilCount<totalEvil){
		roles.push('Minion of Mordred')
		evilCount++;
	}

	while(goodCount<totalGood){
		roles.push("Loyal Servant of Arthur")
		goodCount++;
	}

	return {roles: roles, Lady: Lady, rounds: rounds};

}















// var express = require('express');
// var app = express();
// var port = 3000;
// var bodyParser = require('body-parser');
// var path = require('path');
// var socketio = require('socket.io');
// var http = require('http');
// var swig = require('swig');

// //Array for the usernames
// var usersInHostRoom = [];
// var server = http.createServer();
// var clientsArray = [];
// var models = require('./models/user.js')
// var User = models.User;
// var Room = models.Room;
// var Game = models.Game;
// // var roles = require('./roles.js')
// //var roles = ["Wizard","evil","good","just kinda meh"];
// var hostRoom = new Room('hostRoom');
// var game = new Game("mainGame");

// server.on('request',app);

// var io = socketio.listen(server);

// // Default settings for Swig template engine
// //   Set which function to use when rendering HTML
// app.engine('html', swig.renderFile);
//   // Render views using the "html" engine
// app.set('view engine', 'html');
//   // Set where views for are found for express' "res.render" command
// app.set('views', __dirname + '/public/views');
//   // Turn off default cache preferences for swig and express
// app.set('view cache', false);
// swig.setDefaults({ cache: false});

// // HTTP body parsing (JSON or URL-encoded) middleware
//   // We include both of these so we can parse the two major kinds of bodies
//   // HTML forms default to a URL encoded body
// app.use(bodyParser.urlencoded( { extended: true }));
// app.use(bodyParser.json());

// io.on('connection',function(socket){
// 	var user = new User(socket.id);
// 	hostRoom.addUser(user);
		

// 	socket.on('disconnect',function(){
// 		if(socket.nickname){
// 			var user = findUser(socket.id);
// 			var currentRoom = user.currentRoom;
// 			io.emit('usernames',usersInHostRoom);
// 		}else return;
// 	})
// 	socket.on('newUser',function(data,returnFunc){
// 		if(findIdxOfUser(data,usersInHostRoom)!==null){
// 			returnFunc({bool: false, msg: data +" is already taken"}); 
// 		}else if(data.length < 4){
// 			returnFunc({bool: false, msg: "Please choose a name that is longer than 3 characters"})
// 		}else{
// 			var newUser = hostRoom.findUser(socket.id)
// 			newUser.nickname = data;
// 			socket.nickname = data;
// 			io.sockets.emit('usernames',usersInHostRoom);
// 			// io.to(socket.currentRoom).emit('usernames',usersInHostRoom);
// 			clientsArray.push(socket);
// 		}
// 	})

// 	socket.on('newGame',function(data){
// 		createRolesArray(clientsArray.length)
// 		var roles = createRolesArray(clientsArray.length)
// 			role = roles[randomIdx];
// 			roles.splice(randomIdx,1);

// 	})

// 	socket.on('createRoom',function(data,returnFunc){
// 		if(socket.currentRoom){
// 			returnFunc({msg: "You've already joined a room!", bool: false});
// 		}else if(game.doesRoomExist(data)){
// 			returnFunc({msg: "That room already exists!", bool: false})
// 		}else{
// 			var newRoom = new Room(data);
// 			var currentUser = hostRoom.findUser(socket.id);
// 			newRoom.host = currentUser
// 			currentUser.currentRoom = newRoom
// 			newRoom.addUser(currentUser)
// 			socket.currentRoom = data;
// 			game.addRoom(newRoom);
// 			socket.join(data);
// 			returnFunc({bool:true,msg:data, users: newRoom.users});
// 		}

// 	})

// 	socket.on('join',function(data,returnFunc){
// 		if(socket.currentRoom){
// 			returnFunc({msg: "You've already joined a room!", bool: false});
// 		}else{
// 			var currentUser = hostRoom.findUser(socket.id);

// 			currentUser.currentRoom = data
// 			var currentRoom = game.findRoom(data);
// 			currentRoom.addUser(currentUser);
// 			socket.currentRoom = data;
// 			returnFunc({bool:true,msg:data, users: currentRoom.users});

// 		}
// 	})


// })

// var createRolesArray = function(num){
// 	var numGood = 0;
// 	var numMisunderstood = 0;
// 	var goodEvilArray =[];
// 	if(num%2===0){
// 		numGood = num/2 +1;
// 		numMisunderstood = num/2 -1;
// 	}else{
// 		numGood = Math.ceil(num/2);
// 		numMisunderstood = Math.floor(num/2);
// 	}

// 	while(numMisunderstood>0){
// 		goodEvilArray.push("Misunderstood");
// 		numMisunderstood--;
// 	}
	
// 	while(numGood>0){
// 		goodEvilArray.push("Good");
// 		numGood--;
// 	}
// 	return goodEvilArray;
// }

// var findRoom = function(name){
// 	return game.rooms.filter(function(room){
// 		return room.name === name
// 	})[0]
// }

// var findUser = function(socketId){
// 	if(usersInHostRoom.length>0){
// 		return usersInHostRoom.filter(function(user){
// 			return user.id === socketId
// 		})[0];
// 	}
// }

// var findIdxOfUser = function(nickname,array){
// 	var idx = null;
// 	array.forEach(function(user,position){
// 		if(user.nickname === nickname){
// 			idx=position
// 		}
// 	})
// 	return idx;
// }

// // var findUser = function(socketId){
// // 	usersInHostRoom.
// // }

// app.use('/public',express.static(path.join(__dirname,'/public')));
// app.use(express.static(path.join(__dirname,'browser')));
// app.use(express.static(path.join(__dirname,'/node_modules/')))



// app.use('/',require('./routes'));

// server.listen(port,function(){
// 	console.log("We are listening on port 3000")
// })
