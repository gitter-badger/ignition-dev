/* Network.isOnline
-------------------------------------------------- */
var _             = require('lodash'),
    sockets       = require(__base + 'api/server/server.sockets');


/* Connected to the Internet
-------------------------------------------------- */
function sysGetNetwork(nsp, callback) {


    // var ifaces = os.networkInterfaces();


    // for (var dev in ifaces) {
    //   var alias=0;
    //   ifaces[dev].forEach(function(details){
    //     if (details.family=='IPv4') {
    //       console.log(dev+(alias?':'+alias:''),details.address);
    //       ++alias;
    //     }
    //   });
    // }

    // http://ipinfo.io/json

    // request.get({
 //        uri: "http://ipinfo.io/json"
 //    }, function (error, response, body) {
 //            if (error) {
 //                nsp.emit('api', {error: error});
 //            }

 //            else {
    //            console.log(body);
    //            nsp.emit('api', {networkInfo: body});
 //               }
 //    });

}


function sysIsOnline(nsp, callback) {


    var timeout = false;


    // setTimeout(function() {
    //     console.log(timeout);
    //     if (!timeout) {
    //         nsp.emit('api', {internetConnected: "disconnected"});
    //     }
    //
    // }, 15000);



    require('dns').resolve('www.google.com', function(err) {

      if (err) {
          __api.emit('messaging', {type: 1, body: err });
          timeout = true;
          if (nsp) { nsp.emit('api', {internetConnected: "disconnected"}); }
          if (callback) { callback(false); }
      }

      else {
          timeout = true;
          if (nsp) { nsp.emit('api', {internetConnected: "connected"}); }
          if (callback) { callback(true); }
      }

    });


}

/* Connected to the Ignition Server
-------------------------------------------------- */
function isOnline(nsp, username, callback) {

    if (!username) {

        sockets.networkStatus(function(err, status) {

            // Sockets Method
            if (nsp) {
                nsp.emit('api', {isOnline: status });
            }

            // Callback Method
            if (callback || typeof callback == "function") {
                callback(null, status);
            }

        });


    }

    else {

    }
}

/* Exports
-------------------------------------------------- */

exports.sysIsOnline     = sysIsOnline;
exports.isOnline        = isOnline;
exports.sysGetNetwork   = sysGetNetwork;
