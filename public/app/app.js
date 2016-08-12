bandFinder = angular.module('bandFinder', ['ui.router', 'SongsCtrl'])

bandFinder.config(function($urlRouterProvider, $stateProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'app/views/home.html',
    controller: 'HomeCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'app/views/userSignup.html',
    controller: 'SignupCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/views/userLogin.html',
    controller: 'LoginCtrl'
  });

  $locationProvider.html5Mode(true);
});
bandFinder.controller('finder', ['$scope', '$http', '$sce', function($scope,$http, $sce) {

  $scope.search = function(searchTerm) {
    $scope.term = searchTerm
    tasteKid()
  }

  $scope.convertSongUrl = function(songUrl) {
    return $sce.trustAsResourceUrl(songUrl);
  }

  function tasteKid() {
    $http.get('http://tastekid.com/api/similar?', {
      params: {
        q: $scope.term,
        type: 'music',
        info: 1,
        limit: 15,
        k:'235626-Project4-HB2YAWWP'
      }
    })
    .then(function success(response) {
      $scope.results = response.data.Similar.Results
      console.log($scope.results)
      $scope.results.forEach(function(result, index) {
        itunesSearch(result.Name, index);
      });
    }, function error(response) {
      console.log(response);
    })
  }

  function itunesSearch(artist, resultIndex) {
    $http.get('https://itunes.apple.com/search?', {
      params: {
        term: artist,
        limit: 5
      }
    })
    .then(function success(results) {
      $scope.results[resultIndex].itunesSongs = results.data.results;
      console.log($scope.results[resultIndex].itunesSongs);
    }, function error(results) {
      console.log(results)
    })
  }
}])

bandFinder.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])