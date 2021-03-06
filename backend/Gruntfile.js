'use strict';

var conf = require('./config');
var request = require('superagent');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = conf.reloadPort, files;

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    develop: {
      server: {
        file: 'app/app.js'
      }
    },

    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      js: {
        files: [
          'config.js',
          'app/**/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      jsTest: {
        files: ['test/**/*.js'],
        tasks: ['newer:jshint:test']
        //tasks: ['newer:jshint:test', 'mochaTest']
      }
    },

    clean: {
      dist: ['dist']
    },

    copy: {
      dist: {
        files: [
          {
            expand: true, 
            src: ['app/**'], 
            dest: 'dist/'
          },
          {
            expand: true, 
            src: ['node_modules/**'], 
            dest: 'dist/'
          },
          {
            expand: true, 
            src: ['config.js'], 
            dest: 'dist/'
          }
        ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'app/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      lint: [
        'newer:jshint:all',
        'newer:jshint:test'
      ],
      server: [ // Not yet used
        'copy:styles'
      ],
      test: [ // Not yet used
        'copy:styles'
      ]
    },

    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'chai',
          ui: 'bdd'
          //timeout: 20000
        },
        src: ['test/**/*.js']
      }
    }

  });

  grunt.config.requires('watch.js.files');
  files = grunt.config('watch.js.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded)
            grunt.log.ok('Delayed live reload successful.');
          else
            grunt.log.error('Unable to make a delayed live reload.');
          done(reloaded);
        });
    }, 500);
  });


  grunt.registerTask('serve', [
    'develop',
    'watch'
  ]);

  grunt.registerTask('test', [
    'concurrent:lint',
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist'
  ]);

  grunt.registerTask('default', [
    // In order for grunt test to work grunt serve in "development"
    // or "test" mode MUST be running
    'newer:jshint',
    'test',
    'build'
  ]);

};
