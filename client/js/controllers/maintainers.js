angular
  .module('app')
  .controller('MaintainersController', ['$scope', '$state', 'Parking', 'People', 'Destination', 'VehicleType', 'Profile', 'PubSub', function($scope, $state, Parking, People, Destination, VehicleType, Profile, PubSub) {
  
  
    $scope.newPeople={};
    $scope.people={};

    function pasuser() {
      console.log("HOLA");
    }

    function getVehicleType() {
      VehicleType.find()
      .$promise
      .then(function(results) {
        $scope.vehicleTypes = results;
      });
    }

    function getParkings() {
      Parking.find()
      .$promise
      .then(function(results) {
        $scope.parkings = results;
      });
    }

    function getDestination() {
      Destination.find()
      .$promise
      .then(function(results) {
        $scope.destinations = results;
      });
    }

    function getProfiles() {
      Profile.find()
      .$promise
      .then(function(results) {
        $scope.profiles = results;
      });
    }

    function getPeople() {
      People.find()
      .$promise
      .then(function(results) {
        $scope.peoples = results;
      });
    }

    getParkings();
    getDestination();
    getVehicleType();
    getProfiles();
    getPeople();

    // Counts
    $scope.num_parkings = Parking.count();
    $scope.num_destinations = Destination.count();
    $scope.num_vehicleTypes = VehicleType.count();
    $scope.num_profiles = Profile.count();
    // $scope.num_reasons = Reason.count();

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
        .then(function(place) {
          $scope.newDestination = '';
          getDestination();
        });
    };

    // New Profile
    $scope.addProfile = function() {
      Profile
        .create($scope.newProfile)
        .$promise
        .then(function(profile) {
          $scope.newProfile = '';
          getProfiles();
        });
    };

    // Update Parking
    $scope.updateParking = function(parking) {
        parking.updating = 1;
        console.log(parking);
        parking.$save(parking);
  	};

    // Update Destination
    $scope.updateDestination = function(destination) {
        destination.updating = 1;
        destination.$save(place);
  	};

    // Update Profile
    $scope.updateProfile = function(profile) {
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
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

    // Delete Place
    $scope.deleteDestination = function(destination) {
      Destination
        .deleteById(destination)
        .$promise
        .then(function() {
          getDestination();
        });
    };

    // Delete Profile
    $scope.deleteProfile = function(profile) {
      Profile
        .deleteById(profile)
        .$promise
        .then(function() {
          getProfiles();
        });
    };

    // New VehicleType
    $scope.addVehicleType = function() {
      VehicleType
        .create($scope.newVehicleType)
        .$promise
        .then(function(type) {
          $scope.newVehicleType = '';
          getVehicleType();
        });
    };

    // Delete VehicleType
    $scope.deleteVehicleType = function(type) {
      VehicleType
        .deleteById(type)
        .$promise
        .then(function() {
          getVehicleType();
        });
    };

    // Update VehicleType
    $scope.updateVehicleType = function(type) {
        type.updating = 1;
        console.log(type);
        type.$save(type);
  	};

    $scope.update = function(people){
        //record.updating=true;
        people.$save(people);
    };

     //Record Plant
    $scope.updateReadRecordPlant = function(profile) {
      if (profile.ReadRecordPlant == false) {
        profile.ReadRecordPlant = true;
      } else {
        profile.ReadRecordPlant = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

     $scope.updateWriteRecordPlant = function(profile) {
      if (profile.WriteRecordPlant == false) {
        profile.WriteRecordPlant = true;
      } else {
        profile.WriteRecordPlant = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Record Employees
    $scope.updateReadRecordEmployees = function(profile) {
      if (profile.RecordEmployees == false) {
        profile.RecordEmployees = true;
      } else {
        profile.RecordEmployees = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

     $scope.updateWriteRecordEmployees = function(profile) {
      if (profile.RecordEmployees == false) {
        profile.RecordEmployees = true;
      } else {
        profile.RecordEmployees = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Record Contractor
    $scope.updateReadRecordContractor = function(profile) {
      if (profile.RecordContractor == false) {
        profile.RecordContractor = true;
      } else {
        profile.RecordContractor = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteRecordContractor = function(profile) {
      if (profile.RecordContractor == false) {
        profile.RecordContractor = true;
      } else {
        profile.RecordContractor = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Record Visits
    $scope.updateReadRecordVisits = function(profile) {
      if (profile.RecordVisits == false) {
        profile.RecordVisits = true;
      } else{
        profile.RecordVisits = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteRecordContractor = function(profile) {
      if (profile.RecordVisits == false) {
        profile.RecordVisits = true;
      } else {
        profile.RecordVisits = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

       //Manual Record Visits
    $scope.updateReadManualRecordVisits = function(profile) {
      if (profile.ManualRecordVisits == false) {
        profile.ManualRecordVisits = true;
      } else {
        profile.ManualRecordVisits = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteManualRecordVisits = function(profile) {
      if (profile.ManualRecordVisits == false) {
        profile.ManualRecordVisits = true;
      } else {
        profile.ManualRecordVisits = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Manual Record Employees
    $scope.updateReadManualRecordEmployees = function(profile) {
      if (profile.ManualRecordEmployees == false) {
        profile.ManualRecordEmployees = true;
      } else {
        profile.ManualRecordEmployees = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteManualRecordEmployees = function(profile) {
      if (profile.ManualRecordEmployees == false) {
        profile.ManualRecordEmployees = true;
      } else{
        profile.ManualRecordEmployees = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Manual Record Contractor
    $scope.updateReadManualRecordContractor = function(profile) {
      if (profile.ManualRecordContractor == false) {
        profile.ManualRecordContractor = true;
      } else {
        profile.ManualRecordContractor = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteManualRecordContractor = function(profile) {
      if (profile.ManualRecordContractor == false) {
        profile.ManualRecordContractor = true;
      } else {
        profile.ManualRecordContractor = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Maintainers
    $scope.updateReadMaintainers = function(profile) {
      if (profile.Maintainers == false) {
        profile.Maintainers = true;
      } else {
        profile.Maintainers = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteMaintainers = function(profile) {
      if (profile.Maintainers == false) {
        profile.Maintainers = true;
      } else {
        profile.Maintainers = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Profiles
    $scope.updateReadProfiles = function(profile) {
      if (profile.Profiles == false) {
        profile.Profiles = true;
      } else {
        profile.Profiles = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteProfiles = function(profile) {
      if (profile.Profiles == false) {
        profile.Profiles = true;
      } else {
        profile.Profiles = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    //Blacklist
    $scope.updateReadBlacklist = function(profile) {
      if (profile.Blacklist == false) {
        profile.Blacklist = true;
      } else {
        profile.Blacklist = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };

    $scope.updateWriteProfiles = function(profile) {
      if (profile.Blacklist == false) {
        profile.Blacklist = true;
      } else {
        profile.Blacklist = false;
      }
      profile.updating = 1;
      console.log(profile);
      profile.$save(profile);
    };
    //Visits maintainers
    $scope.addVisit = function() {
      if(($scope.newPeople.fullname == undefined || $scope.newPeople.fullname == "")
        || ($scope.newPeople.run == undefined || $scope.newPeople.run == "")
        || ($scope.newPeople.company == undefined || $scope.newPeople.company == "")){
          
          alert("Debe ingesar todos los datos solicitados");
        
        }
      else{
          $scope.newPeople.profile = "V";
          People.create($scope.newPeople, function(err, model){
            getPeople();
            $scope.newPeople.fullname = "";
            $scope.newPeople.run = "";
            $scope.newPeople.company = "";
        });
          
      }
    };

    $scope.clearVisit = function() {
        $scope.newPeople.fullname = "";
            $scope.newPeople.run = "";
            $scope.newPeople.company = "";
    };

}]);
