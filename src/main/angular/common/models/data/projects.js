angular.module('github-explorer.models.projects', [])

    .service('githubProjectsModel', function githubProjectsModel($http, $q) {
        var githubProjectsModel = this;

        githubProjectsModel.getRepos = function(organization) {
            var deferred = $q.defer();

            var getString = 'https://api.github.com/orgs/' + organization + '/repos';

            $http.get(getString).then(
                function success(result) {
                    console.log(result);
                    console.log(result.size)
                    deferred.resolve(result);
                },
                function error(error) {
                    deferred.reject('Error retrieving projects.');
                }
            );
            return deferred.promise;
        };


        githubProjectsModel.getCommits = function(fullName) {
            var deferred = $q.defer();

            var getString = 'https://api.github.com/repos/'+ fullName + '/commits';

            $http.get(getString).then(
                function success(result) {
                    console.log(result);
                    console.log(result.size)
                    deferred.resolve(result);
                },
                function error(error) {
                    deferred.reject('Error retrieving projects.');
                }
            );
            return deferred.promise;
        };

    })