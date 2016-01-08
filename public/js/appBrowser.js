var app = angular.module('avalon-clone', ['btford.socket-io', 'ui.router', 'dndLists', 'ui.bootstrap']);

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
    })
})

app.config(function($stateProvider) {
    $stateProvider.state('testing', {
        url: '/testing',
        templateUrl: '/templates/testing.html',
        controller: 'MainCtrl'
    })
})

app.config(function($stateProvider) {
    $stateProvider.state('roomJoin', {
        url: '/room',
        templateUrl: 'templates/roomSelectorTemplate.html',
        controller: 'RoomController'
    })
})

app.config(function($stateProvider) {
    $stateProvider.state('currentRoom', {
        url: '/currentroom/:newRoom',
        templateUrl: 'templates/currentRoomTemplate.html',
        controller: 'RoomController'
    })
})


