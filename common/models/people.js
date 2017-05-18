var app = require('../../server/server');

module.exports = function(People) {
    // remove the DELETE functionality from API
    //People.disableRemoteMethod('deleteById', true);
    var Promise = require('bluebird');
    var fs = require('fs');

    People.getLastUpdate = function(profile, cb) {
      var parseString = require('xml2js').parseString;
      var xml2js = require('xml2js');
      var parser = new xml2js.Parser(xml2js.defaults['0.2']);
      var text;
      var lines;
      var lastEmployee;
      var lastContractor;
      var xml;
      //console.log('profile',profile);
      if (profile === 'E') {
         // need to look for the newest file
         text = fs.readFileSync('/opt/marcasmef/lastEmployees.txt','utf8');
         lines = text.trim().split('\n');
         lastEmployee = lines[lines.length -1];
	       xml = lastEmployee; //ROUTE TO XML (EMPLOYEE OPT/MARCASMEF/NAMEXML)
         // console.log(xml);
      } else if (profile === 'C') {
         // need to look for the newest file
         text = fs.readFileSync('/opt/marcasmef/lastContractors.txt','utf8');
         //console.log(text);
         lines = text.trim().split('\n');
         lastContractor = lines[lines.length -1];
         xml = lastContractor;
      }

      fs.readFile(xml, function(err, data) {
        if (err) {
          console.log(err);
          cb(null, 404);
        } else {
          parser.parseString(data, function (err, result) {
            if (profile === 'E') {
                cb(null,
                  JSON.stringify(result.EMPLEADOS_MEF.$.FECHA_ACTUALIZACION));
            } else if (profile === 'C') {
                cb(null,
                  JSON.stringify(result.SUBCONTRATISTAS.$.FECHA_ACTUALIZACION));
            }
          });
        }
      });
    };

    function readLastXml(){
      fs.readFile();
    }

    People.remoteMethod(
      'getLastUpdate',
      {
        accepts: {arg: 'profile', type: 'string', required: true},
        returns: {arg: 'datetime', type: 'string'},
        http: {path: '/getLastUpdate', verb: 'get'}
      }
    );
};
