module.exports = function(Record) {
  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  var colors = require('colors');
  var Promise = require('bluebird');

  Record.observe('before save', function(ctx, next) {
    if (ctx.instance) {
      // find last one
      Record.findOne({
        where: { fullname: ctx.instance.fullname }, order: 'id DESC'},
        function (err, records) {
          if (err) {
            throw err;
            console.error("line 16", err);
          } else {
            try {
              var id = records.id;
              // Update fullname
              if (ctx.instance.fullname !== records.fullname){
                ctx.instance.fullname = records.fullname;
              }
              // get input or output
              if(records.input_datetime !== undefined && records.output_datetime !== undefined){
                // console.log("already has input and output");
                ctx.instance.is_input = true;
              } else if (records.input_datetime !== undefined && records.output_datetime === undefined){
                // console.log("has input without output");
                ctx.instance.is_input = false;
                ctx.instance.id_finded = id;
              } else if (records.input_datetime === undefined && records.output_datetime !== undefined){
                // console.log("has output without input");
                ctx.instance.is_input = true;
              } else if (records.input_datetime === undefined && records.output_datetime === undefined){
                // console.error("no intput and output".red);
                ctx.instance.is_input = true;
              }
            } catch (err) {
              // First record of this person.
              ctx.instance.is_input = true;
              console.log("First record".green);
            }
          }
        }
      );
      switch (ctx.instance.profile) {
        case "E": //Employee
          //nothing yet
          console.log("Is Employee");
          break;
        case "C": //Contractor
          //nothing yet
          console.log("Is Comtractor");
          break;
        case "V": //Visit
          console.log("Is Visit");
          break;
        default:
          console.log("without profile".yellow);
          ctx.instance.profile = "E";
          console.log("Profile set to Employee by default".green);
          break;
      };
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
            throw error;
            console.log("88 ",error);
          }
          if (created) {
            //instance.profileId = 2; // ? where put that...???
            console.log("new ".green, ctx.instance.profile," created".green);
            People.updateAll({ run: instance.run }, { profile: ctx.instance.profile, company: ctx.instance.company }, function(err, info) {
              if (err) {
                console.error(err);
              }
            });
          } else { // Already existed.
            try { // Update fullname if is different.
              if (ctx.instance.fullname !== instance.fullname){
                Record.updateAll({ people_run: ctx.instance.people_run }, { fullname: instance.fullname }, function(err, info) {
                  if (err) {
                    console.error(err);
                  }
                });
              }
            } catch (err) {
              throw err;
              console.error("92" + err);
            }
          }
        });
      }

      // Get fullname and company from last record, if are diferent update it.
      // Check with instance.updating part, what happens if updated some doc?
      // People.findOne({
      //   where: { run: ctx.instance.people_run },
      //   order: 'id DESC'},
      //   function (err, people) {
      //     if (err){
      //       throw err;
      //       console.log("line 127 ", err);
      //     } else {
//             try{
//               if (people.fullname !== ctx.instance.fullname){
// //check
//                 console.log("actualizando nombre en records de ", ctx.instance.people_run, " hacia el nombre de ", people.fullname);
//                 Record.updateAll( { people_run: ctx.instance.people_run }, { fullname: ctx.instance.fullname },
//                   function(err, info) {
//                     if (err) {
//                       console.error(err);
//                     }
//                   });
//               }
//
//               // Record.find({
//               //   where: {
//               //     people_run: ctx.instance.people_run
//               //   },
//               //   limit: 1,
//               //   order: 'id DESC'},
//               //   function(err, record) {
//               //     console.log(record.company); //undefined ... why!!!!
//               //     if(err) console.log(err);
//               //     else {
//               //       Record.updateAll({ id: ctx.instance.id },
//               //         { company: record.company }, null);
//               //     }
//               //   }
//               // );
//             }
//             catch(err){ // first record of this visit
//               console.log("first record of this visit ", err);
//             }
      //     }
      //   }
      // );

      var today = new Date();

      // set input or output
      if (ctx.instance.is_input && ctx.instance.is_permitted && ctx.instance.updating === undefined){
        console.log("Insert input "+ new Date());
        Record.updateAll({ id: ctx.instance.id },
          { input_datetime: new Date(), is_input: true }, null);
      } else if (ctx.instance.is_input && ctx.instance.is_permitted === false && ctx.instance.updating === undefined){
        console.log("Insert input dennied "+ new Date());
        Record.updateAll({ id: ctx.instance.id },
          { input_datetime: new Date(), is_input: true }, null);
      } else if (ctx.instance.is_input === false && ctx.instance.updating === undefined){
        console.log("Insert output "+ new Date());
        if (ctx.instance.id_finded !== undefined){
          Record.updateAll({ id: ctx.instance.id_finded },
            { output_datetime: new Date(), is_input: false }, null);
          // console.log("--- Updated id: " + ctx.instance.id_finded);
          Record.destroyById(ctx.instance.id, null);
          // console.log("--- Deleted id: " + ctx.instance.id);
        }
      } else if (ctx.instance.is_input === false && ctx.instance.id_finded === undefined && ctx.instance.updating === undefined && ctx.instance.is_permitted){
        console.log("Insert input (fixed) "+ new Date());
        Record.updateAll({ id: ctx.instance.id }, { input_datetime: new Date(), is_input: true }, null);
        // console.log("--- Updated id (fixed): " + ctx.instance.id);
      } else if (ctx.instance.is_input === false && ctx.instance.id_finded === undefined && ctx.instance.updating === undefined && ctx.instance.is_permitted){
        console.log("Insert input dennnied (fixed) "+ new Date());
        Record.updateAll({ id: ctx.instance.id }, { input_datetime: new Date(), is_input: true }, null);
      } else if (ctx.instance.updating !== undefined){
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
      } else {
        console.error("ERR 231".red);
      }
      console.log(ctx.instance);
    }
    next();
    console.log("------fdgfg----------");
  });
};
