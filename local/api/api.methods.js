/* Ignition Client API Methods
-------------------------------------------------- */

var api = {
    
    gamesList: function(nsp, param){
        common.listroms.listRoms(nsp, param);
    },
    
    storeGet: function(nsp, database){
        common.databases.storeGet(nsp, database);
    },

    platformList: function(nsp){
        common.listPlatforms.listPlatforms(nsp);
    },

    gameInfo: function(nsp, game) {
        common.game.gameProfileSmall(nsp, game);
    },

    messages: function(nsp) {
        // console.log("send messages...");
    },

    isOnline: function(nsp, username) {
        common.network.isOnline(nsp, username);
    },

    lookupGame: function(nsp, game) {
        common.game.apicall(nsp, game);
    },

    ipInfo: function(nsp) {
        common.location.ipInfo(nsp);
    },
    crc32: function(nsp, path) {
        common.hash.getCRC32(nsp, path);
    }

}

exports.apiMethod = api;