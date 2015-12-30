app.factory('mainFactory', function() {
    var user;
    return {
        setUser: function(thisUser) {
            console.log("USER FROM FACT: ", thisUser)
            user = thisUser;
        },
        getUser: function() {
            return user;
        }
    }
})