app.directive('myChar', function() {
    return {
        templateUrl: 'js/directives/directiveTemplates/modalTemplate.html',
        restrict: 'E',
        scope: {
            role: '=',
            information: '=',
            username: '='
        }
    }
})
