//Game mode helper functions//
var Round = function(){
	this.game;
	this.rolesArray;
};

var RoleMap = function(){
	this.roles = {
		'Merlin': [],
		"Mordred": [],
		'Morgana': [],
		'Percival': [],
		'Assassin': [],
		'Oberon': [],
		'Minion of Mordred': [],
		'Loyal Servant of Arthur': []
	}
	this.rolesArray = []
}

RoleMap.prototype.addUser = function(user,role) {
	var goodArray = ['Merlin','Percival','Loyal Servant of Arthur']
	var allegiance;
	this.roles[role].push(user);
	if(goodArray.indexOf(role) !== -1){
		allegiance='Good'
	}else{
		allegiance="Evil"
	}
	var userInfo = {name: user.name, id: user.id, role: role, allegiance: allegiance}
	this.rolesArray.push(userInfo)
};

Round.prototype.addInfo = function(game,roles) {
	this.game = game;
	this.rolesArray = roles;
};

//Game object is sent out to front end every time something happens

//Game object does NOT contain any role information

//Only time specific role information is sent out is at the start 
//to a specific socket

//Game keeps track of: 
	//-current king
	//-who has lady
	//-current round
	//-score
	//rounds object with data on each round
	//whether votes pass


var Game = function(players,ladyState,roles,roomName,roundInfo){
	this.roomName = roomName;
	this.score = {
		Good: 0,
		Evil: 0
	};
	this.gameState = {active: false, state: "Selection"}
	this.roles = roles

	this.Lady = {
		inUse: ladyState || false,
		currentHolder: null
	}

	this.leader;

	this.players = players;

	this.currentRound = 1;
	
	var rounds = {}

	roundInfo.forEach(function(round,idx){
		var doubleFail = false;
		if(idx === 3 && round > 4){
			doubleFail = true;
		}
		rounds['round'+(idx+1)] = {people: round,winner: null, doubleFail: doubleFail};
	})

	this.rounds = rounds;

	var randIdx = Math.floor(Math.random()*players.length)
	if(this.Lady.inUse){
		var ladyIdx;
		if(randIdx === 0) ladyIdx = this.players.length-1;
		else ladyIdx = randIdx-1;

		this.Lady.currentHolder = this.players[ladyIdx]
	}



	this.leader = this.players[randIdx];

}

Game.prototype.nextPlayerIdx = function(currentIdx) {
	if(currentIdx < this.players.length-2) return currentIdx+1;
	else return 0;
};

Game.prototype.initialLadyIdx = function() {
	return this.prevPlayerIdx(this.players.indexOf(this.leader))
};

Game.prototype.prevPlayerIdx = function(currenIdx){
	if(currenIdx === 0) return this.players.length-1;
	else return currenIdx-1;	
}

Game.prototype.addPlayer = function(player) {
	this.players.push(player);
};

Game.prototype.nextRound = function(winner) {
	this.rounds['round'+this.currentRound.toString] = winner;
	this.score[winner]++;
	if(this.score["Good"] > 2 || this.score["Evil"] > 2){
		console.log(this.score["Good"] > 2 ? "Good wins" : "Evil wins")
	}
	this.currentRound++;
	if(currentRound>5){
		console.log("game over")
	}
};

module.exports = {
	Game: Game,
	RoleMap: RoleMap,
	Round: Round
}
