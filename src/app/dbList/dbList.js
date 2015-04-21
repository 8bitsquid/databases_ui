angular.module('databases.list', ['ngSanitize'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/databases/:t?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:t?/ts/:ts?/d/:d?/fs/:fs?/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:t?/ts/:ts?/d/:d?/fs/:fs?/sub/:sub*\/typ/:typ*\/ft/:ft?/o/:o', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:t?/ts/:ts?/d/:d?/fs/:fs?/sub/:sub*\/ft/:ft?o/:o', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:t?/ts/:ts?/d/:d?/fs/:fs?/typ/:typ*\/ft/:ft?o/:o', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
    }])
    .controller('databasesCtrl', ['$scope', '$location', '$rootScope',
        function($scope, $location, $rootScope){

            $scope.updateURL = function(){
                var newPath = '/databases/';
                if ($scope.dbList.titleFilter)
                    newPath = newPath + $scope.dbList.titleFilter + '/';
                newPath += 'ts/';
                if ($scope.dbList.titleStartFilter)
                    newPath = newPath + $scope.dbList.titleStartFilter + '/';
                newPath += 'd/';
                if ($scope.dbList.descrFilter)
                    newPath = newPath + $scope.dbList.descrFilter + '/';
                newPath += 'fs/';
                if ($scope.dbList.subjectFilter)
                    newPath = newPath + $scope.dbList.subjectFilter + '/';
                if ($scope.selectedSubjects.length > 0){
                    newPath += 'sub/';
                    for (var i = 0; i < $scope.selectedSubjects.length; i++)
                        newPath = newPath + $scope.selectedSubjects[i].subject + '/';
                }
                if ($scope.selectedTypes.length > 0){
                    newPath += 'typ/';
                    for (var i = 0; i < $scope.selectedTypes.length; i++)
                        newPath = newPath + $scope.selectedTypes[i].type + '/';
                }
                newPath += 'ft/';
                if ($scope.dbList.typeFilter)
                    newPath = newPath + $scope.dbList.typeFilter + '/';
                if ($scope.selectedSubjects.length > 0 || $scope.selectedTypes.length > 0)
                    newPath = newPath + 'o/' + $scope.dbList.subTypSelOpen;
                $location.path(newPath);
            }

            $rootScope.$on('$routeChangeSuccess', function(event, currentRoute){
                if (typeof currentRoute.params.t !== 'undefined')
                    $scope.dbList.titleFilter = currentRoute.params.t;
                else
                    $scope.dbList.titleFilter = '';
                if (typeof currentRoute.params.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = currentRoute.params.ts;
                else
                    $scope.dbList.titleStartFilter = '';
                if (typeof currentRoute.params.d !== 'undefined')
                    $scope.dbList.descrFilter = currentRoute.params.d;
                else
                    $scope.dbList.descrFilter = '';
                if (typeof currentRoute.params.fs !== 'undefined')
                    $scope.dbList.subjectFilter = currentRoute.params.fs;
                else
                    $scope.dbList.subjectFilter = '';
                if (typeof currentRoute.params.ft !== 'undefined')
                    $scope.dbList.typeFilter = currentRoute.params.ft;
                else
                    $scope.dbList.typeFilter = '';

                for (var i = 0; i < $scope.dbList.subjects.length; i++){
                    $scope.dbList.subjects[i].selected = false;
                }
                for (var i = 0; i < $scope.dbList.types.length; i++){
                    $scope.dbList.types[i].selected = false;
                }
                $scope.selectedSubjects.splice(0, $scope.selectedSubjects.length);
                if (typeof currentRoute.params.sub !== 'undefined'){
                    var subNames = currentRoute.params.sub.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.subjects.length; j++)
                            if (subNames[i] === $scope.dbList.subjects[j].subject){
                                if ($scope.selectedSubjects.indexOf($scope.dbList.subjects[j]) < 0)
                                    $scope.selectedSubjects.push($scope.dbList.subjects[j]);
                                $scope.dbList.subjects[j].selected = true;
                            }
                }
                $scope.selectedTypes.splice(0, $scope.selectedTypes.length);
                if (typeof currentRoute.params.typ !== 'undefined'){
                    var subNames = currentRoute.params.typ.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.types.length; j++)
                            if (subNames[i] === $scope.dbList.types[j].type){
                                if ($scope.selectedTypes.indexOf($scope.dbList.types[j]) < 0)
                                    $scope.selectedTypes.push($scope.dbList.types[j]);
                                $scope.dbList.types[j].selected = true;
                            }
                }
                $scope.dbList.subTypSelOpen = false;
                if (typeof currentRoute.params.o !== 'undefined')
                    if (currentRoute.params.o.indexOf('true') === 0)
                        $scope.dbList.subTypSelOpen = true;
            });
        }])

    .controller('dbListCtrl', ['$scope', function dbListCtrl($scope){
        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;

        $scope.compareTitle = function(actual, expected){
            if (!expected)
                return true;
            if (actual.toLowerCase().indexOf(expected.toLowerCase()) > -1)
                return true;
            return false;
        };
        $scope.filterSubjects = function(actual, expected){
            if (expected.length == 0)
                return true;

            for (var t = 0; t < expected.length; t++){
                var isPresent = false;
                for (var i = 0; i < actual.length; i++)
                    if (expected[t].sid == actual[i].sid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    return false;
            }

            return true;
        };
        $scope.filterTypes = function(actual, expected){
            if (expected.length == 0)
                return true;

            for (var t = 0; t < expected.length; t++){
                var isPresent = false;
                for (var i = 0; i < actual.length; i++)
                    if (expected[t].tid == actual[i].tid){
                        isPresent = true;
                        break;
                    }
                if (!isPresent)
                    return false;
            }
            return true;
        };
        $scope.startTitle = function(actual, expected){
            if (!expected)
                return true;
            if (actual.toLowerCase().indexOf(expected.toLowerCase()) == 0)
                return true;
            return false;
        };

        $scope.selectAllSubjects = function(value){
            $scope.selectedSubjects.splice(0, $scope.selectedSubjects.length);
            for (var i = 0; i < $scope.dbList.subjects.length; i++)
                $scope.dbList.subjects[i].selected = value;
            if (value)
                $scope.selectedSubjects = angular.copy($scope.dbList.subjects);
            $scope.updatePrimaryStatus();
            $scope.updateURL();
        };
        $scope.selectAllTypes = function(value){
            $scope.selectedTypes.splice(0, $scope.selectedTypes.length);
            for (var i = 0; i < $scope.dbList.types.length; i++)
                $scope.dbList.types[i].selected = value;
            if (value)
                $scope.selectedTypes = angular.copy($scope.dbList.types);
            $scope.updateURL();
        };
        $scope.updateStatus = function(subject){
            var index = $scope.selectedSubjects.indexOf(subject);
            if (index > -1)
                $scope.selectedSubjects.splice(index, 1);
            else
                $scope.selectedSubjects.push(subject);
            $scope.updatePrimaryStatus();
            $scope.updateURL();
        };
        $scope.updateTypes = function(type){
            var index = $scope.selectedTypes.indexOf(type);
            if (index > -1)
                $scope.selectedTypes.splice(index, 1);
            else
                $scope.selectedTypes.push(type);
            $scope.updateURL();
        };
        $scope.updatePrimaryStatus = function(){
            if ($scope.selectedSubjects.length == 0)
                for (var i = 0; i < $scope.dbList.databases.length; i++)
                    $scope.dbList.databases[i].primary = true;
            else
                for (var i = 0; i < $scope.dbList.databases.length; i++){
                    $scope.dbList.databases[i].primary = true;
                    for (var t = 0; t < $scope.selectedSubjects.length; t++){
                        var isPresent = false;
                        for (var j = 0; j < $scope.dbList.databases[i].subjects.length; j++)
                            if ($scope.selectedSubjects[t].sid === $scope.dbList.databases[i].subjects[j].sid &&
                                $scope.dbList.databases[i].subjects[j].type == '1'){
                                isPresent = true;
                                break;
                            }
                        if (!isPresent){
                            $scope.dbList.databases[i].primary = false;
                            break;
                        }
                    }
                }

        };
        $scope.toggleSubjectsTypes = function(value){
            $scope.dbList.subTypSelOpen = value;
            $scope.updateURL();
        };
        $scope.isOpenSubTyp = function(){
            return $scope.dbList.subTypSelOpen;
        };

        $scope.toggleDB = function(db){
            $scope.dbList.databases[$scope.dbList.databases.indexOf(db)].show =
                !$scope.dbList.databases[$scope.dbList.databases.indexOf(db)].show;
        };
    }])

    .directive('databasesList', [function databasesList(){
        return {
            restrict: 'A',
            controller: 'dbListCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'dbList/dbList.tpl.html'
        }
    }])
    .filter('startFrom', function() {
        return function(input, start) {
            if (typeof input === 'undefined')
                return null;
            start = +start; //parse to int
            return input.slice(start);
        }
    })
