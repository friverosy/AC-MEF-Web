angular
  .module('app')
  .controller('MaintainersController', ['$scope', '$state', 'Parking', 'Destination', function($scope,
      $state, Parking, Destination) {
    $scope.parkings = [];

    switch (localStorage.email) {
      case "cberzins@multiexportfoods.com":
        if (localStorage.password !== "CB3rZin5") $window.location.href = '/login';
        break;
        case "jaime":
          if (localStorage.password !== "j4im3") $window.location.href = '/login';
          break;
        case "seguridad1":
          if (localStorage.password !== "84799") $window.location.href = '/login';
          break;
        case "seguridad2":
          if (localStorage.password !== "14551") $window.location.href = '/login';
          break;
        case "seguridad3":
          if (localStorage.password !== "66494") $window.location.href = '/login';
          break;
        case "asistente1":
          if (localStorage.password !== "25913") $window.location.href = '/login';
          break;
        case "asistente2":
          if (localStorage.password !== "19825") $window.location.href = '/login';
          break;
        case "asistente3":
          if (localStorage.password !== "41331") $window.location.href = '/login';
          break;
      default:
        $window.location.href = '/login';
    }

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
