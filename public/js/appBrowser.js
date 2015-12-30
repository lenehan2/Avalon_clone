var app = angular.module('avalon-clone', ['btford.socket-io', 'ui.router', 'dndLists']);

app.factory('mainFactory', function() {
    var user;
    return {
        setUser: function(thisUser) {
            console.log("USER FROM FACT: ", thisUser)
            user = thisUser;
        },
        getUser: function() {
            return user;
        }
    }
})
app.factory('mySocket', function(socketFactory) {

    var myIoSocket = io(window.location.origin);

    var socket = socketFactory({
            ioSocket: myIoSocket
        })
        // console.log(socket)
    return socket;
})

app.factory('gameFactory', function() {
    var yourRole;
    var game;
    var gameState;
    return {
        getGame: function() {
            return game;
        },
        setGame: function(sentGame, user) {
            game = sentGame;
            gameState = sentGame.gameState;
            console.log("SET GAME STATE PARAMS: ", user, sentGame)
            if (gameState.state === "Selection") {
                if (sentGame.leader.name === user.name) {
                    gameState.active = true;
                } else {
                    gameState.message = "Waiting for " + sentGame.leader.name + " to finish selecting their team."
                }
            }
            // console.log("From Factory: ",game)
        },
        setRole: function(roleData) {
            console.log("Role Data from gameFactory: ", roleData)
            yourRole = roleData
        },
        getRole: function() {
            return yourRole;
        },
        getGameState: function() {
            return gameState;
        }
    }
})

// app.factory('actionFactory', function(gameFactory) {

//     return {
//         getGameState: gameFactory.getGameState,
//         setGameState: function(user,state,game){
//             console.log("SET GAME STATE PARAMS: ",user,state,game)
//             if(state==="Selection"){
//                 console.log("MADE IT HERE")
//                 gameState = {active: false, state:state};
//                 if(game.leader.name===user.name){
//                     gameState.active=true;
//                 }
//             }else if(state==="Lady"){

//             }else if(state==="Voting"){

//             }
//         }
//     }
// })

app.factory('roomsFactory', function() {
    var rooms = ['test1', 'test2'];
    var currentRoom;
    return {
        setRooms: function(roomsArray) {
            rooms = roomsArray;
        },
        getRooms: function() {
            return rooms;
        },
        setCurrentRoom: function(room) {
            currentRoom = room;
        },
        getCurrentRoom: function() {
            return currentRoom;
        }
    }
})

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

    // mySocket.on('privateMessage',function(data){
    //     console.log("Your message: ",data.message)
    // })
    //REMOVE THIS
    mySocket.on('SERVER', function(data) {
        console.log("SERVER DATA: ", data)
    })

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
                $scope.currentUser = data.user;
                mainFactory.setUser(data.user)
                    // console.log("CURRENT USER: ", $scope.currentUser)
                $scope.userNameAccepted = true;
                $scope.message = "";
                $state.go('home.roomJoin')
            } else {
                $scope.message = data.message;

            }
        })
    }
})

app.controller('gameController', function($scope, mySocket, roomsFactory, $state, gameFactory, mainFactory) {
    $scope.test = "TEST"
    $scope.game = {};
    $scope.startGame = function(game) {
        var rolesCount = 0;
        game.size = roomsFactory.getCurrentRoom().users.length;
        for (var key in game) {
            if (key !== "Lady" && game[key] === true) {
                // console.log(key,": ",game[key])
                rolesCount++;
            }
        }
        if (game.size < 5) {
            alert('You need more players to join the game before you start')
        } else if (rolesCount > game.size) {
            var num = rolesCount - game.size
            alert('You have picked ' + num + " too many roles for this game.  Add players or remove roles")
        } else {
            mySocket.emit('startGame', game)
        }
    }

    mySocket.on('game', function(data) {
        var user = mainFactory.getUser();
        console.log("USER: ", user)
        gameFactory.setGame(data, user);
        $state.go('game', {
            'newRoom': roomsFactory.getCurrentRoom().name
        })
    })

    mySocket.on('yourRole', function(data) {
        gameFactory.setRole(data)
            // console.log('Your Role: ', data)
    })

    $scope.getGame = gameFactory.getGame;
    $scope.getRole = gameFactory.getRole;


    $scope.getTest = function() {
        return $scope.test
    }

    $scope.gameState = gameFactory.getGameState;

})

