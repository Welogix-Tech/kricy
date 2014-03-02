'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        develop: {
            server: {
                file: 'app.js'
            }
        },
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'styles',
                    src: ['*.scss'],
                    dest: '../public',
                    ext: '.css'
                }]
            }
        },
        dust: {
            many_targets: {
                files: [
                    {
                        expand: true,
                        cwd: "src/",
                        src: ["**/*.dust"],
                        dest: "dst/many_targets/",
                        ext: ".js"
                    }
                ],
                options: {
                    relative: true
                }
            }
        },
        concat: {
            console:{
                files:{
                    
                }
            }
        },
        uglify:{
            console:{
                options:{
                    banner: '/*! <%=pkg.version %> author <%=pkg.author %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
                },
                files:{
                }
            }
        }

    });

};
