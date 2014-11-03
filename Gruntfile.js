/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    changelog: {
      options: {
        repository: 'https://github.com/ghachey/candy-basket',
        //grep: '^feat|^fix|^docs|^style|^refactor|^test|^chore|BREAKING', // not supported
        from: 'be0b17a329e53d9613554c402b08a0be36f45528',
        to: 'HEAD'
      }
    },
    ngdocs: {
      options: {
        dest: 'frontend/app/docs',
        //scripts: ['frontend/bower_components/angular/angular.js'],
        html5Mode: true,
        startPage: '/api',
        title: 'Candy Basket Source Code Documentation'
      },
      api: {
        src: ['frontend/app/**/*.js'],
        title: 'Frontend API Documentation'
      }
    },
    connect: {
      options: {
        keepalive: true
      },
      server: {}
    },
    clean: ['frontend/app/docs']
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Tasks.
  grunt.registerTask('docs', ['clean', 'ngdocs']);
  grunt.registerTask('serve-docs', ['clean', 'ngdocs', 'connect']);
  grunt.registerTask('default', ['changelog']);

};
