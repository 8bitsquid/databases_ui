angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databaseList: function(dbFactory){
                        return dbFactory.get({db: 'all'})
                            .$promise.then(function(data){
                                var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

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

    .controller('DatabasesListCtrl', ['$scope', 'databaseList', '$filter', function($scope, dbList, $filter){
        var databases = [];
        $scope.numAlpha = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        $scope.numAlpha.unshift('0-9');

        dbList.$promise.then(function(data){
            databases = data.databases;
            $scope.subjects = data.subjects;
            $scope.types = data.types;

            $scope.db = {
                subjects: {},
                types: {},
                search: '',
                startsWith: '',
                page: 1,
                perPage: 20
            };

            $scope.totalItems = data.totalRecords;
            $scope.numPages = Math.ceil(data.totalRecords / $scope.db.perPage);

            processFacets(databases);
        });


        $scope.$watch('db', function(newVal, oldVal){
            var filtered = databases;

            filtered = $filter('orderBy')(filtered, function(item){
                return item.subjects.filter(function(subj){
                    return (subj.type == 1 && newVal.subjects[subj.subject]);
                }).length
            }, true);

            if (newVal.startsWith){
                var sw = '^['+newVal.startsWith+']';
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

            processFacets(filtered);
            $scope.filteredDB = filtered;
            $scope.totalItems = $scope.filteredDB.length;
            //$scope.numPages = Math.ceil($scope.totalItems / $scope.db.perpage);

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
    }]);


