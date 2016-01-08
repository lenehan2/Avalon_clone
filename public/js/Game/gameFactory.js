app.factory('gameFactory', function() {
    var yourRole;
    var game = {};
    game.leader = {};
    game.Lady = {};
    var gameState;
    var suggestedTeam;
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
            }else if(gameState.state ==="Voting"){
                gameState.active = true;
            }else if(gameState.state ==="Quest"){
                var present = suggestedTeam.find(function(thisUser){
                    return thisUser.name === user.name
                })

                if(present){
                    gameState.active = true;
                }else{
                    var teamMembers = suggestedTeam.map(function(user){
                        return user.name
                    }).join(', ');
                    gameState.message = "Waiting for " + teamMembers+ " to pass or fail the quest"
                }
            }else if(gameState.state==='CardGame'){
                console.log("HOST: ",game.host)
                console.log('USER: ', user)
                if(game.host.id===user.id){
                    gameState.active = true;
                }else{
                    gameState.active=false;
                    gameState.message = "The Game is underway.  You will only need to refer to this screen in order to use the Lady Card."
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
        },
        setSuggestedTeam: function(team){
            suggestedTeam = team;
        },
        getSuggestedTeam: function(){
            return suggestedTeam;
        },
        toggleState: function(){
            gameState.active = !gameState.active;
        }
    }
})
