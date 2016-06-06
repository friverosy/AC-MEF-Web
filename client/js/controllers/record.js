angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', 'Record', 'Parking', 'Destination', '$http', '$window', function($scope,
      $state, Record, Parking, Destination, $http, $window) {

      if(localStorage.email != "cberzins@multiexportfoods.com" && localStorage.password != "CB3rZin5"){
          $window.location.href = '/login';
      }else{
        //   console.log("aca");
      }

    $scope.logout = function() {
          localStorage.clear();
          $window.location.href = '/login';
    };

    $scope.records = [];
    ONE_DAY = 24 * 60 * 60 * 1000;
    ONE_WEEK = ONE_DAY * 7;
    ONE_MONTH = ONE_WEEK * 4;
    FILTER = '';

    $scope.employee_search = function(rut) {
        if(rut != null){
            var url = 'http://10.0.0.125:6000/employee/' + rut;
            $http({
                method : 'GET',
                url : url
            }).then(function mySucces(response) {
                console.log(response);
                $scope.employee = response.data;
                // for(var i=0;i<len;i++){
                //     twitterEntry = dataWeGotViaJsonp[i];
                //     text += '<p><img src = "' + twitterEntry.user.profile_image_url_https +'"/>' + twitterEntry['text'] + '</p>'
                // }
                // $('#twitterFeed').html(text);
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
    function getDestinations() {
        Destination.find()
        .$promise
        .then(function(results) {
            $scope.destinations = results;
        });
    }
    getParkings();
    getDestinations();

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

    function getPendings() {
        Record.find( { filter: { where: { output_datetime: undefined }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.pendings = results;
        });
    }

    function getDennieds() {
        Record.find( { filter: { where: { is_permitted: false }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.dennieds = results;
        });
    }

    getEmployees();
    getVisits();
    getAll();
    getPendings();
    getDennieds();

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

    $scope.addVisit = function() {
        $scope.newRecord.profile = "V";
        $scope.newRecord.is_permitted = true;
      Record
        .create($scope.newRecord)
        .$promise
        .then(function(record) {
          $scope.newRecord = '';
          $scope.visitForm.people_run.$setPristine();
          $('.focus').focus();
        });
    };

    // Add comment to record
    $scope.update = function(record){
        record.$save(record);
  	};

    // Add parkin to record
    $scope.updateParking = function(record){
        record.$save(record);
  	};

    // Add destination to record
    $scope.updateDestination = function(record){
        record.$save(record);
  	};

  }]);
