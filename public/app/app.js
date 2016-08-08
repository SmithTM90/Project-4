bandFinder = angular.module('bandFinder', [])
// bandFinder.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
//   $urlRouterProvider.otherwise('/');

//   $stateProvider
//   .state('home', {
//     url: '/',
//     templateUrl: 'app/views/home.html',
//     controller: 'HomeCtrl'
//   });

//   $locationProvider.html5Mode(true);
// });

bandFinder.controller('finder', ['$scope', '$http', function($scope,$http) {

  $scope.search = function(searchTerm) {
    $scope.term = searchTerm
    tasteKid()
  }

  function tasteKid() {
    $http.get('https://www.tastekid.com/api/similar?', {
      params: {
        q: $scope.term,
        type: 'music',
        info: 1,
        limit: 20,
        k:'235626-Project4-CE4XY65G'
      }
    })
    .then(function success(response) {
      $scope.results = response.data
    }, function error(response) {
      console.log(response);
    })
  }

}])