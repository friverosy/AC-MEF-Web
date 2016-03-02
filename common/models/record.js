module.exports = function(Record) {
    // remove the DELETE functionality from API
    Record.disableRemoteMethod('deleteById', true);

    Record.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            Record.find({
                where: { people_run: ctx.instance.people_run}},
                function (err, records) {

                    var set_input = true;
                    var id_finded = 0;

                    records.forEach(function (record) {
                        if(record.output_datetime == undefined){
                            set_input = false;
                            id_finded = record.id;
                            console.log("encontro una entrada");
                        }else{
                            set_input = true;
                        };
                    });

                    console.log(set_input);
                    if(set_input){
                        console.log("entrada");
                        ctx.instance.is_input = true;
                    }else{
                        console.log("salida");
                        ctx.instance.is_input = false;
                    }
                }
            );
        };
        next();
    });

    Record.observe('after save', function(ctx, next) {
        if (ctx.instance) {
            console.log(ctx.instance);
            if(ctx.instance.is_input)
                Record.updateAll({ id: ctx.instance.id }, { input_datetime: new Date() }, null);
            else {
                Record.updateAll({ id: ctx.instance.id }, { output_datetime: new Date() }, null);
            }
        };
        next();
    });


    // Record.afterRemote('findById', function (ctx, result, next) {
    //     result.updateAttribute({"$inc": {output_datetime: new Date()}}, function (err, instance) {
    //         if(err) {console.log(err)};
    //         if(!err) {console.log(instance)}
    //     })
    // });
};
