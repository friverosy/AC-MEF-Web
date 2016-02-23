angular
  .module('app', [
    'lbServices',
    'ui.router'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
      $urlRouterProvider) {
    $stateProvider
      .state('record', {
        url: '',
        templateUrl: 'views/record.html',
        controller: 'RecordController'
      });

    $urlRouterProvider.otherwise('record');
  }]);
