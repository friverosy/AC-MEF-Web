angular
  .module('app')
  .controller('CDController', ['$scope', '$rootScope', function($scope, $rootScope) {
      $scope.currentDate = new Date();
      $rootScope.department = 'Angular';
    }])
  .controller('RecordController', ['$scope', '$state', 'Record', function($scope,
      $state, Record) {
    $scope.records = [];

    function getRecords() {
        ONE_DAY = 24 * 60 * 60 * 1000; // 1 day in miliseconds
        Record.find({
            where: {
                input_datetime: {gt: new Date() - ONE_DAY}
            }
        })
        .$promise
        .then(function(results) {
          $scope.records = results;
        });
    }
    getRecords();

    $scope.add = function() {
      Record
        .create($scope.newRecord)
        .$promise
        .then(function(record) {
          $scope.newRecord = '';
          $scope.recordForm.content.$setPristine();
          $('.focus').focus();
          getRecords();
        });
    };

    $scope.update = function(record){
  		record.$save();
  	};

  }]);
