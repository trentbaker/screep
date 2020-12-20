module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'b.trent5@gmail.com',
                token: 'lol',
                branch: 'screep'
            },
            dist: {
                src: ['clean/*.js']
            }
        }
    });
}
