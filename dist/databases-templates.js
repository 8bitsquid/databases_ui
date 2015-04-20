angular.module('databases.templates', ['dbList/databasesMain.tpl.html', 'dbList/dbList.tpl.html', 'dbList/dbListMain.tpl.html']);

angular.module("dbList/databasesMain.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/databasesMain.tpl.html",
    "<div ng-view></div>");
}]);

angular.module("dbList/dbList.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/dbList.tpl.html",
    "<div class=\"row form-inline\">\n" +
    "    <div class=\"col-md-12 form-group text-left\">\n" +
    "        <label for=\"filterBy\">Filter <small>{{filteredDB.length}}</small> results by</label>\n" +
    "        <div id=\"filterBy\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title starts with\" ng-model=\"dbList.titleStartFilter\"\n" +
    "                   ng-change=\"\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Title contains\" ng-model=\"dbList.titleFilter\"\n" +
    "                   ng-change=\"\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Description contains\" ng-model=\"dbList.descrFilter\"\n" +
    "                   ng-change=\"\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Subjects contain\" ng-model=\"dbList.subjectFilter\"\n" +
    "                   ng-change=\"\">\n" +
    "            <input type=\"text\" class=\"form-control\" placeholder=\"Media Types contain\" ng-model=\"dbList.typeFilter\"\n" +
    "                   ng-change=\"\">\n" +
    "            <button type=\"button\" class=\"btn btn-primary\" ng-click=\"updateURL()\">\n" +
    "                Update URL\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"cold-md-12 form-group\">\n" +
    "        <label for=\"selectST\" ng-click=\"subTypSelOpen = !subTypSelOpen\">\n" +
    "            <span class=\"fa fa-fw fa-caret-right\" ng-show=\"subTypSelOpen\"></span>\n" +
    "            <span class=\"fa fa-fw fa-caret-down\" ng-show=\"!subTypSelOpen\"></span>\n" +
    "            <a>\n" +
    "                Select Subjects and Media Types\n" +
    "            </a>\n" +
    "        </label>\n" +
    "        <div id=\"selectST\" ng-show=\"subTypSelOpen\">\n" +
    "            <div class=\"col-md-8\">\n" +
    "                <div class=\"text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"selectAllSubjects(false)\">\n" +
    "                        Deselect All Subjects\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <label class=\"btn btn-default\" btn-checkbox ng-repeat=\"subject in dbList.subjects\"\n" +
    "                        ng-model=\"subject.selected\" ng-click=\"updateStatus(subject)\">\n" +
    "                    {{subject.subject}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div class=\"text-center\">\n" +
    "                    <button type=\"button\" class=\"btn btn-primary\" ng-click=\"selectAllTypes(false)\">\n" +
    "                        Deselect All Types\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <label class=\"btn btn-default\" btn-checkbox ng-repeat=\"type in dbList.types\"\n" +
    "                        ng-model=\"type.selected\" ng-click=\"updateTypes(type)\">\n" +
    "                    {{type.type}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "<div class=\"row\"\n" +
    "     ng-repeat=\"db in filteredDB = (dbList.databases | filter:{title:dbList.titleStartFilter}:startTitle\n" +
    "                                                     | filter:{title:dbList.titleFilter}:compareTitle\n" +
    "                                                     | filter:{description:dbList.descrFilter}:compareTitle\n" +
    "                                                     | filter:{subjects:dbList.subjectFilter}:compareTitle\n" +
    "                                                     | filter:{types:dbList.typeFilter}:compareTitle\n" +
    "                                                     | filter:{disabled:0}\n" +
    "                                                     | filter:{subjects:selectedSubjects}:filterSubjects\n" +
    "                                                     | filter:{types:selectedTypes}:filterTypes\n" +
    "                                                     | orderBy:['-primary','title'])\n" +
    "    | startFrom:(currentPage-1)*perPage | limitTo:perPage\"\n" +
    "     ng-class=\"{sdOpen: db.show, sdOver: db.id == mOver}\" ng-mouseover=\"setOver(db)\">\n" +
    "    <div class=\"col-md-12\" ng-click=\"toggleDB(db)\">\n" +
    "        <div class=\"col-md-10\">\n" +
    "            <h4>\n" +
    "                <span class=\"fa fa-fw fa-caret-right\" ng-hide=\"db.show\"></span>\n" +
    "                <span class=\"fa fa-fw fa-caret-down\" ng-show=\"db.show\"></span>\n" +
    "                <a href=\"{{db.url}}\" ng-hide=\"db.tmpDisabled == '1'\">{{db.title}}</a>\n" +
    "                <span ng-show=\"db.tmpDisabled == '1'\">{{db.title}}</span>\n" +
    "                <small>{{db.coverage}}</small>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 text-right\">\n" +
    "            <small ng-show=\"db.primary && selectedSubjects.length > 0\">RECOMMENDED</small>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <p ng-bind-html=\"db.description\"></p>\n" +
    "            <h4 ng-show=\"primarySubj.length > 0\"><small>Primary Subjects:</small>\n" +
    "                <small ng-repeat=\"subject in primarySubj = (db.subjects | filter:{type:'1'})\">\n" +
    "                    {{subject.subject}}<span ng-hide=\"$index == primarySubj.length-1\"> | </span>\n" +
    "                </small>\n" +
    "            </h4>\n" +
    "            <h4><small>Media Types:</small>\n" +
    "                <small ng-repeat=\"type in db.types\">\n" +
    "                    {{type.type}}<span ng-hide=\"$index == db.types.length-1\"> | </span>\n" +
    "                </small>\n" +
    "            </h4>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-show=\"db.show\">\n" +
    "        <div class=\"col-md-2 form-group\" ng-show=\"db.publisher\">\n" +
    "            <label for=\"{{db.id}}_Publisher\">Publisher</label>\n" +
    "            <p id=\"{{db.id}}_Publisher\">{{db.publisher}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\" ng-show=\"db.vendor\">\n" +
    "            <label for=\"{{db.id}}_Vendor\">Vendor</label>\n" +
    "            <p id=\"{{db.id}}_Vendor\">{{db.vendor}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\" ng-show=\"db.location\">\n" +
    "            <label for=\"{{db.id}}_Location\">Location</label>\n" +
    "            <p id=\"{{db.id}}_Location\">{{db.location}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"{{db.id}}_NotInEDS\">Not in EDS</label>\n" +
    "            <p id=\"{{db.id}}_NotInEDS\">{{db.notInEDS}}<span ng-hide=\"db.notInEDS\">In EDS</span></p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\">\n" +
    "            <label for=\"{{db.id}}_Full-text\">Fulltext</label>\n" +
    "            <p id=\"{{db.id}}_Full-text\">{{db.hasFullText}}<span ng-hide=\"db.hasFullText\">No</span></p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\" ng-show=\"db.presentedBy\">\n" +
    "            <label for=\"{{db.id}}_presented\">Presented by</label>\n" +
    "            <p id=\"{{db.id}}_presented\">{{db.presentedBy}}</p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-2 form-group\" ng-show=\"db.audience1 || db.audience2\">\n" +
    "            <label for=\"{{db.id}}_Audience1\">Audience</label>\n" +
    "            <p id=\"{{db.id}}_Audience1\">{{db.audience1}} <span ng-show=\"db.audience2\">, {{db.audience2}}</span></p>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-4 form-group\" ng-show=\"primarySubjects.length > 0\">\n" +
    "                <label for=\"{{db.id}}_subjectsP\">Primary Subjects</label>\n" +
    "                <ul class=\"list-group\" id=\"{{db.id}}_subjectsP\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"subject in primarySubjects = (db.subjects | filter:{type:'1'})\">\n" +
    "                        {{subject.subject}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\" ng-show=\"secondarySubjects.length > 0\">\n" +
    "                <label for=\"{{db.id}}_subjectsS\">Secondary Subjects</label>\n" +
    "                <ul class=\"list-group\" id=\"{{db.id}}_subjectsS\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"subject in secondarySubjects = (db.subjects | filter:{type:'2'})\">\n" +
    "                        {{subject.subject}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4 form-group\">\n" +
    "                <label for=\"{{db.id}}_types\">Media Types</label>\n" +
    "                <ul class=\"list-group\" id=\"{{db.id}}_types\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"type in db.types\">\n" +
    "                        {{type.type}}\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"text-center\">\n" +
    "    <pagination total-items=\"filteredDB.length\" ng-model=\"currentPage\" max-size=\"maxPageSize\" class=\"pagination-sm\"\n" +
    "                boundary-links=\"true\" rotate=\"false\" items-per-page=\"perPage\"></pagination>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("dbList/dbListMain.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("dbList/dbListMain.tpl.html",
    "<div databases-list></div>\n" +
    "");
}]);
