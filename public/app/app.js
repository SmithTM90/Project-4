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
bandFinder.controller('finder', ['$scope', '$http', '$sce', function($scope,$http, $sce) {

  $scope.search = function(searchTerm) {
    $scope.term = searchTerm
    tasteKid()
  }

  $scope.convertSongUrl = function(songUrl) {
    return $sce.trustAsResourceUrl(songUrl);
  }

  function tasteKid() {
    $http.get('https://tastekid.com/api/similar?', {
      params: {
        q: $scope.term,
        type: 'music',
        info: 1,
        limit: 2,
        k:'235626-Project4-CE4XY65G'
      }
    })
    .then(function success(response) {
      $scope.results = response.data.Similar.Results
      console.log($scope.results)
      $scope.results.forEach(function(result, index) {
        itunesSearch(result.Name, index);
      });
    }, function error(response) {
      console.log('tasteKid error');
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