'use strict';

var request = require('request');

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var reloadPort = 35729, files;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        develop: {
            server: {
                file: 'app.js'
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: reloadPort
            },
            js: {
                files: [
                    'app.js',
                    'app/**/*.js',
                    'config/*.js'
                ],
                tasks: ['develop', 'delayed-livereload']
            },
            jade: {
                files: ['app/views/**/*.dust'],
                options: { livereload: reloadPort }
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

            defaults: {
                files: {
                    "dst/default/views.js": "src/**/*.dust"
                }
            },

            preserve_whitespace: {
                files: {
                    "dst/preserve_whitespace/views.js": "src/**/*.dust"
                },

                options: {
                    optimizers: {
                        format: function(ctx, node) { return node; }
                    }
                }
            },

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
            },

            many_targets_without_package_name: {
                files: [
                    {
                        expand: true,
                        cwd: "src/",
                        src: ["**/*.dust"],
                        dest: "dst/many_targets_without_package_name/",
                        ext: ".js"
                    }
                ],
                options: {
                    wrapper: "amd",
                    wrapperOptions: {
                        packageName: null, // disable packageName
                        deps: {
                            dust: "v1/dust-helpers"
                        }
                    }
                }
            },

            amd_without_package_name_and_deps: {
                files: {
                    "dst/amd_without_package_name_and_deps/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: "amd",
                    wrapperOptions: {
                        packageName: null,
                        deps: false
                    }
                }
            },

            no_wrapper: {
                files: {
                    "dst/views_no_amd/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: false
                }
            },

            amd_custom_deps: {
                files: {
                    "dst/views_amd_custom_deps/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: "amd",
                    wrapperOptions: {
                        deps: {
                            dust: "dust-core-1.0.0.min.js"
                        }
                    }
                }
            },

            amd_without_deps: {
                files: {
                    "dst/views_amd_without_deps/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: "amd",
                    wrapperOptions: {
                        deps: false
                    }
                }
            },

            amd_with_package_name: {
                files: {
                    "dst/views_amd_with_package_name/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: "amd",
                    wrapperOptions: {
                        packageName: "views"
                    }
                }
            },

            commonjs: {
                files: {
                    "dst/views_commonjs/views.js": "src/**/*.dust"
                },
                options: {
                    wrapper: "commonjs",
                    wrapperOptions: {
                        returning: "dust",
                        deps: {
                            foo: "foo.js",
                            dust: "dust.js"
                        }
                    }
                }
            },

            nested_relative: {
                files: {
                    "dst/views_nested_relative/views.js": "src/**/*.dust"
                },
                options: {
                    wrapperOptions: {
                        deps: false
                    },
                    basePath: "src/"
                }
            },

            use_base_name: {
                files: {
                "dst/views_use_base_name/views.js": "src/**/*.dust"
                },
                options: {
                    wrapperOptions: {
                        deps: false
                    },
                    useBaseName: true
                }
            },

            no_runtime: {
                files: {
                "dst/views_no_runtime/views.js": "src/**/*.dust"
                },
                options: {
                    runtime: false
                }
            }

        },
        concat: {
            console:{
                files:{
                    'app/public/js/console/dist/console.js':['app/public/js/console/im/**/*.js','app/public/js/console/map/**/*.js','app/public/js/console/console.js'],
                    'app/public/js/console/dist/console-tmpl.js':'app/public/js/console/tmpl/*.js'
                }
            }
        },
        uglify:{
            console:{
                options:{
                    banner: '/*! console.min.js version <%=pkg.version %> author <%=pkg.author %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
                },
                files:{
                    'app/public/js/console/dist/console.min.js':'app/public/js/console/dist/console.js',
                    'app/public/js/console/dist/console-tmpl.min.js':'app/public/js/console/dist/console-tmpl.js'
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-dust');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.config.requires('watch.js.files');
    files = grunt.config('watch.js.files');
    files = grunt.file.expand(files);

    grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
        var done = this.async();
        setTimeout(function () {
            request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','), function (err, res) {
                var reloaded = !err && res.statusCode === 200;
                if (reloaded)
                    grunt.log.ok('Delayed live reload successful.');
                else
                    grunt.log.error('Unable to make a delayed live reload.');
                done(reloaded);
            });
        }, 500);
    });

    grunt.registerTask('default', ['develop', 'watch']);
    grunt.registerTask('console',['concat:console',"uglify:console"]);

};
