angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', 'Record', 'Parking', function($scope,
      $state, Record, Parking, $http) {
    $scope.records = [];
    ONE_DAY = 24 * 60 * 60 * 1000;
    ONE_WEEK = ONE_DAY * 7;
    ONE_MONTH = ONE_WEEK * 4;
    FILTER = '';

    $scope.employee_searched = function(rut) {
        console.log(rut);
        $http({
            method : "GET",
            url : "http://0.0.0.0:3000/api/records?filter[where][people_run]=" + rut
        }).then(function mySucces(response) {
            console.log(response);
            $scope.myWelcome = response.data;
        }, function myError(response) {
            console.log(response);
            $scope.myWelcome = response.statusText;
        });
    }

    function getParkings() {
        Parking.find()
        .$promise
        .then(function(results) {
            $scope.parkings = results;
        });
    }
    getParkings();

    function getEmployees() {
        Record.find( { filter: { where: { profile: "E" }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.employees = results;
        });
    }

    function getAll() {
        Record.find( { filter: { order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.todayall = results;
        });
    }

    function getVisits() {
        Record.find( { filter: { where: { profile: "V" }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.visits = results;
        });
    }
    getEmployees();
    getVisits();
    getAll();

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

    // Counts
    $scope.num_all = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true}
          ]
      }
    });
    $scope.num_employees = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true},
              {profile: "E"}
          ]
      }
    });
    $scope.num_visits = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {profile: "V"}
          ]
      }
    });
    $scope.num_contractors = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
              {is_permitted: true},
              {profile: "C"}
          ]
      }
    });
    $scope.permitted = Record.count({
      where: { is_permitted : true }
    });
    $scope.rejected = Record.count({
      where: { is_permitted : false }
    });

    // Paginate

    //Reports
    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('records').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };

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

    // New record, not in use now
    $scope.add = function() {
      Record
        .create($scope.newRecord)
        .$promise
        .then(function(record) {
          $scope.newRecord = '';
          $scope.recordForm.content.$setPristine();
          $('.focus').focus();
          getRecords();
        });
    };

    // Add comment to record
    $scope.update = function(record){
        record.updating = 1;
        console.log(record);
        record.$save(record);
  	};

  }]);
