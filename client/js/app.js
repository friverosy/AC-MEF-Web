angular
  .module('app', [
    'ui.router',
    'lbServices',
    'angularUtils.directives.dirPagination'
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
        onExit: unSubscribeAll
      })
      .state('visit', {
        url: '/visits',
        templateUrl: 'views/visits.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('contractors', {
        url: '/contractors',
        templateUrl: 'views/contractors.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'views/employees.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('pendings', {
        url: '/pendings',
        templateUrl: 'views/pendings.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('dennieds', {
        url: '/dennieds',
        templateUrl: 'views/dennieds.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('employee_individual', {
        url: '/employee_individual',
        templateUrl: 'views/employee_individual.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('visit_individual', {
        url: '/visit_individual',
        templateUrl: 'views/visit_individual.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
      })
      .state('visit_calendar', {
        url: '/visit_calendar',
        templateUrl: 'views/visit_calendar.html',
        controller: 'RecordController',
        onExit: unSubscribeAll
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

