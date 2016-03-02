module.exports = function(People) {
    // remove the DELETE functionality from API
    People.disableRemoteMethod('deleteById', true);

    //var Record = server.models.Record;
};
