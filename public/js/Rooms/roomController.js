app.controller('RoomController', function($scope, mySocket, $state, roomsFactory, $stateParams) {

    // $scope.rooms = roomsFactory.getRooms;
    $scope.currentRoom = roomsFactory.getCurrentRoom();
    $scope.getCurrentRoom = roomsFactory.getCurrentRoom();
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
                console.log('from join: ', data)

            }
        })
    }

    mySocket.on('updatedCurrentRoom', function(data) {
        // console.log('Data: ', data)
        roomsFactory.setCurrentRoom(data.currentRoom)
        $scope.currentRoom = roomsFactory.getCurrentRoom();
    })

    mySocket.on('currentRoom', function(data) {
        roomsFactory.setCurrentRoom(data.currentRoom);
        $scope.currentRoom = roomsFactory.getCurrentRoom();
        console.log("ROOM NAME", $scope.currentRoom)
            // console.log("CURRENT ROOM: ", $scope.currentRoom)
        $state.go('currentRoom', {
            'newRoom': $scope.currentRoom.name
        })
    })

    mySocket.on('joined', function() {
        $state.go('currentRoom', {
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
