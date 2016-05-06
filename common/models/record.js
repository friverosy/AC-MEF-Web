module.exports = function(Record) {
    // remove DELETE functionality from API
    Record.disableRemoteMethod('deleteById', true);

    Record.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            // find last one
            Record.findOne({
                where: { fullname: ctx.instance.fullname },
                order: 'id DESC'},
                function (err, records) {
                    try {
                        var id = records.id;
                        if(records.input_datetime !== undefined && records.output_datetime !== undefined){
                            // console.log("already has input and output");
                            ctx.instance.is_input = true;
                        }else if(records.input_datetime !== undefined && records.output_datetime == undefined){
                            // console.log("has input without output");
                            ctx.instance.is_input = false;
                            ctx.instance.id_finded = id;
                        }else if(records.input_datetime == undefined && records.output_datetime !== undefined){
                            // console.log("has output without input");
                            ctx.instance.is_input = true;
                        }else if(records.input_datetime == undefined && records.output_datetime == undefined){
                            // console.log("no intput and output");
                            ctx.instance.is_input = true;
                        }
                    } catch (err) {
                        ctx.instance.is_input = true;
                    }
                }
            );
            if(ctx.instance.profile === undefined){
                ctx.instance.profile = "E";
            }
        };
        next();
    });

    Record.observe('after save', function(ctx, next) {
        var socket = Record.app.io;
        var app = require('../../server/server');
        var People = app.models.People

        if (ctx.instance) {

            // add visit if is new
            if(ctx.instance.profile == "V"){
                People.findOrCreate(
                {
                    where: { run: ctx.instance.people_run } },
                {
                    run: ctx.instance.people_run,
                    fullname: ctx.instance.fullname,
                    profile: 'V',
                    create_at: new Date()
                },
                function(error, instance, created) {  // Callback
                    if (error) throw error;
                    if (created) {
                        console.log('Object already exists: \n', instance);
                    } else {
                        console.log(instance.fullname + ' Already existed.');
                    }
                });
            }

            var today = new Date();
            if(ctx.instance.is_input && ctx.instance.is_permitted &&
                    ctx.instance.updating === undefined){
                console.log("Insert input "+ new Date());
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date(), is_input: true }, null);
            }else if(ctx.instance.is_input &&
                    ctx.instance.is_permitted == false &&
                    ctx.instance.updating === undefined){
                console.log("Insert input dennied "+ new Date());
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date(), is_input: true }, null);
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.updating === undefined){
                console.log("Insert output "+ new Date());
                if(ctx.instance.id_finded !== undefined){
                    Record.updateAll({ id: ctx.instance.id_finded },
                        { output_datetime: new Date(), is_input: false }, null);
                    // console.log("--- Updated id: " + ctx.instance.id_finded);
                    Record.destroyById(ctx.instance.id, null);
                    // console.log("--- Deleted id: " + ctx.instance.id);
                }
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.id_finded === undefined &&
                    ctx.instance.updating === undefined &&
                    ctx.instance.is_permitted){
                console.log("Insert input (fixed) "+ new Date());
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date(), is_input: true }, null);
                // console.log("--- Updated id (fixed): " + ctx.instance.id);
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.id_finded == undefined &&
                    ctx.instance.updating == undefined &&
                    ctx.instance.is_permitted){
                console.log("Insert input dennnied (fixed) "+ new Date());
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date(), is_input: true }, null);
            }else if(ctx.instance.updating !== undefined){
                console.log("Modified at "+ new Date());
                //try to optimize!!
                if (ctx.instance.company !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { company: ctx.instance.company }, null);
                }else if(ctx.instance.reason !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { reason: ctx.instance.reason }, null);
                }else if(ctx.instance.destination !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { destination: ctx.instance.destination }, null);
                }else if(ctx.instance.input_patent !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { input_patent: ctx.instance.input_patent }, null);
                }else if(ctx.instance.output_patent !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { output_patent: ctx.instance.output_patent }, null);
                }else if(ctx.instance.authorized_by !== undefined){
                    Record.updateAll({ id: ctx.instance.id },
                        { authorized_by: ctx.instance.authorized_by }, null);
                }else if(ctx.instance.fullname !== undefined){
                    Record.updateAll({ people_run: ctx.instance.people_run },
                        { fullname: ctx.instance.fullname }, null);
                    People.updateAll({ run: ctx.instance.people_run },
                        { fullname: ctx.instance.fullname }, null);
                }else{
                    Record.updateAll({ id: ctx.instance.id },
                        { comment: ctx.instance.comment }, null);
                }
            }
        }
        next();
    });

};
