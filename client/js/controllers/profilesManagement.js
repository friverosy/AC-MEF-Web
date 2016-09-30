angular
  .module('app')
  .controller('ProfilesManagementController', ['$scope', '$state', 'Profile', 'PubSub', function($scope, $state, Profile, PubSub) {

	function getProfiles() {
        Profile.find()
        .$promise
        .then(function(results) {
            $scope.profiles = results;
        });
    }

        getProfiles();

     $scope.num_profiles = Profile.count();



  	}]);
