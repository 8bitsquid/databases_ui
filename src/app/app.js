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
        $scope.dbList.titleFilter = '';
        $scope.dbList.titleStartFilter = '';
        $scope.dbList.descrFilter = '';
        $scope.dbList.subjectFilter = '';
        $scope.dbList.typeFilter = '';
        $scope.selectedSubjects = [];
        $scope.selectedTypes = [];
        $scope.dbList.subTypSelOpen = false;

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
                    if (data.databases[i].auth == '1')
                        data.databases[i].url = proxyURL + data.databases[i].url;
                }
                $scope.dbList = data;
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
                                if ($scope.selectedSubjects.indexOf($scope.dbList.subjects[j]) < 0)
                                    $scope.selectedSubjects.push($scope.dbList.subjects[j]);
                                $scope.dbList.subjects[j].selected = true;
                            }
                }
                if (typeof $routeParams.typ !== 'undefined'){
                    var subNames = $routeParams.typ.split("/");
                    for (var i = 0; i < subNames.length; i++)
                        for (var j = 0; j < $scope.dbList.types.length; j++)
                            if (subNames[i] === $scope.dbList.types[j].type){
                                if ($scope.selectedTypes.indexOf($scope.dbList.types[j]) < 0)
                                    $scope.selectedTypes.push($scope.dbList.types[j]);
                                $scope.dbList.types[j].selected = true;
                            }
                }
                if (typeof $routeParams.o !== 'undefined')
                    if ($routeParams.o.indexOf('true') === 0)
                        $scope.dbList.subTypSelOpen = true;
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




