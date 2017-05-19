angular.module('app')
  .controller('VisitController', ['$scope', '$http', '$window', 'Record', 'People', 'PubSub', 'Place','Destination','Parking', 'VehicleType',
  	function($scope, $http, $window, Record, People, PubSub, Place, Destination, Parking, VehicleType) {

  	$scope.is_saved = false;

  	$scope.employee = {};
  	$scope.employee.is_input = true;
    $scope.employee.unselectParking = true;
  	$scope.employee.profile = "V";
    $scope.employee.checkboxCar = false;
    $scope.peoples = {};
    $scope.record = {};
    $scope.regex = '^[a-zA-Z0-9]+$';

    //for date in calendar
    $scope.employee.valuationDate = new Date();
    $scope.employee.formatDate='dd/MM/yy HH:mm:ss';
    $scope.employee.valuationDatePickerIsOpen = false;

    $scope.employee.addEmployee = function() {
      console.log($scope.employee.people_run);

    	if (typeof $scope.employee.fullname == "undefined" || $scope.employee.fullname == "") {
    		alert("Debe ingresar el nombre completo de la visita");
    		return;
    	} else if (typeof $scope.employee.people_run == "undefined" || $scope.employee.people_run =="") {
    		alert("Debe ingresar el RUT de la visita");
    		return;
    	} else if (typeof $scope.employee.company == "undefined" || $scope.employee.company =="") {
        alert("Debe ingresar el nombre de la compañía de origen de la visita");
        return;
      } else if (typeof $scope.employee.authorized_by == "undefined" || $scope.employee.authorized_by =="") {
        alert("Debe ingresar el nombre de la persona que autoriza la visita");
        return;
      } else if ($scope.employee.is_input && ((($scope.employee.input_patent == undefined || $scope.employee.input_patent == "") && $scope.employee.checkboxCar))) {
        alert("Debe ingresar la patente de entrada");
        return;
      } else if (!$scope.employee.is_input && ((($scope.employee.output_patent == undefined || $scope.employee.output_patent == "") && $scope.employee.checkboxCar))) {
        alert("Debe ingresar la patente de salida");
        return;
      }
      if (typeof $scope.employee.is_input && ($scope.employee.selectedOptionPlaces.name == "undefined" || $scope.employee.selectedOptionPlaces.name == "")) {
        alert("Debe seleccionar el el destino");
        return;
      } else {

        //Building the record for save.
        $scope.record.run =  $scope.employee.people_run;
        $scope.record.fullname = $scope.employee.fullname;
        $scope.record.is_input = $scope.employee.is_input;
        //Place (is_input)
        if ($scope.employee.is_input) {
          $scope.record.destination =  $scope.employee.selectedOptionPlaces.name;
        }
        //car or not
        if ($scope.employee.checkboxCar) {
          //INPUT OR OUTPUT
          if ($scope.record.is_input) {
            $scope.record.input_patent = $scope.employee.input_patent;
            $scope.record.input_patent_type = $scope.employee.selectedOptionVehicleTypes.name;
            $scope.record.parking =  $scope.employee.selectedOptionParkings.name;
          } else {
            $scope.record.output_patent = $scope.employee.output_patent;
            $scope.record.output_patent_type = $scope.employee.selectedOptionVehicleTypes.name;
          }
        }

        $scope.employee.authorized_by
        $scope.record.is_permitted = true;
        $scope.record.type = "MR";
        $scope.record.profile = "V";
        $scope.record.reviewed = false;

        $scope.record.company = $scope.employee.company;
        $scope.record.authorized_by = $scope.employee.authorized_by;
        $scope.record.bus = false;

        //validation for datetime (input_datetime and outputdatetime)
        if ($scope.record.is_input){
            $scope.record.input_datetime = $scope.employee.valuationDate;
        } else {
            $scope.record.output_datetime = $scope.employee.valuationDate;
        }

        Record.create($scope.record, function(err, model) {
          alert("Visita Registrada con exito");
          $window.location.reload();
        });
      }
    };

    $scope.employee.valuationDatePickerOpen = function () {
      $scope.employee.valuationDatePickerIsOpen = true;
      $scope.employee.valuationDate = new Date();
    };

    function getPlaces() {
      Destination.find()
      .$promise
      .then(function(results) {
        $scope.departments = results;
        $scope.employee.selectedOptionPlaces = $scope.departments[0];
      });
    }

    function getParkings() {
      Parking.find()
      .$promise
      .then(function(results) {
        $scope.parkings = results;
        $scope.employee.selectedOptionParkings = $scope.parkings[0];
      });
    }

    $scope.getPeople = function(run) {
      People.find( { filter: { where: { "_id": run.people_run} } } )
      .$promise
      .then(function(results) {
        $scope.peoples = results;
      })
    }

    function getVehicleType() {
      VehicleType.find()
      .$promise
      .then(function(results) {
        $scope.vehicleTypes = results;
        $scope.employee.selectedOptionVehicleTypes = $scope.vehicleTypes[0];
      });
    }

    //CHECK OUTPUT PARKING
    $scope.outputParkingCheck = function() {
      if ($scope.employee.output_patent != undefined &&  $scope.employee.output_patent != "") {
        $scope.employee.unselectParking = false;
      } else if ($scope.employee.output_patent == undefined) {
        $scope.employee.unselectParking = true;
      } else if ($scope.employee.output_patent == "") {
        $scope.employee.unselectParking = true;
      }
    }

    //CHECK INPUT PARKING
    $scope.inputParkingCheck = function() {
      if ($scope.employee.input_patent != undefined  && $scope.employee.input_patent != "") {
        $scope.employee.unselectParking = false;
      } else if ($scope.employee.input_patent == undefined) {
        $scope.employee.unselectParking = true;
      } else if ($scope.employee.input_patent == "") {
        $scope.employee.unselectParking = true;
      }
    }

    getVehicleType();
    getPlaces();
    getParkings();

}]);
