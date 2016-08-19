module.exports = function(Reason) {
  Reason.observe('before save', function removeUnwantedField(ctx, next) {
    if (ctx.instance) {
      ctx.instance.name = ctx.instance.name.trim();
    } else {
      ctx.instance.name = ctx.instance.name.trim();
    }
    next();
  });
};
