'use strict';

var semver = require('semver');
var utility = require('util');
var async = require('async');

//
// Private fns
//

function detectIndentation(string) {
  var tabs = string.match(/^[\t]+/gm) || [];
  var spaces = string.match(/^[ ]+/gm) || [];
  var commonIndentation = tabs.length >= spaces.length ? tabs : spaces;
  var indentation;

  for(var i = 0, k = commonIndentation.length; i < k; i++) {
    if (!indentation || commonIndentation[i].length < indentation.length) {
      indentation = commonIndentation[i];
    }
  }

  return indentation;
}

function detectDestinationType(dest) {
  if (dest[dest.length - 1] === '/') {
    return 'dir';
  }
  else {
    return 'file';
  }
}

function unixifyPath(filePath) {
  var path = '';
  if (process.platform === 'win32') {
    path = filePath.replace(/\\/g, '/');
  }
  else {
    path = filePath;
  }

  return path;
}


module.exports = function(grunt) {
  function failed(error, message) {
    if (error) {
      grunt.log.error(error);
    }

    grunt.fail.warn(message || 'Task has failed.');
  }


  grunt.registerTask('bump', 'Changing the version.', function (prefix, suffix) {
    var currentVersion = grunt.config.process('<%= pkg.version %>');
    var newVersion = currentVersion;

    var taskConfig = grunt.config('bump');
    var flag = taskConfig.flag;
    var files = taskConfig.files;

    if (prefix) {
      newVersion = prefix + newVersion;
    }

    if (suffix) {
      newVersion = newVersion + suffix;
    }

    if (!flag) {
      grunt.fail.warn('You must specify a flag option in your Gruntfile options.');
    }

    if (!files.length) {
      grunt.log.warn('No files specified. Please specify some file paths to change the version.');
      return;
    }

    files.filter(function(filePath) {
      // Remove non-existing files
      if (!grunt.file.exists(filePath)) {
        grunt.log.warn('File : "' + filePath.cyan + '" has not been found!');
        return false;
      }
      else {
        return true;
      }
    }).forEach(function(filePath) {

      try {
        var dest = unixifyPath(filePath);
        var fileContent = grunt.file.read(filePath);

        var newFileContent = fileContent.replace(new RegExp(flag, "g"), newVersion);

        // Save the file
        if (!grunt.file.write(filePath, newFileContent)) {
          grunt.log.warn('Couldn\'t write to "' + filePath + '"');
        }

      }
      catch (error) {
        failed(error, 'Custom bump has failed.');
      }
    }, this);

    grunt.log.writeln('Bumped to New Version : ' + newVersion);
  });

};
