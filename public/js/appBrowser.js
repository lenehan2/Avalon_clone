var app = angular.module('avalon-clone', ['btford.socket-io', 'ui.router', 'dndLists']);

app.factory('mySocket', function(socketFactory) {

    var myIoSocket = io(window.location.origin);

    var socket = socketFactory({
            ioSocket: myIoSocket
        })
        // console.log(socket)
    return socket;
})

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

app.config(function($stateProvider) {
    $stateProvider.state('testing', {
        url: '/testing',
        templateUrl: '/templates/testing.html',
        controller: 'MainCtrl'
    })
})

