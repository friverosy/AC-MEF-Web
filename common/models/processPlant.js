module.exports = function(processPlant) {
  processPlant.observe('before save', function removeUnwantedField(ctx, next) {
    if (ctx.instance)
      if(ctx.instance.name !== undefined)
        ctx.instance.name = ctx.instance.name.trim();
    next();
  });
};
