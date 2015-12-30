
var $socketForm = $('#socketJoin form');
var $socketFormPar = $('#socketJoin form p');
var $roomForm = $('#roomCreate form');
var $userForm = $('#userNameCreate form');
var $userSection = $('#currentUsers');
var $socketSection = $('#socketJoin');
var $usernameSection = $('#userNameCreate');
var $lobbyUsersList = $('#lobbyUsers ul');

var socket = io(window.location.origin);

socket.on('connect', function() {
    console.log("You have successfully connected.  Enjoy your game!")
})
//Must go back and set variables for the jQuery searches

//Controls user inputed Nickname:  Will need to control length of username, but 
//unique names are currently required correctly.


socket.on('usernames', function(names) {
    $lobbyUsersList.empty()
    names.forEach(function(name) {
        var liElement = "<li>" + name.nickname + "</li>";
        $lobbyUsersList.append(liElement);
    })
})


socket.on('message',function(data){
    $('#role p').html(data.role)
})






$userForm.submit(function(e) {
    var input = $('#nickname').val();
    e.preventDefault()
    if(input.indexOf('<')!==-1){
         $('#userNameCreate form p').html("Stop trying to insert HTML you little shit")
    }else{
        socket.emit('newUser', input, function(data) {
            if (data.bool) {
                $usernameSection.css('display', 'none')
                $socketSection.css('display', 'block')
                 data.rooms.forEach(function(room){

                    var button = "<button value="+room.name+">"+room.name+"</button>";
                    $("#roomsList").append(button)
                })
            } else {
            
                $('#userNameCreate form p').html(data.msg)
               
            }
        })
        $('#nickname').val('');
    }
})

$socketForm.submit(function(e){
    e.preventDefault();
    var input = $('#roomName1').val();
    if(input.length<2){
        $socketFormPar.html("Server name must be longer than 2 characters")
    }else if(input.indexOf('<')!==-1){
        $socketFormPar.html("Don't be a little shit, stop tryint to insert tags")
    }else{
        socket.emit('createRoom',input,function(data){
            if(data.bool){
                helperFunc(data);
            }else{
                $socketFormPar.html(data.msg)
            }
        })
    }
})

$("#roomsList").on('click','button',function(val){
    socket.emit("join",$(this).val(),function(data){
        if(data.bool){
            helperFunc(data)
        }
    })
})

$('#currentUsers form').submit(function(e){
    e.preventDefault();
    socket.emit('newGame',"true");
})

$('#roomForm').submit(function(e){
    e.preventDefault();
    socket.emit("join",$('#roomname').val(),function(data){
        if(data.bool){
            //$('#roomForm').css('display','none');
        }else{
            $('#roomForm p').html(data.msg);
        }
    })
})

var helperFunc = function(data){
    $socketSection.css('display','none');
    $userSection.css('display','block');
    $('#currentUsers span').html(data.msg)
    $('#usernameList').empty();
    data.users.forEach(function(user){
        var liElement = "<li>"+user.nickname+"</li>"
        $('#usernameList').append(liElement);
        // var test = $($('#usernameList')[0])
        // test.html("Lobby Host: "+ test.val())
    })
}
