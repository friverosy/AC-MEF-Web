angular
  .module('app')
  .controller('AccountsController', ['$scope', '$state', 'Record', '$http', '$window', function($scope,
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
  }]);
