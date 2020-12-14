module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'b.trent5@gmail.com',
                token: '26867342-95d6-43eb-88fc-0d4e7047f2eb',
                branch: 'screep'
            },
            dist: {
                src: ['clean/*.js']
            }
        }
    });
}