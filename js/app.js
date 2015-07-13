
var data;
var finalUrl;
var filterNew = false;
var filterHip = false;
var albumsUrl = 'https://api.spotify.com/v1/search?type=album&query=';
var albumUrl = 'https://api.spotify.com/v1/albums/';
var myApp = angular.module('myApp', []);

myApp.factory('albumFactory', function($http, $q) {
    var service = {};
    finalUrl = '';

    var makeUrl = function(terms, filterNew, filterHip) {

        finalUrl = albumsUrl + terms;

        if (filterNew == true) {
            finalUrl = finalUrl + '+tag:new';
        }

        if (filterHip == true) {
            finalUrl = finalUrl + '+tag:hipster';
        }

        return finalUrl;
    };

    service.getDetails = function(albumList) {

        var albumDetails = {};

        angular.forEach(albumList, function(d, i) {
            $http.get(albumUrl + d.id)
                .success(function (dat) {
                    albumDetails[i] = dat;
                });
        });

        return albumDetails;
    };

    service.getAlbums = function(t, n, h) {

        makeUrl(t, n, h);

        var deferred = $q.defer();

        $http.get(finalUrl)
            .success(function(response) {
                deferred.resolve(response);
            }).error(function() {
                deferred.reject('There was an error');
            });

        return deferred.promise;
    };

    return service;

});

var myCtrl = myApp.controller('myCtrl', function($scope, albumFactory) {

    //$scope.newFilter = newFilter;
    //$scope.hipFilter = hipFilter;
    $scope.albumData = {};
    $scope.audioObject = {};
    filterNew = $scope.newFilter;
    filterHip = $scope.hipFilter;

    //executes the spotify search in the factory,
    $scope.getResults = function() {

        albumFactory.getAlbums($scope.track, $scope.newFilter, $scope.hipFilter)
            .then(function(dat) {
                data = $scope.albumData = albumFactory.getDetails(dat.albums.items);
            }, function(dat) {
                alert(dat);
            })

    }; //end getResults

    //play snippet
    $scope.play = function(song) {

        if($scope.currentSong == song) {
            $scope.audioObject.pause();
            $scope.currentSong = false;
            return;
        }
        else {
            if($scope.audioObject.pause != undefined) $scope.audioObject.pause();
            $scope.audioObject = new Audio(song);
            $scope.audioObject.play();
            $scope.currentSong = song
        }

    }; //end play function

}); //ends myCtrl

// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});