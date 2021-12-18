const inquirer = require("inquirer");
const {resolvePaths} = require("./paths");

inquirer.prompt([
    {
        type: "list",
        message: "Builder scripts to run:",
        name: "script",
        choices: ["Paths", "Gadget"]
    }
]).then(ans => {
  switch (ans.script) {
    case "Paths" : { resolvePaths() }
      break;
    case "Gadget": { console.log("gadget") }
      break;
  };
});