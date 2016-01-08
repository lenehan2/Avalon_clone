app.controller('MainCtrl', function($scope, mySocket, $state, roomsFactory, $location, mainFactory) {
    $scope.tempGame = {
        "roomName": "asdfasdf",
        "score": {
            "Good": 0,
            "Evil": 0
        },
        "roles": ["Minion of Mordred", "Minion of Mordred", "Minion of Mordred", "Loyal Servant of Arthur", "Loyal Servant of Arthur", "Loyal Servant of Arthur", "Loyal Servant of Arthur", "Loyal Servant of Arthur", "Loyal Servant of Arthur"],
        "cards": true,
        "Lady": {
            "inUse": true,
            "currentHolder": {
                "name": "Fran",
                "id": 5,
                "role": null
            }
        },
        "gameState": {
            "active": true,
            "state": "CardGame"
        },
        "players": [{
            "name": "aaaa",
            "id": "2iNM4qoEU0v6p1qxAAAE",
            "role": null
        }, {
            "name": "Ted",
            "id": 0,
            "role": null
        }, {
            "name": "Gretchen",
            "id": 1,
            "role": null
        }, {
            "name": "Bill",
            "id": 2,
            "role": null
        }, {
            "name": "Ruby",
            "id": 3,
            "role": null
        }, {
            "name": "Mike",
            "id": 4,
            "role": null
        }, {
            "name": "Fran",
            "id": 5,
            "role": null
        }, {
            "name": "Brian",
            "id": 6,
            "role": null
        }, {
            "name": "Sarah",
            "id": 7,
            "role": null
        }],
        "currentRound": 1,
        "rounds": {
            "round1": {
                "people": 3,
                "winner": null,
                "doubleFail": false,
                "votes": []
            },
            "round2": {
                "people": 4,
                "winner": null,
                "doubleFail": false,
                "votes": []
            },
            "round3": {
                "people": 4,
                "winner": null,
                "doubleFail": false,
                "votes": []
            },
            "round4": {
                "people": 5,
                "winner": null,
                "doubleFail": true,
                "votes": []
            },
            "round5": {
                "people": 5,
                "winner": null,
                "doubleFail": false,
                "votes": []
            }
        },
        "votes": [],
        "roundOfVoting": 1,
        "leader": {
            "name": "Brian",
            "id": 6,
            "role": null
        },
        "host": {
            "name": "aaaa",
            "id": "2iNM4qoEU0v6p1qxAAAE",
            "role": null
        }
    }

    $scope.close = function() {
        $scope.visible = false;
    };

    $scope.show = function(e) {
        $scope.visible = true;
    };


    // $rootScope.$on("documentClicked", _close);
    // $rootScope.$on("escapePressed", _close);

    // function _close() {
    //     $scope.$apply(function() {
    //         $scope.close();
    //     });
    // }
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
    $scope.visible = false;
    $scope.showLobby = false;
    $scope.showRoomSelection = true;
    $scope.showCurrent = false;
    $scope.showRoom = true;

    $scope.toggleLobby = function() {
        $scope.showLobby = !$scope.showLobby;
        $scope.showRoomSelection = !$scope.showRoomSelection
        $scope.visible = false;
    }

    $scope.toggleCurrent = function(view) {
        $scope.visible = false;
        $scope.showLobby = false;
        $scope.showCurrent = false;
        $scope.showRoom = false;
        if (view === 'Lobby') {
            $scope.showLobby = true;
        } else if (view === 'Room') {
            $scope.showRoom = true;
        } else if (view === 'Current') {
            $scope.showCurrent = true;
        }
        console.log($scope.showCurrent)
        console.log($scope.showRoom)
        console.log($scope.showLobby)
    }

    $scope.toggleMenu = function() {
        $scope.visible = !$scope.visible;
    }

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
                $state.go('roomJoin')
            } else {
                $scope.message = data.message;
            }
        })
    }

    //Test Suite Functions

    $scope.testGame = function() {
        mySocket.emit("testGame", {
            data: "DATA"
        })
    }

})
