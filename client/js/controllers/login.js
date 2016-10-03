angular.module('app')
  .controller('LoginController', ['$scope', '$state', 'User', function($scope, $state, User) {


  $scope.login = {};

  $scope.login.userPass = function (user, pass) {
          console.log(user);
          console.log(pass);

          User.find({
          where: { and:
            [
              {name: name},
              {base: pass}
            ]
          }
        })
        .$promise
        .then(function mySucces(results) {
          record = result;
          if(record!=""){
              localStorage.setItem("email", user);
              localStorage.setItem("password", pass);
              location="/#/dashboard"
          }
        },function myError(response) {
          localStorage.setItem("email", "");
          localStorage.setItem("password", "");
          location="/#/login";
       });
  }


//function pasuser(form) {
   // console.log(form.password.value);
    //console.log(form.email.value);


    /*
    switch (form.email.value) {
      case "cberzins@multiexportfoods.com":
        if (form.password.value == "CB3rZin5"){
            localStorage.setItem("email", form.email.value);
            localStorage.setItem("password", form.password.value);
            location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "jaime":
        if (form.password.value=="j4im3") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "seguridad1":
        if (form.password.value=="84799") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "seguridad2":
        if (form.password.value=="14551") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
      break;
        break;
      case "seguridad3":
        if (form.password.value=="66494") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "asistente1":
        if (form.password.value=="25913") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "asistente2":
        if (form.password.value=="19825") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
      case "asistente3":
        if (form.password.value=="41331") {
          localStorage.setItem("email", form.email.value);
          localStorage.setItem("password", form.password.value);
          location="/#/dashboard"
        }
        else alert("Invalid Password")
        break;
        case "seguridad4":
          if (form.password.value=="74294") {
            localStorage.setItem("email", form.email.value);
            localStorage.setItem("password", form.password.value);
            location="/#/dashboard"
          }
  	      else alert("Invalid Password")
          break;
        case "seguridad5":
          if (form.password.value=="74225") {
            localStorage.setItem("email", form.email.value);
            localStorage.setItem("password", form.password.value);
            location="/#/dashboard"
          }
  	      else alert("Invalid Password")
          break;
        case "seguridad6":
          if (form.password.value=="35294") {
            localStorage.setItem("email", form.email.value);
            localStorage.setItem("password", form.password.value);
            location="/#/dashboard"
          }
  	      else alert("Invalid Password")
          break;
      default:
        alert("Invalid user")*/

//}
}]);
