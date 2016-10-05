var updatingInformation = false;

angular.module("app").filter('findById', function() {

  return function(list, _id) {
    for(var i = 0; i < list.length; i++){
      if(list[i]._id == _id){
        return i;
      }
    }
    return -1;
  };
})

angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', 'Record', 'Parking', 'Place', 'VehicleType', '$http', '$window', '$resource','PubSub', 'filterFilter' , '$filter' , function($scope,
      $state, Record, Parking, Place, VehicleType, $http, $window, $resource, PubSub, filterFilter, $filter) {

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

    $scope.records = [];
    $scope.recordsForPatents ={};
    ONE_DAY = 24 * 60 * 60 * 1000;
    ONE_WEEK = ONE_DAY * 7;
    ONE_MONTH = ONE_WEEK * 4;
    FILTER = '';

    $scope.searchEmployee = function() {
      try {
        var rut = $scope.employee.run;
      } catch (err) {
        console.error(err);
      }

      if(rut !== null){
          var url = 'http://0.0.0.0:3000/people/' + rut;
          $http({
              method : 'GET',
              headers: {
                  'Accept': "application/json",
                  'Content-Type': "application/json"
              },
              url : url
          }).then(function mySucces(response) {
              console.log(JSON.stringify(response));
              console.log(response.data);
              $scope.employee = response.data;
          }, function myError(response) {
              console.log(response);
              $scope.employee = response.statusText;
          });
      }else{
          console.log("vacio");
      }
    }

    function getParkings() {
        Parking.find()
        .$promise
        .then(function(results) {
            $scope.parkings = results;
        });
    }
    function getPlaces() {
        Place.find()
        .$promise
        .then(function(results) {
            $scope.places = results;
        });
    }
    function getEmployees() {
        Record.find( { filter: { where: { profile: "E", is_permitted: true }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.employees = results;
            $scope.num_employees = filterFilter($scope.employees, {is_input: true, profile: "E", is_permitted: true}).length;
        })
    }
    function getContractors() {
        Record.find( { filter: { where: { profile: "C", is_permitted: true }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.contractors = results;
            $scope.num_contractors = filterFilter($scope.contractors, {is_input: true, profile: "C", is_permitted: true}).length;
        })
    }
    function getAll() {
        Record.find({ filter: { order: ['id ASC'] } })
        .$promise
        .then(function(results) {
            $scope.todayall = results;
        })
    }

    function getManualRecords() {
        Record.find( { filter: { where: { reviewed: true }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.manualrecords = results;
            $scope.num_manualrecords = filterFilter($scope.manualrecords, {reviewed: true}).length;
        })
    }

    function getVisits() {
        Record.find( { filter: { where: { profile: "V" }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.visits = results;
            $scope.num_visits = filterFilter($scope.visits, {is_input: true, profile: "V"}).length;
        })
    }
    function getPendings() {
        Record.find( { filter: { where: { is_input: true, is_permitted: true }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.pendings = results;
            $scope.num_pendings = filterFilter($scope.pendings, {is_input: true, is_permitted: true}).length;
        })
    }
    function getDennieds() {
        Record.find( { filter: { where: { is_permitted: false }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.dennieds = results;
            $scope.rejected = filterFilter($scope.pendings, {is_permitted : false}).length;
        });
    }
    function getVehicleType() {
        VehicleType.find( )
        .$promise
        .then(function(results) {
            $scope.vehicleTypes = results;
        });
    }

     function getRecords() {
        Record.find( )
        .$promise
        .then(function(results) {
            $scope.recordsForPatents = results;
            console.log($scope.recordsForPatents);
        });
    }

    $scope.onTimeSet = function (newDate, oldDate, record) {
        record.output_datetime = $filter("date")(record.output_datetime,"yyyy-MM-ddTHH:mm:ss")
        record.is_input = false;
        delete record.id;
        Record.create(record);
    }

    switch($state.current.data.accion) {
      case 'pendings' : getPendings(); break;
      case 'employees' : getEmployees(); getVehicleType(); break;
      case 'visits' : getVisits(); getVehicleType(); getPlaces(); getParkings(); break;
      case 'contractors' : getContractors(); getVehicleType(); break;
      case 'dennieds' : getDennieds(); break;
      case 'manualRecords': getManualRecords(); break;
    }

    var f=new Date();
    var ano = f.getFullYear();
    var mes = f.getMonth()+1;
    var dia = f.getDate();

    $scope.filterByDate = function(input){
        return function(item){
            var INPUT = new Date(item.input_datetime)
            return INPUT.getTime() >= new Date(ano+"/"+mes+"/"+dia);
        }
    }

    $scope.eventDateFilter = function(column) {
        if(column === 'today') {
            $scope.dateRange = "";
            $scope.filterByDate = function(input){
                return function(item){
                    var INPUT = new Date(item.input_datetime)
                    return INPUT.getTime() >= new Date(ano+"/"+mes+"/"+dia);
                }
            }
        } else if (column === 'pastWeek') {
            //need logic
            //curr_date - 7 dias
            $scope.dateRange = "";
            $scope.filterByDate = function(input){
                return function(item){
                    var INPUT = new Date(item.input_datetime)
                    return INPUT.getTime() >= Date.now()-ONE_WEEK;
                }
            }
        } else if (column === 'pastMonth') {
            //need logic
            //curr_month - 1
            $scope.filterByDate = function(input){
                return function(item){
                    var INPUT = new Date(item.input_datetime)
                    return INPUT.getTime() >= Date.now()-ONE_MONTH;
                }
            }
        } else {
            $scope.filterByDate = function(input){
                return function(item){
                    var INPUT = new Date(item.input_datetime)
                    return INPUT.getTime() <= Date.now();
                }
            }
        }
    }

    $scope.addVisit = function() {
        $scope.newRecord.profile = "V";
        $scope.newRecord.is_permitted = true;
        $scope.newRecord.is_input = true;
      Record
        .create($scope.newRecord)
        .$promise
        .then(function(record) {
          $scope.newRecord = '';
          $scope.visitForm.run.$setPristine();
          $('.focus').focus();
        })
    };

    $scope.addOutput = function(record) {
      record.type = "PEN";
      record.state = "C";
      record.is_input = false;
      record.output_datetime = new Date();
      record.$save();
      getPendings();
    }

    $scope.addRecord = function(record) {
      var newRecord = record;
      if(record !== undefined)
      Record
        .create(record)
        .$promise
        .then(function(record) {
          console.log("sacado");
          $scope.newRecord = '';
          // getAll();
          getPendings();
        })
    };

    $scope.registrarSalida = function(record){
      //Date picker
    }

    $scope.update = function(record){
        record.updating=true;
        record.$save(record);
  	}

 $scope.updateInputPatent = function(record, item){
        record.input_patent = item;
        record.updating=true;
        record.$save(record);

    }

 $scope.updateOutputPatent = function(record, item){
        record.output_patent = item;
        record.updating=true;
        record.$save(record);
  	}

    $scope.updateManualRecord = function(record) {
      record.reviewed = false;
      record.$save(record)
      getManualRecords();
    }

    //Suscribe to Socket.io events

    var onRecordCreate = function(data) {
      if(!updatingInformation){
          updatingInformation = true;
          if(data.instance.is_input == true) {
            $scope.pendings.push(data.instance)
          }else{
            var index = $filter("findById")($scope.pendings,data._id)
            $scope.pendings.splice(index,1);
          }

          if(data.instance.is_input == true) {
            switch(data.instance.profile){
            case 'E' : if(typeof $scope.employees != "undefined"){
                          $scope.employees.push(data.instance);
                       }
                       break;
            case 'V' : if(typeof $scope.visits != "undefined"){
                          $scope.visits.push(data.instance);
                       }
                       break;
            case 'C' : if(typeof $scope.contractors != "undefined"){
                          $scope.contractors.push(data.instance)
                       };
                       break;
            }
          } else {
            switch(data.instance.profile){
            case 'E' : if(typeof $scope.employees != "undefined"){
                          var index = $filter("findById")($scope.employees,data._id);
                          $scope.employees.splice(index,1);
                       }
                       break;
            case 'V' : if(typeof $scope.visits != "undefined") {
                          var index = $filter("findById")($scope.visits,data._id);
                          $scope.visits.splice(index,1);
                       }
                       break;
            case 'C' : if(typeof $scope.contractors != "undefined"){
                           var index = $filter("findById")($scope.contractors,data._id)
                           $scope.contractors.splice(index,1);
                       };
                       break;
            }
          }
        }
        updatingInformation = false;
    }
    getRecords();

    PubSub.subscribe({
                collectionName: 'Record',
                method : 'POST'
            }, onRecordCreate);
  }]);
