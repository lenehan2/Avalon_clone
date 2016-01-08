app.controller('gameController', function($scope, mySocket, roomsFactory, $state, gameFactory, mainFactory) {
    $scope.role = gameFactory.getRole();
    $scope.gameInfo = {};
    $scope.game = gameFactory.getGame();
    $scope.leader = gameFactory.getGame().leader;
    $scope.Lady;
    $scope.ladyMessage;
    $scope.menuVisible = false;
    $scope.host = roomsFactory.getCurrentRoom().host;
    $scope.ladyObj = {
        returned: false
    }
    $scope.startGame = function(gameInfo) {
        var rolesCount = 0;
        gameInfo.size = roomsFactory.getCurrentRoom().users.length;

        //should go into a factory
        for (var key in gameInfo) {
            if (key !== "Lady" && gameInfo[key] === true) {
                rolesCount++;
            }
        }
        if (gameInfo.size < 5) {
            alert('You need more players to join the game before you start')
        } else if (rolesCount > gameInfo.size) {
            var num = rolesCount - gameInfo.size
            alert('You have picked ' + num + " too many roles for this game.  Add players or remove roles")
        } else {
            mySocket.emit('startGame', gameInfo)
        }
    }

    $scope.ladySubmit = function(userInfo) {
        console.log("LadySubmit Value: ", userInfo)
        mySocket.emit('ladySubmit', userInfo, function(data) {
            if (!data.bool) {
                $scope.ladyMessage = "You are not the Lady Holder";
                console.log("Made it to the callback")
            }
        })
    }

    $scope.nextState = function() {
        mySocket.emit("nextState");
    }

    mySocket.on('ladyInfo', function(data) {
        $scope.ladyObj = {
            username: data.name,
            allegiance: data.allegiance,
            returned: true
        }
    })

    $scope.getGame = gameFactory.getGame;
    $scope.getRole = gameFactory.getRole;
    $scope.gameState = gameFactory.getGameState();
    $scope.view = "Game";

    $scope.toggleView = function(view){
        $scope.view = view;
        $scope.menuVisible = false;
    }

    $scope.toggleMenu = function(){
        $scope.menuVisible=!$scope.menuVisible;
    }


    mySocket.on('game', function(data) {
        var user = mainFactory.getUser();
        gameFactory.setGame(data, user);
        $scope.game = gameFactory.getGame();
        $scope.Lady = $scope.game.Lady;
        $scope.leader = $scope.game.leader;
        $scope.gameState = gameFactory.getGameState();
        $state.go('game', {
            'newRoom': roomsFactory.getCurrentRoom().name
        })
    })

    // mySocket.on('setGameState',function(data){
    //     gameFactory.
    // })

    mySocket.on('yourRole', function(data) {
        gameFactory.setRole(data)
        $scope.role = gameFactory.getRole();

        console.log('Your Rolez: ', $scope.rolez)
    })
    mySocket.on('updatedCurrentRoom', function(data) {
        // console.log('Data: ', data)
        roomsFactory.setCurrentRoom(data.currentRoom)
        $scope.host = roomsFactory.getCurrentRoom().host;
    })

})
