angular
  .module('app')
  .controller('DashboardController', ['$scope', '$state', 'Record', '$http', '$window', '$resource', 'PubSub',
    function($scope,
      $state, Record, $http, $window, $resource, PubSub) {

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


    function getNumPendings() {

        /*$scope.num_pendings = Record.count({
          where: { and:
              [{output_datetime: undefined}]
          }
        })*/
        Record.count({
          where: { and:
              [{is_input: true},
              {output_datetime: undefined}]
          }
        })
        .$promise
        .then(function(result){
          $scope.num_pendings = result;
        });
    };

    function getNumEmployes() {
        Record.count({
          where: { and:
              [
                {is_input: true},
                {output_datetime: undefined},
                {profile: "E"}
              ]
          }
        })
        .$promise
        .then(function(result){
          $scope.num_employees = result;
        });
    };

    function getNumVisits() {
        Record.count({
          where: { and:
              [{is_input: true},
              {output_datetime: undefined},
              {profile: "V"}]
          }
        })
        .$promise
        .then(function(result){
          $scope.num_visits = result;
        });

    };

    function getNumContractos() {
        Record.count({
          where: { and:
              [{is_input: true},
              {output_datetime: undefined},
              {profile: "C"}]
          }
        })
        .$promise
        .then(function(result){
          $scope.num_contractors = result;
        });
    };

    function getRejected() {
        Record.count({
          where: { and :
              [{is_input: true},
              {output_datetime: undefined},
              {is_permitted : false}]
          }
        })
        .$promise
        .then(function(result){
          $scope.rejected = result;
        });
    };



    //Count
    getNumPendings();
    getNumEmployes();
    getNumVisits();
    getNumContractos();
    getRejected();





    var onRecordCreate = function(data) {
          getNumPendings();
          getNumEmployes();
          getNumVisits();
          getNumContractos();
          getRejected();
    }

    PubSub.subscribe({
                collectionName: 'Record',
                method : 'POST'
            }, onRecordCreate);

  }]);
