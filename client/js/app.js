angular
  .module('app', [
    'lbServices',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('record', {
        url: '/',
        templateUrl: 'views/record.html',
        controller: 'RecordController'
      })
      .state('visit', {
        url: '/visits',
        templateUrl: 'views/visits.html',
        controller: 'VisitController'
      })
      .state('contractors', {
        url: '/contractors',
        templateUrl: 'views/contractors.html',
        controller: 'ContractorController'
      })
      .state('about', {
          //we'll get to this in a bit
      })
  }]);
