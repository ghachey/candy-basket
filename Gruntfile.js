/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    changelog: {
      options: {
        repository: 'https://github.com/ghachey/candy-basket',
        //grep: '^feat|^fix|^docs|^style|^refactor|^test|^chore|BREAKING', // not supported
        // Change from to previous tag (not the last release but the one before)
        from: 'ba478d735df2d071cc293a92c7e85a0499a97337',
        // Keep this to HEAD or change as needed
        to: 'bd7e3ac5e2875c29039b9d5f18b09377783d5184'
      }
    },

    // Those docs generators are essentially useful for now.

    // jsdoc : {
    //   dist : {
    //     src: ['backend/app/**/*.js', 'backend/test/specs/**/*.js', 
    //           'frontend/app/**/*.js', 'frontend/test/spec/**/*.js'], 
    //     options: {
    //       destination: 'jsdoc-output'
    //     }
    //   }
    // },

    // ngdocs: {
    //   options: {
    //     dest: 'frontend/app/docs',
    //     //scripts: ['frontend/bower_components/angular/angular.js'],
    //     html5Mode: true,
    //     startPage: '/api',
    //     title: 'Candy Basket Source Code Documentation'
    //   },
    //   api: {
    //     src: ['frontend/app/**/*.js'],
    //     title: 'Frontend API Documentation'
    //   }
    // },

    connect: {
      options: {
        keepalive: true
      },
      server: {}
    },

    clean: {
      ngdocs: ['frontend/app/docs'],
      changelog: ['CHANGELOG.md'],
      dist: ['dist']
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
    },

    shell: {
      buildhtmldocs: {
        command: 'make html',
        options: {
          stderr: false,
          execOptions: {
            cwd: 'docs'
          }
        }
      },
      buildpdfdocs: {
        command: 'make latexpdf',
        options: {
          stderr: false,
          execOptions: {
            cwd: 'docs'
          }
        }
      },
      buildbackend: {
        command: 'grunt',
        options: {
          execOptions: {
            cwd: 'backend'
          }
        }
      },
      buildfrontend: {
        command: 'grunt',
        options: {
          execOptions: {
            cwd: 'frontend'
          }
        }
      },
      mkdirs: {
        command: [
          'mkdir dist/',
          'mkdir dist/backend',
          'mkdir dist/frontend',
          'mkdir dist/frontend/help',
          'mkdir dist/frontend/certificates'
        ].join('&&')
      },
      copyapps: {
        command: [
          'cp -rf backend/dist/* dist/backend/',
          'cp -rf frontend/dist/* dist/frontend/'
        ].join('&')
      },
      copyotherfiles: {
        command: [
          'cp -rf frontend/certificates/* dist/frontend/certificates/',
          'cp -rf docs/build/html/* dist/frontend/help/',
          'cp docs/build/latex/CandyBasket.pdf dist/frontend/help/'
        ].join('&')
      },
      startbackend: { // don't forget to check out backend/config.js
        command: 'forever start app/app.js',
        options: {
          execOptions: {
            async: true,
            detached: true,
            env: {PATH: '/usr/local/bin/', NODE_ENV: 'production', 
                  USER: 'root', USERNAME: 'root', HOME: '/var/root',
                  LOGNAME: 'root'},
            cwd: 'dist/backend'
          }
        }
      },
      startfrontend: { // change to production certs
        command: 'forever start --sourceDir=/usr/local/bin/ --workingDir=dist/frontend/ http-server . --ssl -p 443 --cert certificates/hacksparrow-cert.pem --key certificates/hacksparrow-key.pem',
        options: {
          execOptions: {
            async: true,
            detached: true,
            env: {PATH: '/usr/local/bin/',  
                  USER: 'root', USERNAME: 'root', HOME: '/var/root',
                  LOGNAME: 'root'}
          }
        }
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-conventional-changelog');
  //grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Tasks.
  //grunt.registerTask('docs', ['clean:ngdocs', 'ngdocs']);
  //grunt.registerTask('serve-docs', ['clean:ngdocs', 'ngdocs', 'connect']);
  grunt.registerTask('history', ['changelog']);
  grunt.registerTask('docs', ['shell:buildhtmldocs', 'shell:buildpdfdocs']);

  grunt.registerTask('start', [
    'shell:startbackend',
    'shell:startfrontend'
  ]);

  grunt.registerTask('deploy', [
    'clean:dist',
    'docs', 
    'shell:buildbackend', 
    'shell:buildfrontend', 
    'shell:mkdirs', 
    'shell:copyapps',
    'shell:copyotherfiles',
    'start'
  ]);
  
  // Other tasks used from grunt-release (https://github.com/geddski/grunt-release)
  // grunt release:patch
  // grunt release:minor
  // grunt release:major
  // grunt release:prerelease


};
