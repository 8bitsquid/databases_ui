angular.module('ualib.databases')

/**
 * @ngdoc service
 * @name databases.databasesFactory
 *
 * @requires $resource
 * @requires $http
 * @requires $filter
 * @requires databases.constant:DB_PROXY_PREPEND_URL
 *
 * @description
 * Factory service to retrieve databases from the API.
 *
 */
    .factory('databasesFactory', ['$resource', '$http', '$filter', 'DB_PROXY_PREPEND_URL', function($resource, $http, $filter, DB_PROXY_PREPEND_URL){

        //TODO: centralize this function so it can be used with all apps

        /**
         * @ngdoc function
         * @name databases.databasesFactory#appendTransform
         * @methodOf databases.databasesFactory
         *
         * @param {Array.<function()>} defaults Default `Array` of `$http` transform response transform functions from Angular - will always be `$http.defaults.transformResponse`
         * @param {function()} transform Transform function to extend the `$http.defaults.transformResponse` Array with.
         *
         * @description
         * <span class="label label-warning">Private</span>
         * Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
         *
         * Doing this allows custom modifications of the JSON response from the API to be cached after the initial `$resource` call, instead of
         * performing these modifications on every `$digest()` cycle (e.g., make modifications once, instead of every time the databases list is refreshed).
         *
         * @returns {Array.<function()>} Returns the new `transformResponse` Array
         */
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            //console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return $resource('//wwwdev2.lib.ua.edu/databases/api/:db', {db: 'all'}, {
            get: {
                cache: true,
                method: 'GET',
                transformResponse: appendTransform($http.defaults.transformResponse, function(data){
                    var db = angular.fromJson(data);

                    //Pre sort databases by title
                    var databases = $filter('orderBy')(db.databases, 'title');
                    // Set position for stable sort
                    angular.forEach(databases, function(db, i){
                        var access;

                        switch (databases[i].location){
                            case 'UA':
                                access = 'On campus only';
                                break;
                            case 'UA, Remote':
                                access = 'myBama login required off campus';
                                break;
                            case 'www':
                            case 'WWW':
                                access = false;
                                break;
                            default:
                                access = databases[i].location;
                        }

                        if (databases[i].auth == "1"){
                            databases[i].url = DB_PROXY_PREPEND_URL + databases[i].url;
                        }

                        databases[i].access = access;
                        databases[i].position = i;
                        databases[i].inScout = databases[i].notInEDS === 'Y';

                    });
                    db.databases = databases;
                    return db;
                })
            }
        });
    }]);