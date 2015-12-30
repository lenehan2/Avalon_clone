app.directive('myLobby', function() {
    return {
        templateUrl: 'js/directives/directiveTemplates/lobbyTemplate.html',
        restrict: 'E',
        scope: {
            users: '=',
            room: '=',
            username: '='
        }
    }
})

