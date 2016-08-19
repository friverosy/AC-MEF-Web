'use strict';
angular.module('app', ['lbServices', 'ui-router', 'angularUtils.directives.dirPagination'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider,
    $urlRouterProvider,$locationProvider) {
  $urlRouterProvider.otherwise('dashboard');
  $locationProvider.html5Mode(false);
  $stateProvider
    .state('accounts', {
      url: '/accounts',
      templateUrl: 'views/accounts.html',
      controller: 'AccountsController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'views/record.html',
      controller: 'DashboardController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('todayall', {
      url: '/todayall',
      templateUrl: 'views/todayall.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('visit', {
      url: '/visits',
      templateUrl: 'views/visits.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('contractors', {
      url: '/contractors',
      templateUrl: 'views/contractors.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('employees', {
      url: '/employees',
      templateUrl: 'views/employees.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('bus', {
      url: '/bus',
      templateUrl: 'views/bus.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('pendings', {
      url: '/pendings',
      templateUrl: 'views/pendings.html',
      controller: 'RecordController'
    })
    .state('dennieds', {
      url: '/dennieds',
      templateUrl: 'views/dennieds.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('employee_individual', {
      url: '/employee_individual',
      templateUrl: 'views/employee_individual.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('visit_individual', {
      url: '/visit_individual',
      templateUrl: 'views/visit_individual.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('visit_calendar', {
      url: '/visit_calendar',
      templateUrl: 'views/visit_calendar.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('reports', {
      url: '/reports',
      templateUrl: 'views/reports.html',
      controller: 'ReportsController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('maintainers', {
      url: '/maintainers',
      templateUrl: 'views/maintainers.html',
      controller: 'MaintainersController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'views/profile.html',
      controller: 'ProfileController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('profiles', {
      url: '/profiles',
      templateUrl: 'views/profiles.html',
      controller: 'ProfilesController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('blacklist', {
      url: '/blacklist',
      templateUrl: 'views/blacklist.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('people', {
      url: '/people',
      templateUrl: 'views/people.html',
      controller: 'RecordController',
      //Here unsubscribe function must be called to unsubcribe all events on state change
      onExit: unSubscribeAll
    })
    .state('about', {
        //we'll get to this in a bit
    });
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
