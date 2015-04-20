angular.module('databases', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'databases.common',
    'databases.templates',
    'databases.list'
])

    .constant('DATABASES_API_URL', '//wwwdev2.lib.ua.edu/databases/api/')
    .constant('PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=')

    .factory('dbFactory', ['$http', 'DATABASES_API_URL', function dbFactory($http, url){
        return {
            getData: function(request){
                return $http({method: 'GET', url: url + request, params: {}})
            }
        }
    }])

    .controller('mainDatabasesCtrl', ['$scope', '$routeParams', 'dbFactory', 'PROXY_PREPEND_URL',
    function($scope, $routeParams, dbFactory, proxyURL){
        $scope.dbList = {};
        $scope.dbList.searchText = '';
        $scope.dbList.titleFilter = '';
        $scope.dbList.titleStartFilter = '';
        $scope.dbList.descrFilter = '';
        $scope.dbList.subjectFilter = '';
        $scope.dbList.typeFilter = '';
        $scope.selectedSubjects = [];
        $scope.selectedTypes = [];

        //need to load all databases only once
        dbFactory.getData("all")
            .success(function(data){
                for (var i = 0; i < data.subjects.length; i++){
                    data.subjects[i].selected = false;
                }
                for (var i = 0; i < data.types.length; i++){
                    data.types[i].selected = false;
                }
                for (var i = 0; i < data.databases.length; i++){
                    data.databases[i].show = false;
                    data.databases[i].primary = true;
                    data.databases[i].class = "";
                    data.databases[i].filterBy = data.databases[i].title + data.databases[i].description;
                    if (data.databases[i].auth == '1')
                        data.databases[i].url = proxyURL + data.databases[i].url;
                }
                $scope.dbList = data;
                if (typeof $routeParams.s !== 'undefined')
                    $scope.dbList.searchText = $routeParams.s;
                if (typeof $routeParams.t !== 'undefined')
                    $scope.dbList.titleFilter = $routeParams.t;
                if (typeof $routeParams.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = $routeParams.ts;
                if (typeof $routeParams.d !== 'undefined')
                    $scope.dbList.descrFilter = $routeParams.d;
                if (typeof $routeParams.fs !== 'undefined')
                    $scope.dbList.subjectFilter = $routeParams.fs;
                if (typeof $routeParams.ft !== 'undefined')
                    $scope.dbList.typeFilter = $routeParams.ft;
                if (typeof $routeParams.sub !== 'undefined'){
                    var subNames = $routeParams.sub.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.subjects.length; j++)
                            if (subNames[i] === $scope.dbList.subjects[j].subject){
                                $scope.selectedSubjects.push($scope.dbList.subjects[j]);
                                $scope.dbList.subjects[j].selected = true;
                            }
                }
                if (typeof $routeParams.typ !== 'undefined'){
                    var subNames = $routeParams.typ.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.types.length; j++)
                            if (subNames[i] === $scope.dbList.types[j].type){
                                $scope.selectedTypes.push($scope.dbList.types[j]);
                                $scope.dbList.types[j].selected = true;
                            }
                }
                console.dir($scope.dbList);
            })
            .error(function(msg){
                console.log(msg);
            });

    }])
    .directive('databasesMain', [function databasesMain(){
        return {
            restrict: 'A',
            controller: 'mainDatabasesCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'dbList/databasesMain.tpl.html'
        }
    }])





angular.module('databases.common', [
    'common.databases'
])
angular.module('common.databases', [])


angular.module('databases.list', ['ngSanitize'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/databases/:s?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:s?/title/:t?/ts/:ts?/d/:d?/fs/:fs?/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:s?/title/:t?/ts/:ts?/d/:d?/fs/:fs?/sub/:sub*\/typ/:typ*\/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:s?/title/:t?/ts/:ts?/d/:d?/fs/:fs?/sub/:sub*\/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
            .when('/databases/:s?/title/:t?/ts/:ts?/d/:d?/fs/:fs?/typ/:typ*\/ft/:ft?', {
                templateUrl: 'dbList/dbListMain.tpl.html',
                controller: 'databasesCtrl'
            })
    }])
    .controller('databasesCtrl', ['$scope', '$location', '$rootScope',
        function($scope, $location, $rootScope){

            $scope.search = function(){
                if ($scope.dbList.searchText){
                    var newPath = '/databases/' + $scope.dbList.searchText;
                    newPath += '/title/';
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
                    $location.path(newPath);
                }
            }

            $rootScope.$on('$routeChangeSuccess', function(event, currentRoute){
                if ($scope.dbList.searchText !== currentRoute.params.s)
                    $scope.dbList.searchText = currentRoute.params.s;
                if (typeof currentRoute.params.t !== 'undefined')
                    $scope.dbList.titleFilter = currentRoute.params.t;
                if (typeof currentRoute.params.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = currentRoute.params.ts;
                if (typeof currentRoute.params.d !== 'undefined')
                    $scope.dbList.descrFilter = currentRoute.params.d;
                if (typeof currentRoute.params.fs !== 'undefined')
                    $scope.dbList.subjectFilter = currentRoute.params.fs;
                if (typeof currentRoute.params.ft !== 'undefined')
                    $scope.dbList.typeFilter = currentRoute.params.ft;
                if (typeof currentRoute.params.sub !== 'undefined'){
                    var subNames = currentRoute.params.sub.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.subjects.length; j++)
                            if (subNames[i] === $scope.dbList.subjects[j].subject){
                                $scope.selectedSubjects.push($scope.dbList.subjects[j]);
                                $scope.dbList.subjects[j].selected = true;
                            }
                }
                if (typeof currentRoute.params.typ !== 'undefined'){
                    var subNames = currentRoute.params.typ.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.types.length; j++)
                            if (subNames[i] === $scope.dbList.types[j].type){
                                $scope.selectedTypes.push($scope.dbList.types[j]);
                                $scope.dbList.types[j].selected = true;
                            }
                }
            });
        }])

    .controller('dbListCtrl', ['$scope', function dbListCtrl($scope){
        $scope.currentPage = 1;
        $scope.maxPageSize = 10;
        $scope.perPage = 20;
        $scope.subTypSelOpen = false;

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
            $scope.selectedSubjects = [];
            for (var i = 0; i < $scope.dbList.subjects.length; i++)
                $scope.dbList.subjects[i].selected = value;
            if (value)
                $scope.selectedSubjects = angular.copy($scope.dbList.subjects);
            $scope.updatePrimaryStatus();
        };
        $scope.selectAllTypes = function(value){
            $scope.selectedTypes = [];
            for (var i = 0; i < $scope.dbList.types.length; i++)
                $scope.dbList.types[i].selected = value;
            if (value)
                $scope.selectedTypes = angular.copy($scope.dbList.types);
        };
        $scope.updateStatus = function(subject){
            var index = $scope.selectedSubjects.indexOf(subject);
            if (index > -1)
                $scope.selectedSubjects.splice(index, 1);
            else
                $scope.selectedSubjects.push(subject);
            $scope.updatePrimaryStatus();
        };
        $scope.updateTypes = function(type){
            var index = $scope.selectedTypes.indexOf(type);
            if (index > -1)
                $scope.selectedTypes.splice(index, 1);
            else
                $scope.selectedTypes.push(type);
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
