var app = angular.module('Avalon',['ui.router']);

app.config(function($stateProvider){
	$stateProvider.state('loginState',{
		url: '/',
		templateUrl: '/public/templates/loginTemplate.html'
	})
})
