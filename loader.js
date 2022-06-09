var glob = require("glob");
var fs = require('fs');
var path = require('path');

function findModules (filePath, content, modules) {
  modules = modules || new Set();
  // Find any calls to $SP() that is not inside comments, and remove line breaks
  content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ").replace(/ \./g,".");
  var mtch = content.match(/\$SP\(\)\.((list)\([^\)]+\)\.)?([^\(]+)/g);
  // for each $SP() found, we identify the module
  if (mtch) {
    mtch.forEach(function(m) {
      var res = m.match(/\$SP\(\)\.((list)\([^\)]+\)\.)?([^\(]+)/);
      if (res && res.length===4) {
        if (res[2] && res[2] !== "then") {
          modules.add(res[2]);
        }
        if (res[3] && res[3] !== "then") {
          modules.add(res[3]);
        }
      }
    });
  }

  return modules;
}

module.exports = function(content, mapSource) {
  this.async();
  this.cacheable();

  if (content && (/import \$SP from .sharepointplus./.test(content) || /import * as \$SP from .sharepointplus./.test(content)) && this.resourcePath && !/sharepointplus/i.test(this.resourcePath)) {
    // find the $SP() in the current file
    var modules = findModules(this.resourcePath, content);
    var resourcePath = this.resourcePath;

    // if we have "sp-loader-path:" then we'll scan the resources to find modules in the related resources
    var mtchPath = content.match(/sp-loader-path:\s?["|'].*["|']/g);
    if (mtchPath) {
      mtchPath.forEach(function(m) {
        // find the path
        var pathToResource = m.match(/sp-loader-path:\s?["|'](.*)["|']/);
        if (pathToResource && pathToResource.length===2) {
          // read files in the path
          var cwd = path.dirname(resourcePath).replace(/\\/g, '/'); // replace \ from Windows to /
          var files = glob.sync(cwd + '/' + pathToResource[1]); // options don't work?!
          files.forEach(function(filePath) {
            // check if the path is a file or a folder
            if (fs.lstatSync(filePath).isFile()) {
              var fileContent = fs.readFileSync(filePath, 'utf-8');
              modules = findModules(filePath, fileContent, modules);
            }
          })
        }
      })
    }

    // replace "import $SP from 'sharepointplus'" with individual modules
    if (modules.size > 0) {
      var paths = require('./path.json');
      var newContent = ["import spInit from 'sharepointplus/es5/init.js'"];
      var init = [];
      modules.forEach(function(mod) {
        if (paths[mod]) {
          newContent.push("import "+mod+" from 'sharepointplus/es5"+paths[mod]+"'");
          init.push(mod+':'+mod);
        } else {
          console.error("[ERROR] SharepointPlus Module '"+mod+"' not found by `sharepointplus-loader` ("+resourcePath+")");
        }
      });
      newContent.push("const $SP = spInit({"+init.join(', ')+"});");
      content = content.replace(/import \$SP from .sharepointplus.|import \* as \$SP from .sharepointplus./, newContent.join("\n"));
    }
  }
  this.callback(null, content, mapSource);
};
