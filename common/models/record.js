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
  // Remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  Record.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.reviewed = true;
      notification(ctx.instance.is_permitted, ctx.instance.run, ctx.instance.fullname, ctx.instance.blacklist);
      console.log("before save", ctx.instance);
      switch (ctx.instance.profile) {
        case "E": //Employee
          //nothing yet
          break;
        case "C": //Contractor
          // nothing yet
          break;
        case "V": //Visit
          ctx.instance.is_permitted=true;
          // Add visit on people.
          if (ctx.instance.run.length >= 5) { // && card !==0
            var People = app.models.People
            //ctx.instance.is_permitted = true;
            People.findOrCreate(
              {where: {run: ctx.instance.run}},
              {fullname: ctx.instance.fullname, run: ctx.instance.run,
               company: ctx.instance.company,
               profile: ctx.instance.profile},
              function(err, instance, created) {
                if (err) { console.log(err) }
                else if (created) console.log("New visit created".green, ctx.instance.fullname)
              }
            )
          }
          break;
        default:
          console.log(ctx.instance.fullname, "without profile".yellow);
          ctx.instance.profile = "V";
          console.log("Profile set to Visit", ctx.instance.fullname, "by default".green);
          break;
      }

      // Always set Online type when its diferent to MR.
      if (ctx.instance.type !== "MR") ctx.instance.type == "ON";

      // Update last input as output, add output_datetime send from android.
      if ( ctx.instance.is_input === false ) {
        /*
        Name never change to Employee or Contractor,
        and 1 person can register by his DNI card or Employee card.
        So must be finded by name.
        */
        if(ctx.instance.profile === "E" || ctx.instance.profile === "C"){
          findByName(ctx.instance)
          .then(id => saveOutput(id, ctx))
          .catch(err => catcher(err, ctx.instance))
        } else {
          // Its if a visit find by rut.
          findByRut(ctx.instance)
          .then(id => saveOutput(id, ctx))
          .catch(err => catcher(err, ctx.instance))
        }
      }
    }
    next();
  });

  function findByName(ctx) {
    return new Promise(function (resolve, reject) {
      Record.findOne(
        {where: {fullname: ctx.fullname},
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded != null) {
            // When register 2 output.
            if (recordFinded.output_datetime !== undefined && ctx.type !== "PEN") {
              resolve(0)
            } else { // Output after input.
              resolve(recordFinded.id, ctx)
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
      Record.findOne(
        { where: {run: ctx.run},
        order: 'id DESC'},
        function (err, recordFinded) {
          if (err) { reject(err) }
          if (recordFinded !== null) {
            // When register 2 output.
            if (recordFinded.output_datetime !== undefined) {
              resolve(0)
            } else { // Output after input.
              resolve(recordFinded.id, ctx)
            }
          } else {
            resolve(0)
          }
        }
      )}
    )
  }

  function saveOutput(id, ctx){
    return new Promise(function (resolve, reject) {
      if (id !== 0) {
        Record.updateAll(
          { id: id },
          { output_datetime: ctx.instance.output_datetime, is_input: false, state: "C" },
          function(err) {
            if (err) { reject(err) }
            else {
              resolve()
            }
          }
        )
      } else {
        // Double output an online record.
        reject(0)
      }
    })
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

  function catcher(err, ctx){
    if (err === 0) {
      // DO = Double output
      ctx.status = "DO"
    }
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

  function sendSlackMessage(run, fullname, message){
    slack = new Slack();
    slack.setWebhook("https://hooks.slack.com/services/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");
    slack.webhook({
      channel: "#multiexportfoods",
      username: "Multi-Boot",
      text: message,
      icon_emoji: ":robot_face:",
      attachments: [
        {
          "title": run + " - " + fullname,
          "color": "danger"
        }
      ]
    }, function(err, response) {});
  }

  function notification(is_permitted, run, fullname, blacklist) {
    if (is_permitted === false) sendSlackMessage(run, fullname, "Person dennied detected!.")
    if (blacklist === true) sendSlackMessage(run, fullname, "Person blacklist detected!.")
  }

  Record.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      console.log('after save', ctx.instance);
      if(ctx.instance.updating !== undefined && ctx.instance.updating !== ""){
        if(ctx.instance.profile === "V"){
            var People = app.models.People
            People.upsert(
            {fullname: ctx.instance.fullname,
             company: ctx.instance.company,
             run: ctx.instance.run,
             profile: ctx.instance.profile},
            function(err, instance, created) {
                  if (err) { console.log(err) }
                  else if (created) console.log("Visit Updated".green, ctx.instance.fullname)
               }
            )

        }
      }
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
  });

  // Closed of turn, mark as output (is_input=false) each record with more than 12 hours without output.
  Record.closedTurn = function(msg, cb) {
    console.log("cierre turno activado");
    var workday = 30 * 24 * 60 * 1000 // 12 Hours in milliseconds
    var date = new Date()
    var now = date.getTime()
    Record.updateAll(
      {and: [{input_datetime: {lt: now - workday}}, {output_datetime: undefined}]},
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
