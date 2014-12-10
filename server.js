
var cluster = require('cluster');
var os = require('os');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var port = Number(process.env.PORT || 7777);
var numCPUs = os.cpus().length;
var fs = require("fs");
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

/* Node Child_process */
var cp = require('child_process');

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    })

} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(multer()); // for parsing multipart/form-data
    app.use(express.static(path.join(__dirname, 'src/')));

    app.post('/getList', function(req,res){
        fs.readdir("src/files/test", function (err, filenames) {
            // req 해당 인덱스 받고
            var nCurrentIndex = Number(req.param('index'));
            console.log(req.param('index'));
            var aFilenames = [];

            for (var i = 0; i < 3; i++) {
                if(nCurrentIndex + i < filenames.length) {
                    aFilenames.push(filenames[nCurrentIndex + i])
                }else{
                    break;
                }
            }

            res.json({aFilenames:aFilenames});
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
