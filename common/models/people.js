module.exports = function(People) {
    // remove the DELETE functionality from API
    People.disableRemoteMethod('deleteById', true);
    var Promise = require('bluebird');

    People.getFromXml = function(profile, cb) {
      var fs = require('fs')
      var parseString = require('xml2js').parseString;
      var xml2js = require('xml2js');
      var parser = new xml2js.Parser(xml2js.defaults["0.2"]);

      fs.readFile(__dirname + '/XML_EMPLEADOS.xml', function(err, data) {
        if (err) {
          console.log(new Date(), "Archivo XML_EMPLEADOS no econtrado");
        } else {
          parser.parseString(data, function (err, result) {
            for (var i in result.EMPLEADOS_MEF.EMPLEADO) {
              result.EMPLEADOS_MEF.EMPLEADO[i].profile = "E";
              result.EMPLEADOS_MEF.EMPLEADO[i].is_permitted = true;
              destroyPeople(profile)
              .then(content => upsertPeople(result.EMPLEADOS_MEF.EMPLEADO[i]))
              .catch(err => console.log(err.message))
              //dell
              //upsert
            };
            // updatePeople(profile, result.EMPLEADOS_MEF.EMPLEADO);
            cb(null, 201);
          });
        }
      });
    }

    function destroyPeople(profile) {
      People.destroyAll({profile: profile}, function(err, info, cnt){
        if(err) console.log(err);
        else {
          console.log(info);
          console.log(cnt);
          return Promise.resolve(info);
        }
      })
    }

    function upsertPeople(person){
      People.upsert(person, function(err, obj) {
        if (err) { console.log(new Date(), err) }
      });
    }

    function updatePeople(profile, xml){
      People.find({where: {profile: profile}}, function(err, people) {
        for (var p in people) {
          console.log(xml.indexOf(people[p].run));
          // if (xml.indexOf(people[p].run) === -1) {
          //   console.log("ya existe ", people[p].run);
          // } else if (xml.indexOf(people[p].run) > -1){
          //   console.log("eliminar ", people[p].run);
          // }
        }
      });

      // People.find({where: {profile: profile}}, function(err, people) {
        //
      //   for (var p in people) {
      //     for (var x in xml) {
      //       var finded;
      //       // console.log(xml[x].run + " -> " + people[p].run);
      //       if (xml[x].run == people[p].run)
      //         finded = true;
      //       else {
      //         finded = false;
      //       }
      //       console.log(finded);
      //       if (finded == false) {
      //         //console.log("eliminar ", people[p].run);
      //         People.destroyById(people[p].run, function(err){
      //           if(err) console.log(err);
      //           else {
      //             console.log("eliminada!");
      //           }
      //         })
      //       }
      //     }
      //   }
      //   console.log("done");
      // })
    }

    People.remoteMethod(
      'getFromXml',
      {
        accepts: {arg: 'profile', type: 'string', required: true},
        returns: {arg: 'status', type: 'string'}
      }
    );

    People.getLastUpdate = function(profile, cb) {
      var fs = require('fs')
      var parseString = require('xml2js').parseString;
      var xml2js = require('xml2js');
      var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
      if (profile === "E") {
        var xml = __dirname + '/XML_EMPLEADOS.xml';
      } else if (profile === "C") {
        var xml = __dirname + '/XML_SUBCONTRATISTAS.xml';
      }

      fs.readFile(xml, function(err, data) {
        if (err) {
          console.log(err);
          cb(null, 404);
        } else {
          parser.parseString(data, function (err, result) {
            cb(null, JSON.stringify(result.EMPLEADOS_MEF.$.FECHA_ACTUALIZACION));
          });
        }
      });
    }

    People.remoteMethod(
      'getLastUpdate',
      {
        accepts: {arg: 'profile', type: 'string', required: true},
        returns: {arg: 'datetime', type: 'string'}
      }
    );
};
