var app = angular.module('Index', ["chart.js"]);

app.controller('IndexCtrl', function ($scope, $http, $interval) {
    $scope.tilt = null;

    $scope.options = {
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 180,
                    min: -180,
                    stepSize: 30
                }
            }]
        },
        maintainAspectRatio: false
    };

    $scope.labels = [];
    $scope.values = [];
    $scope.numEntries = 10;
    for(var i=0; i<$scope.numEntries; i++) {
        $scope.labels.push(' ');
        $scope.values.push(null);
    }
    $scope.data = [ $scope.values ];
    $scope.series = ["Tilt"];

    var host = location.origin.replace(/^http/, 'ws');
    var ws = new WebSocket(host);
    ws.onmessage = function (event) {
        $scope.$apply(function(){
            var data = JSON.parse(event.data);

            $scope.tilt = data.tilt;
            var d = new Date();
            $scope.labels.push(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
            $scope.values.push($scope.tilt);
            if($scope.values.length > $scope.numEntries) {
                $scope.labels.shift();
                $scope.values.shift();
            }
        });
    };
    $interval(ping, 1000);
    function ping() {
        ws.send("ping");
    }

});
