$(document).ready(function () {
    var socket=io();

    var name = prompt('What is your name?:', "(unknown)")

    socket.emit('got_a_new_user', {'name':name})

    socket.on('greeting', function(data){
        var htmlString = "<p class='join'>"+data.new_user+" has joined the chatroom!</p>";
        $('#chatroom').append(htmlString);
        $('#chatroom').scrollTop($('#chatroom')[0].scrollHeight);
    });

    socket.on('start', function(data){
        var start_text = "<p class='join'>Welcome to the chat room bruh!</p>"
        $('#chatroom').append(start_text);
        for (var i=0; i<data.messages.length; i++){
            var htmlString = "<p>"+data.messages[i].name+": "+data.messages[i].message+"</p>"
            $('#chatroom').append(htmlString);
        }
        $('#chatroom').scrollTop($('#chatroom')[0].scrollHeight);
    })

    $('#submit').on('click', function () {
        var message = $('#add_message').val();
        socket.emit('add_message', {'name': name, 'message':message})
        return false;
    });

    socket.on('new_message', function(data){
        if (name === data.message.name){
            var htmlString = "<p>[Me]: " + data.message.message+ "</p>"
        } else{
            var htmlString = "<p>[" + data.message.name +"]: " + data.message.message + "</p>"
        }
        $('#chatroom').append(htmlString);
        $('#chatroom').scrollTop($('#chatroom')[0].scrollHeight);
    });

});