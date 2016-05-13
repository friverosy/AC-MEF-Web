angular
  .module('app', [
    'ui.router',
    'lbServices'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider,
      $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('login');
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/record.html',
        controller: 'RecordController'
      })
      .state('todayall', {
        url: '/todayall',
        templateUrl: 'views/todayall.html',
        controller: 'RecordController'
      })
      .state('visit', {
        url: '/visits',
        templateUrl: 'views/visits.html',
        controller: 'RecordController'
      })
      .state('contractors', {
        url: '/contractors',
        templateUrl: 'views/contractors.html',
        controller: 'RecordController'
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'views/employees.html',
        controller: 'RecordController'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports.html',
        controller: 'RecordController'
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
