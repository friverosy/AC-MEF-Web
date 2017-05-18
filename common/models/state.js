'use strict';

module.exports = function(State) {
  State.updatePeople = function(pda, cb) {
    State.find({
      fields: {updatePeople: true},
      where: {pda: pda},
      order: 'id DESC',
      limit: 1
    },
    function (err, record) {
      if (err) {
        console.error(err);
        cb(null, null);
      } else if (record.length < 1){
        cb(null, null);
      } else {
        cb(null, record[0].updatePeople);
      }
    });
  };

  State.remoteMethod('updatePeople', {
      returns: {arg: 'update', type: 'boolean'},
      accepts: {arg: 'pda', type: 'number', required: true},
      http: {path: '/updatePeople', verb: 'get'}
  });
};
