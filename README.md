# sharepointplus-loader

Webpack plugin that permits to leverage tree-shaking for https://aymkdn.github.io/SharepointPlus/ (starting from SharepointPlus v6.0)

## Installation

```sh
npm install sharepointplus-loader
```


And, for regular Webpack config file (e.g. `webpack.conf.js`), add it to the plugins:
```js
// ----- file 'webpack.conf.js'
const webpack = require('webpack');
const SharepointPlusLoaderPlugin = require('sharepointplus-loader/plugin'); // load the plugin
module.exports = {
  [ ... your configuration ...],
  plugins:[
    new SharepointPlusLoaderPlugin() // add the plugin here
  ]
};
```

Or if you work **with SPFx** you have to edit your `gulpfile.js` file:
```js
// ----- file 'gulpfile.js'
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
[ ... your configuration ... ]

// add the plugin with the below block of code:
const webpack = require('webpack');
const SharepointPlusLoaderPlugin = require('sharepointplus-loader/plugin'); // load the plugin
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfig) => {
    if (!Array.isArray(generatedConfig.plugins)) generatedConfig.plugins=[];
    generatedConfig.plugins.push(new SharepointPlusLoaderPlugin()); // add the plugin here
    // return modified config => SPFx build pipeline
    return generatedConfig;
  }
});

build.initialize(gulp);
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
