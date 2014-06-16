module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		clean: {
			dev: {
				src: ['build-dev']
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
					'build-dev/css/compiled.css': 'app/sass/compiled.scss'
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
					'build-dev/js/libs.min.js': [ 
						'app/js/libs/**/*.js',
						'!app/js/libs/modernizr.min.js'
					],
					'build-dev/js/modernizr.min.js': [
						'app/js/libs/modernizr.min.js'
					],
					'build-dev/js/project-name.min.js': [ 
						'app/js/**/*.js',
						'!app/js/libs/**/*.js'
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
							'index.html',
							'img/**/*',
							'data/**/*'
						],
						dest: 'build-dev/'
					}
				]
			}
		},


		connect: {
			devServer:{
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
									'clean:dev', 
									'sass:dev', 
									'uglify:dev',
									'copy:dev',
									'connect:devServer', 
									'watch'
								]);
};





