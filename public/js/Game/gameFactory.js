app.factory('gameFactory', function() {
    var yourRole;
    var game = {};
    game.leader = {};
    game.Lady = {};
    var gameState;
    return {
        getGame: function() {
            return game;
        },
        setGame: function(sentGame, user) {
            game = sentGame;
            gameState = sentGame.gameState;
            console.log("SET GAME STATE PARAMS: ", user, sentGame)
            if (gameState.state === "Selection") {
                if (sentGame.leader.name === user.name) {
                    gameState.active = true;
                } else {
                    gameState.message = "Waiting for " + sentGame.leader.name + " to finish selecting their team."
                }
            }else if(gameState.state==="Lady"){
                if (sentGame.Lady.currentHolder.name === user.name) {
                    gameState.active = true;
                } else {
                    gameState.message = "Waiting for " + sentGame.Lady.currentHolder.name + " to finish selecting who to Lady."
                }
            }
            // console.log("From Factory: ",game)
        },
        setRole: function(roleData) {
            console.log("Role Data from gameFactory: ", roleData)
            yourRole = roleData;
        },
        getRole: function() {
            return yourRole;
        },
        getGameState: function() {
            return gameState;
        }
    }
})
