const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");

function resolvePaths() {
  const dir = path.parse(path.parse(__dirname).dir);
  const projectDir = dir.dir.split("\\").pop();
  console.log(`[ ${projectDir} resolving paths... ]\n`);
  
  const cdnPath = `https://${projectDir}.b-cdn.net/`;
  const localPath = dir.dir;

  fs.readdirSync(localPath).forEach(file => {
     
      let fileName = null;
      let currentFilePath = `${localPath}\\${file}`;
  
      if (file.includes(".data.js")) {
        const replacer = new Set();
        fileName = file.slice(0, -8);

      /[!-z]*.data.js$/gmi.test(file) && fsPromises.readFile(currentFilePath, "utf-8")
        .then(content => {

          try {
            replacer.add([/var PACKAGE_NAME = '[!-z]*.data';$/gmi, `var PACKAGE_NAME = '${cdnPath}${fileName}.data';`, 1]);
            replacer.add([/var REMOTE_PACKAGE_BASE = '[!-z]*.data';/gmi, `var REMOTE_PACKAGE_BASE = '${cdnPath}${fileName}.data';`, 2]);
            replacer.add([/Module\['removeRunDependency'\]\('[!-z]*.data'\);$/gmi, `Module['removeRunDependency']('${cdnPath}${fileName}.data');`, 3]);
            replacer.add([/Module\['addRunDependency'\]\('[!-z]*.data'\);$/gmi, `Module['addRunDependency']('${cdnPath}${fileName}.data');`, 4]);
      
            console.log(`Resolve file - ${file}`);
            let buffer = content;
              
            replacer.forEach(([key, value, index]) => {
              buffer = buffer.replace(key, value);
              index === 1 && console.log("____________________\n");
              console.log(`Replacement - [ ${key.exec(content)[0]} ] >>>> [ ${value} ]`);
              index === 4 && console.log("____________________\n");
              index === 4 && console.log("\u2611 Succeed\n");
              fs.writeFileSync(currentFilePath, buffer, "utf8");
            });

            } catch (err) {
              console.log(err);
            }
        });
      }
      if (file.includes(".UE4.js")) {
          const replacer = new Set();
          fileName = file.slice(0, -7);
          
          /[!-z]*.UE4.js$/gmi.test(file) && fsPromises.readFile(currentFilePath, "utf-8")
          .then(content => {
            try {
              replacer.add([
                /return download\(Module.locateFile\('[!-z]*UE4Game.wasm'\)/gmi,
                `return download(Module.locateFile('${cdnPath}UE4Game.wasm')`,
                1
              ]);
              replacer.add([
                /var mainJsDownload = fetchOrDownloadAndStore\(db, Module.locateFile\('[!-z]*UE4Game.js'\)/gmi,
                `var mainJsDownload = fetchOrDownloadAndStore(db, Module.locateFile('${cdnPath}UE4Game.js')`,
                2
              ]);
              replacer.add([
                /var dataJsDownload = fetchOrDownloadAndStore\(db, Module.locateFile\('[!-z]*.data.js'\)\);/gmi,
                `var dataJsDownload = fetchOrDownloadAndStore(db, Module.locateFile('${cdnPath}${fileName}.data.js'));`,
                3
              ]);
              replacer.add([
                /var utilityJsDownload = fetchOrDownloadAndStore\(db, Module.locateFile\('[!-z]*Utility.js'\)\).then\(addScriptToDom\);/gmi,
                `var utilityJsDownload = fetchOrDownloadAndStore(db, Module.locateFile('${cdnPath}Utility.js')).then(addScriptToDom);`,
                4
              ]);
              replacer.add([
                /fetchOrDownloadAndStore\(db, Module.locateFile\('[!-z]*.data'\), 'arraybuffer'\)/gmi,
                `fetchOrDownloadAndStore(db, Module.locateFile('${cdnPath}${fileName}.data'), 'arraybuffer')`,
                5
              ]);
              replacer.add([
                /Module\['preloadedPackages'\]\[Module.locateFile\('[!-z]*.data'\)\]/gmi,
                `Module['preloadedPackages'][Module.locateFile('${cdnPath}${fileName}.data')]`,
                6
              ]);
        
              console.log(`Resolve file - ${file}`);
              let buffer = content;
                
              replacer.forEach(([key, value, index]) => {
                buffer = buffer.replace(key, value);
                index === 1 && console.log("____________________\n");
                console.log(`Replacement - [ ${key.exec(content)[0]} ] >>>> [ ${value} ]`);
                index === 6 && console.log("____________________\n");
                index === 6 && console.log("\u2611 Succeed\n");
                fs.writeFileSync(currentFilePath, buffer, "utf8");
              });

              } catch (err) {
                console.log(err);
              }
          });
      }
    });
}
module.exports = {
  resolvePaths
}