var app = angular.module('Index', ["chart.js"]);

app.controller('IndexCtrl', function ($scope, $http, $timeout) {

    window.addEventListener("deviceorientation", handleOrientation, true);
    function handleOrientation(event) {
        $scope.$apply(function(){
            $scope.absolute = event.absolute;
            $scope.alpha    = event.alpha;
            $scope.beta     = event.beta;
            $scope.gamma    = event.gamma;
        });
    }
});
