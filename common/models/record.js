var pubsub = require("../../server/pubsub.js");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/AccessControl2'


var updateSalidaSinEntrada = function(db, ctx, callback) {
   db.collection('record').updateOne(
      { 
        "peopleId" : ctx.instance.peopleId, 
        "input_datetime" : { $exists : false }, 
        "is_input": false 
      },
      {
        $set: { 
                "input_datetime": ctx.instance.output_datetime, 
                "is_input" : true, 
              },
        $unset : {"output_datetime" : ""}
      }, function(err, results) {
        if(err){
          console.log("Consulta Record updateSalidaSinEntrada: error ", err);
        }else{
          
        }
   });
};

module.exports = function(Record) {

  // remove DELETE functionality from API
  Record.disableRemoteMethod('deleteById', true);

  var colors = require('colors');

  Record.observe('before save', function(ctx, next) {

    console.log("Before save record");
    

    var app = require('../../server/server');
    var People = app.models.People;
    
    if (ctx.instance) {

      //Si es entrada ...
      if(ctx.instance.is_input == true){

        //Set-up objeto base
        //ctx.instance.output_datetime = "";

        //Si no estadefinida la fecha de entrada, se define la actual
        if(typeof ctx.instance.input_datetime == "undefined"){
          ctx.instance.input_datetime = Date();
        }
        
      }
      //Si es salida...
      else{
        //ctx.instance.input_datetime = ""
      }

      /*
      console.log(ctx.instance);

      if(ctx.instance.is_input === true){
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
                console.log(records);
                Record.updateAll({ id: records.id }, { output_datetime: new Date(), is_input: false }, null);
              } catch (err) {
                // First record of this person.
                console.log(new Date(), "First record of", ctx.instance.fullname);
                ctx.instance.owi = true; //output without input
              }
            }
          }
        );


        if(ctx.instance.profile === "V"){
          Record.findOne({
            where: { peopleId : ctx.instance.peopleId }, order: 'id DESC'}, {limit: 1},
            function (err, records) {
              if (err) {
                throw err;
                console.error(new Date(), "Error line 17", err);
              } else {
                try {
                  console.log("salida de:",records.id);
                  Record.updateAll({ id: records.id }, { output_datetime: new Date(), is_input: false }, null);
                } catch (err) {
                  // First record of this person.
                  console.log(err);
                  console.log(new Date(), "First record of", ctx.instance.fullname);
                  ctx.instance.owi = true; //output without input
                }
              }
            }
          );
        }
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
      */
    } else {
      // Updating
      console.log("ctx.data");
      ctx.data.updating = new Date();

      //Si es entrada ...
      if(ctx.data.is_input == true){

        //Set-up objeto base
        //ctx.instance.output_datetime = "";

        //Si no estadefinida la fecha de entrada, se define la actual
        if(typeof ctx.data.input_datetime == "undefined"){
          ctx.data.input_datetime = Date();
        }
        
      }
      //Si es salida...
      else{
        //ctx.instance.input_datetime = ""
      }
    }
    
    next();
  });

Record.observe('after save', function(ctx, next) {

    console.log("After save record");

    var socket = Record.app.io;
    var app = require('../../server/server');
    var People = app.models.People;


    if (ctx.instance) {   

      // add visit if is new
      if (ctx.instance.profile === "V") {
        People.findOrCreate(
        {
          where: { run: ctx.instance.peopleId } },
        {
          run: ctx.instance.peopleId,
          fullname: ctx.instance.fullname.toUpperCase(),
          create_at: new Date()
        },
        function (error, instance, created) {
          if (error){
            console.log(new date(), "Error line 70:",error);
          }
          if (created) {
            //instance.profileId = 2; // ? where put that...???
            People.updateAll({ run: instance.run }, { profile: ctx.instance.profile, company: ctx.instance.company, comment: ctx.instance.comment }, function(err, info) {
              if (err) {
                console.error(err);
              }
            });
          } else { // Already existed.
            try {
              // Update fullname if is different, considers the name of the people table
              if (ctx.instance.fullname !== instance.fullname && ctx.instance.updating === undefined && ctx.instance.is_input === true){
                Record.updateAll({ peopleId: ctx.instance.peopleId}, { fullname: instance.fullname, comment: ctx.instance.comment }, function(err, info) {
                  if (err) {
                    console.error(err);
                  }else{
                    //console.log(new Date(), "fullname updated, "+instance.fullname+" to "+ctx.instance.fullname+"".green);
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


      var inputDateTime = Date();

      //Si es entrada...
      /*if(ctx.instance.is_input == true){

        console.log("is input");
        //Actualiza registro previo si ya existe una entrada sin salida
        Record.updateAll({peopleId : ctx.instance.peopleId, id: { neq : ctx.instance.id}, output_datetime : undefined , is_input: true}, 
          { output_datetime: ctx.instance.input_datetime, is_input: false },
          function(err, info){
            if(err){
              throw err;
            }else{
              if(info.count > 0){
                Record.destroyById(ctx.instance.id);
              }
            }
        });

      }
      //Si es salida...
      else{


        //Actualiza registro previo si ya existe una entrada sin salida
        Record.updateAll({peopleId : ctx.instance.peopleId, id: { neq : ctx.instance.id}, output_datetime : undefined , is_input: true}, 
          { output_datetime: ctx.instance.output_datetime, is_input: false },
          function(err, info){
            if(err){
              throw err;
            }else{
              if(info.count > 0){
                //Borramos el registro actual para evitar duplicados
                Record.destroyById(ctx.instance.id);
              }
            }
        });



        //Si existe una salida sin entrada, cambia el registro a entrada
        MongoClient.connect(url, function(err, db) {
          assert.equal(null, err);
          updateSalidaSinEntrada(db, ctx, function() {
            db.close();
          });
        });


        /*  


        //Si existe una salida sin entrada, cambia el registro a entrada
        Record.updateAll( { "where" : { peopleId: ctx.instance.peopleId, "id": { neq : ctx.instance.id}, "input_datetime" : { "$exists": false }, "is_input": false } },
         { input_datetime : ctx.instance.output_datetime, is_input: true} ,
          function(err,info){
            if(err){
              console.log("Consult 4: error ", err);
            }else{
              console.log("Consult 4: Registros actualizados: " + info.count);
            }
          });

          */





//      }

/*
      if (ctx.instance.input_datetime === undefined && ctx.instance.output_datetime === undefined){
        if( ctx.instance.is_input === false && ctx.instance.input_datetime === undefined && ctx.instance.owi === true){
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


      */

      pubsub.publish(socket, {
          collectionName : 'Record',
          data: ctx,
          method: 'POST'
      });

    }
    next();
  });
};