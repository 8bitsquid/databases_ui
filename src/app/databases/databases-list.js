angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databases: function(databasesFactory){
                        return databasesFactory.get({db: 'active'})
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


            //if (newVal.search && newVal.search.length > 2){
                filtered = $filter('filter')(filtered, newVal.search, simpleSearch);
            //}

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
            updatePager();

            var newParams = angular.extend({}, newVal, {page: $scope.pager.page});

            processFacets(filtered);
            scopeToParams(newParams);
        }, true);

        function simpleSearch(obj, text) {
            if (text){
                text = (''+text).toLowerCase();
                var tokens = [].concat.apply([], text.split('"').map(function(v,i){
                    return i%2 ? v : v.split(' ');
                })).filter(Boolean);

                var matched = tokens.filter(function(token){
                    return (''+obj).toLowerCase().indexOf(token) > -1;
                });

                return matched.length === tokens.length;
            }
            return true;
        }

        function updatePager(){
            $scope.pager.totalItems = $scope.filteredDB.length;
            var numPages =  Math.floor($scope.pager.totalItems / $scope.pager.maxSize);
            if (numPages < $scope.pager.page){
                $scope.pager.page = numPages || 1;
            }
            $scope.pager.firstItem = ($scope.pager.page-1)*$scope.pager.perPage+1;
            $scope.pager.lastItem = Math.min($scope.pager.totalItems, ($scope.pager.page * $scope.pager.perPage));

        }


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
            updatePager();
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
                    else {
                        $location.search(key, val);
                    }
                    /*else if (!(key === 'search' && val.length < 3)){
                        $location.search(key, val);
                    }
                    else{
                        $location.search(key, null);
                    }*/
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
            //console.log(params);
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
        }

    }]);

