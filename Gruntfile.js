
var path = require('path');

module.exports = function(grunt) {

  var clientScripts = [
    'src/utils.js',
    'src/module.js',
    'src/builder.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['.build', 'static/app.js', 'static/builtin_modules.txt'],

    concat: {

      client: {
        src: clientScripts,
        dest: 'static/app.js',
        options: {
          banner: "(function(exports, global) {\n\tglobal.APIDash = exports;\n",
          footer: "\n})({}, function() { return this; }());"
        }
      },

      modules: {
        src: 'src/modules/*.js',
        dest: 'static/builtin_modules.txt',
        options: {
          separator: '\n%%%%%%%%%%%%! MODULE SEPARATOR !%%%%%%%%%%%%\n',
          process: function(src, filepath) {
            var filename = path.basename(filepath, '.js');
            return "//~module: " + filename + "\n" + src;
          }
        }
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      concat: {
        files: [clientScripts, 'src/modules/*.js'],
        tasks: ['build']
      }
    }

  });

  [
   'grunt-contrib-watch',
   'grunt-contrib-clean',
   'grunt-contrib-concat',
  ].map(grunt.loadNpmTasks);

  grunt.registerTask('build', ['clean', 'concat']);
  grunt.registerTask('default', ['build','watch']);

};
