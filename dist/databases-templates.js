angular.module('databases.templates', ['databases/databases-list.tpl.html']);

angular.module("databases/databases-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("databases/databases-list.tpl.html",
    "<div class=\"page-header\"><h1>Databases</h1></div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-md-push-9\">\n" +
    "        <form class=\"facets-form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"db.search\" placeholder=\"Search databases\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Title starts with</h5>\n" +
    "                <div class=\"facet-group alphanum-group\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" ng-disabled=\"startsWithDisabled[na]\" uncheckable>{{na}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Subjects</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': subj.disabled}\" ng-repeat=\"subj in subjects\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.subjects[subj.subject]\" ng-disabled=\"subj.disabled\">\n" +
    "                            {{subj.subject}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Types</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': type.disabled}\" ng-repeat=\"type in types\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.types[type.type]\"  ng-disabled=\"type.disabled\">\n" +
    "                            {{type.type}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3 dbware-list-container\">\n" +
    "\n" +
    "        <div class=\"media\" ng-repeat=\"item in filteredDB | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">\n" +
    "                    <a ng-href=\"{{DB_PROXY_PREPEND_URL}}{{item.url}}\" title=\"{{item.title}}\"> {{item.title}}</a>  <small>{{item.coverage}}</small>\n" +
    "                </h4>\n" +
    "                <div class=\"details-context\">\n" +
    "                    <span ng-repeat=\"subj in item.subjects | where:{type:1}\">{{subj.subject}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"details-context\">\n" +
    "                    <span ng-repeat=\"type in item.types\">{{type.type}}</span>\n" +
    "                </div>\n" +
    "                <p>{{item.description}}</p>\n" +
    "\n" +
    "                <div class=\"details-context\">\n" +
    "                    <span ng-if=\"item.audience1\">{{item.audience1}}</span>\n" +
    "                    <span ng-if=\"item.audience2\">{{item.audience2}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "            <h2>No results found <span ng-if=\"db.search\"> for \"{{db.search}}\"</span></h2>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
