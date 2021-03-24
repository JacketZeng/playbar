
const webpack = require('webpack');

module.exports = {

    entry: {
        app: './index.jsx',
    },
    output: {
        filename: 'dist/playbar.js',
        library: 'playbar'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader?modules', 'less-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 100
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            WaveSurfer: 'wavesurfer.js'
        }),
    ],
};
