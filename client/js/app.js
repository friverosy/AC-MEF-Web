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
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider,
        $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('dashboard');
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardController',
                data: {
                    accion: "dashboard"
                }
            })
            .state('visit', {
                url: '/logbook/visits',
                templateUrl: 'views/logbook/visits/view.html',
                controller: 'RecordController',
                data: {
                    accion: "visits"
                }
            })
            .state('contractors', {
                url: '/logbook/contractors',
                templateUrl: 'views/logbook/contractors/view.html',
                controller: 'RecordController',
                data: {
                    accion: "contractors"
                }
            })
            .state('employees', {
                url: '/logbook/employees',
                templateUrl: 'views/logbook/employees/view.html',
                controller: 'RecordController',
                data: {
                    accion: "employees"
                }
            })
            .state('employeeNew', {
                url: '/logbook/employees/new',
                templateUrl: 'views/logbook/employees/new.html',
                controller: 'EmployeeController',
                data: {
                    accion: "employeeNew"
                }
            })
            .state('employeeInside', {
                url: '/logbook/employees/inside',
                templateUrl: 'views/logbook/employees/inside.html',
                controller: 'RecordController',
                data: {
                    accion: "employeeInside"
                }
            })
            .state('suppliers', {
                url: '/logbook/suppliers',
                templateUrl: 'views/logbook/suppliers/view.html',
                controller: 'RecordController',
                data: {
                    accion: "suppliers"
                }
            })
            .state('supplierNew', {
                url: '/logbook/suppliers/new',
                templateUrl: 'views/logbook/suppliers/new.html',
                controller: 'SupplierController',
                data: {
                    accion: "supplierNew"
                }
            })
            .state('supplierInside', {
                url: '/logbook/suppliers/inside',
                templateUrl: 'views/logbook/suppliers/inside.html',
                controller: 'RecordController',
                data: {
                    accion: "supplierInside"
                }
            })
            .state('visitNew', {
                url: '/logbook/visits/new',
                templateUrl: 'views/logbook/visits/new.html',
                controller: 'VisitController',
                data: {
                    accion: "visitNew"
                }
            })
            .state('visitInside', {
                url: '/logbook/visits/inside',
                templateUrl: 'views/logbook/visits/inside.html',
                controller: 'RecordController',
                data: {
                    accion: "visitInside"
                }
            })
            .state('contractorNew', {
                url: '/logbook/contractors/new',
                templateUrl: 'views/logbook/contractors/new.html',
                controller: 'ContractorController',
                data: {
                    accion: "contractorNew"
                }
            })
            .state('contractorInside', {
                url: '/logbook/contractors/inside',
                templateUrl: 'views/logbook/contractors/inside.html',
                controller: 'RecordController',
                data: {
                    accion: "contractorInside"
                }
            })
            .state('pendings', {
                url: '/logbook/pendings',
                templateUrl: 'views/logbook/pendings.html',
                controller: 'RecordController',
                data: {
                    accion: "pendings"
                }
            })
            .state('dennieds', {
                url: '/logbook/dennieds',
                templateUrl: 'views/logbook/dennieds.html',
                data: {
                    accion: "dennieds"
                }
            })
            .state('blacklist', {
                url: '/admin/blacklist',
                templateUrl: 'views/admin/blacklist.html',
                controller: 'BlacklistController',
                data: {
                    accion: "blacklist"
                }
            })
            .state('maintainers', {
                url: '/admin/maintainers',
                templateUrl: 'views/admin/maintainers.html',
                controller: 'MaintainersController'
            })
            .state('profile', {
                url: '/user/profile',
                templateUrl: 'views/user/profile.html',
                controller: 'ProfileController'
            })
            .state('profiles', {
                url: '/admin/profiles',
                templateUrl: 'views/admin/profiles.html',
                controller: 'MaintainersController'
            })
            .state('manuals', {
                url: '/logbook/manuals',
                templateUrl: 'views/logbook/manuals.html',
                controller: 'RecordController',
                data: {
                    accion: "manuals"
                }
            })
            .state('PatentsFiled', {
                url: '/logbook/PatentsFiled',
                templateUrl: 'views/logbook/PatentsFiled.html',
                controller: 'RecordController',
                data: {
                    accion: "patentsFiled"
                }
            })
            .state('inside', {
                url: '/logbook/inside',
                templateUrl: 'views/logbook/inside.html',
                controller: 'RecordController',
                data: {
                    accion: "inside"
                }
            })
            .state('visitsMaintainers', {
                url: '/people/visits/maintainers',
                templateUrl: 'views/people/visits/maintainers.html',
                controller: 'MaintainersController'
            })
            .state('suppliersController', {
                url: '/people/suppliers/maintainers',
                templateUrl: 'views/people/suppliers/maintainers.html',
                controller: 'MaintainersController'
            })
            .state('reports', {
                url: '/admin/reports',
                templateUrl: 'views/admin/reports.html',
                controller: 'RecordController',
                data: {
                    accion: "reports"
                }
            })
            .state('individual-report', {
                url: '/admin/reports/individual',
                templateUrl: 'views/admin/individual-report.html',
                controller: 'RecordController',
                data: {
                    accion: "individual-report"
                }
            })
    }]);
