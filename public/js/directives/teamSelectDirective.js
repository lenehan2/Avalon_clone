app.directive('myTeam',function(){
	return {
		restrict: "E",
		templateUrl: "js/directives/directiveTemplates/teamSelectTemplate.html",
		scope: {
			game: "="
		}
	}
})