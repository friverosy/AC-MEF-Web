var app = require('../../server/server')

module.exports = function(People) {
    // remove the DELETE functionality from API
    People.disableRemoteMethod('deleteById', true);
    var Promise = require('bluebird');
    var fs = require('fs');

    // function destroyPeople(file) {
    //   return new Promise(function (resolve, reject) {
    //     var employee = "EMPLEADOS";
    //     var contractor = "SUBCONTRATISTAS";
    //     if (file.indexOf(employee) !== -1) {
    //       profile = "E"
    //     } else if (file.indexOf(contractor) !== -1) {
    //       profile = "C"
    //     } else {
    //       reject("File incorrect")
    //     }
    //     People.destroyAll({profile: profile}, function(err, info){
    //       if (err) {
    //         reject(err)
    //       } else {
    //         resolve(file)
    //       }
    //     })
    //   })
    // }
    //
    // function insertPerson(file) {
    //   return new Promise(function (resolve, reject) {
    //     var parseString = require('xml2js').parseString;
    //     var xml2js = require('xml2js');
    //     var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
    //
    //     var employee = "EMPLEADOS";
    //     var contractor = "SUBCONTRATISTAS";
    //     if (file.indexOf(employee) !== -1) {
    //       profile = "E"
    //     } else if (file.indexOf(contractor) !== -1) {
    //       profile = "C"
    //     }
    //
    //     fs.readFile(file, function (err, content) {
    //       if (err) {
    //         return reject(err)
    //       }
    //       parser.parseString(content, function (err, result) {
    //         try {
    //           var people = result.EMPLEADOS_MEF.EMPLEADO
    //         } catch (err) {
    //           var people = result.SUBCONTRATISTAS.SUBCONTRATISTA
    //         }
    //
    //         for (var i in people) {
    //           people[i].profile = profile;
    //           people[i].is_permitted = true;
    //           var place = people[i].location + '';
    //           if (profile === "E") {
    //             switch(parseInt(people[i].company_code)) {
    //               case 2:
    //                   upsertModel("Place", place, parseInt(people[i].company_code))
    //                   break;
    //               case 3:
    //                   upsertModel("Place", place, parseInt(people[i].company_code))
    //                   break;
    //               case 8:
    //                   upsertModel("Place", place, parseInt(people[i].company_code))
    //                   break;
    //             }
    //             upsertModel("Company", people[i].company, people[i].company_code)
    //           }
    //           People.create(people[i], function(err, obj) {
    //             if (err) {
    //               return reject(err)
    //             }
    //           })
    //         }
    //       })
    //       resolve()
    //     })
    //   })
    // }
    //
    // function upsertModel(model, name, rut){
    //   switch (model) {
    //     case "Company":
    //       var Company = app.models.Company
    //       Company.upsert(
    //         {name: name, rut: rut},
    //         function(err, instance, created) {
    //           if (err) console.log(err)
    //         }
    //       )
    //       break;
    //     case "Place":
    //       var Place = app.models.Place
    //       Place.findOrCreate(
    //         {where: {and: [{name: name},{companyId: rut}]}},
    //         {name: name, companyId: rut},
    //         function(err, instance, created) {
    //           if (err) console.log(err)
    //           console.log("instance",instance);
    //           console.log("created",created);
    //         }
    //       )
    //       break;
    //   }
    // }
    //
    // People.getFromXml = function(file, cb) {
    //   destroyPeople(file)
    //   .then(file => insertPerson(file))
    //   .catch(err => cb(null, err))
    //   cb(null, 201)
    // }
    //
    // People.remoteMethod(
    //   'getFromXml',
    //   {
    //     accepts: {arg: 'file', type: 'string', required: true},
    //     returns: {arg: 'status', type: 'string'},
    //     http: {path: '/updateDbFromXml', verb: 'get'}
    //   }
    // );
//


    People.getLastUpdate = function(profile, cb) {
      var parseString = require('xml2js').parseString;
      var xml2js = require('xml2js');
      var parser = new xml2js.Parser(xml2js.defaults["0.2"]);
      if (profile === "E") {
        // need to look for the newest file
        var xml = '/Users/cristtopher/Desktop/xmls/EMPLEADOS_20160926_104534.xml';
      } else if (profile === "C") {
        // need to look for the newest file
        var xml = '/Users/cristtopher/Desktop/xmls/SUBCONTRATISTAS_20160927_104142.xml';
      }

      fs.readFile(xml, function(err, data) {
        if (err) {
          console.log(err);
          cb(null, 404);
        } else {
          parser.parseString(data, function (err, result) {
            cb(null, JSON.stringify(result.EMPLEADOS_MEF.FECHA_ACTUALIZACION) );
          });
        }
      });
    }

    function readLastXml(){
      fs.readFile()
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
