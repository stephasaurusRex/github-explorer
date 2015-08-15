module.exports = {

    build_dir: 'build',
    compile_dir: 'bin',

    app_files: {
        // source, but NO specs
        js: [ 'src/**/*.js', '!src/**/*.spec.js' ],
        // js files that will be conditionally loaded
        //role_js: ['src/main/angular/app/admin/**/*.js'],
        // template files that will be conditionally loaded
        //role_templates: ['src/main/angular/app/admin/**/*.html'],
        jsunit: [ 'src/**/*.spec.js' ],
        // our partial templates
        atpl: [ 'src/main/angular/app/**/*.tpl.html'],
        ctpl: [ 'src/main/angular/common/**/*.tpl.html' ],
        // the index.html
        html: [ 'src/main/angular/index.html', 'src/main/webapp/jsp/index.jsp' ],
        less: ['src/main/angular/less/main.less', 'src/main/angular/common/components/**/*.less'],
        styles: [ 'src/main/angular/less/**/*.less'],
        images: ['src/main/angular/assets/**/*.png', 'src/main/angular/assets/**/*.gif']
    },

    test_files: {
        js: [
        ]
    },

    vendor_files: {
        js: [
            'vendor/highcharts/highcharts-ng.js',
            'vendor/adapt-strap/dist/adapt-strap.js',
            'vendor/adapt-strap/dist/adapt-strap.tpl.js',
            'vendor/pattern-fill/pattern-fill.js'
        ],
        css: [
            'vendor/adapt-strap/dist/adapt-strap.css'
        ],
        assets: [
        ]
    }
};