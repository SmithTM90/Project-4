angular.module('SongsCtrl', ['songServices'])
.controller('HomeCtrl', [ '$scope', '$http', function($scope,$http) {

}])
.controller('SignupCtrl', ['$scope', '$http', '$location', function($scope,$http,$location) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userSignup = function() {
    $http.post('/api/users', $scope.user).then(function success(res) {
      $location.path('/login');
    }, function error(res) {
      console.log(res);
    })
  }
}])
.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', function($scope,$http,$location,Auth) {
  $scope.user = {
    email: '',
    password: ''
  };
  $scope.userLogin = function() {
    $http.post('/api/auth', $scope.user).then(function success(res) {
      Auth.saveToken(res.data.token);
      console.log('Token:', res.data.token)
      $location.path('/');
    }, function error(res) {
      console.log(data);
    })
  };
}]);