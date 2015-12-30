var User = function(id,name){
	this.name = name;
	this.id = id;
	this.role = null;
	this.currentRoom;
}

// var Game = function(name){
// 	this.name = name;
// 	this.rooms = [];
// }

var Room = function(name,host){
	this.name = name;
	this.users = [];
	this.host = host;
}

Room.prototype.addUser = function(newUser) {
	if(!this.host){this.host = newUser}
	this.users.push(newUser);	// body...
};

Room.prototype.findUser = function(userId) {
	return this.users.filter(function(user){
		return user.id === userId
	})[0]
};

Room.prototype.removeUser = function(oldUser) {
	var idx = this.users.indexOf(oldUser);
	if(idx!== -1){
		this.users.splice(idx,1);
		if(this.users.length>0){
		}
	}
	if(this.host === oldUser){
		this.host = this.users[0];
	}

};

// Game.prototype.addRoom = function(room) {
// 	this.rooms.push(room);	
// };

// Game.prototype.doesRoomExist = function(roomName) {
// 	var check = this.rooms.filter(function(room){
// 		return room.name === roomName;
// 	})
// 	if(check.length>0) return true;
// 	else return false;
// };

// Game.prototype.findRoom = function(name) {
// 	return this.rooms.filter(function(room){
// 		return room.name === name;
// 	})[0];
// };

module.exports = {
	User: User,
	Room: Room
}

//__t
