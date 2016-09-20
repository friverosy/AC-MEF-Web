angular
  .module('app', [
    'ui.router',
    'lbServices',
    'angularUtils.directives.dirPagination',
    'ui.bootstrap.datetimepicker',
    'frapontillo.bootstrap-switch'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider,
      $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('dashboard');
    $stateProvider
      .state('accounts', {
        url: '/accounts',
        templateUrl: 'views/accounts.html',
        controller: 'AccountsController',
        onExit: unSubscribeAll
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/record.html',
        controller: 'DashboardController',
        onExit: unSubscribeAll
      })
      .state('todayall', {
        url: '/todayall',
        templateUrl: 'views/todayall.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : ""
        }
      })
      .state('visit', {
        url: '/visits',
        templateUrl: 'views/visits.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "visits"
        }
      })
      .state('contractors', {
        url: '/contractors',
        templateUrl: 'views/contractors.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "contractors"
        }
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'views/employees.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "employees"
        }
      })
      .state('pendings', {
        url: '/pendings',
        templateUrl: 'views/pendings.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "pendings"
        }
      })
      .state('dennieds', {
        url: '/dennieds',
        templateUrl: 'views/dennieds.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : "denieds"
        }
      })
      .state('visit_individual', {
        url: '/visit_individual',
        templateUrl: 'views/visit_individual.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : ""
        }
      })
      .state('contractorInsert', {
        url: '/contractor/new',
        templateUrl: 'views/contractors/insertForm.html',
        controller: 'ContractorController',
        onExit: unSubscribeAll,
        data: {
          accion : ""
        }
      })
      .state('employeeInsert', {
        url: '/employee/new',
        templateUrl: 'views/employees/insertForm.html',
        controller: 'EmployeeController',
        onExit: unSubscribeAll,
        data: {
          accion : ""
        }
      })
      .state('visit_calendar', {
        url: '/visit_calendar',
        templateUrl: 'views/visit_calendar.html',
        controller: 'RecordController',
        onExit: unSubscribeAll,
        data: {
          accion : ""
        }
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports.html',
        controller: 'ReportsController',
        onExit: unSubscribeAll
      })
      .state('maintainers', {
        url: '/maintainers',
        templateUrl: 'views/maintainers.html',
        controller: 'MaintainersController',
        onExit: unSubscribeAll
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileController',
        onExit: unSubscribeAll
      })
      .state('profiles', {
        url: '/profiles',
        templateUrl: 'views/profiles.html',
        controller: 'ProfilesController',
        onExit: unSubscribeAll
      })
      .state('blacklist', {
        url: '/blacklist',
        templateUrl: 'views/blacklist.html',
        controller: 'BlacklistController',
        onExit: unSubscribeAll
      })
      .state('about', {
          //we'll get to this in a bit
      })
    //   $locationProvider.html5Mode(({
    //       enabled: true,
    //       requireBase: true
    //   }));
    //   $locationProvider.hashPrefix('#');
  }]);

//Function for unsubscribing..
var unSubscribeAll = function(PubSub){
    //Unsubscribe all listeners..
    PubSub.unSubscribeAll();
}