app.controller('ActionController', function($scope, mySocket, mainFactory, actionFactory, gameFactory) {

    $scope.getGameState = actionFactory.getGameState;
    $scope.message;
    $scope.user = mainFactory.getUser();
    $scope.game = gameFactory.getGame();
    mySocket.on('setGameState', function(data) {
        console.log("Made it to the emmission")
        $scope.game = gameFactory.getGame();
        $scope.user = mainFactory.getUser();
        actionFactory.setGameState($scope.user, data.state, $scope.game)
        $scope.gameState = actionFactory.getGameState();
    })

})

app.controller('RoomController', function($scope, mySocket, $state, roomsFactory, $stateParams) {

    // $scope.rooms = roomsFactory.getRooms;
    $scope.currentRoom = "test";
    $scope.getCurrentRoom = roomsFactory.getCurrentRoom;
    $scope.size = function() {
        if ($scope.currentRoom.users) {
            return $scope.currentRoom.users.length;
        }
    }

    // mySocket.on('rooms',function(data){
    //     roomsFactory.setRooms(data.rooms);
    // })
    $scope.join = function(room) {
        mySocket.emit('joinRoom', {
            room: room
        }, function(data) {
            if (data.bool) {
                // console.log('Joined Room')
                $state.go('home.currentRoom', {
                    'newRoom': data.currentRoom
                })
            }
        })
    }

    mySocket.on('updatedCurrentRoom', function(data) {
        // console.log('Data: ', data)
        roomsFactory.setCurrentRoom(data.currentRoom)
        $scope.currentRoom = data.currentRoom;
    })

    mySocket.on('currentRoom', function(data) {
        roomsFactory.setCurrentRoom(data.currentRoom);
        $scope.currentRoom = roomsFactory.getCurrentRoom();
        // console.log("CURRENT ROOM: ", $scope.currentRoom)
        $state.go('home.currentRoom', {
            'newRoom': $scope.currentRoom.name
        })
    })


    $scope.roomName = function(name) {
        mySocket.emit('newRoom', {
            room: name
        }, function(data) {
            if (data.bool) {} else {
                $scope.roomMessage = data.message;
            }
        })
    }

})

app.directive('myLobby', function() {
    return {
        templateUrl: 'templates/lobbyTemplate.html',
        restrict: 'E',
        scope: {
            users: '=',
            room: '=',
            username: '='
        }
    }
})

app.directive('myChar', function() {
    return {
        templateUrl: 'templates/modalTemplate.html',
        restrict: 'E',
        scope: {
            role: '=',
            information: '=',
            username: '='
        }
    }
})

app.directive('myProfile', function() {
    return {
        templateUrl: 'templates/profileTemplate.html',
        restrict: 'E',
        scope: {
            user: '=',
            username: '=',
            lady: '=',
            leader: '='
        }
    }
})

app.directive('sideBar', function($window) {
    return {
        templateUrl: 'templates/sideBarTemplate.html',
        restrict: 'E',
        scope: {
            game: '=',
            user: '=',
            username: '=',
            lady: '=',
            leader: '='
        }
    }
})

app.directive('myLoading', function() {
    return {
        templateUrl: 'templates/myLoadingTemplate.html',
        restrict: 'E',
        scope: {
            user: '=',
            message: '='
        }
    }
})

// app.directive('myAction',function(){
//     templateUrl: 'templates/myActionTemplate.html',
//     restrict: 'E',
//     scope: {
//         action: '='
//     }
// })

app.config(function($stateProvider) {
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: 'templates/homeTemplate.html',
        controller: 'RoomController'
    }).state('home.roomJoin', {
        url: '/room',
        templateUrl: 'templates/roomSelectorTemplate.html',
        controller: 'RoomController'
    }).state('home.currentRoom', {
        url: '/currentroom/:newRoom',
        templateUrl: 'templates/currentRoomTemplate.html',
        controller: 'RoomController'
    })
})

