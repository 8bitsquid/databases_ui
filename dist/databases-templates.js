angular.module('databases.templates', ['list/list.tpl.html', 'list/listMain.tpl.html']);

angular.module("list/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/list.tpl.html",
    "<div ng-show=\"dbList.searchText.length > 0\">\n" +
    "    <h3>Searched for: {{dbList.searchText}}, found {{filteredDB.length}} results</h3>\n" +
    "    <div class=\"text-center row form-inline\">\n" +
    "        <div class=\"col-md-12 form-group text-left\">\n" +
    "            <label for=\"filterBy\">Filter by</label>\n" +
    "            <div id=\"filterBy\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Title\" ng-model=\"dbList.titleFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Description\" ng-model=\"dbList.descrFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Subject\" ng-model=\"dbList.subjectFilter\">\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"Media Type\" ng-model=\"dbList.typeFilter\">\n" +
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
    "                                                         | filter:{title:dbList.titleFilter}:compareTitle\n" +
    "                                                         | filter:{description:dbList.descrFilter}:compareTitle\n" +
    "                                                         | filter:{subjects:dbList.subjectFilter}:compareTitle\n" +
    "                                                         | filter:{types:dbList.typeFilter}:compareTitle)\n" +
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
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"{{db.id}}_title\">Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.title}}\" ng-model=\"db.title\"\n" +
    "                       id=\"{{db.id}}_title\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.publisher}}\" ng-model=\"db.publisher\"\n" +
    "                       id=\"{{db.id}}_Publisher\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.vendor}}\" ng-model=\"db.vendor\"\n" +
    "                       id=\"{{db.id}}_Vendor\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"{{db.id}}_URL\">URL</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.url}}\" ng-model=\"db.url\"\n" +
    "                       id=\"{{db.id}}_URL\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.location}}\" ng-model=\"db.location\"\n" +
    "                       id=\"{{db.id}}_Location\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"{{db.id}}_NotInEDS\">Not in EDS</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notInEDS}}\" ng-model=\"db.notInEDS\"\n" +
    "                       id=\"{{db.id}}_NotInEDS\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.hasFullText}}\" ng-model=\"db.hasFullText\"\n" +
    "                       id=\"{{db.id}}_Full-text\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"{{db.id}}_Authenticate\">Authenticate</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.auth\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"{{db.id}}_Authenticate\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-1 form-group\">\n" +
    "                <label for=\"{{db.id}}_Disable\">Disabled</label>\n" +
    "                <input type=\"checkbox\" class=\"form-control\" ng-model=\"db.disabled\" ng-true-value=\"'1'\" ng-false-value=\"'0'\"\n" +
    "                       id=\"{{db.id}}_Disable\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"{{db.id}}_Coverage\">Coverage</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.coverage}}\" ng-model=\"db.coverage\"\n" +
    "                       id=\"{{db.id}}_Coverage\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6 form-group\">\n" +
    "                <label for=\"{{db.id}}_Notes\">Notes</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.notes}}\" ng-model=\"db.notes\"\n" +
    "                       id=\"{{db.id}}_Notes\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 form-group\">\n" +
    "                <label for=\"{{db.id}}_descr\">Database Description</label>\n" +
    "                <textarea class=\"form-control\" rows=\"3\" id=\"{{db.id}}_descr\" ng-model=\"db.description\"></textarea>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_presented\">Presented by</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.presentedBy}}\" ng-model=\"db.presentedBy\"\n" +
    "                       id=\"{{db.id}}_presented\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_Audience1\">Audience One</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience1}}\" ng-model=\"db.audience1\"\n" +
    "                       id=\"{{db.id}}_Audience1\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-2 form-group\">\n" +
    "                <label for=\"{{db.id}}_Audience2\">Audience Two</label>\n" +
    "                <input type=\"text\" class=\"form-control\" placeholder=\"{{db.audience2}}\" ng-model=\"db.audience2\"\n" +
    "                       id=\"{{db.id}}_Audience2\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
    "                <label for=\"{{db.id}}_dAuthor\">Description Author</label>\n" +
    "                <p id=\"{{db.id}}_dAuthor\">{{db.descrAuthor}}</p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-3 form-group\">\n" +
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

angular.module("list/listMain.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("list/listMain.tpl.html",
    "<h2>Search Databases</h2>\n" +
    "\n" +
    "<form ng-submit=\"search()\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-10\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Search Databases\" ng-model=\"dbList.searchText\">\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2\">\n" +
    "            <button type=\"submit\" class=\"btn btn-primary\">\n" +
    "                Search\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<div databases-list></div>\n" +
    "");
}]);
