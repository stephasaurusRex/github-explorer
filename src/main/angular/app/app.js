var githubExplorer = angular.module('github-explorer', [
    'ui.router',
    'ui.bootstrap',
    'github-explorer.common.models',
    'github-explorer.projects',
    'templates-app',
    'templates-common'
]);

githubExplorer.controller('AppCtrl', function AppCtrl($rootScope, $scope,  $state, $location, $log, $stateParams, $window) {
    var app = this;

    $state.go('projects');

});


;