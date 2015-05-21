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
    "                        <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" uncheckable>{{na}}</label>\n" +
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
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3 dbware-list-container\">\n" +
    "        <!--<div class=\"text-center\">\n" +
    "            <pagination total-items=\"totalItems\" ng-model=\"db.page\" max-size=\"10\" class=\"pagination-sm\" boundary-links=\"true\" items-per-page=\"db.perPage\" ng-change=\"update()\" ng-if=\"filteredDB.length > db.perPage\"></pagination>\n" +
    "        </div>-->\n" +
    "\n" +
    "        <div class=\"media\" ng-repeat=\"item in filteredDB | limitTo:20\">\n" +
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
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination total-items=\"filteredDB.length\" ng-model=\"db.page\" max-size=\"10\" class=\"pagination-sm\" boundary-links=\"true\" items-per-page=\"db.perPage\" ng-change=\"update()\" ng-if=\"filteredDB.length > db.perPage\"></pagination>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
