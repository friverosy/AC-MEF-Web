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
        Record.find({
          filter: { where: {datetime_input: {gt: new Date() - (24 * 60 * 60 * 1000)}}}
        })
        .$promise
        .then(function(results) {
            $scope.records = results;
        });
    }
    getRecords();

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth()+1;
    var curr_year = d.getFullYear();

    $scope.dateToday = Date.parse(curr_month + "/" + curr_date + "/" + curr_year);
    $scope.dateRange = "";

    $scope.eventDateFilter = function(column) {
        console.log(column);
        if(column === 'today') {
            $scope.dateRange = $scope.dateToday;
        } else if (column === 'pastWeek') {
            //need logic
        } else if (column === 'pastMonth') {
            //need logic
        } else if (column === 'future') {
            //need logic
        } else {
            $scope.dateRange = "";
        }
        console.log($scope.dateRange);
    }

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
