app.config(function($stateProvider) {
    $stateProvider.state('game', {
        url: '/currentRoom/:newRoom/game',
        templateUrl: 'templates/testing.html',
        controller: 'gameController'
    })
})