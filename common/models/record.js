module.exports = function(Record) {
  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  var colors = require('colors');

  Record.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      if(ctx.instance.is_input == true){
        ctx.instance.input_datetime = new Date();
      }else{
        Record.findOne({
          where: { fullname: ctx.instance.fullname }, order: 'id DESC'},{limit: 1},
          function (err, records) {
            if (err) {
              throw err;
              console.error(new Date(), "Error line 17", err);
            } else {
              try {
                Record.updateAll({ id: records.id }, { output_datetime: new Date(), is_input: false }, null);
              } catch (err) {
                // First record of this person.
                console.log(new Date(), "First record of", ctx.instance.fullname);
                ctx.instance.owi = true; //output without input
              }
            }
          }
        );
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
          break;
        default:
          console.log(ctx.instance.fullname, "without profile".yellow);
          ctx.instance.profile = "E";
          console.log("Profile set to Employee", ctx.instance.fullname, "by default".green);
          break;
      }
    } else {
      // Updating
      ctx.data.updating = new Date();
    }
    next();
  });

Record.observe('after save', function(ctx, next) {
    var socket = Record.app.io;
    var app = require('../../server/server');
    var People = app.models.People;

    if (ctx.instance) {
      // add visit if is new
      if (ctx.instance.profile === "V") {
        People.findOrCreate(
        {
          where: { run: ctx.instance.people_run } },
        {
          run: ctx.instance.people_run,
          fullname: ctx.instance.fullname.toUpperCase(),
          create_at: new Date()
        },
        function (error, instance, created) {
          if (error){
            console.log(new date(), "Error line 70:",error);
          }
          if (created) {
            //instance.profileId = 2; // ? where put that...???
            People.updateAll({ run: instance.run }, { profile: ctx.instance.profile, company: ctx.instance.company }, function(err, info) {
              if (err) {
                console.error(err);
              }
            });
          } else { // Already existed.
            try {
              // Update fullname if is different.
              if (ctx.instance.fullname !== instance.fullname){
                Record.updateAll({ people_run: ctx.instance.people_run }, { fullname: ctx.instance.fullname }, function(err, info) {
                  if (err) {
                    console.error(err);
                  }else{
                    console.log(new Date(), "fullname updated, "+instance.fullname+" to "+ctx.instance.fullname+"".green);
                  }
                });
              }
            } catch (err) {
              throw err;
              console.error(new date(), "Error line 93" + err);
            }
          }
        });
      }

      if (ctx.instance.input_datetime === undefined && ctx.instance.output_datetime === undefined){
        if( ctx.instance.is_input === false && ctx.instance.input_datetime === undefined &&     ctx.instance.owi === true){
          Record.updateAll({ id: ctx.instance.id }, { output_datetime: new Date(), is_input: false, input_datetime: false }, null);
        }else{
            Record.destroyById(ctx.instance.id, null);
        }
      }

      var today = new Date();

      // set input or output
      if (ctx.instance.updating !== undefined){
        ///try to optimize!!
        if (ctx.instance.company !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { company: ctx.instance.company }, null);
          People.updateAll({ run: ctx.instance.people_run }, { company: ctx.instance.company }, null);
        } else if (ctx.instance.reason !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { reason: ctx.instance.reason }, null);
        } else if (ctx.instance.destination !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { destination: ctx.instance.destination }, null);
        } else if (ctx.instance.input_patent !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { input_patent: ctx.instance.input_patent }, null);
        } else if (ctx.instance.output_patent !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { output_patent: ctx.instance.output_patent }, null);
        } else if (ctx.instance.authorized_by !== undefined){
          Record.updateAll({ id: ctx.instance.id }, { authorized_by: ctx.instance.authorized_by }, null);
        } else if (ctx.instance.fullname !== undefined){
          Record.updateAll({ people_run: ctx.instance.people_run }, { fullname: ctx.instance.fullname }, null);
          People.updateAll({ run: ctx.instance.people_run }, { fullname: ctx.instance.fullname }, null);
        } else {
          Record.updateAll({ id: ctx.instance.id }, { comment: ctx.instance.comment }, null);
        }
      }
    }
    next();
  });
};
