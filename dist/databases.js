angular.module('databases.templates', ['databases/databases-list.tpl.html']);

angular.module("databases/databases-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("databases/databases-list.tpl.html",
    "<div class=\"jumbotron-header\">\n" +
    "    <div class=\"jumbotron\">\n" +
    "        <div class=\"container\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <h1>Databases</h1>\n" +
    "                </div>\n" +
    "                <div class=\"hidden-xs col-md-4\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <p class=\"lead\">Check out our database trials and tell us what you think!</p>\n" +
    "                        <a class=\"btn btn-primary\" href=\"/research-tools/e-resources/electronic-resource-trials/\" title=\"database trials\">See Trials <span class=\"fa fa-fw fa-eye\"></span></span></a>\n" +
    "                        <a class=\"btn btn-default\" href=\"/forms/electronic-resource-trial-evaluation-form/\" title=\"database trials evaluation form\">Evaluate <span class=\"fa fa-fw fa-check-square-o\"></span></span></a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"container\">\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-sm-3 col-sm-push-9\">\n" +
    "            <form class=\"facets-form\">\n" +
    "                <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Databases By</h4>\n" +
    "                </span>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" ng-model=\"db.search\" placeholder=\"Keyword search\">\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Title starts with</h5>\n" +
    "                    <div class=\"facet-group alphanum-group\">\n" +
    "                        <div class=\"btn-group\">\n" +
    "                            <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" ng-disabled=\"startsWithDisabled[na]\" uncheckable>{{na}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Subjects</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\" ng-class=\"{'disabled': subj.disabled}\" ng-repeat=\"subj in subjects\">\n" +
    "                            <label>\n" +
    "                                <input type=\"checkbox\" ng-model=\"db.subjects[subj.subject]\" ng-disabled=\"subj.disabled\">\n" +
    "                                {{subj.subject}} ({{subj.total}})\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group hidden-xs\">\n" +
    "                    <h5>Types</h5>\n" +
    "                    <div class=\"facet-group\">\n" +
    "                        <div class=\"radio\" ng-class=\"{'disabled': type.disabled}\" ng-repeat=\"type in types\">\n" +
    "                            <label>\n" +
    "                                <input type=\"checkbox\" ng-model=\"db.types[type.type]\"  ng-disabled=\"type.disabled\">\n" +
    "                                {{type.type}} ({{type.total}})\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div class=\"col-sm-9 col-sm-pull-3 databases-list-container\">\n" +
    "            <p>\n" +
    "            <h4 class=\"text-right\">Showing {{pager.firstItem}} - {{pager.lastItem}} of {{pager.totalItems}} results</h4>\n" +
    "            <div ng-if=\"!!activeFilters.startsWith || activeFilters.subjects || activeFilters.types\">\n" +
    "\n" +
    "                <ol class=\"breadcrumb facetcrumb\">\n" +
    "                    <li ng-if=\"!!activeFilters.startsWith\"><strong>Starts with:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.startsWith = ''\">\"{{db.startsWith}}\" <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.subjects\"><strong>Subjects:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.subjects[subject] = false\" ng-repeat=\"(subject, key) in db.subjects\">{{subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li ng-if=\"activeFilters.types\"><strong>Types:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.types[type] = false\" ng-repeat=\"(type, key) in db.types\">{{type}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "                    <li class=\"pull-right\"><button type=\"button\" class=\"btn btn-primary btn-small reset-btn\" title=\"Reset filters\" ng-click=\"resetFilters()\"><i class=\"fa fa-refresh\"></i></button></li>\n" +
    "                </ol>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"media animate-repeat\" ng-repeat=\"item in filteredDB | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "                <div class=\"media-body\">\n" +
    "\n" +
    "                    <h4 class=\"media-heading\">\n" +
    "                        <a ng-href=\"{{item.url}}\" title=\"{{item.title}}\" ng-bind-html=\"item.title | highlight:db.search\"></a>\n" +
    "                        <!--<small ng-if=\"item.presentedBy\">({{item.presentedBy}})</small>-->\n" +
    "                        <small ng-bind-html=\"item.coverage | highlight:db.search\"></small>\n" +
    "\n" +
    "                        <small class=\"pull-right\">\n" +
    "                            <span class=\"label label-success\" ng-if=\"item.hasFullText == 'A'\">All Full Text</span>\n" +
    "                            <span class=\"label label-info\" ng-if=\"item.hasFullText == 'P'\">Primarily Full Text</span>\n" +
    "                            <span class=\"label label-warning\" ng-if=\"item.hasFullText == 'S'\">Some Full Text</span>\n" +
    "                            <span class=\"label label-danger\" ng-if=\"item.hasFullText == 'N'\">No Full Text</span>\n" +
    "                        </small>\n" +
    "                    </h4>\n" +
    "\n" +
    "                    <p class=\"text-justify\" ng-bind-html=\"item.description | highlight:db.search\"></p>\n" +
    "\n" +
    "                    <div ng-if=\"item.location\">\n" +
    "                        <strong>Access:</strong> {{item.location}}\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"(item.subjects | where:{type:1}).length > 0\">\n" +
    "                        <strong>Primary subjects: </strong>\n" +
    "                        <span ng-repeat=\"subj in item.subjects | where:{type:1}\" ng-bind-html=\"subj.subject | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"item.types\">\n" +
    "                        <strong>Types of material: </strong>\n" +
    "                        <span ng-repeat=\"type in item.types\" ng-bind-html=\"type.type | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"databases-details\" ng-if=\"item.vendor\">\n" +
    "                        <strong>Vendor: </strong>\n" +
    "                        <span ng-bind-html=\"item.vendor | highlight:db.search\"></span>\n" +
    "                    </div>\n" +
    "                    <div class=\"scout-coverage\">\n" +
    "                        <strong>Scout coverage: </strong>\n" +
    "                    <span class=\"fa text-info\" ng-class=\"{'fa-circle': item.notInEDS == 'Y', 'fa-adjust': item.notInEDS == 'P', 'fa-circle-o': !item.notInEDS}\">\n" +
    "                    </span>\n" +
    "                        <span ng-if=\"item.notInEDS == 'Y'\">Full</span>\n" +
    "                        <span  ng-if=\"item.notInEDS == 'P'\">Partial</span>\n" +
    "                        <span  ng-if=\"!item.notInEDS\">Not in Scout</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"text-center\">\n" +
    "                <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "                <h2>No results found <span ng-if=\"db.search\"> for \"{{db.search}}\"</span></h2>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

/**
 * @ngdoc overview
 * @name index
 *
 * @description
 * # Databases app UI.
 *
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

/**
 * @ngdoc overview
 * @name databases
 *
 *
 * @requires ngRoute
 * @requires ngResource
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires ui-bootstrap
 * @requires angular-filter
 * @requires duScroll
 * @requires ualib-ui
 *
 * @description
 * # Databases app UI.
 * ## Default route: [/#/databases](http://www.lib.ua.edu/#/databases)
 */

angular.module('ualib.databases', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'angular.filter',
    'duScroll',
    'ualib.ui',
    'databases.templates'
])
    /**
     * @ngdoc object
     * @name databases.constant:DB_PROXY_PREPEND_URL
     *
     * @description
     * Proxy URL to prefix database links
     *
     * | constant | value |
     * |----------|-------|
     * | DB_PROXY_PREPEND_URL | http://libdata.lib.ua.edu/login?url= |
     *
     */
    .constant('DB_PROXY_PREPEND_URL', 'http://libdata.lib.ua.edu/login?url=');




