//Game mode helper functions//
var Round = function() {
    this.game;
    this.rolesArray;
};

var RoleMap = function() {
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

RoleMap.prototype.addUser = function(user, role) {
    var goodArray = ['Merlin', 'Percival', 'Loyal Servant of Arthur']
    var allegiance;
    this.roles[role].push(user);
    if (goodArray.indexOf(role) !== -1) {
        allegiance = 'Good'
    } else {
        allegiance = "Evil"
    }
    var userInfo = {
        name: user.name,
        id: user.id,
        role: role,
        allegiance: allegiance
    }
    this.rolesArray.push(userInfo)
};

Round.prototype.addInfo = function(game, roles) {
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


var Game = function(players, ladyState, roles, roomName, roundInfo, cards) {
    this.host;
    this.roomName = roomName;
    this.score = {
        Good: 0,
        Evil: 0
    };
    this.roles = roles

    this.cards = cards

    this.Lady = {
        inUse: ladyState || false,
        currentHolder: null
    }

    this.gameState = {
        active: false,
        state: this.cards ? "CardGame" : "Selection"
    }

    console.log('CARDS: ',this.cards)


    this.leader;

    this.players = players;

    this.currentRound = 1;

    var rounds = {}

    roundInfo.forEach(function(round, idx) {
        var doubleFail = false;
        if (idx === 3 && round > 4) {
            doubleFail = true;
        }
        rounds['round' + (idx + 1)] = {
            people: round,
            winner: null,
            doubleFail: doubleFail,
            votes: []
        };
    })

    this.rounds = rounds;
    this.votes = [];
    this.roundOfVoting = 1;
    this.suggestedTeam;

    var randIdx = Math.floor(Math.random() * players.length)
    if (this.Lady.inUse) {
        var ladyIdx;
        if (randIdx === 0) ladyIdx = this.players.length - 1;
        else ladyIdx = randIdx - 1;

        this.Lady.currentHolder = this.players[ladyIdx]
    }



    this.leader = this.players[randIdx];

}

Game.prototype.nextPlayerIdx = function(currentIdx) {
    if (currentIdx < this.players.length - 2) return currentIdx + 1;
    else return 0;
};

Game.prototype.initialLadyIdx = function() {
    return this.prevPlayerIdx(this.players.indexOf(this.leader))
};

Game.prototype.prevPlayerIdx = function(currenIdx) {
    if (currenIdx === 0) return this.players.length - 1;
    else return currenIdx - 1;
}

Game.prototype.addPlayer = function(player) {
    this.players.push(player);
};

Game.prototype.nextLady = function(username) {
    var newLady = this.players.find(function(user) {
        return user.name === username;
    })

    this.Lady.currentHolder = newLady;
};

Game.prototype.nextRound = function(winner) {
    
    this.rounds['round' + this.currentRound].winner = winner;
    
    console.log(this.rounds['round' + this.currentRound])

    this.score[winner]++;
    if (this.score["Good"] > 2 || this.score["Evil"] > 2) {
        console.log(this.score["Good"] > 2 ? "Good wins" : "Evil wins")
    }
    this.currentRound++;
    if (this.currentRound > 5) {
        console.log("game over")
    }
    this.nextLeader();
    if(this.currentRound > 2 && this.Lady.inUse){
    	this.nextState('Lady')
    }else{
    	this.nextState('Selection')
    }
    this.suggestedTeam = [];
    this.roundOfVoting=1;
};

Game.prototype.nextState = function(state) {
    if (!state) {
        if (this.gameState.state === "Selection") {
            this.gameState.state = "Voting";
        } else if (this.gameState.state === "Voting") {
            this.gameState.state = "Lady";
        } else if (this.gameState.state === "Lady") {
            this.gameState.state = "Selection";
        }
    } else {
        console.log("Before:", this.gameState)
        this.gameState.state = state;
        console.log("Made it to the state change: ", this.gameState)
    }
};


Game.prototype.addVote = function(type, vote) {
    var numberOfVotesNeeded;
    this.votes.push(vote)
    if (type === 'team') {
    	numberOfVotesNeeded = this.players.length;
    } else if (type === 'quest') {
    	numberOfVotesNeeded = this.rounds['round'+this.currentRound].people;
    }
    console.log('votes: ',this.votes)
    if (this.votes.length === numberOfVotesNeeded) {
        return true
    } else {
        return false;
    }

};

Game.prototype.nextLeader = function() {
    var currentIdx = this.players.indexOf(this.leader);
    var idx = this.nextPlayerIdx(currentIdx);
    this.leader = this.players[idx]
    console.log("Idx: ", idx)
    console.log(this.players)
    console.log("From models: ", this.leader)
};

Game.prototype.checkOutcome = function() {
    var passes = this.votes.filter(function(vote) {
        return vote.vote === "Pass";
    })
    var fails = this.votes.filter(function(vote) {
        return vote.vote === "Fail";
    })
    return passes.length >= fails.length ? "Passes" : "Fails";
};

Game.prototype.checkQuest = function() {
	var currentRound = this.rounds['round'+this.currentRound];
	var failsRequired = 1;
	if(currentRound.doubleFail){
		failsRequired = 2
	}
	var totalFails = this.votes.filter(function(vote){
		return vote === "Fail"
	}).length
	return totalFails >= failsRequired ? "Fails" : "Passes";
};


Game.prototype.reset = function() {
    this.votes = [];
};

//Functions for Game state while playing with cards

Game.prototype.nextRoundCards = function(winner) {
    // body...
};

module.exports = {
    Game: Game,
    RoleMap: RoleMap,
    Round: Round
}

Game.prototype.removeUser = function(player) {
    var idx = this.players.indexOf(player);
    if(this.leader===player){
        this.nextLeader();
    }
    this.players.splice(idx,1);
    var leaderIdx = this.players.indexOf(this.leader);
    if(this.Lady.currentHolder===player){
        this.Lady.currentHolder = this.players[this.prevPlayerIdx(leaderIdx)]
    }    
};




