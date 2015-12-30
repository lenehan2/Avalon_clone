app.controller('MainCtrl', function($scope, mySocket, $state, roomsFactory, $location, mainFactory) {
    $scope.tempGame = {
            "roomName": "John's Room",
            "score": {
                "Good": 0,
                "Evil": 0
            },
            "state": "Selection",
            "roles": [
                "Merlin",
                "Mordred",
                "Morgana",
                "Percival",
                "Assassin",
                "Oberon",
                "Loyal Servant of Arthur",
                "Loyal Servant of Arthur",
                "Loyal Servant of Arthur",
                "Loyal Servant of Arthur"
            ],
            "Lady": {
                "inUse": true,
                "currentHolder": {
                    "name": "John",
                    "id": "bW2YEcRb8_jYy-naAAAC",
                    "role": null
                }
            },
            "players": [{
                "name": "John",
                "id": "bW2YEcRb8_jYy-naAAAC",
                "role": null
            }, {
                "name": "Bob",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Greg",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Ted",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Gretchen",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Howie",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Sarah",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Louis",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Buddy",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }, {
                "name": "Checkers",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }],
            "currentRound": 4,
            "rounds": {
                "round1": {
                    "people": 3,
                    "winner": 'good',
                    "doubleFail": false
                },
                "round2": {
                    "people": 4,
                    "winner": 'evil',
                    "doubleFail": false
                },
                "round3": {
                    "people": 4,
                    "winner": null,
                    "doubleFail": false
                },
                "round4": {
                    "people": 5,
                    "winner": null,
                    "doubleFail": true
                },
                "round5": {
                    "people": 5,
                    "winner": null,
                    "doubleFail": false
                }
            },
            "leader": {
                "name": "Bob",
                "id": "ktZ1fGXbq0RPwH8DAAAF",
                "role": null
            }
        }
        //Should deal with only the main lobby
        //Loads current room of users
        //When user adds a username, emits new user/userlist to other sockets
        //Listen for new users being added
        //Emits to server when room is created/joined?(maybe not this ctrl)
    $location.path('/home')
    $scope.currentUser;
    $scope.userNameAccepted = false;
    $scope.lobby;
    $scope.rooms;
    //$scope.rooms = roomsFactory.rooms;
    $scope.message = "";
    $scope.setRooms = function() {
        $scope.rooms = roomsFactory.getRooms();
    }

    mySocket.on('initialSetup', function(data) {
        $scope.lobby = data.lobby;
        // console.log("THE LOBBY: ", $scope.lobby)
        roomsFactory.setRooms(data.rooms);
        $scope.rooms = roomsFactory.getRooms();
    })

    mySocket.on('updated', function(data) {
        $scope.lobby = data.lobby;
        $scope.rooms = data.rooms;
    })

    mySocket.on('rooms', function(data) {
        // console.log(data)
        roomsFactory.setRooms(data.rooms);
        $scope.rooms = roomsFactory.getRooms();
    })

    $scope.userName = function(user) {
        mySocket.emit('newUser', user, function(data) {
            if (data.bool) {
                mainFactory.setUser(data.user)
                $scope.currentUser = mainFactory.getUser();
                $scope.userNameAccepted = true;
                $scope.message = "";
                $state.go('home.roomJoin')
            } else {
                $scope.message = data.message;
            }
        })
    }
})