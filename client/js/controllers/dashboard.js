angular
  .module('app')
  .controller('DashboardController', ['$scope', '$state', 'Record', '$http', '$window', function($scope,
      $state, Record, $http, $window) {

      if(localStorage.email != "cberzins@multiexportfoods.com" && localStorage.password != "CB3rZin5"){
          $window.location.href = '/login';
      }else{
        //   console.log("aca");
      }

    $scope.logout = function() {
          localStorage.clear();
          $window.location.href = '/login';
    };


    // Counts
    $scope.num_all = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true}
          ]
      }
    });
    $scope.num_employees = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true},
              {profile: "E"}
          ]
      }
    });
    $scope.num_visits = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {profile: "V"}
          ]
      }
    });
    $scope.num_contractors = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true},
              {profile: "C"}
          ]
      }
    });
    $scope.permitted = Record.count({
      where: { is_permitted : true }
    });
    $scope.rejected = Record.count({
      where: { is_permitted : false }
    });

  }]);
