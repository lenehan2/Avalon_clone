app.factory('roomsFactory', function() {
    var rooms;
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