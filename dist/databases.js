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

    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');




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
angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databases: function(databasesFactory){
                        return databasesFactory.get({db: 'all'})
                            .$promise.then(function(data){
                                return data;
                            }, function(data, status, headers, config) {
                                console.log('ERROR: databases');
                                console.log({
                                    data: data,
                                    status: status,
                                    headers: headers,
                                    config: config
                                });
                            });
                    }
                },
                templateUrl: 'databases/databases-list.tpl.html',
                controller: 'DatabasesListCtrl'
            })
    }])

    .controller('DatabasesListCtrl', ['$scope', 'databases', '$filter' ,'$location' ,'$document', function($scope, db, $filter, $location, $document){
        var databases = [];

        $scope.numAlpha = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        $scope.numAlpha.unshift('0-9');

        db.$promise.then(function(data){
            databases = data.databases;

            $scope.subjects = data.subjects;
            $scope.types = data.types;

            $scope.resetFilters();
            paramsToScope();

            $scope.totalItems = data.totalRecords;
            processStartsWith(databases);
            processFacets(databases);
        });

        $scope.$on('$locationChangeSuccess', function(){
            paramsToScope();
        });

        var filterWatcher = $scope.$watch('db', function(newVal, oldVal){
            var filtered = databases;

            filtered = $filter('filter')(filtered, filterBySubject);
            filtered = $filter('filter')(filtered, filterByType);

            if (newVal.search && newVal.search.length > 2){
                filtered = $filter('filter')(filtered, newVal.search);
            }

            if (newVal.startsWith){
                var sw = newVal.startsWith.indexOf('-') == -1 ? "^"+newVal.startsWith+".+$" : '^['+newVal.startsWith+'].+$';

                filtered = $filter('filter')(filtered, function(item){
                    return $filter('test')(item.title, sw, 'i');
                });
            }

            filtered.sort(function(a, b){
                var aNum = countPrimarySubjects(a, newVal.subjects);
                var bNum = countPrimarySubjects(b, newVal.subjects);

                if (aNum === bNum){
                    return a.position - b.position;
                }
                if (aNum > bNum){
                    return -1;
                }
                return 1;
            });

            $scope.filteredDB = filtered;
            $scope.pager.totalItems = $scope.filteredDB.length;
            $scope.pager.firstItem = (($scope.pager.page-1)*$scope.pager.perPage)+1;
            $scope.pager.lastItem = $scope.pager.page*($scope.pager.totalItems < $scope.pager.maxSize ? $scope.pager.totalItems : $scope.pager.perPage);
            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }

            var newParams = angular.extend({}, newVal, {page: $scope.pager.page});

            processFacets(filtered);
            scopeToParams(newParams);
        }, true);


        function filterBySubject(item){
            var subjects = Object.keys($scope.db.subjects).filter(function(key){
                return $scope.db.subjects[key];
            });

            return item.subjects.filter(function(itemSubj){
                    return $scope.db.subjects[itemSubj.subject];
                }).length === subjects.length;
        };

        function filterByType(item){
            var types = Object.keys($scope.db.types).filter(function(key){
                return $scope.db.types[key];
            });

            return item.types.filter(function(itemSubj){
                    return $scope.db.types[itemSubj.type];
                }).length === types.length;
        };

        $scope.resetFilters = function(){
            $scope.db = {
                subjects: {},
                types: {},
                search: '',
                startsWith: ''
            };
            $scope.pager = {
                page: 1,
                perPage: 20,
                maxSize: 10,
                totalItems: 0
            };
        };

        $scope.pageChange = function(){

            scopeToParams({page: $scope.pager.page});
            $document.duScrollTo(0, 30, 500, function (t) { return (--t)*t*t+1 });
        };

        $scope.$on('$destroy', function(){
            filterWatcher();
        });

        function processFacets(databases){
            var subjAvail = [];
            var subjCount = {};

            var typeAvail = [];
            var typeCount = {};


            for (var i = 0, len = databases.length; i < len; i++){
                databases[i].subjects.map(function(subj){
                    if (subjAvail.indexOf(subj.sid) == -1){
                        subjAvail.push(subj.sid);
                        subjCount[subj.sid] = 1;
                    }
                    else{
                        subjCount[subj.sid]++;
                    }
                });
                databases[i].types.map(function(type){
                    if (typeAvail.indexOf(type.tid) == -1){
                        typeAvail.push(type.tid);
                        typeCount[type.tid] = 1;
                    }
                    else{
                        typeCount[type.tid]++;
                    }
                });
            }

            $scope.subjects.map(function(subject){
                var s = subject;
                s.disabled = subjAvail.indexOf(s.sid) == -1;
                s.total = subjCount[subject.sid] || 0;
                return s;
            });

            $scope.types.map(function(type){
                var t = type;
                t.disabled = typeAvail.indexOf(t.tid) == -1;
                t.total = typeCount[type.tid] || 0;
                return t;
            });
        }

        function processStartsWith(databases){
            $scope.startsWithDisabled = {};

            $scope.numAlpha.map(function(startsWith){
                var sw = startsWith.indexOf('-') == -1 ? "^"+startsWith+".+$" : '^['+startsWith+'].+$';
                for (var i = 0, len = databases.length; i < len; i++){
                    if ($filter('test')(databases[i].title, sw, 'i')){
                        return;
                    }
                }
                $scope.startsWithDisabled[startsWith] = true;
            });
        }

        function countPrimarySubjects(db, subjects){
            return db.subjects.filter(function(subj){
                return (parseInt(subj.type) === 1 && subjects[subj.subject]);
            }).length;
        }

        function scopeToParams(scopeVals){
            angular.forEach(scopeVals, function(val, key){
                var newParam = {};

                if (angular.isDefined(val) && val !== ''){
                    if (angular.isObject(val)){
                        val = Object.keys(val).filter(function(f){
                            return val[f];
                        }).join(",");
                       if (val.length > 0){
                           $location.search(key, val);
                       }
                       else{
                           $location.search(key, null);
                       }
                    }
                    else if (!(key === 'search' && val.length < 3)){
                        $location.search(key, val);
                    }
                    else{
                        $location.search(key, null);
                    }
                }
                else{
                    $location.search(key, null);
                }
            });
        }

        function paramsToScope(){
            var params = $location.search();
            var scopeFacets = {};
            angular.copy($scope.db, scopeFacets);
            console.log(params);
            $scope.activeFilters = params;

            if (params['page']){
                $scope.pager.page = params['page'];
            }

            angular.forEach(scopeFacets, function(val, key){

                if (angular.isDefined(params[key])){

                    if (key == 'subjects' || key == 'types'){
                        var filters = {};
                        params[key].split(',').forEach(function(filter){
                            filters[filter] = true;
                        });
                        scopeFacets[key] = filters;
                    }
                    else{
                        scopeFacets[key] = params[key];
                    }
                }
                else{
                    scopeFacets[key] = angular.isObject(val) ? {} : '';
                }
            });
            $scope.db = scopeFacets;
            /*angular.forEach(params, function(val, key){
                if (key === 'page'){
                    $scope.pager.page = val;
                }
                else {
                    if (angular.isDefined(val) && val !== ''){
                        if (key == 'subjects' || key == 'types'){
                            var filters = {};
                            val.split(',').forEach(function(filter){
                                filters[filter] = true;
                            });
                            val = filters;
                        }
                        $scope.db[key] = val;
                    }
                    else {
                        if (angular.isObject($scope.db[key])){
                            $scope.db[key] = {};
                        }
                        else{
                            $scope.db[key] = '';
                        }
                    }
                }
            });*/
        }

        // Adopted from http://stackoverflow.com/questions/4994201/is-object-empty
        var hasOwnProperty = Object.prototype.hasOwnProperty;

        function facetsActive(obj) {

            // null and undefined are "empty"
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own? And are those properties "truthy"
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key) && key) return true;
            }

            return false;
        }

    }]);


