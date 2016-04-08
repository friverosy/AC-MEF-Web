module.exports = function(Record) {
    // remove the DELETE functionality from API
    Record.disableRemoteMethod('deleteById', true);

    Record.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            Record.find({
                where: { fullname: ctx.instance.fullname }},
                function (err, records) {

                    var set_input = true;

                    records.forEach(function (record) {
                        if(record.is_input == true){
                            set_input = false;
                            ctx.instance.id_finded = record.id;
                        }else{
                            set_input = true;
                        };
                    });

                    if(set_input) ctx.instance.is_input = true;
                    else ctx.instance.is_input = false;
                }
            );
        }
        next();
    });

    Record.observe('after save', function(ctx, next) {
        if (ctx.instance) {
            console.log(ctx.instance);
            if(ctx.instance.is_input && ctx.instance.is_permitted &&
            ctx.instance.updating == undefined){
                console.log("Insert input");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date(), is_input: true }, null);
            }else if(ctx.instance.is_input &&
            ctx.instance.updating == undefined){
                console.log("Insert input dennied");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date() }, null);
            }else if(ctx.instance.id_finded != undefined &&
            ctx.instance.updating == undefined){
                console.log("Insert output");
                Record.updateAll({ id: ctx.instance.id_finded },
                    { output_datetime: new Date(), is_input: false }, null);
                Record.destroyById(ctx.instance.id, null);
            }else if(ctx.instance.updating != undefined){
                console.log("Adding comment");
                Record.updateAll({ id: ctx.instance.id },
                    { comment: ctx.instance.comment }, null);
                //Record.destroyById(ctx.instance.id, null);
            }else{
                console.log("else");
            }

            if(ctx.instance.input_datetime == undefined &&
                ctx.instance.output_datetime == undefined)
                ctx.instance.input_datetime = new Date();
        }
        next();
    });

};
