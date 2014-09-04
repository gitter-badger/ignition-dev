/* Game Helpers
-------------------------------------------------- */
var database = require(appDir+'/local/common').databases
,   execute = require(appDir+'/local/common').exec
,   achievements = require(appDir+'/local/common').achievements
,   util = require('util')
,   spawn = require('child_process').spawn
,   fs = require('fs')
,   _ = require('lodash');


/* Check for valid JSON return
-------------------------------------------------- */
function isJson(data) {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
}

/* Check For Sequels 
-------------------------------------------------- */
function hasNumbers(string) {
    var regex = /\d/g;
    return regex.test(string);
}

/* Cap For DB Store
-------------------------------------------------- */
function toCap(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

/* Launch Game/Emulator
-------------------------------------------------- */
function gameLaunch(req, res, callback) {

    // var filepath = '/home/pi/ignition/ramdisk/working.ram'

    var payload = '';
    var ignite = '';

    req.on('data', function(data) {
        payload += data;
    });

    req.on('end', function() {

        var args = payload.split(" ");
        var l = args.length;
        var base = args.slice(2, l);
        base = base.join(' ');


        // Pause Chromium to free up RAM
        execute('sudo pkill -STOP chromium', function(stdout) {});

        execute('sudo openvt -sw python ' + __dirname + '/py/launch.py ' + args[0] + " " + args[1] + " " + base, function(stdout) {
            // console.log("out:"+stdout);
        });

        achievements.dumpRetroRamInit();

    });

    res.send(null);

}

/* Call Archive.vg API to store and populate game
-------------------------------------------------- */
function apicall(game, callback) {


    // !!!!!YOU MUST HAVE PYTHON INSTALED!!!!!!
    // python archive_api_call.py api.archive.vg/2.0/Archive.search/json/ Super+Castlevania 
    var vg = spawn('python', [__dirname + '/py/archive_api_call.py', 'api.archive.vg/2.0/Archive.search/json/', game]);

    var data = '';

    vg.stdout.on('data', function(buffer) {
        console.log("got data from API");
        data += buffer;
    });

    vg.stdout.on('end', function(err) {

        data = data.toString('utf8');

        var rLength = data.length;
        var isjson = isJson(data);

        // JSON Friendly Data
        if (isjson == true) {

            data = JSON.parse(data); // Errors


            document = data;

            if (rLength > 50) {
                database.storeGame(document, function(newDocument) {
                    if (newDocument) {
                        callback(null, newDocument);
                    } else {
                        callback('err', null)
                    }
                });
            } else {
                callback('err', null);
            }

        }

        // Not JSON friendly DATA
        else {

            callback('err', 'null');
        }

    });

    vg.stderr.on('data', function(data) {

        console.log("error stdouts: " + data)
        // callback('err');
    });

}


/* Get Preview Profile 
-------------------------------------------------- */
function gameProfileSmall(nsp, game) {

    game = game.trim();
    
    var research = new RegExp(game, "i");

    database.findGame({
        $or: [{
            "games.game.title": {
                $regex: research
            }
        }, {
            "games.game.title": 'THE ' + {
                $regex: research
            }
        }]
    }, function(doc) {
        if (doc != "") {

            doc = doc[0];
            doc = JSON.stringify(doc);
            doc = JSON.parse(doc);

            var gameTitleThe = "THE " + game.toUpperCase();
            var gameTitle = game.toUpperCase();

            if (doc.games.game[0]) {
                var recordTitle = doc.games.game[0].title.toUpperCase()
            } else {
                var recordTitle = doc.games.game.title.toUpperCase()
            };


            if (gameTitle == recordTitle || gameTitleThe == recordTitle) {
                // console.log("Matched!")
            } else {
                for (key in doc.games.game) {
                    if (doc.games.game[key].title) {
                        if (doc.games.game[key].title.toUpperCase() == gameTitle || gameTitleThe == doc.games.game[key].title.toUpperCase()) {
                            doc.games.game[0] = doc.games.game[key];
                            break;
                        } else {
                            // delete doc.games.game[key];
                        }
                    }
                }
            }
           nsp.emit('api', {gameInfo: doc.games.game[0]});
         
            
        } else {
            apicall(game, function(err, newDoc) {
                if (err) {
                    // console.log(err);
                    // res.send(null);
                } else {
                    // res.send(newDoc);
                    nsp.emit('api', {gameInfo: null});
                }
            });
        }
    });

}

/* Large Game Profile
-------------------------------------------------- */
function gameProfileLarge(req, res, callback) {

    res.render('profile', {
        'locals': [{
            passed: "Stuff"
        }]
    });


}


/* Exports
-------------------------------------------------- */

exports.gameLaunch = gameLaunch;
exports.gameProfileSmall = gameProfileSmall;
exports.gameProfileLarge = gameProfileLarge;