module.exports = function(content, mapSource) {
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
          console.log(mod," => ",paths[mod]);
          newContent.push("import "+mod+" from 'sharepointplus/es5"+paths[mod]+"'");
          init.push(mod+':'+mod);
        });
        newContent.push("const $SP = spInit({"+init.join(', ')+"});");
        content = content.replace(/import \$SP from 'sharepointplus'/, newContent.join("\n"));
      }
    }
  }
  this.callback(null, content, mapSource);
};
