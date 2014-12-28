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

    clean: {
      ngdocs: ['frontend/app/docs'],
      changelog: ['CHANGELOG.md']
    },

    release: {
      options: {
        bump: true,
        file: 'package.json',
        additionalFiles: ['backend/package.json', 'frontend/package.json', 
                          'frontend/bower.json'],
        add: true,
        commit: true,
        tag: true,
        push: true,
        pushTags: true,
        npm: false, //default: true
        //npmtag: true, //default: no tag
        indentation: '  ',
        //folder: 'folder/to/publish/to/npm', //default project root
        tagName: 'v<%= version %>',
        commitMessage: 'chore(release): Release version <%= version %>',
        tagMessage: 'tagging version <%= version %>'
        // github: { // for a github release (not yet)
        //   repo: 'ghachey/candy-basket',
        //   usernameVar: 'GITHUB_USERNAME', // ENVIRONMENT VARIABLES
        //   passwordVar: 'GITHUB_PASSWORD'
        // }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Tasks.
  grunt.registerTask('docs', ['clean:ngdocs', 'ngdocs']);
  grunt.registerTask('serve-docs', ['clean:ngdocs', 'ngdocs', 'connect']);
  grunt.registerTask('history', ['clean:changelog', 'changelog']);
  
  // Other tasks used from grunt-release (https://github.com/geddski/grunt-release)
  // grunt release:path
  // grunt release:minor
  // grunt release:major
  // grunt release:prerelease


};
