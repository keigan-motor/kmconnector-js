'use strict';
var path = require('path');
module.exports = [

    {
        entry: {//browser script
            indexBrowser: './src/KMConnectorBrowser.js'
        },
        output: {
            path:path.resolve(__dirname, './'),
            filename:"[name].js"

        }
        ,devtool: 'inline-source-map'
    }

];