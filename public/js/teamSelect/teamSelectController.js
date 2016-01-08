app.controller('teamSelect',function($scope,gameFactory,mySocket){
	// var game = gameFactory.getGame();
	// var currentRound = gameFactory.getGame().rounds['round'+game.currentRound]
	$scope.team = [];
	$scope.message;
	$scope.validTeam = false;
	$scope.addToTeam = function(user,game){
		var currentRound = game.rounds['round'+game.currentRound]
		if($scope.team.length+1>currentRound.people){
			$scope.message = "You can only pick "+currentRound.people+" to go on this quest."
		}else{
			$scope.team.push(user);
			if($scope.team.length < currentRound.people){
				var num = currentRound.people -$scope.team.length;
				$scope.message = "Pick "+ num + " more people to go on the quest";
			}else{
				$scope.message = "You are ready to go on the quest!";
				$scope.validTeam = true;
			}
		}
	}

	$scope.removeUser = function(user,game){
		var currentRound = game.rounds['round'+game.currentRound]
		var idx = $scope.team.indexOf(user);
		$scope.team.splice(idx,1);
		var num = currentRound.people-$scope.team.length;
		$scope.message = "Pick "+ num + " more people to go on the quest";
		$scope.validTeam = false;
		console.log("game: ", game);
		console.log('currentRound: ',currentRound);
	}

	$scope.submitTeam = function(team){
		mySocket.emit('teamSubmit',team)
	}

})