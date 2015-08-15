angular.module('github-explorer.projects', [
    'ui.router',
    'toaster'
])
    .config(function ($stateProvider) {
        $stateProvider
            .state('projects', {
                url: '/projects',
                templateUrl: 'projects/projects.tpl.html',
                controller: 'ProjectsCtrl as projects'
            });
    })

    .controller('ProjectsCtrl', function ($state, $stateParams, $modal, $interval, toaster, githubProjectsModel) {

        var projects;
        projects = this;

        projects.radioModel = "-forks";

        projects.searchRepos = function () {
            githubProjectsModel.getRepos(projects.organization).then(
                function success(data) {
                    projects.repos = data.data;
                },
                function error() {
                    projects.repos = [];
                    toaster.pop('error', 'System Error', 'An error occurred trying to access the repo name. Are you sure it exists?', 5000);
                }
            );
        };

        projects.openCommitsModal = function (repo) {
            githubProjectsModel.getCommits(repo.full_name).then(
                function success(data) {
                    var modalInstance = $modal.open({
                        templateUrl: 'projects/commits/commits.tpl.html',
                        controller: CommitsModalInstanceCtrl,
                        resolve: {
                            commits:  function() {
                                return data.data;
                            }

                        }
                    });
                },
                function error() {
                    projects.repos = [];
                    toaster.pop('error', 'System Error', 'An error occurred trying to access the commits for this repo, sorry!', 5000);
                }
            );

        };


    });


var CommitsModalInstanceCtrl = function ($scope, $modalInstance, commits) {
    $scope.commits = commits;

    $scope.ok = function () {
        $modalInstance.close();
    };
};