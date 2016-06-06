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
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/record.html',
        controller: 'DashboardController'
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
      .state('pendings', {
        url: '/pendings',
        templateUrl: 'views/pendings.html',
        controller: 'RecordController'
      })
      .state('dennieds', {
        url: '/dennieds',
        templateUrl: 'views/dennieds.html',
        controller: 'RecordController'
      })
      .state('employee_individual', {
        url: '/employee_individual',
        templateUrl: 'views/employee_individual.html',
        controller: 'RecordController'
      })
      .state('visit_individual', {
        url: '/visit_individual',
        templateUrl: 'views/visit_individual.html',
        controller: 'RecordController'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'views/reports.html',
        controller: 'ReportsController'
      })
      .state('maintainers', {
        url: '/maintainers',
        templateUrl: 'views/maintainers.html',
        controller: 'MaintainersController'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile.html',
        controller: 'ProfileController'
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
