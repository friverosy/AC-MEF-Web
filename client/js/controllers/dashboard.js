angular
.module('app')
.filter('singleDecimal', function ($filter) {
    return function (input) {
        if (isNaN(input)) return input;
        return Math.round(input * 10) / 10;
    };
})
.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
    };
})
.controller('DashboardController', ['$scope', '$state', '$filter', 'Record','Login' ,'$http', '$window', '$resource', 'PubSub','Company', 'Place','People',
function($scope,
  $state, $filter, Record, Login, $http, $window, $resource, PubSub, Company, Place, People) {


    //Login
    if(localStorage.verificador){
      Login.find({filter: {where: {and:
        [
          {email: localStorage.email},
          {password: localStorage.password}
        ]
      }}})
      .$promise
      .then(function(results) {
        if(results.length > 0){
          localStorage.verificador = true;
        }
        else{
          localStorage.clear();
          $window.location.href = '/login';
        }
      });

    } else if(!localStorage.verificador && localStorage.verificador!= undefined){
      console.log("Usuario logeado", localStorage.email);
    } else{
      localStorage.clear();
      $window.location.href = '/login';
    }
    //End: Login

    //Logout Function
    function logout(){
      localStorage.clear();
      //$window.location.href = '/login';
      location="/login"
    };
    //End: Logout Function

    $scope.arregloPeople = {};
    $scope.RecordsAll = {};
    $scope.placesFiltered = {};

    //Numbers in Dashboard
    //Number of employees inside
    function getNumEmployes() {
      Record.find({
        filter: {
          where: {
            and:
              [
                {is_input: true},
                {profile: "E"},
                {is_permitted: true}
              ]
          }
        }
      })
      .$promise
      .then(function(result){
        var contador = 0;
        var num_employees = 0;
        var employeeFiltered = $filter('unique')(result,'fullname');
        angular.forEach(employeeFiltered, function(value, key) {
          if(employeeFiltered[contador].output_datetime == undefined && employeeFiltered[contador].is_input == true)
            num_employees++
          contador++;
        });
        $scope.num_employees = num_employees
      });
    };

    //Number of visits inside
    function getNumVisits() {
      //Filtered by run (not fullname)
      Record.find({
        filter: {
          where: {
            and:
              [
                {is_input: true},
                {profile: "V"}
              ]
          }
        }
      })
      .$promise
      .then(function(result){
        var contador = 0;
        var num_visits = 0;
        var visitFiltered = $filter('unique')(result,'run');
        angular.forEach(visitFiltered, function(value, key) {
          contador++;
        });
        $scope.num_visits = contador;
      })};

      //Number of contractors inside
      function getNumContractos() {
        Record.find({
          filter: {
            where: {
              and: [
                {is_input: true},
                {output_datetime: undefined},
                {profile: "C"},
                {is_permitted: true},
                {company_code: {neq: null}}
              ]
            }
          }
        })
        .$promise
        .then(function(result){
          //$scope.num_contractors = result;
          var contador = 0;
          var num_contractors = 0;
          var contractorFiltered = $filter('unique')(result,'fullname');
          angular.forEach(contractorFiltered, function(value, key) {
            if(contractorFiltered[contador].output_datetime == undefined && contractorFiltered[contador].is_input == true){
                num_contractors++
            }
            contador++;
          });
          $scope.num_contractors = num_contractors;
        });
      };

      //Number of Employees's Patents
      function getNumPatentsInside() {
        Record.count({
          where: {
            and: [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true},
              {input_patent: {nin: [null, '']}}
            ]
          }
        })
        .$promise
        .then(function(result){
          $scope.num_patentsInside = result;
        });
      };
      //End: Numbers in Dashboard

      var f=new Date();
      var ano = f.getFullYear();
      var mes = f.getMonth()+1;
      var dia = f.getDate();

      //For dennied number in navbar.
      function getRejected() {
        Record.find({
          filter: {
            where: {
              and : [
                {is_input: true},
                {output_datetime: undefined},
                {is_permitted : false}
              ]
            }
          }
        })
        .$promise
        .then(function(result){
          var contador = 0;
          $scope.Dennied = 0;
          angular.forEach(result, function(value, key) {
            var INPUT = new Date(result[contador].input_datetime)
            if(INPUT.getTime() >= new Date(ano+"/"+mes+"/"+dia)){
              $scope.Dennied++;
            }
            contador++
          });
        });
      };
      //End: For dennied number in navbar

      //Table of departments with number of people in dashboard
      //Get name of companies with id '2', '3' and '8'
      function getCompany() {
        Company.find({
          filter: {
            where: {
              or: [
                {rut: '2'},
                {rut: '3'},
                {rut: '8'}
              ]
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.companies = results;
        });
      }

      //Get all the records of people that are enabled to enter the plant
      function getRecords() {
        Record.find({
          filter: {
            where: {
              and: [
                {is_input: true},
                {is_permitted: true}
              ]
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.RecordsAll = results;
        });
      }

      //Get all the places
      function getAllPlacesFiltered() {
        Place.find()
        .$promise
        .then(function(results) {
          $scope.placesFiltered = $filter('unique')(results,'name');
        })
      }

      //Get all the places filtered by id (run) of the company clicked on tabs in dashboard
      $scope.getPlacesByRut = function(rut) {
        Place.find({
          filter: {
            where: {
              companyId: rut
            }
          }
        })
        .$promise
        .then(function(results) {
          $scope.places = results;
        })
      }

      //Get the records filtered by run of company and place for table in dashboard
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
          var supreme_counter =0;
          var arreglo = results;
          var contador =0;
          var contadorFilter = 0;
          var arreglo2 = $filter('unique')($scope.RecordsAll,'fullname');
          $scope.arregloPeople={};
          angular.forEach(arreglo, function(value, key) {
            var newTemp = $filter("filter")(arreglo2, {place: arreglo[contadorFilter].name});
            $scope.arregloPeople[contadorFilter] = {Place: arreglo[contadorFilter].name, Count : newTemp.length};
            contadorFilter++;
            supreme_counter = newTemp.length + supreme_counter;
          });
        })
      }

      //End: Table of departments with number of people in dashboard
      //Get collections.
      getAllPlacesFiltered();
      getNumEmployes();
      getNumVisits();
      getNumContractos();
      getRejected();
      getNumPatentsInside();
      getCompany();
      getRecords();
      $scope.user = localStorage.email.toUpperCase();
    }
  ]
);
