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

### Complex project

If your project has several files using SharepointPlus, but you only want to load it as a global object with only what matters, then you can use `// sp-loader-path: "./path/"` in your main file.

Example with the below hierarchy:
```markdown
.
+-- classes/
| |-- Files.js
| +-- Folders.js
+-- components/
| |-- App.vue
| |-- Header.vue
| +-- Footer.vue
+-- plugins/
| +-- vuetify.js
+-- store/
| |-- files.js
| |-- folders.js
| +-- list.js
+-- index.js
```

We have several calls of `$SP()` all other the place, but we want all of them to be loaded by `index.js`. We will only call `import $SP from 'sharepointplus'` in `index.js` and we'll use `sp-loader-path` as the below:
```javascript
// index.js – before sharepoint-loader has analyzed it

// Load $SP modules from files in the below path,
//   using glob patterns (see https://github.com/isaacs/node-glob#readme)
// sp-loader-path: "./classes/**"
// sp-loader-path: "./components/**"
// sp-loader-path: "./store/**"
import $SP from 'sharepointplus'
global.$SP = $SP; // to make sure it will be available everywhere
```

Once `sharepointplus-loader` has analyzed the file, it will convert it to load all the necessary modules:
```javascript
// index.js – after sharepoint-loader has analyzed it

// all the modules from the sub files have been listed and are loaded
import spInit from 'sharepointplus/es5/init.js'
import cleanResult from 'sharepointplus/es5/lists/cleanResult.js'
import getLookup from 'sharepointplus/es5/utils/getLookup.js'
import getPeopleLookup from 'sharepointplus/es5/utils/getPeopleLookup.js'
import toDate from 'sharepointplus/es5/utils/toDate.js'
import showModalDialog from 'sharepointplus/es5/modals/showModalDialog.js'
import closeModalDialog from 'sharepointplus/es5/modals/closeModalDialog.js'
import ajax from 'sharepointplus/es5/utils/ajax.js'
import list from 'sharepointplus/es5/lists/list.js'
import add from 'sharepointplus/es5/lists/add.js'
import get from 'sharepointplus/es5/lists/get.js'
import workflowStatusToText from 'sharepointplus/es5/utils/workflowStatusToText.js'
import getWorkflowID from 'sharepointplus/es5/lists/getWorkflowID.js'
import startWorkflow from 'sharepointplus/es5/lists/startWorkflow.js'
import remove from 'sharepointplus/es5/lists/remove.js'
import update from 'sharepointplus/es5/lists/update.js'
import getContentTypeInfo from 'sharepointplus/es5/lists/getContentTypeInfo.js'
import toSPDate from 'sharepointplus/es5/utils/toSPDate.js'
import webService from 'sharepointplus/es5/utils/webService.js'
import createFile from 'sharepointplus/es5/files/createFile.js'
const $SP = spInit({cleanResult:cleanResult, getLookup:getLookup, getPeopleLookup:getPeopleLookup, toDate:toDate, showModalDialog:showModalDialog, closeModalDialog:closeModalDialog, ajax:ajax, list:list, add:add, get:get, workflowStatusToText:workflowStatusToText, getWorkflowID:getWorkflowID, startWorkflow:startWorkflow, remove:remove, update:update, getContentTypeInfo:getContentTypeInfo, toSPDate:toSPDate, webService:webService, createFile:createFile});
global.$SP = $SP; // to make sure it will be available everywhere
```
