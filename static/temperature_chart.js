var app = angular.module('Index', ["chart.js"]);

app.controller('IndexCtrl', function ($scope, $http, $timeout) {
    $scope.temperature = null;

    $scope.options = {
        animation: {
            duration: 0
        },
        scales: {
            yAxes: [{
                ticks: {
                    max: 30,
                    min: 0,
                    stepSize: 10
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
    $scope.series = ["Temperatur"];

    $scope.getTemp = function getTemp() {
        $http({
            method: 'GET',
            url: '/temperature'
        }).then(function successCallback(response) {
            $scope.temperature = response.data.temperature;

            var d = new Date();
            $scope.labels.push(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
            $scope.values.push($scope.temperature);

            if($scope.values.length > $scope.numEntries) {
                $scope.labels.shift();
                $scope.values.shift();
            }

            $scope.buttonPressed = response.data.buttonPressed;

            if(response.data.buttonPressed) {
                console.log("BUTTON PRESSED 2");
                window.top.postMessage({ event: 'measurement', value: $scope.temperature }, "*");
                console.log("event sent.");
            }

            $timeout(getTemp, 1000);
        }, function errorCallback(response) {
            console.log(response);
        });
    };


    $timeout($scope.getTemp, 1000);




});
