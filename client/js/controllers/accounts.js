angular
  .module('app')
  .controller('AccountsController', ['$scope', '$state', 'Record', '$http', '$window', function($scope,
      $state, Record, $http, $window) {


    $scope.logout = function() {
          localStorage.clear();
          $window.location.href = '/login';
    };
  }]);
