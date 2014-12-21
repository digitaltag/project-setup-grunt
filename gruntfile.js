module.exports = function(grunt) {

	var ENVIRONMENT = 'dev';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		settings: grunt.file.readJSON('grunt/settings.json'),


		clean: {

			all: {
				src: [
					'<%= settings.paths.dev_base %>',
					'<%= settings.paths.prod_base %>'
				]
			}


		},


		sass: {
			dev: {
				options: {
					noCache: true,
	                lineNumbers: true
				},
				files: {
					'<%= settings.paths.dev_base %>css/compiled.css': '<%= settings.paths.app_sass %>compiled.scss'
				}
			},
			prod: {
				options: {
					noCache: true,
	                quiet: true,
	                lineNumbers: false
				},
				files: {
					'<%= settings.paths.prod_base %>css/compiled.css': '<%= settings.paths.app_sass %>compiled.scss'
				}
			}
		},

		complexity: {
			dev: {
				src: [ '<%= settings.paths.dev_base %>js/project-name.min.js' ],
				options: {
					breakOnErrors: true,
					jsLintXML: 'report.xml',         // create XML JSLint-like report
					checkstyleXML: 'checkstyle.xml', // create checkstyle report
					errorsOnly: false,               // show only maintainability errors
					cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
					halstead: [8, 13, 20],           // or optionally a single value, like 8
					maintainability: 100,
					hideComplexFunctions: false,     // only display maintainability
					broadcast: false                 // broadcast data over event-bus
				}
			},
			prod: {
				src: [ '<%= settings.paths.prod_base %>js/project-name.min.js' ],
				options: {
					breakOnErrors: true,
					jsLintXML: 'report.xml',         // create XML JSLint-like report
					checkstyleXML: 'checkstyle.xml', // create checkstyle report
					errorsOnly: false,               // show only maintainability errors
					cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
					halstead: [8, 13, 20],           // or optionally a single value, like 8
					maintainability: 100,
					hideComplexFunctions: false,     // only display maintainability
					broadcast: false                 // broadcast data over event-bus
				}
			}
		},


		uglify:{

			dev:{
				options: {
					banner: '<%= banner %>',
					mangle: false,
					beautify : true,
					preserveComments: "all",
					compress: false
				},
				files:{
					// Libs
					'<%= settings.paths.dev_base %>js/libs.min.js': [ 
						'<%= settings.paths.app_js %>libs/**/*.js',
						'!<%= settings.paths.app_js %>libs/modernizr.min.js'
					],
					// Modernizr
					'<%= settings.paths.dev_base %>js/modernizr.min.js': [
						'<%= settings.paths.app_js %>libs/modernizr.min.js'
					],
					// Main JS
					'<%= settings.paths.dev_base %>js/project-name.min.js': [ 
						'<%= settings.paths.app_js %>**/*.js',
						'!<%= settings.paths.app_js %>libs/**/*.js'
					]
				}
			},

			prod:{
				options: {
					banner: '<%= banner %>',
					mangle: true,
					beautify : false,
					preserveComments: false,
					compress: false
				},
				files:{
					// Libs
					'<%= settings.paths.prod_base %>js/libs.min.js': [ 
						'<%= settings.paths.app_js %>libs/**/*.js',
						'!<%= settings.paths.app_js %>libs/modernizr.min.js'
					],
					// Modernizr
					'<%= settings.paths.prod_base %>js/modernizr.min.js': [
						'<%= settings.paths.app_js %>libs/modernizr.min.js'
					],
					// Main JS
					'<%= settings.paths.prod_base %>js/project-name.min.js': [ 
						'<%= settings.paths.app_js %>**/*.js',
						'!<%= settings.paths.app_js %>libs/**/*.js'
					]
				}
			}

		},


		copy: {
			dev: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'img/**/*',
							'data/**/*',
							'index.html'
						],
						dest: '<%= settings.paths.dev_base %>'
					}
				]
			},
			prod: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'img/**/*',
							'data/**/*',
							'index.html'
						],
						dest: '<%= settings.paths.prod_base %>'
					}
				]
			}
		},


		connect: {
			
			dev:{
				options: {
					hostname: '*',
					port: 3333,
					// keepalive: true,
					base: '<%= settings.paths.dev_base %>'
				}
			},
			prod:{
				options: {
					hostname: '*',
					port: 4444,
					// keepalive: true,
					base: '<%= settings.paths.prod_base %>'
				}
			}

		},


		watch: {
			options: {
				interrupt: true
			},
			sass: {
				files: [
					'<%= settings.paths.app_sass %>**/*.scss'
				],
				tasks: ['sass:'+ENVIRONMENT]
			},
			images: {
				files: [
					'<%= settings.paths.app_img %>**',
				],
				tasks: ['copy:'+ENVIRONMENT]
			},
			data: {
				files: [
					'<%= settings.paths.app_data %>**',
				],
				tasks: ['copy:'+ENVIRONMENT]
			},
			js: {
				files: [
					'<%= settings.paths.app_js %>**/*.js'
				],
				tasks: ['uglify:'+ENVIRONMENT]
			}, 
			html: {				
				files: [
					'<%= settings.paths.app_source %>index.html'
				],
				tasks: ['copy:'+ENVIRONMENT]
			}
		},

	});
	
	grunt.loadNpmTasks('grunt-contrib-clean'); 
	grunt.loadNpmTasks('grunt-contrib-sass'); 
	grunt.loadNpmTasks('grunt-complexity'); 
	grunt.loadNpmTasks('grunt-contrib-copy'); 
	grunt.loadNpmTasks('grunt-contrib-uglify'); 
	grunt.loadNpmTasks('grunt-contrib-connect'); 
	grunt.loadNpmTasks('grunt-contrib-watch'); 

	// Target is either prod or dev.
	// 
	// grunt server:dev
	// or
	// grunt server:prod

	grunt.registerTask('deploy', [

			'clean:all', 
			'sass:prod', 
			'uglify:prod', 
			'copy:prod'

	]);


	grunt.registerTask('server', function(env){

		ENVIRONMENT = env ? env : 'dev';

		grunt.task.run([

			'clean:all', 
			'sass:'+		ENVIRONMENT, 
			'uglify:'+		ENVIRONMENT, 
			'copy:'+		ENVIRONMENT, 
			'complexity:'+	ENVIRONMENT, 
			'connect:'+ 	ENVIRONMENT, 
			'watch'

		]);

	});

};





