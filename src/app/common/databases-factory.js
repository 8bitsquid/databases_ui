angular.module('ualib.databases')

/**
 * Transform the JSON response - this allows the transformed values to be cached via Angular's $resource service.
 */
    .factory('databasesFactory', ['$resource', '$filter', 'DB_PROXY_PREPEND_URL', function($resource, $filter, DB_PROXY_PREPEND_URL){
        return $resource('https://wwwdev2.lib.ua.edu/databases/api/:db', {db: 'all'}, {
            cache: true,
            get: {
                method: 'GET',
                transformResponse: function(data){
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
                }
            }
        });
    }]);