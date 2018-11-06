'use strict';
let path = require('path');
module.exports = [

    {
        entry: {//browser script
            'KMConnectorBrowser': './lib/KMConnectorBrowserWPK.js',
            'examples/browser_webbluetooh/library/KMConnectorBrowser': './lib/KMConnectorBrowserWPK.js'
        },
        output: {
            path:path.resolve(__dirname, './'),
            filename:"[name].js"

        }
        ,devtool: 'inline-source-map'
    }

];