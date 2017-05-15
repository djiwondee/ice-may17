var app = angular.module('Index', []);

app.controller('IndexCtrl', function ($scope, $http, $timeout) {
    window.addEventListener("deviceorientation", handleOrientation, true);
    function handleOrientation(event) {
        $scope.$apply(function(){
            $scope.beta = Math.round(event.beta);
        });
    }
});
