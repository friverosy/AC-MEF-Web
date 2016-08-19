'use strict';
angular.module('app',[])
  .controller('DashboardController', ['$scope', '$state', 'Record', '$http', '$window', '$resource', function($scope,
      $state, Record, $http, $window, $resource) {

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
        case "seguridad4":
          if (localStorage.password !== "74294") $window.location.href = '/login';
          break;
        case "seguridad5":
          if (localStorage.password !== "74225") $window.location.href = '/login';
          break;
        case "seguridad6":
          if (localStorage.password !== "35294") $window.location.href = '/login';
          break;
      default:
        $window.location.href = '/login';
    }

    $scope.logout = function() {
          localStorage.clear();
          $window.location.href = '/login';
    };

    // Counts
    $scope.num_pendings = Record.count({
      where: { and:
          [{output_datetime: undefined}]
      }
    });

    $scope.num_employees = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
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
              {profile: "C"}
          ]
      }
    });
    $scope.rejected = Record.count({
      where: {
          is_permitted : false
      }
    });

  }]);
