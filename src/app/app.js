/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Databases app UI.
 *
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

/**
 * @ngdoc overview
 * @name databases
 *
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires ui-bootstrap
 * @requires angular-filter
 * @requires duScroll
 * @requires ualib-ui
 *
 * @description
 * # Databases app UI.
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'angular.filter',
    'duScroll',
    'ualib.ui',
    'databases.templates'
])
    /**
     * @ngdoc object
     * @name databases.constant:DB_PROXY_PREPEND_URL
     *
     * @description
     * Proxy URL to prefix database links
     *
     * | constant | value |
     * |----------|-------|
     * | DB_PROXY_PREPEND_URL | http://libdata.lib.ua.edu/login?url= |
     *
     */
    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');



