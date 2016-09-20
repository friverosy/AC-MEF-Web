var colors = require('colors')
var Promise = require('bluebird')
var app = require('../../server/server')

module.exports = function(Record) {
  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  Record.observe('before save', function(ctx, next) {
    var People = app.models.People
    if (ctx.instance) {
      if (ctx.instance.input_datetime === undefined && ctx.instance.output_datetime === undefined) {
        // Online Record
        if ( ctx.instance.is_input === true ) {
          var date = new Date()
          ctx.instance.input_datetime = date.getTime()
        } else {
          findByName(ctx.instance)
          .then(id => saveOutput(id))
          .catch(err => console.log(err.message))
        }
      } else {
        // Offline record
      }

      switch (ctx.instance.profile) {
        case "E": //Employee
          //nothing yet
          break;
        case "C": //Contractor
          // nothing yet
          break;
        case "V": //Visit
          // ctx.instance.is_permitted = true;
          var Company = app.models.Company
          Company.findOrCreate(
            {where: {name: ctx.company}},
            {name: ctx.company, rut: ctx.company_code},
            function(err, instance, created) {
              if (err) { console.log(err) }
              else if (created) console.log("New Company created".green, ctx.location)
            }
          )
          break;
        default:
          console.log(ctx.instance.fullname, "without profile".yellow);
          ctx.instance.profile = "E";
          console.log("Profile set to Employee", ctx.instance.fullname, "by default".green);
          break;
      }
    }
    next();
  });

  function findByName(ctx) {
    return new Promise(function (resolve, reject) {
      //{ where: {and: [{ fullname: ctx.fullname}, { output_datetime: {neq: undefined} }] },
      Record.findOne(
        {where: {fullname: ctx.fullname},
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded != null) {
            console.log(recordFinded);
            resolve(recordFinded.id)
          } else {
            resolve(0)
          }
        }
      )}
    )
  }

  function saveOutput(id){
    return new Promise(function (resolve, reject) {
      console.log(id);
      if (id != 0) {
        var date = new Date()
        Record.updateAll(
          { id: id },
          { output_datetime: date.getTime(), is_input: false },
          function(err) {
            if (err) { reject(err) }
            else { resolve() }
          }
        )
      } else {
        //double output.
      }
    })
  }

  function deleteRecord(id){
    Record.destroyById(id, function(err){
      if (err) {
        console.log(err)
      }
    })
  }

  function updateFullname(run, newName) {
    var app = require('../../server/server')
    var People = app.models.People
    People.updateAll(
      { run: run },
      { fullname: newName },
      function(err, info) {
        if (err) { console.error(err) }
      }
    )
    Record.updateAll(
      { run: run},
      { fullname: newName },
      function(err, info) {
        if (err) { console.error(err) }
      }
    )
  }

  Record.observe('after save', function(ctx, next) {
    var socket = Record.app.io
    var app = require('../../server/server')
    var People = app.models.People

    if (ctx.instance) {
      if (ctx.instance.is_input === false && ctx.instance.updating === undefined) {
        deleteRecord(ctx.instance.id)
      }
    }
    next()
  })

  // Closed of turn, mark like a output (is_input=false) each record with more than 12 hours without output.
  Record.closedTurn = function(msg, cb) {
    var workday = 30 * 24 * 60 * 1000 //12 Hours in milliseconds
    var date = new Date()
    var now = date.getTime()
    Record.updateAll(
      {and: [{input_datetime: {lt: date - now}}, {output_datetime: undefined}]},
      {is_input: false, type: "CT"},
      function(err, info) {
        if (err) {
          console.log(err);
          cb(null, 500)
        } else {
          console.log(info);
          cb(null, 200);
        }
      }
    )
  }

  Record.remoteMethod(
    'closedTurn',
    {
      accepts: {arg: 'profile', type: 'string', required: false},
      returns: {arg: 'status', type: 'number'},
      http: {path: '/closedTurn', verb: 'get'}
    }
  );
};
