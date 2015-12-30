app.directive('myLoading', function() {
    return {
        templateUrl: 'js/directives/directiveTemplates/myLoadingTemplate.html',
        restrict: 'E',
        scope: {
            user: '=',
            message: '='
        }
    }
})