module.exports = function(content, mapSource) {
  //var callback = this.async();
  /*content = content.replace(/import \$SP from 'sharepointplus'/, `import spInit from 'sharepointplus/es5/init.js'
import list from 'sharepointplus/es5/lists/list.js'
import get from 'sharepointplus/es5/lists/get.js'
import info from 'sharepointplus/es5/lists/info.js'
import cleanResult from 'sharepointplus/es5/lists/cleanResult.js'
import view from 'sharepointplus/es5/lists/view.js'
import toDate from 'sharepointplus/es5/utils/toDate.js'
import getLookup from 'sharepointplus/es5/utils/getLookup.js'
import getPeopleLookup from 'sharepointplus/es5/utils/getPeopleLookup.js'
const $SP = spInit({list:list, get:get, info, cleanResult, toDate, getLookup, getPeopleLookup, view });`);*/

  this.async();
  this.cacheable();

  if (content && /\$SP()/.test(content) && /import \$SP from 'sharepointplus'/.test(content) && this.resourcePath && !/sharepointplus/i.test(this.resourcePath)) {
    var modules = new Set();
    // Find any calls to $SP() that is not inside comments
    var mtch = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').match(/(.*)?\$SP\(\).*/g);

    // for each $SP() found, we identify the module
    if (mtch) {
      mtch.forEach(function(m) {
        var res = m.match(/\$SP\(\)\.((list)\([^\)]+\)\.)?([^\(]+)/);
        if (res && res.length===4) {
          if (res[2]) modules.add(res[2]);
          if (res[3]) modules.add(res[3]);
        }
      });

      // replace "import \$SP from 'sharepointplus'" with individual modules
      if (modules.size > 0) {
        var paths = require('./path.json');
        var newContent = ["import spInit from 'sharepointplus/es5/init.js'"];
        var init = [];
        modules.forEach(function(mod) {
          newContent.push("import "+mod+" from 'sharepointplus/es5"+paths[mod]+"'");
          init.push(mod+':'+mod);
        });
        newContent.push("const $SP = spInit({"+init.join(', ')+"});");
        content = content.replace(/import \$SP from 'sharepointplus'/, newContent.join("\n"));
        //console.log(this.resourcePath)
        //console.log(newContent)
      }
    }
  }
  this.callback(null, content, mapSource);
  //return content;
};
