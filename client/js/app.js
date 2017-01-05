angular
  .module('app', [
    'ui.router',
    'lbServices',
    'angularUtils.directives.dirPagination',
    'frapontillo.bootstrap-switch',
    'ngAnimate',
    'angular.filter',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.bootstrap.datetimepicker'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider,
    $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('dashboard');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardController',
        onExit: unSubscribeAll,
        data: {
          accion : "dashboard"
        }
      })
      .state('visit', {
        url: '/logbook/visits',
        templateUrl: 'views/logbook/visits/view.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "visits"
        }
      })
      .state('contractors', {
        url: '/logbook/contractors',
        templateUrl: 'views/logbook/contractors/view.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "contractors"
        }
      })
      .state('employees', {
        url: '/logbook/employees',
        templateUrl: 'views/logbook/employees/view.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "employees"
        }
      })
      .state('employeeNew', {
        url: '/logbook/employees/new',
        templateUrl: 'views/logbook/employees/new.html',
        controller: 'EmployeeController',
        onExit: unSubscribeAll,
        data: {
          accion : "employeeNew"
        }
      })
      .state('employeeInside', {
        url: '/logbook/employees/inside',
        templateUrl: 'views/logbook/employees/inside.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "employeeInside"
        }
      })
      .state('visitNew', {
        url: '/logbook/visits/new',
        templateUrl: 'views/logbook/visits/new.html',
        controller: 'VisitController',
        onExit: unSubscribeAll,
        data: {
          accion : "visitNew"
        }
      })
      .state('visitInside', {
        url: '/logbook/visits/inside',
        templateUrl: 'views/logbook/visits/inside.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "visitInside"
        }
      })
      .state('contractorNew', {
        url: '/logbook/contractors/new',
        templateUrl: 'views/logbook/contractors/new.html',
        controller: 'ContractorController',
        onExit: unSubscribeAll,
        data: {
          accion : "contractorNew"
        }
      })
      .state('contractorInside', {
        url: '/logbook/contractors/inside',
        templateUrl: 'views/logbook/contractors/inside.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "contractorInside"
        }
      })
      .state('pendings', {
        url: '/logbook/pendings',
        templateUrl: 'views/logbook/pendings.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "pendings"
        }
      })
      .state('dennieds', {
        url: '/logbook/dennieds',
        templateUrl: 'views/logbook/dennieds.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "dennieds"
        }
      })
      .state('blacklist', {
        url: '/admin/blacklist',
        templateUrl: 'views/admin/blacklist.html',
        controller: 'BlacklistController',
        onExit: unSubscribeAll,
        data: {
          accion : "blacklist"
        }
      })
      .state('maintainers', {
        url: '/admin/maintainers',
        templateUrl: 'views/admin/maintainers.html',
        controller: 'MaintainersController',
        onExit: unSubscribeAll
      })
      .state('profile', {
        url: '/user/profile',
        templateUrl: 'views/user/profile.html',
        controller: 'ProfileController',
        onExit: unSubscribeAll
      })
      .state('profiles', {
        url: '/admin/profiles',
        templateUrl: 'views/admin/profiles.html',
        controller: 'MaintainersController',
        onExit: unSubscribeAll
      })
      .state('manuals', {
        url: '/logbook/manuals',
        templateUrl: 'views/logbook/manuals.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "manuals"
        }
      })
      .state('PatentsFiled', {
        url: '/logbook/PatentsFiled',
        templateUrl: 'views/logbook/PatentsFiled.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "patentsFiled"
        }
      })
     .state('inside', {
        url: '/logbook/inside',
        templateUrl: 'views/logbook/inside.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "inside"
        }
      })
     .state('visitsMaintainers', {
        url: '/people/visits/maintainers',
        templateUrl: 'views/people/visits/maintainers.html',
        controller: 'MaintainersController',
        onExit: unSubscribeAll
      })
  }]);

//Function for unsubscribing..
var unSubscribeAll = function(PubSub){
    //Unsubscribe all listeners..
    PubSub.unSubscribeAll();
}
