module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            app: {
                options:{
                    base: 'src/app',
                    process: true
                },
                src: 'src/app/**/*.tpl.html',
                dest: 'dist/databases-templates.js',
                module: 'databases.templates'
            }
        },
        concat: {
            dist: {
                src: ['src/app/**/*.js'],
                dest: 'dist/databases.js'
            },
            index: {
                src: 'src/index.html',
                dest: 'dist/index.html',
                options: {
                    process: true
                }
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'dist/databases.css'
            }
        },
      bump: {
        options: {
          files: ['package.json', 'bower.json'],
          updateConfigs: ['pkg'],
          commit: false,
          commitMessage: 'Release v%VERSION%',
          commitFiles: ['package.json', 'bower.json'],
          createTag: true,
          tagName: 'v%VERSION%',
          tagMessage: 'Version %VERSION%',
          push: false,
          pushTo: 'origin',
          gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
          globalReplace: false,
          prereleaseName: false,
          regExp: false
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('default', ['html2js', 'concat']);
};