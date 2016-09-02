angular.module('RPiDemo', []);

angular.module('RPiDemo')
  .controller('RPiCtrl', function ($scope, dataService) {
    $scope.test = "Well, that worked"
    $scope.publish = function () {
      console.log('pushed!');
      dataService.publish().then(function (response) {
        console.log(response);
      })
    }
  });

angular.module('RPiDemo')
  .service('dataService', function ($http) {
    this.publish = function () {
      return $http({
        method: 'GET',
        url: '/test'
      }).then(function (response) {
        return response
      })
    }
  })
