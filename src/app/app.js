angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'ui.utils',
    'angular.filter',
    'duScroll',
    'ualib.ui',
    'databases.templates'
])
    .config(['$locationProvider', function($locationProvider){
        //$locationProvider.html5Mode(false).hashPrefix('!')
    }])

    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');



