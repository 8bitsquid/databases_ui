angular.module('databases', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'databases.common',
    'databases.templates',
    'databases.list'
])

    .constant('DATABASES_API_URL', '//wwwdev2.lib.ua.edu/databases/api/')

    .factory('dbFactory', ['$http', 'DATABASES_API_URL', function dbFactory($http, url){
        return {
            getData: function(request){
                return $http({method: 'GET', url: url + request, params: {}})
            }
        }
    }])

    .controller('mainDatabasesCtrl', ['$scope', '$routeParams', 'dbFactory', function($scope, $routeParams, dbFactory){
        $scope.dbList = {};
        $scope.dbList.searchText = '';
        $scope.dbList.titleFilter = '';
        $scope.dbList.descrFilter = '';
        $scope.dbList.subjectFilter = '';
        $scope.dbList.typeFilter = '';

        //need to load all databases only once
        dbFactory.getData("all")
            .success(function(data){
                for (var i = 0; i < data.databases.length; i++){
                    data.databases[i].show = false;
                    data.databases[i].class = "";
                    data.databases[i].filterBy = data.databases[i].title + data.databases[i].description;
                }
                $scope.dbList = data;
                if (typeof $routeParams.s !== 'undefined')
                    $scope.dbList.searchText = $routeParams.s;
                if (typeof $routeParams.t !== 'undefined')
                    $scope.dbList.titleFilter = $routeParams.t;
                if (typeof $routeParams.d !== 'undefined')
                    $scope.dbList.descrFilter = $routeParams.d;
                if (typeof $routeParams.fs !== 'undefined')
                    $scope.dbList.subjectFilter = $routeParams.fs;
                if (typeof $routeParams.ft !== 'undefined')
                    $scope.dbList.typeFilter = $routeParams.ft;
                console.dir($scope.dbList);
            })
            .error(function(msg){
                console.log(msg);
            });

    }])





angular.module('databases.common', [
    'common.databases'
])
angular.module('common.databases', [])


angular.module('databases.list', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/databases/:s?/title/:t?/descr/:d?/fs/:fs?/ft/:ft?', {
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
                    newPath += 'descr/';
                    if ($scope.dbList.descrFilter)
                        newPath = newPath + $scope.dbList.descrFilter + '/';
                    newPath += 'fs/';
                    if ($scope.dbList.subjectFilter)
                        newPath = newPath + $scope.dbList.subjectFilter + '/';
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
                if (typeof currentRoute.params.d !== 'undefined')
                    $scope.dbList.descrFilter = currentRoute.params.d;
                if (typeof currentRoute.params.fs !== 'undefined')
                    $scope.dbList.subjectFilter = currentRoute.params.fs;
                if (typeof currentRoute.params.ft !== 'undefined')
                    $scope.dbList.typeFilter = currentRoute.params.ft;

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
