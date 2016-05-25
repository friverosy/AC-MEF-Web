angular
  .module('app')
  .controller('MaintainersController', ['$scope', '$state', 'Parking', function($scope,
      $state, Parking) {
    $scope.parkings = [];

    function getParkings() {
        Parking.find()
        .$promise
        .then(function(results) {
            $scope.parkings = results;
        });
    }
    getParkings();

    // Counts
    $scope.num_parkings = Parking.count();

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

    // Update Parking
    $scope.updateParking = function(parking){
        parking.updating = 1;
        console.log(parking);
        parking.$save(parking);
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

  }]);
