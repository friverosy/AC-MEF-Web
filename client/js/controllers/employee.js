angular.module('app')
  .controller('EmployeeController', ['$scope', 'Record', 'People', 'PubSub', 
  	function($scope, Record, People, PubSub) {

  	$scope.is_saved = false;

  	$scope.employee = {};
  	$scope.employee.is_input = true;
  	$scope.employee.authorized_by = localStorage.getItem("email");
  	$scope.employee.profile = "E";

  	$scope.employee.searchEmployee = function() {
      var id = $scope.employee.peopleId;
      People.findOne({
          where: { run: $scope.employee.peopleId }},
          function (record, err) {
          	if(record){
          		if(record.run == $scope.employee.peopleId){
	          		$scope.employee.peopleId = record.run;
	          		$scope.employee.is_input = true;
				  	$scope.employee.authorized_by = localStorage.getItem("email");
				  	$scope.employee.is_permitted = ((typeof record.is_permited == "undefined")? true : record.is_permitted);
				  	$scope.employee.fullname = record.fullname;
				}
          	}else{
          		console.log(err)
          	}
          	
          });
    };

    $scope.employee.addEmployee = function() {
    	if(typeof $scope.employee.peopleId == "undefined" || $scope.employee.peopleId == ""){
    		alert("Debe ingresar el identificador de empleado");
    		return;
    	}else if(typeof $scope.employee.fullname == "undefined" || $scope.employee.fullname == ""){
    		alert("Debe ingresar el nombre del empleado");
    		return;
    	}else if(typeof $scope.employee.is_input == "undefined"){
    		alert("Debe seleccionar el tipo de registro");
    		return;
    	}
    	/*else if($scope.employee.is_input && (typeof $scope.employee.input_datetime == "undefined" || $scope.employee.input_datetime == "") ) {
    		alert("Debe ingresar la fecha/hora de entrada");
    		return;
    	}else if(!$scope.employee.is_input && (typeof $scope.employee.output_datetime == "undefined" || $scope.employee.output_datetime == "") ) {
    		alert("Debe ingresar la fecha/hora de salida");
    		return;
    	}*/

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