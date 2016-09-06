angular.module('app')
  .controller('EmployeeController', ['$scope', '$http', 'Record', 'People', 'PubSub', 
  	function($scope, $http, Record, People, PubSub) {

  	$scope.is_saved = false;

  	$scope.employee = {};
  	$scope.employee.is_input = true;
  	$scope.employee.authorized_by = localStorage.getItem("email");
  	$scope.employee.profile = "E";

  	$scope.employee.searchEmployee = function() {

      var url = 'http://127.0.0.1:3000/api/people/' + $scope.employee.people_run;
      $http({
        method : 'GET',
        headers: {
          'Accept': "application/json",
          'Content-Type': "application/json"
        },
        url : url
      }).then(function mySucces(record) {
        record = record.data;
        if(record){
          if(record.run == $scope.employee.people_run && record.profile == "E"){
            $scope.employee.people_run = record.run;
            $scope.employee.is_input = true;
            $scope.employee.authorized_by = localStorage.getItem("email");
            $scope.employee.is_permitted = ((typeof record.is_permited == "undefined")? true : record.is_permitted);
            $scope.employee.fullname = record.fullname;
          }else{
            //todo si no existe
          }
        }
      }, function myError(response) {
        console.log(response)
      });
    };

    $scope.employee.addEmployee = function() {
    	if(typeof $scope.employee.people_run == "undefined" || $scope.employee.people_run == ""){
    		alert("Debe ingresar el identificador de empleado");
    		return;
    	}else if(typeof $scope.employee.fullname == "undefined" || $scope.employee.fullname == ""){
    		alert("Debe ingresar el nombre del empleado");
    		return;
    	}else if(typeof $scope.employee.is_input == "undefined"){
    		alert("Debe seleccionar el tipo de registro");
    		return;
    	}else if($scope.employee.is_input && (typeof $scope.employee.input_patent == "undefined" || $scope.employee.input_patent == "") ) {
        alert("Debe ingresar la patente de entrada");
        return;
      }else if($scope.employee.is_input && (typeof $scope.employee.input_patent_type == "undefined" || $scope.employee.input_patent_type == "") ) {
        alert("Debe ingresar el tipo de patente de entrada");
        return;
      }else if($scope.employee.is_input && (typeof $scope.employee.input_datetime == "undefined" || $scope.employee.input_datetime == "") ) {
    		alert("Debe ingresar la fecha/hora de entrada");
    		return;
    	}else if(!$scope.employee.is_input && (typeof $scope.employee.output_datetime == "undefined" || $scope.employee.output_datetime == "") ) {
    		alert("Debe ingresar la fecha/hora de salida");
    		return;
    	}else if(!$scope.employee.is_input && (typeof $scope.employee.output_patent == "undefined" || $scope.employee.output_patent == "") ) {
        alert("Debe ingresar la patente de salida");
        return;
      }else if(!$scope.employee.is_input && (typeof $scope.employee.output_patent_type == "undefined" || $scope.employee.output_patent_type == "") ) {
        alert("Debe ingresar el tipo de patente de salida");
        return;
      }

    	if($scope.employee.is_input){
    		$scope.employee.input_datetime = Date();
    	}else{
    		$scope.employee.output_datetime = Date();
    	}

    	Record.create($scope.employee, function(err,model){
    		$scope.is_saved = false;
    	});
      
    };
    
}]);