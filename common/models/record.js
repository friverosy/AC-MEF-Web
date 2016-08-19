var pubsub = require('../../server/pubsub.js');
var loopback = require('loopback');
module.exports = function(Record) {
  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  var colors = require('colors');
  var Promise = require('bluebird');
  var app = require('../../server/server');
  var io = app.io;

  Record.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      switch (ctx.instance.profile) {
        case "E": //Employee
        //nothing yet
        break;
        case "C": //Contractorn
        //nothing yet
        break;
        case "V": //Visit
        //nothing yet
        break;
        default:
        ctx.instance.profile = "E";
        break;
      };
    }
    next();
  });

  function updateName(old, newOne, profile, rut){
    var app = require('../../server/server');
    // var People = app.models.People;
    if (old !== newOne){
      try {
        Record.updateAll({ people_run:  rut }, { fullname: newOne }, null);
        if ( profile === "V" ) People.updateAll({ run:  rut }, { fullname: newOne }, null);
      } catch (err) {
        console.log("error updating visit fullname at "+new Date()+": " + err);
      }
    }
  }

  function setInOrOut(name, id, profile, rut, updating) {
    return new Promise(function (resolve, reject) {
      var app = require('../../server/server');
      var People = app.models.People;

      if (profile === "E") {
        Record.findOne({
          where: { and: [{fullname: name}, {id: {lt: id}}]}, order: 'id DESC'},
          function (err, records) {
            var is_input = "";
            if (err) {
              return reject(err)
            }
            try {
              if(updating === undefined){
                // get input or output
                if (records.input_datetime !== undefined && records.output_datetime !== undefined){
                  // console.log("already has input and output");
                  Record.updateAll({ id:  id }, { input_datetime: new Date(), is_input: true }, null);
                  is_input = true;
                } else if (records.input_datetime !== undefined && records.output_datetime === undefined){
                  // console.log("has input without output");
                  is_input = false;
                  Record.updateAll({ id: records.id }, { output_datetime: new Date(), is_input: false }, null);
                  Record.destroyById(id, null);
                } else if (records.input_datetime === undefined && records.output_datetime !== undefined){
                  // console.log("has output without input");
                  is_input = true;
                } else if (records.input_datetime === undefined && records.output_datetime === undefined){
                  // console.error("no intput and output".red);
                  is_input = true;
                  Record.updateAll({ id: id }, { input_datetime: new Date(), is_input: true }, null);
                }
              }
            } catch (err) {
              // First record of this person.
              is_input = true;
              console.log("First employee record".green);
              console.log(err);
              Record.updateAll({ id:  id }, { input_datetime: new Date(), is_input: true }, null);
            }
            resolve(is_input)
          }
        )
      } else if (profile === "V") {
        Record.findOne({
          where: { and: [{people_run: rut}, {id: {lt: id}}]}, order: 'id DESC'},
          function (err, records) {
            var is_input = "";
            if (err) {
              return reject(err)
            }
            try {
              // get input or output
              if (records.input_datetime !== undefined && records.output_datetime !== undefined && updating === undefined){
                // console.log("already has input and output");
                Record.updateAll({ id:  id }, { input_datetime: new Date(), is_input: true }, null);
                is_input = true;
              } else if (records.input_datetime !== undefined && records.output_datetime === undefined && updating === undefined){
                // console.log("has input without output");
                is_input = false;
                Record.updateAll({ id: records.id }, { output_datetime: new Date(), is_input: false }, null);
                Record.destroyById(id, null);
              } else if (records.input_datetime === undefined && records.output_datetime !== undefined && updating === undefined){
                // console.log("has output without input");
                is_input = true;
              } else if (records.input_datetime === undefined && records.output_datetime === undefined && updating === undefined){
                // console.error("no intput and output".red);
                is_input = true;
                Record.updateAll({ id: id }, { input_datetime: new Date(), is_input: true }, null);
              } else if (updating === undefined) {
                //Aca cuando actualizo desde angular el nombre de la visita le cambia la fecha de entrada.
                updateName(records.fullname, name, "V", rut);
              }
            } catch (err) {
              // updateName(records.fullname, name, "V", rut);

              // First record of this person.
              // console.log(records);
              is_input = true;
              console.log("First visit record".green);
              Record.updateAll({ id:  id }, { input_datetime: new Date(), is_input: true }, null);
            }
            resolve(is_input)
          }
        )
      }
    })
  }

  function updateRecord(instance, is_input) {
    return new Promise(function (resolve, reject) {
      var app = require('../../server/server');
      var People = app.models.People;

      if (instance.profile === "V") {
        People.findOrCreate(
          {
            where: { run: instance.people_run } },
            {
              run: instance.people_run,
              fullname: instance.fullname.toUpperCase(),
              create_at: new Date()
            },
            function (error, instance2, created) {
              if (error) {
                throw error;
                console.log("152 ",error);
              }
              if (created) {
                People.updateAll({ run: instance2.run }, { profile: instance.profile, company: instance.company }, function(err, info) {
                  if (err) {
                    console.error(err);
                  }
                });
              } else { // Already existed.
                // try { // Update fullname if is different.
                //   if (instance.fullname !== instance2.fullname){
                //     Record.updateAll({ people_run: instance.people_run }, { fullname: instance2.fullname }, function(err, info) {
                //       if (err) {
                //         console.error(err);
                //       }
                //     });
                //   }
                // } catch (err) {
                //   throw err;
                //   console.error("115 " + err);
                // }
              }
              socket.emit('record created', record);
              next();
        });
      }
    })
  }

  Record.observe('after save', function(ctx, record, next) {
    var io = Record.app.io;
    if (ctx.instance) {
      setInOrOut(ctx.instance.fullname, ctx.instance.id, ctx.instance.profile, ctx.instance.people_run, ctx.instance.updating)
      .then(content => updateRecord(ctx.instance, content, next)) //content its: is_input
      .catch(err => console.log('Error on the promises: ' + err.message))
    }
  });
};
