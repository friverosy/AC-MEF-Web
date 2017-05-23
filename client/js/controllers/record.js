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
    $scope.totalRegister_length = 0;
    $scope.totalEmployees_length = 0;
    $scope.totalContractors_length = 0;
    $scope.totalSuppliers_length = 0;
    $scope.totalVisits_length = 0;
    $scope.totalVehicles_length = 0;

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
        $scope.destinations = results;
      });
    }

    function getManualRecords() {
      Record.find( {
        filter: {
          where: { reviewed: false },
          order: '_id DESC' }
      })
      .$promise
      .then(function(results) {
        $scope.manualrecords = results;
        console.log(results);
        //$scope.num_manualrecords = filterFilter($scope.manualrecords,
        //{reviewed: false}).length;
      })
    }

    function getDennieds() {
      Record.find( {
        filter: {
          where: { is_permitted: false, to_blacklist: {neq: true}},
          order: '_id DESC' }
      } )
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

    $scope.getIndividualReport = function() {
        var array = $scope.person.month.split("-");
        var month = array[0]-1;
        var year = array[1];
        var from = new Date(year,month,01);
        var until = new Date(year,month,31);

        console.log("from ", from.toISOString());
        console.log("until", until.toISOString());
        Record.find({
            filter: {
                where: {
                    and: [
                        {'run': $scope.person.rut},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.records = results;
            console.log($scope.records);
        })
    }

    function getPeople() {
        People.find({
            filter: {
                fields: {run: true}
            }
        })
        .$promise
        .then(function(results) {
            $scope.people = $filter('unique')(results,'run');
        });
    }

    function getRecords4Patents() {
      Record.find({
        fields: {input_patent: true},
        filter: { where: { input_patent: {neq: null} }}
      })
      .$promise
      .then(function(results) {
        $scope.recordsForPatents = results;
      });
    }

    function getInputPatents() {
      Record.find( {
        filter: {
          where: {
            and: [
              {is_input: true},
              {input_patent: {neq: ''}},
              {input_patent: {neq: null}}
            ]
          },
          order: ['input_datetime DESC']
        }
      })
      .$promise
      .then(function(results) {
          $scope.inputPatents = results;
      })
    }

    $scope.getReport = function() {
        Report($scope.reportForm.$$success.parse[0].$$rawModelValue)
    }

    function Report(date) {
        console.log(date);
        var array = date.split("-");
        var month = array[0]-1;
        var year = array[1];
        var from = new Date(year,month,01);
        var until = new Date(year,month,31);

        console.log("from ", from.toISOString());
        console.log("until", until.toISOString());

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.totalRegister_length =  results.length;
            $scope.totalRegister =  results;
        });

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {profile: "E"},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.totalEmployees_length =  results.length;
            $scope.totalEmployees =  results;
        });

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {profile: "C"},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.totalContractors_length =  results.length;
            $scope.totalContractors =  results;
        });

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {profile: "P"},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.total_Supplierslength =  results.length;
            $scope.totalSuppliers =  results;
        });

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {profile: "V"},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            $scope.totalVisits_length =  results.length;
            $scope.totalVisits =  results;
        });

        Record.find({
            filter: {
                where: {
                    and: [
                        {is_permitted: true},
                        {input_patent: {nin: [null, '']}},
                        {input_datetime: {
                            between: [
                                from.toISOString(),
                                until.toISOString()
                            ]
                        }}
                    ]
                }
            }
        })
        .$promise
        .then(function(results) {
            console.log("total", results.length);
            $scope.totalVehicles_length =  results.length;
            $scope.totalVehicles =  results;
        });
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

      if (profile === '') { // For /#/logbook/inside all profile
        Record.find({
          filter: {
            where: {
              and: [
                {is_permitted: true},
                {is_input: true},
                {input_datetime: {gte: date}}
              ]
            },
            order: 'input_datetime DESC'
          }
        })
        .$promise
        .then(function(results) {
          $scope.recordsFiltered =  $filter('unique')(results,'run');
        });
      } else if (filter === 'inside') {
        Record.find({
          filter: {
            where: {
              and: [
                {profile: profile},
                {is_permitted: true},
                {is_input: true},
                {input_datetime: {gte: date}},
                {output_datetime: undefined}
              ]
            },
            order: 'input_datetime DESC'
          }
        })
        .$promise
        .then(function(results) {
          $scope.recordsFiltered =  $filter('unique')(results,'run');
        });
      } else {
        Record.find({
          filter: {
            where: {
              and: [
                {profile: profile},
                {input_datetime: {gte: date}}
              ]
            },
            order: 'input_datetime DESC'
          }
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
      });
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
      // Find all pendings records
      Record.find({
        filter: {
          where: {
            and: [
              {is_input: true},
              {run: record.run},
              {input_datetime: {lte: new Date(record.input_datetime)}}
            ]
          }
        }
      })
      .$promise
      .then(function(results) {
        for (i = 0; i < results.length; i++) {
          results[i].is_input = false;
          var dateinput = new Date (results[i].input_datetime);
          results[i].output_datetime = new Date(
            dateinput.setTime(dateinput.getTime() + 1*60*1000)
          );
          results[i].updated = new Date();
          results[i].reviewed = false;
          results[i].user = localStorage.email;
          results[i].$save();
        }
        getInside();
      });
    }

    $scope.addSingleOutput = function(record) {
      Record.findOne({
        filter: {
          where: {
            id: record.id
          }
        }
      })
      .$promise
      .then(function(result) {
        result.is_input = false;
        var dateinput = new Date (result.input_datetime);
        result.output_datetime = new Date(
          dateinput.setTime(dateinput.getTime() + 1*60*1000)
        );
        result.updated = new Date();
        result.reviewed = false;
        result.user = localStorage.email;
        result.$save();
        getInputPatents();
      });
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
                {is_permitted: true},
                {output_datetime: undefined}
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
                {profile: "V"},
                {output_datetime: undefined}
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
          if(visitFiltered[contador].output_datetime == undefined && visitFiltered[contador].is_input == true)
            num_visits++
          contador++;
        });
        $scope.num_visits = num_visits;
      })};

      //Number of contractors inside
      function getNumContractors() {
        Record.find({
          filter: {
            where: {
              and: [
                {is_input: true},
                {output_datetime: undefined},
                {profile: "C"},
                {is_permitted: true}
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
            if(contractorFiltered[contador].output_datetime == undefined && contractorFiltered[contador].is_input == true)
                num_contractors++
            contador++;
          });
          $scope.num_contractors = num_contractors;
        });
      };

      //Number of suppliers inside
      function getNumSuppliers() {
        Record.find({
          filter: {
            where: {
              and: [
                {is_input: true},
                {output_datetime: undefined},
                {profile: "P"},
                {is_permitted: true}
              ]
            }
          }
        })
        .$promise
        .then(function(result){
          //$scope.num_contractors = result;
          var contador = 0;
          var num_suppliers = 0;
          var suppliersFiltered = $filter('unique')(result,'fullname');
          angular.forEach(suppliersFiltered, function(value, key) {
            if(suppliersFiltered[contador].output_datetime == undefined && suppliersFiltered[contador].is_input == true)
                num_suppliers++
            contador++;
          });
          $scope.num_suppliers = num_suppliers;
        });
      };

    //Get Collections
    switch($state.current.data.accion) {
      case 'inside' :
        getInside();
        break;
      case 'employees' :
        getVehicleType();
        getNumEmployes();
        $scope.eventDateFilter('today','E', 'all');
        break;
      case 'employeeInside':
        getVehicleType();
        getNumEmployes();
        $scope.eventDateFilter('today','E', 'inside');
        break;
      case 'visitInside':
        getVehicleType();
        getDestination();
        getNumVisits();
        getParkings();
        $scope.eventDateFilter('today','V', 'inside');
        break;
      case 'contractorInside':
        getVehicleType();
        getDestination();
        getNumContractors();
        $scope.eventDateFilter('today','C', 'inside');
        break;
      case 'visits' :
        getVehicleType();
        getDestination();
        getNumVisits();
        getParkings();
        $scope.eventDateFilter('today','V', 'all');
        break;
      case 'contractors' :
        getVehicleType();
        getNumContractors();
        getDestination();
        $scope.eventDateFilter('today','C', 'all');
        break;
      case 'suppliers' :
          getVehicleType();
          getNumSuppliers();
          getDestination();
          $scope.eventDateFilter('today','P', 'all');
          break;
      case 'supplierInside':
            getVehicleType();
            getDestination();
            getNumSuppliers();
            $scope.eventDateFilter('today','P', 'inside');
            break;
      case 'dennieds' :
        getDennieds();
        break;
      case 'manuals':
        getManualRecords();
        break;
      case 'patentsFiled':
        getVehicleType();
        getDestination();
        getParkings();
        getInputPatents();
        break;
      case 'individual-report':
        //getPeople();
        break;
    }

    getRecords4Patents();
  }
]
);
