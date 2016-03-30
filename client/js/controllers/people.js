angular
  .module('app')

  .controller('PeopleController', ['$scope', '$state', 'People', function($scope,
      $state, People) {
    $scope.peoples = [];

    function getPeoples() {
        People.find()
        .$promise
        .then(function(results) {
            $scope.peoples = results;
        });
    }
    getPeoples();

    $scope.add = function() {
      People
        .create($scope.newPeople)
        .$promise
        .then(function(people) {
          $scope.newPeople = '';
          $scope.peopleForm.content.$setPristine();
          $('.focus').focus();
          getPeoples();
        })
        .catch(function(err){
            throw(err)
        });
    };

    $scope.update = function(people){
  		people.$save();
  	};

  }]);
