app.directive('sideBar', function($window) {
    return {
        templateUrl: 'js/directives/directiveTemplates/sideBarTemplate.html',
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