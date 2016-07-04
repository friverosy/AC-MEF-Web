angular
  .module('app')
  .controller('RecordController', ['$scope', '$state', 'Record', 'Parking', 'Destination', '$http', '$window', '$resource', function($scope,
      $state, Record, Parking, Destination, $http, $window, $resource) {

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
    ONE_DAY = 24 * 60 * 60 * 1000;
    ONE_WEEK = ONE_DAY * 7;
    ONE_MONTH = ONE_WEEK * 4;
    FILTER = '';

    $scope.searchEmployee = function() {
      try {
        var rut = $scope.employee.people_run;
      } catch (err) {
        console.error(err);
      }

        if(rut !== null){
            var url = 'http://10.0.0.125:6000/employee/' + rut;
            // var url = 'http://restcountries.eu/rest/v1/';



            // var User = $resource('http://10.0.0.125:6000/employee/:rut', {rut});
            // User.get({rut}, function(user, getResponseHeaders){
            //
            //   console.log(user);
            //
            // });

            // curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET url


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
                // for(var i=0;i<len;i++){
                //     twitterEntry = dataWeGotViaJsonp[i];
                //     text += '<p><img src = "' + twitterEntry.user.profile_image_url_https +'"/>' + twitterEntry['text'] + '</p>'
                // }
                // $('#twitterFeed').html(text);
            }, function myError(response) {
                // console.log(response);
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
    function getEmployees() {
        Record.find( { filter: { where: { profile: "E", is_permitted: true }, order: ['input_datetime DESC'] } } )
        .$promise
        .then(function(results) {
            $scope.employees = results;
        });
    }
    function getAll() {
        Record.find( { filter: { order: ['id ASC'] } } )
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
        Record.find( { filter: { where: { is_input: true }, order: ['input_datetime DESC'] } } )
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
    getParkings();
    getDestinations();

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
    $scope.num_pendings = Record.count({
      where: { is_input: true}
    });

    $scope.num_employees = Record.count({
      where: { and:
          [
              {is_input: true},
              {output_datetime: undefined},
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
    // $scope.exportData = function () {
    //     var blob = new Blob([document.getElementById('records').innerHTML], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //     });
    //     saveAs(blob, "Report.xls");
    // };

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
          $scope.visitForm.people_run.$setPristine();
          $('.focus').focus();
        });
    };

    $scope.addRecord = function() {
      console.log($scope.newRecord);
      if($scope.newRecord !== undefined)
      Record
        .create($scope.newRecord)
        .$promise
        .then(function(record) {
          console.log(record);
          $scope.newRecord = '';
          getAll();
        });
    };

    $scope.update = function(record){
        record.updating=true;
        record.$save(record);
  	};

  }]);
