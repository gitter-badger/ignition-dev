/* Socket Server Client API
-------------------------------------------------- */
var methods = require('./api.methods.js');


/* Sockets.io
-------------------------------------------------- */
var api = function(nsp) {

    nsp.on('connection', function(nsp){

      console.log('client connected to API');
      
      nsp.on('request', function(request) {

        var method = request.request;
        var param = request.param;

        methods.apiMethod[method](nsp, param);

        nsp.emit('api', request);
        
        });


    });

}

module.exports = api;