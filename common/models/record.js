module.exports = function(Record) {
    Record.observe('before save', function processData(ctx, next) {
        // console.log(ctx.instance.people_run);

        // Record.find({where: {and: [{people_run: ctx.instance.people_run},
        //     {intput_datetime: '2016-02-22T18:35:24.487Z'}]}},
        //     function (err, records) {
        //         console.log(records.id);
        // });

        // Record.find({where: {"id": "56cb6b2809397a5708230352"}},
        //     function (err, records) {
        //         console.log(records.id);
        // });


        // Record.find({where: {fullname: 'Cristtopher Quintana Toledo'}, limit: 3},
        // function(err, records) {
        //     console.log(records.id);
        // });

        if (ctx.instance) {
            ctx.instance.input_datetime = new Date();
        } else {
            //ctx.data.output_datetime = new Date();
        }
        next();
    });
};
