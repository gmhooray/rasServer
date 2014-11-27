var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var port = Number(process.env.PORT || 33551);

var os = require('os');
var ifaces = os.networkInterfaces();
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
            console.log(dev+(alias?':'+alias:''),details.address);
            ++alias;
        }
    });
}

/* Node Child_process */
var cp = require('child_process');
var spawn = cp.spawn;

var path = require('path');
app.use(express.static(path.join( __dirname , 'src/')));

var gman = function(){this.$init.apply(this,arguments)};
gman.prototype = {
    $init: function(){
        this._sResult = '';
    },
    cmd : function (sCommand, aParameter){
        this._cmd = spawn(sCommand, aParameter);

        this._cmd.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        this._cmd.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        this._cmd.on('close', function (code) {
            console.log('child process exited with code ' + code);
        });
    }
}

var gServer = new gman();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

/* socket.io event */
io.on('connection', function(socket){
    socket.emit('news', { hello: 'world' });

})

server.listen(port, function() {
    console.log("Listening on " + port);
});
