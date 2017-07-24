angular.module("IAmNotAlone", ["ngRoute", "RouteControllers", "UserService", "angular-storage"]);

angular.module("IAmNotAlone").config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);  // Enable href routing without hashes

    $routeProvider.when("/", {
        templateUrl: "templates/home.html",
        controller: "HomeController"
    })
    .when("/charts", {
        templateUrl: "templates/charts.html",
        controller: "RegisterController"
    })
    .when("/real_stories", {
    	templateUrl: "templates/real_stories.html",
    	controller: "FirstReviewsController"
    })

});