const path = require('path');
const Dotenv = require('dotenv-webpack');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

console.log(dotenv);
module.exports = {
    entry: './src/index.js',
    mode: dotenv.parsed.NODE_ENV,
    watchOptions: {
        poll: true
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/assets/'
    },
    devServer: {
        inline: true,
        contentBase: './dist',
        host: dotenv.parsed.HOST,
        port: dotenv.parsed.PORT,
        https: true,
        proxy: {
            '/api/': {
                target: `https://${dotenv.parsed.API_HOST}:${dotenv.parsed.API_PORT}`,
                secure: false,
                pathRewrite: { '^/api/': '/' },
                changeOrigin: true
            },
            '/wss/': {
                target: `https://${dotenv.parsed.API_HOST}:${dotenv.parsed.API_PORT}`,
                secure: false,
                ws: true,
                pathRewrite: { '^/wss/': '/' },
                changeOrigin: true
            }
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /(node_modules)/,
                loader: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest', 'react', 'stage-0']
                }

            },
            {
                test: /\.css/,
                loader: 'style-loader!css-loader'

            },
            {
                test: /\.scss/,
                exclude: /(node_modules)/,
                loader: 'style-loader!css-loader!sass-loader'

            },
            {
                test: /\.(woff|woff2)$/i,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new Dotenv()
    ]
};
