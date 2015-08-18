angular.module('ualib.databases')

/**
 * Transform the JSON response - this allows the transformed values to be cached via Angular's $resource service.
 */
    .factory('databasesFactory', ['$resource', '$http', '$filter', 'DB_PROXY_PREPEND_URL', function($resource, $http, $filter, DB_PROXY_PREPEND_URL){

        //TODO: centralize this function so it can be used with all apps
        // Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return $resource('https://wwwdev2.lib.ua.edu/databases/api/:db', {db: 'active'}, {
            cache: true,
            get: {
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
                                databases[i].url = DB_PROXY_PREPEND_URL + databases[i].url;
                                break;
                            case 'UA, Remote':
                                access = 'myBama login required off campus';
                                databases[i].url = DB_PROXY_PREPEND_URL + databases[i].url;
                                break;
                            case 'www':
                            case 'WWW':
                                access = false;
                                break;
                            default:
                                access = databases[i].location;
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