const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
    secret: 'Jeffsrandomsecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}))

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

const server = app.listen(9999);
const io = require('socket.io')(server);
var messages= []; 

io.on('connection', function(socket){
    socket.on('got_a_new_user', function(data){
        socket.broadcast.emit('greeting', {'new_user': data.name});
        socket.emit('start', {'messages' :messages});
    })
    socket.on('add_message', function(data){
        var name = data.name;
        var message = data.message;
        var new_message = {'name': name, 'message':message}
        messages.push(new_message);
        io.sockets.emit('new_message',{'message': new_message})
    })
})

app.get('/', function(req, res){
    res.render('index');
})