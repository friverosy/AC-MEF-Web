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

    var f=new Date();
    var ano = f.getFullYear();
    var mes = f.getMonth()+1;
    var dia = f.getDate();

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
    function getCounter(profile) {
      Record.find({
        filter: {
          where: {
            and:
              [
                {profile: profile},
                {is_input: true},
                {is_permitted: true}
              ]
          }
        }
      })
      .$promise
      .then(function(result){
        var index = 0;
        var people = 0;

        if (profile == 'V') var peopleFiltered = $filter('unique')(result,'run');
        else var peopleFiltered = $filter('unique')(result,'fullname');

        switch(profile) {
          case 'E':
            $scope.num_employees = peopleFiltered.length;
            break;
          case 'C':
            $scope.num_contractors = peopleFiltered.length;
            break;
          case 'P':
            $scope.num_suppliers = peopleFiltered.length;
            break;
          case 'V':
            $scope.num_visits = peopleFiltered.length;
            break;
        };
      });
    }

    function getNumPatentsInside() {
      Record.count({
        where: {
          and: [
            {is_input: true},
            {is_permitted: true},
            {or: [
              { input_patent: {nin: [null, '']} },
              { truck_patent: {nin: [null, '']} },
              { rampla_patent: {nin: [null, '']} }
            ]}
          ]
        }
      })
      .$promise
      .then(function(result){
        $scope.num_patentsInside = result;
      });
    };

    //For dennied number in navbar.
    // function getRejected() {
    //   Record.find({
    //     filter: {
    //       where: {
    //         and : [
    //           {is_input: true},
    //           {output_datetime: undefined},
    //           {is_permitted : false}
    //         ]
    //       }
    //     }
    //   })
    //   .$promise
    //   .then(function(result){
    //     var contador = 0;
    //     $scope.Dennied = 0;
    //     angular.forEach(result, function(value, key) {
    //       var INPUT = new Date(result[contador].input_datetime)
    //       if(INPUT.getTime() >= new Date(ano+"/"+mes+"/"+dia)){
    //         $scope.Dennied++;
    //       }
    //       contador++
    //     });
    //   });
    // };
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
      getCounter('E');
      getCounter('C');
      getCounter('P');
      getCounter('V');
      getAllPlacesFiltered();
      getNumPatentsInside();
      getCompany();
      getRecords();
      $scope.user = localStorage.email.toUpperCase();
    }
  ]
);
