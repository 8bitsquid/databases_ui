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
        $scope.dbList.titleStartFilter = '';
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
                if (typeof $routeParams.ts !== 'undefined')
                    $scope.dbList.titleStartFilter = $routeParams.ts;
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
    .directive('databasesMain', [function databasesMain(){
        return {
            restrict: 'A',
            controller: 'mainDatabasesCtrl',
            link: function(scope, elm, attrs){
            },
            templateUrl: 'dbList/databasesMain.tpl.html'
        }
    }])




