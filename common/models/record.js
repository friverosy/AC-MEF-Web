module.exports = function(Record) {
    Record.observe('before save', function processData(ctx, next) {
        if (ctx.instance) { // if its new record
            var count = 0;

            Record.find({
                where: {
                    and: [
                        {people_run: ctx.instance.people_run},
                        {input_datetime: undefined}
                    ]
                }},
                function (err, records) {
                    records.forEach(function (record) {
                        count = count + 1;
                        console.log(count);
                    });
                }
            );

            if (count > 0){
                console.log("Entrada");
                ctx.instance.input_datetime = new Date();
            }else{
                console.log("Salida");
                ctx.instance.output_datetime = new Date();
            }
        } else {
            console.log("updated");
            // ctx.data.output_datetime = new Date();
        }
        next();
    });
};
