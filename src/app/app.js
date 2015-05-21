angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'angular.filter',
    'ualib.ui',
    'databases.templates'
])

    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');



