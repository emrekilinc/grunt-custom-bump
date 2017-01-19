'use strict';

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // jshint settings
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', 'tasks/*.js']
    },
    bump: {
      flag: '\\{DEVELOPMENT.LOCAL}',
      files: ['test/test_file.js', 'test/test_file.json', 'test/not_found.js']
    }
  });

  // Load this plugin's tasks
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');


  grunt.registerTask('test', function() {
    var prefix = grunt.option('prefix') || '';
    var suffix = grunt.option('suffix') || '';
    var taskName = ['bump', prefix, suffix].join(':');

    grunt.task.run(taskName);
  });

  grunt.registerTask('default', function() {
    grunt.log.writeln('Version : ', + grunt.config.process('<%= pkg.version %>'));
  });

};
