angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', '$filter', 'Record', 'Parking', 'Place', 'Destination', 'VehicleType', 'Blacklist', 'People', '$http', '$window', '$resource','PubSub', 'filterFilter' , function($scope,
      $state, $filter, Record, Parking, Place, Destination, VehicleType, Blacklist, People, $http, $window, $resource, PubSub, filterFilter) {

    //For blacklist
    $scope.blacklist = {};
    $scope.verificador_noencontrado = false;

    //Manual Outputs
    $scope.manual_outputs = [];

    $scope.records = [];
    $scope.recordsForPatents = {};

    //For Dates.
    var f = new Date();
    var ano = f.getFullYear();
    var mes = f.getMonth() + 1;
    var dia = f.getDate();

    ONE_DAY = 24 * 60 * 60 * 1000;
    ONE_WEEK = ONE_DAY * 7;
    ONE_MONTH = ONE_WEEK * 4;
    FILTER = '';

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

    function getDestination() {
      Destination.find()
      .$promise
      .then(function(results) {
        console.log(results);
        $scope.destinations = results;
      });
    }

    function getManualRecords() {
      Record.find( { filter: { where: { reviewed: false }, order: '_id DESC' } } )
      .$promise
      .then(function(results) {
        $scope.manualrecords = results;
        //$scope.num_manualrecords = filterFilter($scope.manualrecords, {reviewed: false}).length;
      })
    }

    function getDennieds() {
      Record.find( { filter: { where: { is_permitted: false, to_blacklist: {neq: true}}, order: '_id DESC' } } )
      .$promise
      .then(function(results) {
        $scope.dennieds = results;
      });
    }

    function getVehicleType() {
      VehicleType.find()
      .$promise
      .then(function(results) {
        $scope.vehicleTypes = results;
      });
    }

    function getRecords4Patents() {
      Record.find( { fields: {input_patent: true}, filter: { where: { input_patent: {neq: null} }}})
      .$promise
      .then(function(results) {
        $scope.recordsForPatents = results;
      });
    }

    function getInputPatents() {
      Record.find( {
        filter: {
          where: {
            is_input: true,
            input_patent: {neq: null}
          },
          order: ['input_datetime DESC']
        }
      })
      .$promise
      .then(function(results) {
          $scope.inputPatents = results;
      })
    }

    $scope.filterByDate = function(input){
      return function(item){
        var INPUT = new Date(item.input_datetime)
        return INPUT.getTime() >= new Date(ano+'/'+mes+'/'+dia);
      }
    }

    //For records tabs (employees, contractors and visits)

    //input_datetime undefined in records
    $scope.notFindInputDate = function(profile){
       results_inputNotFind = [];
       Record.find( {
         filter: {
           where: {
             profile: profile,
             is_permitted: true
           },
           order:  '_id DESC'
         }
       })
       .$promise
       .then(function(results) {
         var counter_inputs_undefined = 0;
         var counter_results = 0;
         angular.forEach(results, function(value, key) {
            if(results[counter_results].input_datetime == undefined){
              results_inputNotFind[counter_inputs_undefined] = results[counter_results];
              counter_inputs_undefined++;
            }
          counter_results++;
        });
        $scope.records = results_inputNotFind;
      });
     }

    // Get data record by profile and date filter.
    $scope.eventDateFilter = function(column, profile, filter){
      var today = new Date(ano + '/' + mes + '/' + dia);
      var date = today.toISOString();

      if (column === 'today') {
        // nothing yet
      } else if (column === 'pastWeek'){
        var pastWeek = new Date(Date.now() - ONE_WEEK);
        date = pastWeek.toISOString();
      } else if(column === 'pastMonth'){
        var pastMonth = new Date(Date.now() - ONE_MONTH);
        date = pastMonth.toISOString();
      } else if(column === 'all'){
        var all = new Date('0000-01-01T00:00:00.000Z');
        date = all.toISOString();
      }

      if (filter === 'inside') {
        Record.find({
          filter: {
            where: {
              and: [
                {profile: profile},
                {is_permitted: true},
                {is_input: true},
                {input_datetime: {gte: date}}
              ]
            },
            order: 'input_datetime DESC' }
          })
        .$promise
        .then(function(results) {
          $scope.recordsFiltered =  $filter('unique')(results,'run');
        })
      } else {
        Record.find({
          filter: {
            where: {
              and: [
                {profile: profile},
                {is_permitted: true},
                {input_datetime: {gte: date}}
              ]
            },
            order: 'input_datetime DESC' }
          })
        .$promise
        .then(function(results) {
          $scope.records = results;
        })
      }

    }

    function getInside() {
      Record.find({
        filter: {
          where: {
            and: [
              {is_input: true},
              {input_datetime: { neq: null }},
              {is_permitted: true }
            ]
          },
          order: 'input_datetime DESC' }
        })
      .$promise
      .then(function(results) {
        //$scope.records = results;
        $scope.recordsFiltered =  $filter('unique')(results,'run');
      })
    }

    //Dennied view
    //Dennieds tabs
   $scope.eventDateFilterDennied = function(column) {
    getDennieds();
      if(column === 'today') {
        $scope.dateRange = '';
        $scope.filterByDate = function(input){
          return function(item){
            var INPUT = new Date(item.input_datetime)
            return INPUT.getTime() >= new Date(ano+'/'+mes+'/'+dia);
          }
        }
      } else if (column === 'pastWeek') {
        //curr_date - 7 dias
        $scope.dateRange = '';
        $scope.filterByDate = function(input){
          return function(item){
            var INPUT = new Date(item.input_datetime)
            return INPUT.getTime() >= Date.now()-ONE_WEEK;
          }
        }
      } else if (column === 'pastMonth') {
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
    //End: Dennieds tabs

    //Dennied to Blacklist
    $scope.denniedToBlacklist = function(record) {
      //save flag in record
      record.to_blacklist = true;
      record.$upsert();
      //save in blacklist
       $scope.blacklist.run = record.run;
       Blacklist.create($scope.blacklist, function(err, model){
        });
      getDennieds();
    }
    //End: Dennied to Blacklist
    //End: Dennied view

    $scope.addVisit = function() {
      $scope.newRecord.profile = 'V';
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

    // Button on pendings view.
    $scope.addOutput = function(record) {
      record.reviewed = false;
      record.is_input = false;
      var dateinput = new Date (record.input_datetime);
      record.output_datetime = new Date(dateinput.setTime(dateinput.getTime() + 1*60*1000));
      record.updated = new Date();
      record.user = localStorage.email;
      record.$save();
      getInside();
    }

    $scope.denniedToBlacklist = function(record) {
      //save flag in record
      record.to_blacklist = true;
      record.$upsert();
      //save in blacklist
       $scope.blacklist.run = record.run;
       Blacklist.create($scope.blacklist, function(err, model){
        });
      getDennieds();
    }

    $scope.addRecord = function(record) {
      //var newRecord = record;
      console.log(record);
      if(record !== undefined)
      Record
        .create(record)
        .$promise
        .then(function(record) {
          $scope.newRecord = '';
          // getAll();
          getPendings();
        })
    };

    // $scope.registrarSalida = function(record){
    //   //Date picker
    // }

    $scope.update = function(record){
        record.updating = true;
        record.$save(record);
  	}

    $scope.updateInputPatent = function(record, item){
      record.input_patent = item;
      record.updating = true;
      record.$save(record);
    }

    $scope.updateOutputPatent = function(record, item){
      record.output_patent = item;
      record.updating = true;
      record.$save(record);
  	}

    $scope.updateManualRecord = function(record) {
      record.reviewed = true;
      record.$save(record)
      getManualRecords();
    }

    //Get Collections
    switch($state.current.data.accion) {
      case 'inside' :
        getInside();
        break;
      case 'employees' :
        getVehicleType();
        $scope.eventDateFilter('today','E', 'all');
        break;
      case 'employeeInside':
        getVehicleType();
        $scope.eventDateFilter('today','E', 'inside');
        break;
      case 'visitInside':
        getVehicleType();
        getDestination();
        getParkings();
        $scope.eventDateFilter('today','V', 'inside');
        break;
      case 'contractorInside':
        getVehicleType();
        getDestination();
        $scope.eventDateFilter('today','C', 'all');
        break;
      case 'visits' :
        getVehicleType();
        getDestination();
        getParkings();
        $scope.eventDateFilter('today','V', 'all');
        break;
      case 'contractors' :
        getVehicleType();
        getDestination();
        $scope.eventDateFilter('today','C', 'all');
        break;
      case 'dennieds' :
        getDennieds();
        break;
      case 'manuals':
        getManualRecords();
        break;
      case 'patentsFiled':
        getInputPatents();
        break;
    }

    getRecords4Patents();

  }]);
