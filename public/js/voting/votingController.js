app.controller('votingController', function($scope, mySocket,gameFactory, $uibModal) {
    $scope.quest;
    $scope.user;
    $scope.votingDone = false;
    mySocket.on('teamVote', function(data) {
        $scope.quest = data.quest;
        $scope.user = data.user;
        gameFactory.setSuggestedTeam(data.quest);
        console.log("SUGGESTED TEAM: ", data.quest)
    })

    $scope.vote = function(vote) {
        mySocket.emit('vote', vote)
    }

    mySocket.on('votingDone', function(data) {
        $scope.outcome = data.outcome;
        $scope.votes = data.votes;
        $scope.votingDone = true;
        $scope.open($scope.votes,$scope.outcome);
        $scope.votingDone = false;
    })

    $scope.open = function(votes,outcome) {

        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'templates/votingModal.html',
            resolve: {
                votes: function() {
                    return votes;
                },
                outcome: function() {
                    return outcome;
                }
            },
            controller: function($scope, $uibModalInstance, votes, outcome) {
                $scope.votes = votes;
                $scope.outcome = outcome;
            }
        });
    };
})