angular.module('ualib.databases')

/**
 * @ngdoc service
 * @name databases.databasesFactory
 *
 * @requires $resource
 * @requires $http
 * @requires $filter
 * @requires databases.constant:DB_PROXY_PREPEND_URL
 *
 * @description
 * Factory service to retrieve databases from the API.
 *
 */
    .factory('databasesFactory', ['$resource', '$http', '$filter', 'DB_PROXY_PREPEND_URL', function($resource, $http, $filter, DB_PROXY_PREPEND_URL){

        //TODO: centralize this function so it can be used with all apps

        /**
         * @ngdoc function
         * @name databases.databasesFactory#appendTransform
         * @methodOf databases.databasesFactory
         *
         * @param {Array.<function()>} defaults Default `Array` of `$http` transform response transform functions from Angular - will always be `$http.defaults.transformResponse`
         * @param {function()} transform Transform function to extend the `$http.defaults.transformResponse` Array with.
         *
         * @description
         * <span class="label label-warning">Private</span>
         * Extend the default responseTransform array - Straight from Angular 1.2.8 API docs - https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
         *
         * Doing this allows custom modifications of the JSON response from the API to be cached after the initial `$resource` call, instead of
         * performing these modifications on every `$digest()` cycle (e.g., make modifications once, instead of every time the databases list is refreshed).
         *
         * @returns {Array.<function()>} Returns the new `transformResponse` Array
         */
        function appendTransform(defaults, transform) {

            // We can't guarantee that the default transformation is an array
            defaults = angular.isArray(defaults) ? defaults : [defaults];
            //console.log(defaults.concat(transform));
            // Append the new transformation to the defaults
            return defaults.concat(transform);
        }

        return $resource('//wwwdev2.lib.ua.edu/databases/api/:db', {db: 'all'}, {
            get: {
                cache: true,
                method: 'GET',
                transformResponse: appendTransform($http.defaults.transformResponse, function(data){
                    var db = angular.fromJson(data);

                    //Pre sort databases by title
                    var databases = $filter('orderBy')(db.databases, 'title');
                    // Set position for stable sort
                    angular.forEach(databases, function(db, i){
                        var access;
                        switch (databases[i].location){
                            case 'UA':
                                access = 'On campus only';
                                break;
                            case 'UA, Remote':
                                access = 'myBama login required off campus';
                                break;
                            case 'www':
                            case 'WWW':
                                access = false;
                                break;
                            default:
                                access = databases[i].location;
                        }
                        if (databases[i].auth == "1")
                            databases[i].url = DB_PROXY_PREPEND_URL + databases[i].url;
                        databases[i].access = access;
                        databases[i].position = i;
                        databases[i].inScout = databases[i].notInEDS === 'Y';

                    });
                    db.databases = databases;
                    return db;
                })
            }
        });
    }]);
angular.module('ualib.databases')

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/databases', {
                reloadOnSearch: false,
                resolve: {
                    databases: ['databasesFactory', function(databasesFactory){
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
                    }]
                },
                templateUrl: 'databases/databases-list.tpl.html',
                controller: 'DatabasesListCtrl'
            })
    }])

    /**
     * @ngdoc controller
     * @name databases.Controller:DatabasesListCtrl
     *
     * @requires $scope
     * @requires $filter
     * @requires $location
     * @requires $document
     * @requires databases.databasesFactory
     *
     *
     * @description
     * Controller for the databases route (`/#/databases`)
     */

    .controller('DatabasesListCtrl', ['$scope', 'databases', '$filter' ,'$location' ,'$document', function($scope, db, $filter, $location, $document){
        var databases = [];

        /**
         * @ngdoc object
         * @name databases.Controller:DatabasesListCtrl:$scope.numAlpha
         * @propertyOf databases.Controller:DatabasesListCtrl
         *
         * @description
         * `Array` of characters `a-z` for `Starts With` filter UI
         */
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

