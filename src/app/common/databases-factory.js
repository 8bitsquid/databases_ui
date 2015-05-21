angular.module('ualib.databases')

    .factory('dbFactory', ['$resource', function($resource){
        return $resource('https://wwwdev2.lib.ua.edu/databases/api/:db');
    }]);