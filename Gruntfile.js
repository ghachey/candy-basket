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
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-conventional-changelog');

  // Default task.
  grunt.registerTask('default', ['changelog']);

};
