
var cluster = require('cluster');
var os = require('os');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var port = Number(process.env.PORT || 7777);
var numCPUs = os.cpus().length;
var serveIndex = require('serve-index');
var fs = require("fs")

/* Node Child_process */
var cp = require('child_process');

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    var path = require('path');
    app.use(express.static(path.join(__dirname, 'src/')));
//    app.use('/files', serveIndex('src/files', {'icons': true}))

    app.post('/getList', function(req,res){
        fs.readdir("src/files/test", function (err, filenames) {
            var i;
            console.log(req.param('index'));
            for (i = 0; i < filenames.length; i++) {
                console.log(filenames[i]);
            }
            res.json({0:filenames[0],1:filenames[1],2:filenames[2]});
        });

    })
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    });
    server.listen(port, function() {
        console.log("Listening on " + port);
    });
}
//    /* socket.io event */
//    io.on('connection', function(socket){
//        socket.emit('news', { hello: 'world' });
//        if( process.platform  == "win32" ){
//            socket.on('pushPrev', function(data){
//                gServer.cmd('./tool/WinSendKeys/WinSendKeys.exe',['-t','2000','-w','[ACTIVE]','{UP}']);
//            })
//            socket.on('pushNext', function(data){
//                gServer.cmd('./tool/WinSendKeys/WinSendKeys.exe',['-t','2000','-w','[ACTIVE]','{DOWN}']);
//            })
//        }else if(process.platform  == "darwin"){
//            socket.on('pushPrev', function(data) {
//                gServer.cmd('osascript',['-e', 'tell app \"System Events\" to key code 126']);
//            })
//            socket.on('pushNext', function(data){
//                gServer.cmd('osascript',['-e', 'tell app \"System Events\" to key code 125']);
//            })
//        }
//    })


//    var spawn = cp.spawn;
//
//    var gman = function(){this.$init.apply(this,arguments)};
//    gman.prototype = {
//        $init: function(){
//            this._sResult = '';
//        },
//        cmd : function (sCommand, aParameter){
//            this._cmd = spawn(sCommand, aParameter);
//
//            this._cmd.stdout.on('data', function (data) {
//                console.log('stdout: ' + data);
//            });
//
//            this._cmd.stderr.on('data', function (data) {
//                console.log('stderr: ' + data);
//            });
//
//            this._cmd.on('close', function (code) {
//                console.log('child process exited with code ' + code);
//            });
//        }
//    }
//
//    var gServer = new gman();
//
//    server.listen(port, function() {
//        console.log("Listening on " + port);
//    });
//}



/*var ifaces = os.networkInterfaces();
for (var dev in ifaces) {
    var alias=0;
    ifaces[dev].forEach(function(details){
        if (details.family=='IPv4') {
            console.log(dev+(alias?':'+alias:''),details.address);
            ++alias;
        }
    });
}*/
