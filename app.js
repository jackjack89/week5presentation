angular.module('rtfmApp', ['firebase', 'ngRoute', 'monospaced.qrcode', 'ngCookies', 'angular-uuid']).run(function ($rootScope, $cookies, $window, uuid) {
    $rootScope.cookie = $cookies.get('clientid');
    // console.log(uuid.v4());
    if ($rootScope.cookie === null) {
        var now = new $window.Date();
        exp = new $window.Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
        var username = uuid.v4();
        $cookies.put('clientid', username, {
            expires: exp
        });
    }
    $rootScope.cookie = $cookies.get('clientid');
    console.log("cookie is " + $rootScope.cookie);
})

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

    .controller('threadsCtrl', function ($rootScope,$scope, $firebaseArray, threadsRef, $cookies, $window, uuid) {
    $scope.threads = $firebaseArray(threadsRef);
    $scope.threads.$loaded().then(function (threads) {});
})

    .controller("QRCodeCtrl", function ($rootScope,$scope, $firebaseArray, threadsRef) {
    $scope.threads = $firebaseArray(threadsRef);
    $scope.threads.$loaded().then(function (threads) {});

    $scope.createThread = function (title) {
        var username = $rootScope.cookie;
        $scope.threads.$add({
            username: username,
            title: title
        });
    };

})

    .controller('threadCtrl', function ($rootScope,$scope, $firebaseArray, $firebaseObject, $location, threadRef, commentsRef) {
    var thread = $firebaseObject(threadRef);
    $scope.currentLocation = $location.absUrl();
    thread.$bindTo($scope, 'thread');
    $scope.comments = $firebaseArray(commentsRef)
    $scope.createComment = function (text) {
        var username = $rootScope.cookie;
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
