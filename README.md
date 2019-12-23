# sharepointplus-loader

Webpack plugin that permits to leverage tree-shaking for https://aymkdn.github.io/SharepointPlus/ (starting from SharepointPlus v6.0)

## Installation

```sh
npm install sharepointplus-loader
```

And in your Webpack config file (e.g. `webpack.conf.js`), add it to the plugins:
```js
const webpack = require('webpack');
const SharepointPlusLoaderPlugin = require('sharepointplus-loader/plugin'); // load the plugin
module.exports = {
  [ ... your configuration ...],
  plugins:[
    new SharepointPlusLoaderPlugin() // add the plugin here
  ]
};
```

## How it works

The plugin will analyze your code, in files with extension `.js`, `.jsx`, `.ts` and `.vue`, to detect the below line:
```js
import $SP from 'sharepointplus'
```

Then it will replace it with a similar code as the one below:
```js
import spInit from 'sharepointplus/es5/init.js'
import list from 'sharepointplus/es5/lists/list.js' // if `$SP().list()` is used in the analyzed file
import get from 'sharepointplus/es5/lists/get.js' // if `$SP().list().get()` is used in the analyzed file
import getPeopleLookup from 'sharepointplus/es5/utils/getPeopleLookup.js'  // if `$SP().getPeopleLookup()` is used in the analyzed file
const $SP = spInit({'list':list, 'get':get, 'getPeopleLookup':getPeopleLookup });
```
