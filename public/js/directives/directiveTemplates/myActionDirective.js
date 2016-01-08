app.directive('myAction', function() {
    return {
        templateUrl: 'js/directives/directiveTemplates/modalTemplate.html',
        restrict: 'E',
        scope: {
        	players: '=',
            information: '=',
            username: '='
        }
    }
})
