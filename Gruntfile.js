module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    var userConfig = require('./build.config.js');
    var taskConfig = {
        pkg: grunt.file.readJSON('package.json'),

        clean: [
            '<%= build_dir %>',
            'bin',
            '.tmp'
        ],

        copy: {
            appjs: {
                src: [ '<%= app_files.js %>' ],
                dest: '<%= build_dir %>/js/',
                cwd: '.',
                expand: true,
                rename: function(dest, src) {
                    var r = new RegExp("src\/main\/angular\/");
                    var s = src.replace(r, "");
                    return dest + s;
                }
            },
            vendor_assets: {
                files: [
                    {
                        src: [ '<%= vendor_files.assets %>' ],
                        dest: '<%= build_dir %>/style/',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            vendorjs: {
                files: [
                    {
                        src: [ '<%= vendor_files.js %>' ],
                        dest: '<%= build_dir %>/js',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            vendorcss: {
                files: [
                    {
                        src: [ '<%= vendor_files.css %>' ],
                        dest: '<%= build_dir %>/style',
                        cwd: '.',
                        expand: true
                    }
                ]
            },
            fontawesomefonts: {
                files: [
                    {
                        src: [ 'vendor/font-awesome/fonts/**/*' ],
                        dest: '<%= build_dir %>/fonts',
                        cwd: '.',
                        expand: true,
                        flatten: true
                    }
                ]
            },
            webapp_dir: {
                files: [
                    {
                        src: ['**/*'],
                        dest: 'bin/webapp',
                        cwd: 'src/main/webapp',
                        expand: true
                    }
                ]
            },
            index: {
                files: [
                    {
                        src: ['build/index.html'],
                        dest: 'bin/webapp/jsp/index.html'
                    }
                ]
            }
        },

        ngAnnotate: {
            compile: {
                files: [
                    {
                        src: [ 'js/**/app/**/*.js', 'js/**/common/**/*.js' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['src/main/angular/index.html'],
                ignorePath: new RegExp('^src/main/angular/|(../){1,}')
            },
            less: {
                src: ['src/main/angular/**/*.less'],
                ignorePath: /(\.\.\/){1,2}bower_components\//
            },
            test: {
                devDependencies: true,
                src: 'karma/karma-unit.tpl.js',
                ignorePath:  /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        ngmin: {
            compile: {
                files: [
                    {
                        src: [ '<%= app_files.js %>' ],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        less: {
            build: {
                src: [ '<%= app_files.less %>' ],
                dest: '<%= build_dir %>/style/<%= pkg.name %>-<%= pkg.version %>.css',
                options: {
                    compile: true,
                    compress: false,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                },
                files: {
                    '<%= build_dir %>/style/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                }
            },
            compile: {
                src: [ '<%= app_files.less %>' ],
                dest: '<%= less.build.dest %>',
                options: {
                    compile: true,
                    compress: true,
                    noUnderscores: false,
                    noIDs: false,
                    zeroUnits: false
                },
                files: {
                    '<%= build_dir %>/style/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
                }
            }
        },

        index: {
            build: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= build_dir %>/js/**/*.js',
                    '<%= build_dir %>/style/**/*.css'
                ]
            },

            compile: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= vendor_files.css %>',
                    '<%= less.compile.dest %>'
                ]
            }
        },

        watch: {
            options: {
                livereload: true
            },
            jssrc: {
                files: [
                    '<%= app_files.js %>'
                ],
                tasks: ['copy:appjs', 'copy:vendorjs']
            },
            html: {
                files: [ '<%= app_files.html %>' ],
                tasks: [ 'index:build' ]
            },
            less: {
                files: [ '<%= app_files.styles %>' ],
                tasks: [ 'less:build' ]
            },
            tpls: {
                files: [
                    '<%= app_files.atpl %>',
                    '<%= app_files.ctpl %>'
                ],
                tasks: [ 'html2js' ]
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['build'],
                options: {
                    livereload: false
                }
            },
            jsunit: {
                files: [
                    '<%= app_files.jsunit %>'
                ],
                tasks: [  ],
                options: {
                    livereload: false
                }
            }
        },


        html2js: {
            /**
             * These are the templates from `src/app`.
             */
            app: {
                options: {
                    base: 'src/main/angular/app'
                },
                src: [ '<%= app_files.atpl %>' ],
                dest: '<%= build_dir %>/js/templates/templates-app.js'
            },
            common: {
                options: {
                    base: 'src/main/angular/common'
                },
                src: [ '<%= app_files.ctpl %>' ],
                dest: '<%= build_dir %>/js/templates/templates-common.js'
            }
        },
        karma: {
            options: {
                configFile: '<%= build_dir %>/karma-unit.js'
            },
            unit: {
                autoWatch: true,
                singleRun: false,
                browsers: ['Chrome']
            },
            continuous: {
                configFile: '<%= build_dir %>/karma-unit.js',
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: ['progress', 'junit'],
                junitReporter: {
                    outputFile: 'test-results.xml',
                    suite: ''
                }
            },
            connect: {
                server: {
                    options: {
                        hostname: '0.0.0.0',
                        port: 9018,
                        base: "build",
                        keepalive: false
                    }
                }
            }
        },
        karmaconfig: {
            unit: {
                dir: '<%= build_dir %>',
                src: [
                    '<%= vendor_files.js %>',
                    '<%= html2js.app.dest %>',
                    '<%= test_files.js %>'
                ]
            }
        },

        uglify: {
            options: {
                mangle: false,
                beautify: true,
                compress: false
            }
        },

        bower: {
            install: {
                options: {
                    targetDir: './bower_components',
                    verbose: true,
                    copy: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {
                        forceLatest: true
                    }
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: livereloadOptions
            }
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    grunt.registerTask('default', ['serve']);

    grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);

    grunt.registerTask('build', [
        'clean',
        'bower:install',
        'copy:vendor_assets',
        'copy:appjs',
        'copy:vendorjs',
        'copy:vendorcss',
        'copy:fontawesomefonts',
        'less:build',
        'wiredep',
        'html2js',
        'index:build'
    ]);

    grunt.registerTask('compile', [ 'copy:webapp_dir', 'ngAnnotate', 'useminPrepare', 'concat:generated', 'uglify:generated', 'cssmin:generated', 'filerev', 'usemin', 'copy:index'
        //'less:compile', 'copy:compile_assets', 'ngAnnotate', 'concat:build_css', 'concat:compile_js', 'index:compile'
    ]);

    grunt.registerTask('test', ['wiredep:test', 'karmaconfig', 'karma:unit'])

    grunt.registerTask('test_ci', ['wiredep:test', 'karmaconfig', 'karma:continuous']);


    /**
     * A utility function to get all app JavaScript sources.
     */
    function filterForJS(files) {
        return files.filter(function (file) {
            return file.match(/\.js$/);
        });
    }

    /**
     * A utility function to get all app CSS sources.
     */
    function filterForCSS(files) {
        return files.filter(function (file) {
            return file.match(/\.css$/);
        });
    }

    /**
     * The index.html template includes the stylesheet and javascript sources
     * based on dynamic names calculated in this Gruntfile. This task assembles
     * the list into variables for the template to use and then runs the
     * compilation.
     */
    grunt.registerMultiTask('index', 'Process index.html template', function () {
        var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
        var jsFiles = filterForJS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });
        var cssFiles = filterForCSS(this.filesSrc).map(function (file) {
            return file.replace(dirRE, '');
        });

        grunt.template.addDelimiters('github-explorer', '[#', '#]');

        grunt.file.copy('src/main/angular/index.html', this.data.dir + '/index.html', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles,
                        version: grunt.config('pkg.version')
                    },
                    delimiters: 'github-explorer'
                });
            }
        });
    });

    grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function () {
        var jsFiles = this.filesSrc.filter(function (file) {
            return file.match(/\.js$/);
        });

        grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
            process: function (contents, path) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles
                    }
                });
            }
        });
    });
};

var express = require('express'),
    path = require('path'),
    app = express(),
    fs = require('fs');

var livereloadOptions = {
    open: true,
    middleware: function (connect) {
        return [
            connect.static('build'),
            connect().use(
                '/bower_components',
                connect.static('./bower_components')
            )
        ];
    }
}