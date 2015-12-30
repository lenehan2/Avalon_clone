app.controller('ActionController', function($scope, mySocket, mainFactory, actionFactory, gameFactory) {

    // $scope.gameState = gameFactory.getGameState();
    $scope.message;
    $scope.user = mainFactory.getUser();
    $scope.game = gameFactory.getGame();
    mySocket.on('setGameState', function(data) {
        console.log("Made it to the emmission")
        $scope.game = gameFactory.getGame();
        $scope.user = mainFactory.getUser();
        gameFactory.setGameState($scope.user, data.state, $scope.game)
        // $scope.gameState = gameFactory.getGameState();
        console.log("GAMESTATE: ",$scope.gameState)
    })

})