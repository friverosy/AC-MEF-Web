module.exports = function(Place) {
  Place.validatesUniquenessOf('name');
};
