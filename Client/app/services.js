angular.module('app.services', [])
  
  .factory('Auth', function($http, $location, $window) {
   
    var signin = function (user) {
      //need to define routes in server.js
      return $http({
        method: 'POST',
        url: '/api/users/signin',
        data: user
      })
      .then(function (resp) {
        console.log('token', resp.data.token);
        return resp.data.token;
      })
    };

    var signup = function (user) {
      return $http.post('/api/users/signup', user)
        .then(function (response) {
          return response.data.token;
        });
    };

    var isAuth = function () {
      return !!$window.localStorage.getItem('com.stegorex');
    };

    var signout = function () {
      $window.localStorage.removeItem('com.stegorex');
      $location.path('/signin');
    };

    return {
      signin: signin,
      signup: signup,
      isAuth: isAuth,
      signout: signout
    };
  });