module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		clean: {
			dev: {
				src: ['dev']
			}
		},


		sass: {
			dev: {
				options: {
					noCache: true,
	                quiet: true,
	                lineNumbers: true
				},
				files: {
					'dev/css/compiled.css': 'app/sass/compiled.scss'
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
							'index.html',
							'js/libs/modernizr.min.js',
							'img/**/*',
							'data/**/*'
						],
						dest: 'dev/'
					}
				]
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
					'dev/js/libs.min.js': [ 
						'app/js/libs/**/*.js',
						'!app/js/libs/modernizr.min.js'
					],
					'dev/js/gymbox.min.js': [ 
						'app/js/**/*.js',
						'!app/js/libs/**/*.js'
					]
				}
			}
		},


		connect: {
			server:{
				options: {
					hostname: '*',
					port: 9009,
					// keepalive: true,
					base: 'dev'
				}
			}
		},


		watch: {
			options: {
				interrupt: true
			},
			sass: {
				files: [
					'app/sass/**/*.scss'
				],
				tasks: ['sass']
			},
			images: {
				files: [
					'app/img/**'
				],
				tasks: ['copy:dev']
			},
			js: {
				files: [
					'app/js/**/*.js'
				],
				tasks: ['uglify:dev']
			}
		},

	});
	
	grunt.loadNpmTasks('grunt-contrib-clean'); 
	grunt.loadNpmTasks('grunt-contrib-sass'); 
	grunt.loadNpmTasks('grunt-contrib-copy'); 
	grunt.loadNpmTasks('grunt-contrib-uglify'); 
	grunt.loadNpmTasks('grunt-contrib-connect'); 
	grunt.loadNpmTasks('grunt-contrib-watch'); 

	grunt.registerTask('setup',  [
									'clean', 
									'sass', 
									'uglify',
									'copy'
								]);

	grunt.registerTask('server', [ 
									'setup', 
									'connect:server', 
									'watch'
								]);
};