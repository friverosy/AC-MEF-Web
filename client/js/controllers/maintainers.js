angular
  .module('app')
  .controller('MaintainersController', ['$scope', '$state', 'Parking', 'Destination', function($scope,
      $state, Parking, Destination) {
    $scope.parkings = [];

    function getParkings() {
        Parking.find()
        .$promise
        .then(function(results) {
            $scope.parkings = results;
        });
    }
    function getDestinations() {
        Destination.find()
        .$promise
        .then(function(results) {
            $scope.destinations = results;
        });
    }
    getParkings();
    getDestinations();

    // Counts
    $scope.num_parkings = Parking.count();
    $scope.num_destinations = Destination.count();

    // New parking
    $scope.addParking = function() {
      Parking
        .create($scope.newParking)
        .$promise
        .then(function(parking) {
          $scope.newParking = '';
          getParkings();
        });
    };
    // New Destination
    $scope.addDestination = function() {
      Destination
        .create($scope.newDestination)
        .$promise
        .then(function(destination) {
          $scope.newDestination = '';
          getDestinations();
        });
    };

    // Update Parking
    $scope.updateParking = function(parking){
        parking.updating = 1;
        console.log(parking);
        parking.$save(parking);
  	};
    // Update Destination
    $scope.updateDestination = function(destination){
        parking.updating = 1;
        console.log(destination);
        destination.$save(destination);
  	};

    // Delete Parking
    $scope.deleteParking = function(parking) {
      Parking
        .deleteById(parking)
        .$promise
        .then(function() {
          getParkings();
        });
    };
    // Delete Destination
    $scope.deleteDestination = function(destination) {
      Destination
        .deleteById(destination)
        .$promise
        .then(function() {
          getDestinations();
        });
    };

  }]);
