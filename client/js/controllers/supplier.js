angular.module('app')
  .controller('SupplierController', ['$scope', '$http', '$window', 'Record', 'People', 'PubSub', 'Parking', 'Destination',
  	function($scope, $http, $window, Record, People, PubSub, Parking, Destination) {

  	$scope.is_saved = false;

  	$scope.supplier = {};
  	$scope.supplier.is_input = true;
    $scope.supplier.unselectParking = true;
  	$scope.supplier.profile = "P";
    $scope.supplier.checkboxCar = false;
    $scope.peoples = {};
    $scope.record = {};
    //for date in calendar
    $scope.supplier.valuationDate = new Date();
    $scope.supplier.formatDate='dd/MM/yy HH:mm:ss';
    $scope.supplier.valuationDatePickerIsOpen = false;

  	$scope.supplier.searchSupplier = function() {
      People.find( { filter: { where: { run: $scope.supplier.rut, profile: "P" } } } )
      .$promise
      .then(function mySucces(results) {
          $scope.peoples = results;
          record = results;
          if(record != ""){
            if(record[0].run == $scope.supplier.rut){
              $scope.supplier.people_run = record[0].run;
              $scope.supplier.company_code = record[0].company_code;
              $scope.supplier.is_permitted = record[0].is_permitted;
              $scope.supplier.company = record[0].company;
              $scope.supplier.is_input = true;
              $scope.supplier.fullname = record[0].fullname;
              $scope.supplier.truck_patent = record[0].truck_patent;
              $scope.supplier.rampla_patent = record[0].rampla_patent;
            }
            else{
              $scope.supplier.fullname = "";
              alert("El RUT ingresado no existe en los registros de Proveedores");
            }
          }else{
            $scope.supplier.fullname = "";
            alert("El RUT ingresado no existe en los registros de Proveedores");
         }}, function myError(response) {
      $scope.supplier.fullname = "";
      alert("El RUT ingresado no existe en los registros de Contratistas");
     });
    };

    $scope.supplier.addSupplier = function() {
      //Building the record for save.
      $scope.record.run =  $scope.supplier.rut;
      $scope.record.fullname = $scope.supplier.fullname;
      $scope.record.is_input = $scope.supplier.is_input;
      $scope.record.type = "MR";
      $scope.record.profile = "P";
      $scope.record.truck_patent = $scope.supplier.truck_patent;
      $scope.record.rampla_patent = $scope.supplier.rampla_patent;
      $scope.record.reviewed = false;

      //validation for datetime (input_datetime and output datetime)
       if ($scope.record.is_input){
         $scope.record.comment = $scope.supplier.comment;
         $scope.record.destination = $scope.supplier.destination.name;
         $scope.record.input_datetime = $scope.supplier.valuationDate;
       } else {
           $scope.record.output_datetime = $scope.supplier.valuationDate;
       }

      $scope.record.is_permitted = $scope.supplier.is_permitted;
      $scope.record.company_code = $scope.supplier.company_code;
      $scope.record.is_permitted = $scope.supplier.is_permitted;
      $scope.record.company = $scope.supplier.company;

      Record.create($scope.record, function(err,model){
        alert("Proveedor Registrado con exito");
        $window.location.reload();
      });

    };

    $scope.supplier.valuationDatePickerOpen = function () {
      $scope.supplier.valuationDatePickerIsOpen = true;
      $scope.supplier.valuationDate = new Date();
    };

    function getParkings() {
      Parking.find()
      .$promise
      .then(function(results) {
        $scope.parkings = results;
        $scope.supplier.selectedOptionParkings = $scope.parkings[0];
      });
    }

    $scope.getPeople = function(run){
      People.find( { filter: { where: { run: run.people_run } } } )
      .$promise
      .then(function(results) {
        $scope.peoples = results;
      })
    }

    function getDestination() {
      Destination.find()
      .$promise
      .then(function(results) {
        $scope.destinations = results;
      });
    }

    getDestination();
    getParkings();

      //CHECK OUTPUT PARKING
    $scope.outputParkingCheck = function(){
      if($scope.supplier.output_patent != undefined &&  $scope.supplier.output_patent != ""){
        $scope.supplier.unselectParking = false;
      }
      else if($scope.supplier.output_patent == undefined){
        $scope.supplier.unselectParking = true;
      }
      else if($scope.supplier.output_patent == ""){
        $scope.supplier.unselectParking = true;
      }
    }

      //CHECK INPUT PARKING
    $scope.inputParkingCheck = function(){
      if($scope.supplier.input_patent != undefined  && $scope.supplier.input_patent != ""){
        $scope.supplier.unselectParking = false;
      }
      else if($scope.supplier.input_patent == undefined){
        $scope.supplier.unselectParking = true;
      }
      else if($scope.supplier.input_patent == ""){
        $scope.supplier.unselectParking = true;
      }
    }
}]);
