
/* Express Configuration */
var express = require('express');
var app = express();
var port = Number(process.env.PORT || 5000);
var visitPeople = 0;

app.use('/img', express.static(__dirname + '/src/img/'));
app.use('/css', express.static(__dirname + '/src/css/'));
app.use('/js', express.static(__dirname + '/src/js/'));

/* Node Child_process */
var spawn = require('child_process').spawn;

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

app.get('/', function(req, res){
    var options = {
        root: __dirname + '/src/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile('index.html', options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:','index.html');
        }
    });
});

app.post('/doCMD', function(req, res){
    visitPeople += 1;
    gServer.cmd('node',['-v']);
    res.send(visitPeople.toString());
});

app.listen(port, function() {
    console.log("Listening on " + port);
});