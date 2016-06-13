angular.module("app", [
  "timer",
  "app.auth",
  "app.race",
  "app.leaderboard",
  "app.services",
  "ngRoute",
  ])

.config(function($routeProvider, $httpProvider){
  $routeProvider
    .when('/signin', {
      templateUrl: '../auth/signin.html',
      controller: 'AuthController'
    })
    // The raceView address will have the user and room id
    // These ids are used for the socket instantiateUser event
    .when('/raceView/:roomId/:userId', {
      templateUrl: '../race/race.html',
      controller: 'raceController'
    })
    .when('/leaderboard', {
      templateUrl: '../leaderboard/leaderboard.html',
      controller: 'leaderboardController'
    })
    // Default back to /signin page
    .otherwise({
      redirectTo: '/signin'
    });

  // We add our $httpInterceptor into the array of interceptors. Its like middleware for ajax calls
  $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this $httpInterceptor stops all outgoing request
  // looks in local storage to find the user's token
  // adds token to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.stegorex');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});