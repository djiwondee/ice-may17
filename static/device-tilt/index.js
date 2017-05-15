var app = angular.module('Index', []);

app.controller('IndexCtrl', function ($scope, $http, $interval) {
    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);

    ws.onopen = function() {
        $interval(send, 1000);
        //$scope.$watch("beta", send);
        function send() {
            var data = {
                timestamp: Date.now(),
                tilt: $scope.beta
            };
            ws.send(JSON.stringify(data));
        };
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    function handleOrientation(event) {
        $scope.$apply(function(){
            $scope.beta = Math.round(event.beta);
        });
    }
});
