/* TYPE:
ON = Online,
OFF = Offline,
PDA = Online,
MR = Manual Record,
CT = Closed of turn,
PEN = from pendings view, manual record with input & output datetime

State:
DO = Double Output,

Reviewed:
false = showable on manuals view to mark as reviewed
true = dont showable on manuals view (admin mark as reviewed)
*/

var colors = require('colors');
var Promise = require('bluebird');
var app = require('../../server/server');
var Slack = require('slack-node');

module.exports = function(Record) {
  // Remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  Record.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      ctx.instance.reviewed = true;
      notification(ctx.instance.is_permitted,
        ctx.instance.run, ctx.instance.fullname, ctx.instance.blacklist);
      //console.log('before save', ctx.instance);
      switch (ctx.instance.profile) {
        case 'E': //Employee
          //nothing yet
          break;
        case 'C': //Contractor
          // nothing yet
          break;
        case 'V': //Visit
          // Add visit on people.
          if (ctx.instance.run.length <= 5) {
           /* This person its an employee
           who was registered as a visit
           because it was not found in the database of employees */
            ctx.instane.profile = 'E';
            ctx.instane.is_permitted = false;
          }
          break;
        default:
          //console.log(ctx.instance.fullname, 'without profile'.yellow);
          ctx.instance.profile = 'V';
          break;
      }

      // Always set Online type when its diferent to MR.
      //if (ctx.instance.type !== 'MR') ctx.instance.type = 'ON';

      // Update last input as output, add output_datetime send from android.
      if ( ctx.instance.is_input === false ) {
        findByRut(ctx.instance)
        .then(id => saveOutput(id, ctx.instance))
        .catch(err => catcher(err, ctx.instance));
      }
    }
    next();
  });

  function findByRut(ctx) {
    return new Promise(function (resolve, reject) {
      Record.findOne({
        order: 'input_datetime DESC'},{
          where: {
            run: ctx.run, is_input: true
          }
      },
      function (err, recordFinded) {
        if (err) { reject(err); }
        if (recordFinded !== null) {
          // When register 2 output.
          if (recordFinded.output_datetime !== undefined) {
            resolve(0);
          } else { // Output after input.
            resolve(recordFinded.id, ctx);
          }
        } else {
          resolve(0);
        }
      });}
    );
  }

  function saveOutput(id, ctx){
    console.log('saveOutput',id);
    return new Promise(function (resolve, reject) {
      if (id !== 0) {
        Record.updateAll(
          { id: id },
          { output_datetime: ctx.output_datetime, is_input: false },
          function(err) {
            if (err) { reject(err); }
            else {
              resolve();
            }
          }
        );
      } else {
        // Double output an online record.
        reject(0);
      }
    });
  }

  function catcher(err, ctx){
    if (err === 0) {
      // DO = Double output
      ctx.status = 'DO';
    }
  }

  function onBlacklist(ctx) {
    return new Promise(function (resolve, reject) {
      var Blacklist = app.models.Blacklist;
      //console.log(ctx.run, ctx.card);
      Blacklist.findOne({
        where: {
          run: ctx.run
        }
      },
      function (err, recordFinded) {
        if (err) { reject(err); }
        if (recordFinded !== null) {
          //console.log('persona encontrada en la lista negra', ctx.fullname);
          resolve(ctx.id);
        } else {
          resolve(0);
        }
      });}
    );
  }

  function setBlacklist(id) {
    return new Promise(function (resolve, reject) {
      if (id !== 0) {
        Record.updateAll(
          { id: id },
          { blacklist: true },
          function(err) {
            if (err) { reject(err); }
            else { resolve(); }
          }
        );
      }
    });
  }

  function deleteRecord(id){
    Record.destroyById(id, function(err){
      if (err) {
        console.log(err);
      }
    });
  }

  function updateFullname(run, newName) {
    var People = app.models.People;
    People.updateAll(
      { run: run },
      { fullname: newName },
      function(err, info) {
        if (err) { console.error(err); }
      }
    );
    Record.updateAll(
      { run: run},
      { fullname: newName },
      function(err, info) {
        if (err) { console.error(err); }
      }
    );
  }

  function sendSlackMessage(run, fullname, message){
    var slack = new Slack();
    slack.setWebhook('https://hooks.slack.com/services/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');
    slack.webhook({
      channel: '#multiexportfoods',
      username: 'Multi-Boot',
      text: message,
      icon_emoji: ':robot_face:',
      attachments: [
        {
          'title': run + ' - ' + fullname,
          'color': 'danger'
        }
      ]
    }, function(err, response) {});
  }

  function notification(is_permitted, run, fullname, blacklist) {
    if (is_permitted === false)
      sendSlackMessage(run, fullname, 'Person dennied detected!.');
    if (blacklist === true)
      sendSlackMessage(run, fullname, 'Person blacklist detected!.');
  }

  Record.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      if(ctx.instance.updating !== undefined || ctx.instance.updating !== ''){
        if(ctx.instance.profile === 'V'){
            var People = app.models.People;
            People.upsertWithWhere(
            { run: ctx.instance.run },
            { fullname: ctx.instance.fullname,
             company: ctx.instance.company,
             run: ctx.instance.run,
             is_permitted: true,
             profile: ctx.instance.profile },
            function(err, model) {
                  if (err) { console.log(err); }
                  else if (model) console.log('Visit Updated'.green, model);
               }
            );
        }
      }
      
      if (ctx.instance.input_datetime === undefined &&
        ctx.instance.is_input === false &&
        ctx.instance.updating === undefined) {
        if (ctx.instance.status === 'DO') {
          saveOutput(ctx.instance.id, ctx.instance);
        } else {
          deleteRecord(ctx.instance.id);
        }
      } else {
        //console.log(ctx.instance.is_input);
        onBlacklist(ctx.instance)
        .then(id => setBlacklist(id))
        .catch(err => console.log('Error onBlacklist', err));
      }
    }
    next();
  });

  // Closed of turn, mark as output (is_input=false)
  // each record with more than 12 hours without output.
  Record.closedTurn = function(msg, cb) {
    //console.log('cierre turno activado');
    var workday = 30 * 24 * 60 * 1000; // 12 Hours in milliseconds
    var date = new Date();
    var now = date.getTime();
    Record.updateAll(
      {and: [
        {input_datetime: {lt: now - workday}},
        {output_datetime: undefined}
      ]},
      {is_input: false, type: 'CT'},
      function(err, info) {
        if (err) {
          console.log(err);
          cb(null, 500);
        } else {
          console.log(info);
          cb(null, 200);
        }
      }
    );
  };

  Record.remoteMethod(
    'closedTurn',
    {
      accepts: {arg: 'profile', type: 'string', required: false},
      returns: {arg: 'status', type: 'number'},
      http: {path: '/closedTurn', verb: 'get'}
    }
  );
};
