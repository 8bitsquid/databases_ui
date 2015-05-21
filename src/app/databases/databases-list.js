angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databaseList: function(dbFactory){
                        return dbFactory.get({db: 'all'})
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

    .controller('DatabasesListCtrl', ['$scope', 'databaseList', '$filter' ,'$location' ,'$document', function($scope, dbList, $filter, $location, $document){
        var databases = [];

        $scope.numAlpha = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        $scope.numAlpha.unshift('0-9');

        dbList.$promise.then(function(data){
            databases = data.databases;
            $scope.subjects = data.subjects;
            $scope.types = data.types;

            $scope.resetFilters();
            paramsToScope();

            $scope.totalItems = data.totalRecords;
            processStartsWith(databases);
            processFacets(databases);
        });


        var filterWatcher = $scope.$watch('db', function(newVal, oldVal){
            var filtered = databases;

            filtered = $filter('orderBy')(filtered, function(item){
                return item.subjects.filter(function(subj){
                    return (subj.type == 1 && newVal.subjects[subj.subject]);
                }).length
            }, true);

            if (newVal.startsWith){
                var sw = newVal.startsWith.indexOf('-') == -1 ? "^"+newVal.startsWith+".+$" : '^['+newVal.startsWith+'].+$';
                filtered = $filter('filter')(filtered, function(item){
                    return $filter('test')(item.title, sw, 'i');
                });
            }
            filtered = $filter('filter')(filtered, $scope.filterBySubject);
            filtered = $filter('filter')(filtered, $scope.filterByType);
            if (newVal.search.length > 2){
                filtered = $filter('filter')(filtered, newVal.search);
            }
            filtered = $filter('orderBy')(filtered, 'title');

            $scope.filteredDB = filtered;
            $scope.pager.totalItems = $scope.filteredDB.length;
            $scope.pager.page = 1;

            var newParams = angular.extend({}, newVal, {page: $scope.pager.page});

            processFacets(filtered);
            scopeToParams(newParams);
            if (newVal.startsWith === null || newVal.startsWith === ''){
                processStartsWith(filtered);
            }

        }, true);

        $scope.primarySubjects = function(item){
            return item.subjects.filter(function(subj){
                return (parseInt(subj.type) === 1 && $scope.db.subjects[subj.subject]);
            }).length;
        };

        $scope.filterBySubject = function(item){
            var subjects = Object.keys($scope.db.subjects).filter(function(key){
                return $scope.db.subjects[key];
            });

            return item.subjects.filter(function(itemSubj){
                    return $scope.db.subjects[itemSubj.subject];
                }).length === subjects.length;
        };

        $scope.filterByType = function(item){
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
            var typeAvail = [];

            for (var i = 0, len = databases.length; i < len; i++){
                databases[i].subjects.map(function(subj){
                    if (subjAvail.indexOf(subj.sid) == -1){
                        subjAvail.push(subj.sid);
                    }
                });
                databases[i].types.map(function(type){
                    if (typeAvail.indexOf(type.tid) == -1){
                        typeAvail.push(type.tid);
                    }
                });

            }

            $scope.subjects.map(function(subject){
                var s = subject;
                s.disabled = subjAvail.indexOf(s.sid) == -1;
                return s;
            });

            $scope.types.map(function(type){
                var t = type;
                t.disabled = typeAvail.indexOf(t.tid) == -1;
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
            angular.forEach(params, function(val, key){
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
                }
            });
        }
    }]);


