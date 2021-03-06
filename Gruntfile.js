/*
 * grunt-aws-s3
 * https://github.com/MathieuLoutre/grunt-aws-s3
 *
 * Copyright (c) 2013 Mathieu Triay
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.registerTask('create_bucket', 'creates the bucket folder', function() {
		grunt.file.mkdir(__dirname + '/test/local/bucket');
	});

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc',
			},
		},
		aws_s3: {
			test: {
				options: {
					bucket: __dirname + '/test/local/bucket',
					concurrency: 1,
					mock: true,
				},
				files: [
					{expand: true, cwd: "test/local/upload/", src: ['**'], dest: 'first/'},
					{dest: '/', cwd: 'test/local/download/backup/', action: 'download'},
					{dest: 'first/otters/updated/', action: 'delete'},
					{dest: 'punk/', action: 'delete'},
					{expand: true, cwd: "test/local/upload/otters/river/", src: ['**'], dest: 'second/'},
					{dest: 'otters/funk/', cwd: 'test/local/download/backup/', action: 'download'},
					{expand: true, cwd: "test/local/upload/otters/updated/", src: ['**'], dest: 'second/', differential: true},
					{expand: true, cwd: "test/local/upload/otters/updated/", src: ['**'], dest: 'third/'},
					{dest: 'third/', action: 'delete', differential: true, cwd: "test/local/upload/otters/river/"},
					{expand: true, cwd: "test/local/upload/", src: ['**'], dest: 'fourth/'},
					{dest: 'fourth/otters/river/', cwd: 'test/local/download/fourth/', action: 'download'},
					{dest: 'fourth/otters/updated/', cwd: 'test/local/download/fourth/', action: 'download', differential: true},
				]
			},
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/*.js']
			}
		},
		clean: {
			test: ['test/local/**']
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'test/fixtures/', src: ['**'], dest: 'test/local'},
				]
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('./tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['clean', 'copy', 'create_bucket', 'aws_s3', 'mochaTest']);

};
