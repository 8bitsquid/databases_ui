angular.module('ualib.databases')

    .factory('databasesFactory', ['$resource', function($resource){
        return $resource('https://wwwdev2.lib.ua.edu/databases/api/:db');
    }]);