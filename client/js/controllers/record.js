angular
.module('app')
.controller('RecordController', ['$scope', '$state', '$filter', 'Record', 'Parking', 'Place', 'Destination', 'VehicleType', 'Blacklist', 'People', '$http', '$window', '$resource','PubSub', 'filterFilter' , function($scope,
    $state, $filter, Record, Parking, Place, Destination, VehicleType, Blacklist, People, $http, $window, $resource, PubSub, filterFilter) {

  //for blacklist
   $scope.blacklist = {};
   $scope.verificador_noencontrado = false;

  //Manual Outputs
  $scope.manual_outputs = [];

  $scope.records = [];
  $scope.recordsForPatents ={};

  //For Dates.
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
        $scope.destinations = results;
    });
  }

  function getAll() {
    Record.find({ filter: { order: ['id ASC'] } })
    .$promise
    .then(function(results) {
      $scope.todayall = results;
    })
  }

  function getManualRecords() {
    Record.find( { filter: { where: { type:"PEN", reviewed: false }, order: ['input_datetime DESC'] } } )
    .$promise
    .then(function(results) {
      $scope.manualrecords = results;
      $scope.num_manualrecords = filterFilter($scope.manualrecords, {reviewed: false}).length;
    })
  }


  function getPendings() {
    Record.find( { filter: { where:  { is_input: true, is_permitted: true }, order: ['input_datetime DESC']  } } )
    .$promise
    .then(function(results) {
      $scope.pendings = results;
      $scope.num_pendings = filterFilter($scope.pendings, {is_input: true, is_permitted: true}).length;
    })
  }

  function getManualOutputs() {
    Record.find( { filter: { where:  { is_input: false }, order: ['input_datetime DESC']  } } )
    .$promise
    .then(function(results) {
      var contador_manual_outputs =0;
      var contador_results = 0;
       angular.forEach(results, function(value, key) {
          if(results[contador_results].user != undefined){
            $scope.manual_outputs[contador_manual_outputs] = results[contador_results];
            contador_manual_outputs++;
          }
        contador_results++;
      });
    })
  }
   function getInPlant() {
    Record.find( { filter: { where: {and: [{ is_input: true, input_datetime: {neq:null}, fullname: {neq: null} }]}, order: ['input_datetime DESC'] } } )
    .$promise
    .then(function(results) {
      $scope.inPlant = results;
      //$scope.inPlant = filterFilter($scope.pendings, {is_input: true, is_permitted: true}).length;
    })
  }


  function getDennieds() {
    Record.find( { filter: { where: {and: [{ is_permitted: false, to_blacklist: {neq: true}}]}, order: ['input_datetime DESC'] } } )
    .$promise
    .then(function(results) {
      $scope.dennieds = results;
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
    Record.find( { filter: { where: { input_patent: {neq: null} }}})
    .$promise
    .then(function(results) {
      $scope.recordsForPatents = results;
    });
  }

  function getInputPatents() {
    Record.find( { filter: { where: { is_input: true, input_patent: {neq: null} }, order: ['input_datetime DESC'] } } )
    .$promise
    .then(function(results) {
      $scope.inputPatents = results;
    })
  }

  switch($state.current.data.accion) {
    case 'pendings' : getPendings(); break;
    case 'employees' : getVehicleType(); break;
    case 'visits' :  getVehicleType(); getDestination(); getParkings(); break;
    case 'contractors' : getVehicleType(); getDestination(); break;
    case 'dennieds' : break;
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

  //For records tabs (employees, contractors and visits)

  //input_datetime undefined in records
  $scope.notFindInputDate = function(profile){
     results_inputNotFind = [];
     Record.find( { filter: { where:
      { profile: profile,
      is_permitted: true }, order:  ['input_datetime DESC'] } } )
    .$promise
    .then(function(results) {
      var counter_inputs_undefined =0;
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
   //End: input_datetime not undefined in records

   //For records tabs (employees, contractors and visits)

  $scope.eventDateFilter = function(column, profile){
    if(column ==='today'){
      var today = new Date(ano+"/"+mes+"/"+dia);
      var date = today.toISOString();
    }
    else if(column === 'pastWeek'){
      var pastWeek = new Date(Date.now()-ONE_WEEK);
      var date = pastWeek.toISOString();
    }
    else if(column === 'pastMonth'){
      var pastMonth = new Date(Date.now()-ONE_MONTH);
      var date = pastMonth.toISOString();
    }
    else if(column === 'all'){
      var all = new Date('0000-01-01T00:00:00.000Z');
      var date = all.toISOString();
    };
     Record.find( { filter:
      { where: { and:
       [{
        profile: profile,
        is_permitted: true,
        input_datetime: {gte:  date}}]
      }},
        order:  ['input_datetime DESC']})
    .$promise
    .then(function(results) {
      $scope.records = results;
    });
  }
  //End: For records tabs (employees, contractors and visits)

  //Dennied view
  //Dennieds tabs
 $scope.eventDateFilterDennied = function(column, profile){
    if(column ==='today'){
      var today = new Date(ano+"/"+mes+"/"+dia);
      var date = today.toISOString();
    }
    else if(column === 'pastWeek'){
      var pastWeek = new Date(Date.now()-ONE_WEEK);
      var date = pastWeek.toISOString();
    }
    else if(column === 'pastMonth'){
      var pastMonth = new Date(Date.now()-ONE_MONTH);
      var date = pastMonth.toISOString();
    }
    else if(column === 'all'){
      var all = new Date('0000-01-01T00:00:00.000Z');
      var date = all.toISOString();
    };
     Record.find( { filter:
      { where: { and:
       [{
        is_permitted: false,
        to_blacklist: {neq: true},
        input_datetime: {gte:  date}}]
      }},
        order:  ['input_datetime DESC']})
    .$promise
    .then(function(results) {
      $scope.dennieds = results;
    });
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
      if (err) { console.log("ERROR", err) }
    });
    getDennieds();
  }
  //End: Dennied to Blacklist
  //End: Dennied view

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
    record.reviewed = false;
    record.is_input = false;
    var dateinput = new Date (record.input_datetime);
    record.output_datetime = new Date(dateinput.setTime(dateinput.getTime() + 1*60*1000));
    record.updated = new Date();
    record.user = localStorage.email;
    record.$save();
    getPendings();
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
    var newRecord = record;
    if(record !== undefined)
    Record
      .create(record)
      .$promise
      .then(function(record) {
        $scope.newRecord = '';
        getPendings();
      })
  };

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
  getRecords();
  getInputPatents();
  getInPlant();
  getManualOutputs();

}]);
