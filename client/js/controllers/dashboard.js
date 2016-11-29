angular
  .module('app')
  .controller('DashboardController', ['$scope', '$state', '$filter', 'Record','Login' ,'$http', '$window', '$resource', 'PubSub','Company', 'Place','People',
    function($scope,
      $state, $filter, Record, Login, $http, $window, $resource, PubSub, Company, Place, People) {


//Login
if(localStorage.verificador){ //Primera vez que entra del login.
      Login.find({filter: {where: {and:
        [
          {email: localStorage.email},
          {password: localStorage.password}
        ]
      }}})
      .$promise
      .then(function(results) {
        if(results.length>0){ //Si existe
          localStorage.verificador = true;
        }
        else{ //sino, lo tira a login.
            localStorage.clear();
            $window.location.href = '/login';
          }
      });

  }else if(!localStorage.verificador && localStorage.verificador!= undefined){console.log("Usuario logeado");}
  else{
       localStorage.clear();
       $window.location.href = '/login';

  }
  //End: Login

    //Logout Function
  function logout(){
    console.log("Local Storage Clear... Redireccionando");
    localStorage.clear();
    //$window.location.href = '/login';
    location="/login"
    };
    //End: Logout Function


    $scope.arregloPeople = {};
    $scope.RecordsAll = {};

    //Numbers in Dashboard
    //Number of employees inside
    function getNumEmployes() {
      Record.find({filter:
       { where: { and:
          [
            {is_input: true},
            {output_datetime: undefined},
            {profile: "E"},
            {is_permitted: true},
            {company_code: {neq: null}}
          ]
        }}
      })
      .$promise
      .then(function(result){
        var contador=0;
        var num_employees=0;
        var employeeFiltered = $filter('unique')(result,'fullname');
         angular.forEach(employeeFiltered, function(value, key) {
          var newTemp = $filter("filter")($scope.placesFiltered, {name: employeeFiltered[contador].place});
          if(newTemp.length){
            if(employeeFiltered[contador].output_datetime == undefined && employeeFiltered[contador].is_input == true &&
              employeeFiltered[contador].place!="" && employeeFiltered[contador].place !=undefined &&
              employeeFiltered[contador].place != "No encontrado"){
              num_employees++

            }}
          contador++;
        });
        $scope.num_employees = num_employees;
      });
    };

     //Number of visits inside
    function getNumVisits() {
      //Filtered by run (not fullname)
      Record.find({filter:
       { where: { and:
          [{is_input: true},
          {output_datetime: undefined},
          {profile: "V"}]
        }}
      })
      .$promise
      .then(function(result){
        var contador=0;
        var num_visits=0;
        var visitFiltered = $filter('unique')(result,'run');
        angular.forEach(visitFiltered, function(value, key) {
          if(visitFiltered[contador].output_datetime == undefined && visitFiltered[contador].is_input == true
            &&
            visitFiltered[contador].destination != "No encontrado"){
           num_visits++

          }
          contador++;
        });
        console.log(visitFiltered);
        $scope.num_visits = num_visits;
      });
    };

     //Number of contractors inside
    function getNumContractos() {
      Record.find({filter:
       { where: { and:
          [{is_input: true},
          {output_datetime: undefined},
          {profile: "C"},
          {is_permitted: true},
          {company_code: {neq: null}}]
        }}
      })
      .$promise
      .then(function(result){
        //$scope.num_contractors = result;
        var contador=0;
        var num_contractors=0;
        var contractorFiltered = $filter('unique')(result,'fullname');
        angular.forEach(contractorFiltered, function(value, key) {
            if(contractorFiltered[contador].output_datetime == undefined && contractorFiltered[contador].is_input == true &&
              contractorFiltered[contador].place!="" && contractorFiltered[contador].place !=undefined &&
              contractorFiltered[contador].place != "No encontrado"){
              num_contractors++
            }
          contador++;
        });
        $scope.num_contractors = num_contractors;
      });
    };

    //Number of Employees's Patents
    function getNumPatentsEmployees() {
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

    //Number of Contractors's Patents
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

    //Number of visits's Patents
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
    //End: Numbers in Dashboard

    var f=new Date();
    var ano = f.getFullYear();
    var mes = f.getMonth()+1;
    var dia = f.getDate();

    //For dennied number in navbar.
    function getRejected() {
      Record.find({ filter:
       { where: { and :
          [{is_input: true},
          {output_datetime: undefined},
          {is_permitted : false}]
        }}
      })
      .$promise
      .then(function(result){
        var contador=0;
        $scope.Dennied = 0;
        angular.forEach(result, function(value, key) {
          var INPUT = new Date(result[contador].input_datetime)
          if(INPUT.getTime() >= new Date(ano+"/"+mes+"/"+dia)){
           // $scope.Dennied++;

          }
          contador++
        });


      });
    };
    //End: For dennied number in navbar


    //Table of departments with number of people in dashboard
    //Get name of companies with id '2', '3' and '8' by default
     function getCompany() {
      Company.find({filter: {where: {or:
        [
          {rut: '2'},
          {rut: '3'},
          {rut: '8'}
        ]
      }}})
      .$promise
      .then(function(results) {
        $scope.companies = results;
      });
     }

     //Get all the records of people that are enabled to enter the plant
     function getRecords() {
      Record.find({filter:
        {where: { and:
          [
            {is_input: true},
            {is_permitted: true}
          ]
        }}
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
        var supreme_counter = 0;
        var arreglo = results;
        var contador = 0;
        var contadorFilter = 0;
        var arreglo2 = $filter('unique')($scope.RecordsAll,'fullname');
        $scope.arregloPeople = {};
        angular.forEach(arreglo, function(value, key) {
          var newTemp = $filter("filter")(arreglo2, {place: arreglo[contadorFilter].name});
          $scope.arregloPeople[contadorFilter] = {Place: arreglo[contadorFilter].name, Count : newTemp.length};
          contadorFilter++;
          supreme_counter = newTemp.length + supreme_counter;
        });
        console.log(supreme_counter);
      })
    }

    //End: Table of departments with number of people in dashboard

    //Get collections.
    getAllPlacesFiltered();
    getNumEmployes();
    getNumVisits();
    getNumContractos();
    getRejected();
    getNumPatentsEmployees();
    getNumPatentsVisits();
    getNumPatentsContractors();
    getCompany();
    getRecords();
  }]);