// app.config(function($stateProvider) {
//     $stateProvider.state('roomJoin', {
//         url: '/room',
//         templateUrl: 'templates/roomSelectorTemplate.html',
//         controller: 'RoomController'
//     })
// })

// app.config(function($stateProvider) {
//     $stateProvider.state('currentRoom', {
//         url: '/currentroom/:newRoom',
//         templateUrl: 'templates/currentRoomTemplate.html',
//         controller: 'RoomController'
//     })
// })

app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/currentRoom/:newRoom/game',
        templateUrl: 'templates/testing.html',
        controller: 'gameController'
    })
})

app.config(function($stateProvider) {
    $stateProvider.state('testing', {
        url: '/testing',
        templateUrl: '/templates/testing.html',
        controller: 'MainCtrl'
    })
})


// var socket = io(window.location.origin);

// socket.on('connect', function() {
//     console.log("You have successfully connected.  Enjoy your game!")
// })
// //Must go back and set variables for the jQuery searches

// var $socketForm = $('#socketJoin form');
// var $socketFormPar = $('#socketJoin form p');

// var $roomForm = $('#roomCreate form');
// var $userForm = $('#userNameCreate form');
// var $userSection = $('#currentUsers');
// var $socketSection = $('#socketJoin');
// var $usernameSection = $('#userNameCreate');
// var $lobbyUsersList = $('#lobbyUsers ul');

// //Controls user inputed Nickname:  Will need to control length of username, but 
// //unique names are currently required correctly.

// $userForm.submit(function(e) {
//     var input = $('#nickname').val();
//     e.preventDefault()
//     if(input.indexOf('<')!==-1){
//          $('#userNameCreate form p').html("Stop trying to insert HTML you little shit")
//     }else{
//         socket.emit('newUser', input, function(data) {
//             if (data.bool) {
//                 $usernameSection.css('display', 'none')
//                 $socketSection.css('display', 'block')
//                  data.rooms.forEach(function(room){

//                     var button = "<button value="+room.name+">"+room.name+"</button>";
//                     $("#roomsList").append(button)
//                 })
//             } else {

//                 $('#userNameCreate form p').html(data.msg)

//             }
//         })
//         $('#nickname').val('');
//     }
// })

// socket.on('usernames', function(names) {
//     $lobbyUsersList.empty()
//     names.forEach(function(name) {
//         var liElement = "<li>" + name.nickname + "</li>";
//         $lobbyUsersList.append(liElement);
//     })
// })


// $socketForm.submit(function(e){
//     e.preventDefault();
//     var input = $('#roomName1').val();
//     if(input.length<2){
//         $socketFormPar.html("Server name must be longer than 2 characters")
//     }else if(input.indexOf('<')!==-1){
//         $socketFormPar.html("Don't be a little shit, stop tryint to insert tags")
//     }else{
//         socket.emit('createRoom',input,function(data){
//             if(data.bool){
//                 helperFunc(data);
//             }else{
//                 $socketFormPar.html(data.msg)
//             }
//         })
//     }
// })


// $("#roomsList").on('click','button',function(val){
//     socket.emit("join",$(this).val(),function(data){
//         if(data.bool){
//             helperFunc(data)
//         }
//     })
// })

// $('#currentUsers form').submit(function(e){
//     e.preventDefault();
//     socket.emit('newGame',"true");
// })

// $('#roomForm').submit(function(e){
//     e.preventDefault();
//     socket.emit("join",$('#roomname').val(),function(data){
//         if(data.bool){
//             //$('#roomForm').css('display','none');
//         }else{
//             $('#roomForm p').html(data.msg);
//         }
//     })
// })

// socket.on('message',function(data){
//     $('#role p').html(data.role)
// })


// var helperFunc = function(data){
//     $socketSection.css('display','none');
//     $userSection.css('display','block');
//     $('#currentUsers span').html(data.msg)
//     $('#usernameList').empty();
//     data.users.forEach(function(user){
//         var liElement = "<li>"+user.nickname+"</li>"
//         $('#usernameList').append(liElement);
//         // var test = $($('#usernameList')[0])
//         // test.html("Lobby Host: "+ test.val())
//     })
// }
