angular.module('app.auth', ['app.services'])

  //Auth controller is responsible for our client-side authentication
  // in our signup/signin forms using the injecte Auth service -KN
  .controller('AuthController', function ($scope, $location, $window, Auth) {
    $scope.user = {};
    $scope.username = '';

    $scope.racename = '';

    $scope.ctrlSignIn = function () {
      Auth.signin($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.stegorex', token);
          // Upon submit of the signin form redirect to raceView using the racename and username
          $location.path('/raceView'+ scope.racename + '/' + $scope.username);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.signup = function() {
      Auth.signup($scope.user)
        .then(function (token) {
          $window.localStorage.setItem('com.stegorex', token);
          $location.path('/raceView'+ scope.racename + '/' + $scope.username);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    $scope.logout = function() {
      Auth.logout($scope.user);
    }
  });
