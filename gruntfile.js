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
					preserveComments: "all",
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
			img: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'img/**/*'
						],
						dest: ENVIRONMENT
					}
				]
			},
			data: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'data/**/*'
						],
						dest: ENVIRONMENT
					}
				]
			},
			html: {
				files: [
					{
						expand: true,
						cwd: 'app/',
						src: [
							'index.html'
						],
						dest: ENVIRONMENT
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
				tasks: ['copy:img']
			},
			data: {
				files: [
					'<%= settings.paths.app_data %>**',
				],
				tasks: ['copy:data']
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
				tasks: ['copy:html']
			}
		},

	});
	
	grunt.loadNpmTasks('grunt-contrib-clean'); 
	grunt.loadNpmTasks('grunt-contrib-sass'); 
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
			'copy'

	]);


	grunt.registerTask('server', function(env){

		ENVIRONMENT = env ? env : 'prod';

		grunt.task.run([

			'clean:all', 
			'sass:'+	ENVIRONMENT, 
			'uglify:'+	ENVIRONMENT, 
			'copy',
			'connect:'+  ENVIRONMENT, 
			'watch'

		]);

	});

};





