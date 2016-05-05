module.exports = function(Login) {
    var app = require('../../server/server');

    Login.observe('before save', function(ctx, next) {
        if (ctx.instance){
            var User = app.models.User;
            if(ctx.instance.email === undefined || ctx.instance.password === undefined){
                console.log("faltan datos");
            }else {
                ctx.instance.datetime = new Date();
                
            }
        }
        next();
    });

};
