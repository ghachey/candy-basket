/*global module:false*/
module.exports = function(grunt) {

  var user = process.env.USERNAME;
  var userHome = process.env.HOME;

  // Project configuration.
  grunt.initConfig({

    changelog: {
      options: {
        repository: 'https://github.com/ghachey/candy-basket',
        //grep: '^feat|^fix|^docs|^style|^refactor|^test|^chore|BREAKING', // not supported
        // Change from to previous tag (not the last release but the one before)
        from: '3b2e22517c182958001bb20d4eae37848f230dcf',
        // Keep this to HEAD or change as needed
        to: 'HEAD'
      }
    },

    connect: {
      options: {
        keepalive: true
      },
      server: {}
    },

    clean: {
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
            cwd: 'backend',
            env: {PATH: '/usr/bin/', NODE_ENV: 'test'}
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
          'cp -rf docs/build/html/* dist/frontend/help/',
          'cp docs/build/latex/CandyBasket.pdf dist/frontend/help/'
        ].join('&')
      },
      startbackend: { // don't forget to check out backend/config.js
        command: 'forever start --uid "candy-basket-backend" -a app/app.js',
        options: {
          execOptions: { // Use candy user instead of ghachey
            async: true,
            detached: true,
            env: {PATH: '/usr/bin/', NODE_ENV: 'production', 
                  USER: user, USERNAME: user, HOME: userHome,
                  LOGNAME: user},
            cwd: 'dist/backend'
          }
        }
      },
      startfrontend: { // change to production certs
        command: 'authbind --deep forever start --uid "candy-basket-frontend" -a --sourceDir=/usr/bin/ --workingDir=dist/frontend/ http-server . --ssl -p 443 --cert ../../certificates/candy-basket-frontend-cert.pem --key ../../certificates/candy-basket-frontend-key.pem',
        options: {
          execOptions: {
            async: true,
            detached: true,
            env: {PATH: '/usr/bin/',  
                  USER: user, USERNAME: user, HOME: userHome,
                  LOGNAME: user}
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
  grunt.registerTask('history', ['changelog']);

  grunt.registerTask('docs', ['shell:buildhtmldocs', 'shell:buildpdfdocs']);

  grunt.registerTask('start', [
    'shell:startbackend',
    'shell:startfrontend'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'docs', 
    'shell:buildbackend', 
    'shell:buildfrontend', 
    'shell:mkdirs', 
    'shell:copyapps',
    'shell:copyotherfiles'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'start'
  ]);


  
  // Other tasks used from grunt-release (https://github.com/geddski/grunt-release)
  // grunt release:patch
  // grunt release:minor
  // grunt release:major
  // grunt release:prerelease


};
