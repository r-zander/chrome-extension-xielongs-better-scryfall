const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');
const path = require("path");

const reloader = new Reloader({
    port: 6223,
    watch_dir: path.resolve(__dirname, 'dist')
});

reloader.watch();

const ext_id = 'kegcfgonjkipjkpfajbneanfjjnicggg';

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [{
        apply: (compiler) => {
            compiler.hooks.done.tap('done', (stats) => {
                // setTimeout(() => {
                const an_error_occured = stats.compilation.errors.length !== 0;

                if (an_error_occured) {
                    reloader.play_error_notification();
                } else {
                    reloader.reload({
                        ext_id,
                        hard: true,
                        all_tabs: false,
                        play_sound: true,
                        after_reload_delay: 1000,
                        manifest_path: true,
                    });

                }
                // }, 1000);
            });
        },
    }]
});
