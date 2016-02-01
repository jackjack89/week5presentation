angular.module('rtfmApp', ['firebase', 'ngRoute', 'monospaced.qrcode'])

.constant('fb', {
    url: 'https://feedmeweek5.firebaseio.com'
})

.config(function ($routeProvider) {
    $routeProvider
        .when('/threads', {
            templateUrl: 'threads.html',
            controller: 'threadsCtrl',
            resolve: {
                threadsRef: function (threadServ) {
                    return threadServ.getThreads()
                }
            }
        })
        .when('/create', {
            templateUrl: 'create.html',
            controller: 'QRCodeCtrl',
            resolve: {
                threadsRef: function (threadServ) {
                    return threadServ.getThreads()
                }
            }
        })
        .when('/threads/:threadId', {
            templateUrl: 'thread.html',
            controller: 'threadCtrl',
            resolve: {
                threadRef: function ($route, threadServ) {
                    return threadServ.getThread($route.current.params.threadId)
                },
                commentsRef: function ($route, threadServ) {
                    return threadServ.getComments($route.current.params.threadId)
                }
            }
        })
        .otherwise({
            redirectTo: '/threads'
        })
})

.controller('threadsCtrl', function ($scope, $firebaseArray, threadsRef) {
    $scope.threads = $firebaseArray(threadsRef);
    $scope.threads.$loaded().then(function (threads) {});
})

.controller("QRCodeCtrl", function ($scope, $firebaseArray, threadsRef) {
    $scope.threads = $firebaseArray(threadsRef);
    $scope.threads.$loaded().then(function (threads) {});
    $scope.createThread = function (username, title) {
        $scope.threads.$add({
            username: username,
            title: title
        });
    };

})

.controller('threadCtrl', function ($scope, $firebaseArray, $firebaseObject, $location, threadRef, commentsRef) {
    var thread = $firebaseObject(threadRef);
    //    console.log(threadServ.getThread(thread.id));
    //    console.log(thread);
    $scope.currentLocation = $location.absUrl();
    //console.log(currentLocation);
    thread.$bindTo($scope, 'thread');
    $scope.comments = $firebaseArray(commentsRef)
    $scope.createComment = function (username, text) {
        $scope.comments.$add({
            username: username,
            text: text
        })
    }
})

.service('threadServ', function (fb) {
    this.getThreads = function () {
        return new Firebase(fb.url + '/threads');
    }
    this.getThread = function (threadId) {
        return new Firebase(fb.url + '/threads/' + threadId)
    }
    this.getComments = function (threadId) {
        return new Firebase(fb.url + '/threads/' + threadId + '/comments')
    }
})

.directive()

;
