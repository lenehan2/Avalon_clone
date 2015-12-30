app.directive('myProfile', function() {
    return {
        templateUrl: 'js/directives/directiveTemplates/profileTemplate.html',
        restrict: 'E',
        scope: {
            user: '=',
            username: '=',
            lady: '=',
            leader: '='
        }
    }
})
