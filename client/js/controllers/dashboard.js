angular
  .module('app')
  .controller('DashboardController', ['$scope', '$state', '$filter', 'Record', '$http', '$window', '$resource', 'PubSub','Company', 'Place','People',
    function($scope,
      $state, $filter, Record, $http, $window, $resource, PubSub, Company, Place, People) {
      
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
    $scope.arregloPeople = {};
    $scope.RecordsAll = {};
    $scope.logout = function() {
          localStorage.clear();
          $window.location.href = '/login';
    };

    function getNumPendings() {
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
            {profile: "E"},
            {is_permitted: true}
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

    function getNumPatentsEmployees() {
      //$scope.num_patentsEmployees = $filter('countBy')($scope.input_patent,'input_patent');
      Record.count({
        where: { and:
          [
            {is_input: true},
            {output_datetime: undefined},
            {profile: "E"},
            {is_permitted: true},
            {input_patent: {neq: null}}
          ]
        }
      })
      .$promise
      .then(function(result){
        $scope.num_patentsEmployees = result;
      });
    };

    function getNumPatentsVisits() {
      //$scope.num_patentsEmployees = $filter('countBy')($scope.input_patent,'input_patent');
      Record.count({
        where: { and:
          [
            {is_input: true},
            {output_datetime: undefined},
            {profile: "V"},
            {is_permitted: true},
            {input_patent: {neq: null}}
          ]
        }
      })
      .$promise
      .then(function(result){
        $scope.num_patentsVisits = result;
      });
    };

    function getNumPatentsContractors() {
      //$scope.num_patentsEmployees = $filter('countBy')($scope.input_patent,'input_patent');
      Record.count({
        where: { and:
          [
            {is_input: true},
            {output_datetime: undefined},
            {profile: "C"},
            {is_permitted: true},
            {input_patent: {neq: null}}
          ]
        }
      })
      .$promise
      .then(function(result){
        $scope.num_patentsContractors = result;
      });
    };

    function getCompany() {
      Company.find({filter: {where: {or:
        [{rut: '2'},
        {rut: '3'},
        {rut: '8'}]
      }}})
      .$promise
      .then(function(results) {
        $scope.companies = results;
      });
    }

    function getRecords() {
      Record.find({
        where: { and:
          [
            {is_input: true}
          ]
        }
      })
      .$promise
      .then(function(results) {
        $scope.RecordsAll = results;
      });
    }

    function getDefaultPlace() {
      Place.find({filter: {where: {and: [{companyId: 8},{name: {nlike: '/AREA/'}}]}}})
      .$promise
      .then(function(results) {
        $scope.places = results;
      })
      //falta mostrar contador de record por place
    }

    //Count
    getNumPendings();
    getNumEmployes();
    getNumVisits();
    getNumContractos();
    getRejected();
    getNumPatentsEmployees();
    getNumPatentsVisits();
    getNumPatentsContractors();
    getDefaultPlace();
    getCompany();
    getRecords();
   

    var onRecordCreate = function(data) {
          getNumPendings();
          getNumEmployes();
          getNumVisits();
          getNumContractos();
          getRejected();
          getNumPatentsEmployees();
          getNumPatentsContractors();
          getNumPatentsVisits();
          getCompany();
          getRecords();
          
    }

    PubSub.subscribe({
                collectionName: 'Record',
                method : 'POST'
            }, onRecordCreate);

    function countByPlace(place) {
      Record.find({
          filter: {
            where: {
              and: [{place: place}, {is_input: true}]
            }
          }
        },
        function(list) {
          console.log(list);
          $scope.records = list;
        },
        function(errorResponse) { console.log(errorResponse) }
      );
    }

    $scope.getPlacesByRut = function(rut) {
      //console.log(rut);
      Place.find({
        filter: {
          where: {
            companyId: rut
          }
        }
      })
      .$promise
      .then(function(results) {
        //console.log(results);
        $scope.places = results;
       // angular.forEach(results, function(value, key) {
          //console.log(value.name);
         // countByPlace(value.name);
        //});
      })
    }

$scope.getRecordsByRut = function(rut) {
      //console.log(rut);
      Place.find({
        filter: {
          where: {
            companyId: rut
          }
        }
      })
      .$promise
      .then(function(results) {
   
        var arreglo = results;
          var contador =0;
          var contadorFilter = 0;
          var arreglo2 = $scope.RecordsAll;
          $scope.arregloPeople={};
          angular.forEach(arreglo, function(value, key) {
           var newTemp = $filter("filter")(arreglo2, {place: arreglo[contadorFilter].name});
           $scope.arregloPeople[contadorFilter] = {Place: arreglo[contadorFilter].name, Count : newTemp.length};
           contadorFilter++;
           
     

         });
            
            
            
       
        
      })
     
    }

  }]);
