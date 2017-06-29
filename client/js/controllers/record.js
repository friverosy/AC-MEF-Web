angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', '$filter', 'Record', 'Parking', 'Place', 'Destination', 'VehicleType', 'Blacklist', 'People', '$http', '$window', '$resource','PubSub', 'filterFilter' , function($scope,
      $state, $filter, Record, Parking, Place, Destination, VehicleType, Blacklist, People, $http, $window, $resource, PubSub, filterFilter) {

    //For blacklist
    $scope.blacklist = {};
    $scope.verificador_noencontrado = false;
    $scope.registerType = '';
    $scope.filterType = function(type){
      $scope.registerType = type;
    }

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

    // Export to excel
    $scope.exportData = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, to_date(input_datetime) as Entrada, input_patent as Patente, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.recordsFiltered]);
    };

    $scope.exportEmployeesData = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, place as Departamento, to_date(input_datetime) as Entrada, input_patent as Patente, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.records]);
    };

    $scope.exportSuppliersData = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.records]);
    };

    $scope.exportVisitsData = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.records]);
    };

    $scope.exportReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, to_date(input_datetime) as Entrada, place as Departamento, destination as Destino, input_patent as Patente, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalRegister]);
    };

    $scope.exportEmployeesReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, place as Departamento, to_date(input_datetime) as Entrada, input_patent as Patente, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalEmployees]);
    };

    $scope.exportContractorsReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalContractors]);
    };

    $scope.exportSuppliersReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalProveiders]);
    };

    $scope.exportVisitsReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalVisits]);
    };

    $scope.exportVehicleReport = function () {
      alasql.fn.to_date = function(date){
        if (date == undefined) {
          return '';
        }
        var datetime = moment(date);
        datetime = datetime.tz('America/Santiago').format('MMM Do YY h:mm:ss a');
        return datetime;
      };
      alasql('SELECT run as Rut, fullname as Nombre, destination as Destino, to_date(input_datetime) as Entrada, input_patent as Patente ,truck_patent as Camion, rampla_patent as Rampla, to_date(output_datetime) as Salida, comment as Comentario INTO XLSX("report.xlsx",{headers:true}) FROM ?',[$scope.totalVehicles]);
    };

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
        //console.log(results);
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

        //console.log("from ", from.toISOString());
        //console.log("until", until.toISOString());
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
            //console.log($scope.records);
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
        filter: {where: {input_patent: {nin: [null, '']}}}
      })
      .$promise
      .then(function(results) {
        $scope.recordsForPatents = results;
      });
    }

    function getInputPatents() {
      var f = new Date();
      var ano = f.getFullYear();
      var mes = f.getMonth() + 1;
      var dia = f.getDate();
      var today = new Date(ano + '/' + mes + '/' + dia);
      var date = today.toISOString();
      Record.find( {
        filter: {
          where: {
            and: [
              {is_input: true},
              {is_permitted: true},
              {input_datetime: {gte: date}},
              {or: [
                { input_patent: {nin: [null, '']} },
                { truck_patent: {nin: [null, '']} },
                { rampla_patent: {nin: [null, '']} }
              ]}
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
        //console.log(date);
        var array = date.split("-");
        var month = array[0]-1;
        var year = array[1];
        var from = new Date(year,month,01);
        var until = new Date(year,month,31);

        //console.log("from ", from.toISOString());
        //console.log("until", until.toISOString());

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
            //console.log("total", results.length);
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
                {input_datetime: {gte: date}}
              ]
            },
            order: 'input_datetime DESC'
          }
        })
        .$promise
        .then(function(results) {
          $scope.recordsFiltered =  $filter('unique')(results,'run');
          switch(profile) {
            case 'E':
              $scope.num_employees = $scope.recordsFiltered.length;
              break;
            case 'C':
              $scope.num_contractors = $scope.recordsFiltered.length;
              break;
            case 'P':
              $scope.num_suppliers = $scope.recordsFiltered.length;
              break;
            case 'V':
              $scope.num_visits = $scope.recordsFiltered.length;
              break;
          };
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
    };

    //Dennied view
    //Dennieds tabs
  //  $scope.eventDateFilterDennied = function(column) {
  //   getDennieds();
  //     if(column === 'today') {
  //       $scope.dateRange = '';
  //       $scope.filterByDate = function(input){
  //         return function(item){
  //           var INPUT = new Date(item.input_datetime)
  //           return INPUT.getTime() >= new Date(ano+'/'+mes+'/'+dia);
  //         }
  //       }
  //     } else if (column === 'pastWeek') {
  //       //curr_date - 7 dias
  //       $scope.dateRange = '';
  //       $scope.filterByDate = function(input){
  //         return function(item){
  //           var INPUT = new Date(item.input_datetime)
  //           return INPUT.getTime() >= Date.now()-ONE_WEEK;
  //         }
  //       }
  //     } else if (column === 'pastMonth') {
  //       //curr_month - 1
  //       $scope.filterByDate = function(input){
  //         return function(item){
  //           var INPUT = new Date(item.input_datetime)
  //           return INPUT.getTime() >= Date.now()-ONE_MONTH;
  //         }
  //       }
  //     } else {
  //       $scope.filterByDate = function(input){
  //         return function(item){
  //           var INPUT = new Date(item.input_datetime)
  //           return INPUT.getTime() <= Date.now();
  //         }
  //       }
  //     }
  //   }
    //End: Dennieds tabs

    //Dennied to Blacklist
    // $scope.denniedToBlacklist = function(record) {
    //   //save flag in record
    //   record.to_blacklist = true;
    //   record.$upsert();
    //   //save in blacklist
    //    $scope.blacklist.run = record.run;
    //    Blacklist.create($scope.blacklist, function(err, model){
    //     });
    //   getDennieds();
    // }
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
    // function getCounter(profile) {
    //   Record.find({
    //     filter: {
    //       where: {
    //         and:
    //           [
    //             {profile: profile},
    //             {is_input: true},
    //             {is_permitted: true},
    //             {output_datetime: undefined}
    //           ]
    //       }
    //     }
    //   })
    //   .$promise
    //   .then(function(result){
    //     var peopleFiltered = $filter('unique')(result,'run');
    //     switch(profile) {
    //       case 'E':
    //         $scope.num_employees = peopleFiltered.length;
    //         break;
    //       case 'C':
    //         $scope.num_contractors = peopleFiltered.length;
    //         break;
    //       case 'P':
    //         $scope.num_suppliers = peopleFiltered.length;
    //         break;
    //       case 'V':
    //         $scope.num_visits = peopleFiltered.length;
    //         break;
    //     };
    //   });
    // }


    //Get Collections
    switch($state.current.data.accion) {
      case 'inside' :
        getInside();
        break;
      case 'employees' :
        getVehicleType();
        // getCounter('E');
        $scope.eventDateFilter('today','E', 'all');
        break;
      case 'employeeInside':
        getVehicleType();
        // getCounter('E');
        $scope.eventDateFilter('today','E', 'inside');
        break;
      case 'visitInside':
        getVehicleType();
        getDestination();
        // getCounter('V');
        getParkings();
        $scope.eventDateFilter('today','V', 'inside');
        break;
      case 'contractorInside':
        getVehicleType();
        getDestination();
        // getCounter('C');
        $scope.eventDateFilter('today','C', 'inside');
        break;
      case 'visits' :
        getVehicleType();
        getDestination();
        // getCounter('V');
        getParkings();
        $scope.eventDateFilter('today','V', 'all');
        break;
      case 'contractors' :
        getVehicleType();
        // getCounter('C');
        getDestination();
        $scope.eventDateFilter('today','C', 'all');
        break;
      case 'suppliers' :
        getVehicleType();
        // getCounter('P');
        getDestination();
        $scope.eventDateFilter('today','P', 'all');
        break;
      case 'supplierInside':
        getVehicleType();
        getDestination();
        // getCounter('S');
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
