/* TYPE:
ON = Online,
OFF = Offline,
MR = Manual Record,
CT = Closed of turn,
PEN = from pendings view, manual record with input & output datetime

State:
DO = Double Output,
C = Closed (with input, output datetime, and is_input = false)

Reviewed:
true = showable on manualRecords view
false = dont showable on manualRecords view (admin mark as reviewed)
*/

var colors = require('colors')
var Promise = require('bluebird')
var app = require('../../server/server')
var Slack = require('slack-node');

module.exports = function(Record) {
  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  Record.observe('before save', function(ctx, next) {
    var People = app.models.People
    if (ctx.instance) {
      ctx.instance.reviewed = true;
      if (ctx.instance.is_permitted === false) {
        slack = new Slack();
        slack.setWebhook("https://hooks.slack.com/services/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");
        slack.webhook({
          channel: "#multiexportfoods",
          username: "Multi-Boot",
          text: "Person dennied detected!.",
          icon_emoji: ":robot_face:",
          attachments: [
            {
                "title": ctx.instance.run + " - " + ctx.instance.fullname,
                "color": "danger"
            }
          ]
        }, function(err, response) {});
      }
      if (ctx.instance.input_datetime === undefined && ctx.instance.output_datetime === undefined) {
        // Online Record
        if (ctx.instance.type === undefined) {
            ctx.instance.type = "ON"
        }
        if ( ctx.instance.is_input === true ) {
          ctx.instance.input_datetime = new Date()
        } else {
          if(ctx.instance.profile === "E" || ctx.instance.profile === "C"){
            findByName(ctx.instance)
            .then(id => saveOutput(id))
            .catch(err => catcher(err, ctx.instance))
          }else {
            findByRut(ctx.instance)
            .then(id => saveOutput(id))
            .catch(err => catcher(err, ctx.instance))
          }
        }
      } else {
        // Offline record
        ctx.instance.type = "OFF"
      }

      switch (ctx.instance.profile) {
        case "E": //Employee
          //nothing yet
          break;
        case "C": //Contractor
          // nothing yet
          break;
        case "V": //Visit
          // if register employee as visit.
          if (ctx.instance.run.length <= 5) { // && card !== 0
            ctx.instance.profile = "E"
          } else {
            ctx.instance.is_permitted = true;
            var Company = app.models.Company
            Company.findOrCreate(
              {where: {name: ctx.company}},
              {name: ctx.company, rut: ctx.company_code},
              function(err, instance, created) {
                if (err) { console.log(err) }
                else if (created) console.log("New Company created".green, ctx.company)
              }
            )
          }
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

  function catcher(err, ctx){
    if (err === 0) {
      // DO = Double output
      ctx.status = "DO"
    }
  }

  function onBlacklist(ctx) {
    return new Promise(function (resolve, reject) {
      var Blacklist = app.models.Blacklist
      Blacklist.findOne(
        { where: {or: [{ run: ctx.run}, { card: ctx.card }] },
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded != null) {
            resolve(ctx.id)
          } else {
            resolve(0)
          }
        }
      )}
    )
  }

  function findByName(ctx) {
    return new Promise(function (resolve, reject) {
      //{ where: {and: [{ fullname: ctx.fullname}, { output_datetime: {neq: undefined} }] },
      Record.findOne(
        {where: {fullname: ctx.fullname},
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded != null) {
            // when register 2 output
            if (recordFinded.output_datetime !== undefined && ctx.type !== "PEN") {
              resolve(0)
            } else { // output after input
              resolve(recordFinded.id)
            }
          } else {
            resolve(0)
          }
        }
      )}
    )
  }

  function findByRut(ctx) {
    return new Promise(function (resolve, reject) {
      //{ where: {and: [{ fullname: ctx.fullname}, { output_datetime: {neq: undefined} }] },
      Record.findOne(
        {where: {rut: ctx.rut},
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded != null) {
            // when register 2 output
            if (recordFinded.output_datetime !== undefined) {
              resolve(0)
            } else { // output after input
              resolve(recordFinded.id)
            }
          } else {
            resolve(0)
          }
        }
      )}
    )
  }

  function setBlacklist(id) {
    return new Promise(function (resolve, reject) {
      if (id !== 0) {
        Record.updateAll(
          { id: id },
          { blacklist: true },
          function(err) {
            if (err) { reject(err) }
            else { resolve() }
          }
        )
      }
    })
  }

  function saveOutput(id){
    return new Promise(function (resolve, reject) {
      if (id !== 0) {
        Record.updateAll(
          { id: id },
          { output_datetime: new Date(), is_input: false, state: "C" },
          function(err) {
            if (err) { reject(err) }
            else {
              resolve()
            }
          }
        )
      } else {
        //double output an online record
        reject(0)
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
    var People = app.models.People

    if (ctx.instance) {
      if (ctx.instance.input_datetime === undefined && ctx.instance.is_input === false && ctx.instance.updating === undefined) {
        if(ctx.instance.status === "DO") { saveOutput(ctx.instance.id) }
        else { deleteRecord(ctx.instance.id) }
      } else {
        onBlacklist(ctx.instance)
        .then(id => setBlacklist(id))
        .catch(err => console.log("Error onBlacklist", err))
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
