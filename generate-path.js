// This file permits to generate the `path.json`
// Command: node generate-path.js /path/to/sharepointplus/src/

const fs = require('fs');
function getFiles (dir, files){
  fs.readdirSync(dir).forEach(file => {
    var pathName = dir + '/' + file;
    if (fs.statSync(pathName).isDirectory()) {
      files = getFiles(pathName, files||[]);
    } else if (Array.isArray(files)) {
      files.push(pathName);
    }
  })
  return files;
}

var result = [];
var srcDir = process.argv[2].replace(/\/+$/,"");
var regExpDir = new RegExp(srcDir);
getFiles(srcDir).forEach(filePath => {
  var content = fs.readFileSync(filePath, 'utf8');
  if (!/@ignore/.test(content)) {
    var mtch = content.match(/^export .* (\w+)\(.*\) {/m);
    if (mtch) {
      result.push({fctName:mtch[1], path:filePath.replace(regExpDir, "")});
    }
  }
});

// sort
result.sort((a,b) => {
  if (a.fctName < b.fctName) return -1;
  if (a.fctName > b.fctName) return 1;
  return 0;
});

var ret = {};
result.forEach(res => {
  ret[res.fctName] = res.path;
});

// write file
fs.writeFileSync('./path.json', JSON.stringify(ret, null, 2));
console.log("-> 'path.json' generated.")
