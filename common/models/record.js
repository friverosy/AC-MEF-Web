module.exports = function(Record) {
    // remove the DELETE functionality from API
    Record.disableRemoteMethod('deleteById', true);

    Record.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            Record.find({
                where: { fullname: ctx.instance.fullname }},
                function (err, records) {
                    var set_input = true;

                    if(records.length < 1){
                        //console.log("first record: "+records.length);
                        set_input = true
                    }else{
                        //console.log("more than one record: "+records.length);
                        var input = records[records.length-1].input_datetime;
                        var output = records[records.length-1].output_datetime;
                        var id = records[records.length-1].id;

                        if(input != undefined && output != undefined){
                            // console.log("already has input and output");
                            set_input = true;
                        }else if(input != undefined && output == undefined){
                            // console.log("has input without output");
                            set_input = false;
                            ctx.instance.id_finded = id;
                        }else if(input == undefined && output != undefined){
                            // console.log("has output without input");
                            set_input = true;
                        }else if(input == undefined && output == undefined){
                            // console.log("no intput and output");
                            set_input = true;
                        }
                        // console.log("|");
                        // console.log(id);
                        // console.log(input)
                        // console.log(output);
                        // console.log("|");
                    }

                    if(set_input){
                        ctx.instance.is_input = true;
                        console.log("Entrada: "+records.length);
                    }
                    else{
                        ctx.instance.is_input = false;
                        console.log("Salida : "+records.length);
                    }

                }
            );
        };
        next();

    });

    Record.observe('after save', function(ctx, next) {
        if (ctx.instance) {
            var today = new Date();
            if(ctx.instance.is_input && ctx.instance.is_permitted &&
                    ctx.instance.updating == undefined){
                // console.log("Insert input");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date() }, null);
            }else if(ctx.instance.is_input &&
                    ctx.instance.is_permitted == false &&
                    ctx.instance.updating == undefined){
                // console.log("Insert input dennied");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date() }, null);
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.updating == undefined){
                // console.log("Insert output");
                if(ctx.instance.id_finded != undefined){
                    Record.updateAll({ id: ctx.instance.id_finded },
                        { output_datetime: new Date(), is_input: false }, null);
                    // console.log("--- Updated id: " + ctx.instance.id_finded);
                    Record.destroyById(ctx.instance.id, null);
                    // console.log("--- Deleted id: " + ctx.instance.id);
                }
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.id_finded == undefined &&
                    ctx.instance.updating == undefined &&
                    ctx.instance.is_permitted){
                // console.log("Insert input (fixed)");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date() }, null);
                console.log("--- Updated id (fixed): " + ctx.instance.id);
            }else if(ctx.instance.is_input == false &&
                    ctx.instance.id_finded == undefined &&
                    ctx.instance.updating == undefined &&
                    ctx.instance.is_permitted){
                // console.log("Insert input dennnied (fixed)");
                Record.updateAll({ id: ctx.instance.id },
                    { input_datetime: new Date() }, null);
            }else if(ctx.instance.updating != undefined){
                // console.log("Adding comment");
                Record.updateAll({ id: ctx.instance.id },
                    { comment: ctx.instance.comment }, null);
            }else{
                // console.log("else");
            }

            // console.log(ctx.instance);
            console.log("-------------------------------------------");
        }
        next();
    });
};
