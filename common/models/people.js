var app = require('../../server/server')

module.exports = function(People) {
    // remove the DELETE functionality from API
    People.disableRemoteMethod('deleteById', true);
    var Promise = require('bluebird');
    var fs = require('fs');

    function destroyPeople(profile) {
      return new Promise(function (resolve, reject) {
        People.destroyAll({profile: "E"}, function(err, info){
          if (err) {
            reject(err)
          } else {
            console.log("People destroyed ", info);
            resolve("E")
          }
        })
      })
    }

    function insertPerson(content) {
      return new Promise(function (resolve, reject) {
        var parseString = require('xml2js').parseString;
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser(xml2js.defaults["0.2"]);

        var profile = "E";
        if (profile === "E") {
          xml = __dirname + "/XML_EMPLEADOS.xml";
        } else if (profile === "C") {
          xml = __dirname + "/XML_SUBCONTRATISTAS.xml";
        }
        fs.readFile(xml, function (err, content) {
          if (err) {
            return reject(err)
          }
          parser.parseString(content, function (err, result) {
            for (var i in result.EMPLEADOS_MEF.EMPLEADO) {
              result.EMPLEADOS_MEF.EMPLEADO[i].profile = "E";
              result.EMPLEADOS_MEF.EMPLEADO[i].is_permitted = true;
              var location = result.EMPLEADOS_MEF.EMPLEADO[i].location + '';
              var plant = location.split("-");
              upsertModel("Destination", location, null)
              upsertModel("Company", result.EMPLEADOS_MEF.EMPLEADO[i].company, result.EMPLEADOS_MEF.EMPLEADO[i].company_code)
              upsertModel("ProcessPlant", plant[0], null)
              People.create(result.EMPLEADOS_MEF.EMPLEADO[i], function(err, obj) {
                if (err) {
                  return reject(err)
                }
              })
            }
          })
          resolve()
        })
      })
    }

    function upsertModel(model, name, rut){
      switch (model) {
        case "Company":
          var Company = app.models.Company
          Company.upsert(
            {name: name, rut: rut},
            function(err, instance, created) {
              if (err) console.log(err)
            }
          )
          break;
        case "Destination":
          var Destination = app.models.Destination
          Destination.upsert(
            {name: name},
            function(err, instance, created) {
              if (err) console.log(err)
            }
          )
          break;
        case "ProcessPlant":
          var ProcessPlant = app.models.ProcessPlant
          ProcessPlant.upsert(
            {name: name},
            function(err, instance, created) {
              if (err) reject(err)
            }
          )
          break;
      }
    }

    People.getFromXml = function(cb) {
      destroyPeople()
      .then(profile => insertPerson(profile))
      .catch(err => cb(null, err))
      cb(null, 201)
    }

    People.remoteMethod(
      'getFromXml',
      {
        returns: {arg: 'status', type: 'string'},
        http: {path: '/updateDbFromXml', verb: 'get'}
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
        returns: {arg: 'datetime', type: 'string'},
        http: {path: '/getLastUpdate', verb: 'get'}
      }
    );
};
