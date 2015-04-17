angular.module('databases.templates', ['dbList/databasesMain.tpl.html', 'dbList/dbList.tpl.html', 'dbList/dbListMain.tpl.html']);

angular.module("dbList/databasesMain.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/databasesMain.tpl.html",
    "<div ng-view></div>");
}]);

angular.module("dbList/dbList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/dbList.tpl.html",
    "<div ng-show=\"dbList.searchText.length > 0\">\n" +
    "    <div class=\"text-center row form-inline\">\n" +
    "        <div class=\"col-md-12 form-group text-left\">\n" +
    "            <label for=\"filterBy\">Filter <small>{{filteredDB.length}}</small> results by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title starts with\" ng-model=\"dbList.titleStartFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"dbList.titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"dbList.descrFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subjects contain\" ng-model=\"dbList.subjectFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Media Types contain\" ng-model=\"dbList.typeFilter\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "    <div class=\"row\"\n" +
    "         ng-repeat=\"db in filteredDB = (dbList.databases | filter:{filterBy:dbList.searchText}:compareTitle\n" +
    "                                                         | filter:{title:dbList.titleStartFilter}:startTitle\n" +
    "                                                         | filter:{title:dbList.titleFilter}:compareTitle\n" +
    "                                                         | filter:{description:dbList.descrFilter}:compareTitle\n" +
    "                                                         | filter:{subjects:dbList.subjectFilter}:compareTitle\n" +
    "                                                         | filter:{types:dbList.typeFilter}:compareTitle\n" +
    "                                                         | filter:{disabled:0}\n" +
    "                                                         | orderBy:'title')\n" +
    "        | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "         ng-class=\"{sdOpen: db.show, sdOver: db.id == mOver}\" ng-mouseover=\"setOver(db)\">\n" +
    "        <div class=\"col-md-12\" ng-click=\"toggleDB(db)\">\n" +
    "            <h4>\n" +
    "                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                <a href=\"{{db.url}}\">{{db.title}}</a>\n" +
    "                <small>{{db.publisher}} <span ng-show=\"db.vendor.length > 0\">: {{db.vendor}}</span></small>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\" ng-show=\"db.show\">\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                <p id=\"{{db.id}}_descr\">{{db.description}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\" ng-show=\"db.coverage\">\n" +
    "                <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                <p id=\"{{db.id}}_Coverage\">{{db.coverage}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\" ng-show=\"db.publisher\">\n" +
    "                <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                <p id=\"{{db.id}}_Publisher\">{{db.publisher}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\" ng-show=\"db.vendor\">\n" +
    "                <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                <p id=\"{{db.id}}_Vendor\">{{db.vendor}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\" ng-show=\"db.notes\">\n" +
    "                <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                <p id=\"{{db.id}}_Notes\">{{db.notes}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\" ng-show=\"db.location\">\n" +
    "                <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                <p id=\"{{db.id}}_Location\">{{db.location}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_NotInEDS\">Not in EDS</label>\n" +
    "                <p id=\"{{db.id}}_NotInEDS\">{{db.notInEDS}}<span ng-hide=\"db.notInEDS\">In EDS</span></p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                <p id=\"{{db.id}}_Full-text\">{{db.hasFullText}}<span ng-hide=\"db.hasFullText\">No</span></p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"{{db.id}}_Authenticate\" disabled>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\" ng-show=\"db.presentedBy\">\n" +
    "                <label for=\"{{db.id}}_presented\">Presented by</label>\n" +
    "                <p id=\"{{db.id}}_presented\">{{db.presentedBy}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\" ng-show=\"db.audience1 || db.audience2\">\n" +
    "                <label for=\"{{db.id}}_Audience1\">Audience</label>\n" +
    "                <p id=\"{{db.id}}_Audience1\">{{db.audience1}} <span ng-show=\"db.audience2\">, {{db.audience2}}</span></p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\" ng-show=\"db.descrAuthor\">\n" +
    "                <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                <p id=\"{{db.id}}_dAuthor\">{{db.descrAuthor}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\" ng-show=\"db.lastModified\">\n" +
    "                <label for=\"{{db.id}}_date\">Last Modified</label>\n" +
    "                <p id=\"{{db.id}}_date\">{{db.lastModified}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_subjects\">Subjects</label>\n" +
    "                    <ul class=\"list-group\" id=\"{{db.id}}_subjects\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"subject in db.subjects\">\n" +
    "                            {{subject.subject}} : {{subject.type}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6 form-group\">\n" +
    "                    <label for=\"{{db.id}}_types\">Types</label>\n" +
    "                    <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                        <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                            {{type.type}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"text-center\">\n" +
    "        <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                    boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("dbList/dbListMain.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/dbListMain.tpl.html",
    "<h2>Search Databases</h2>\n" +
    "\n" +
    "<form ng-submit=\"search()\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-4\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Search Databases\" ng-model=\"dbList.searchText\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">\n" +
    "                <span ng-show=\"dbList.searchText.length == 0\">Search</span>\n" +
    "                <span ng-hide=\"dbList.searchText.length == 0\">Update URL</span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div databases-list></div>\n" +
    "");
}]);
