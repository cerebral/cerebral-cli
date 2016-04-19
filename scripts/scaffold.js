const fs        = require('fs-extra');
const CWD       = process.cwd();
var exec        = require('child_process').execSync;
var spawn       = require('child_process').spawn;
var inquirer    = require('inquirer');
var pkg         = require('../scaffold/package.json');
var httpGet     = require('./utils').httpGet;
var dasherize   = require('./utils').dasherize;

module.exports = function scaffold(options) {
  const appName = options.appName;

  inquirer.prompt([{
    type: 'list',
    name: 'view',
    message: 'What view layer do you want to use?',
    choices: ['React', 'Angular', 'Angular2', 'Snabbdom', 'Inferno']
  }, {
    type: 'list',
    name: 'model',
    message: 'What model layer you want to use?',
    choices: ['Baobab', 'ImmutableJS']
  }]).then(function(answers) {

    fs.mkdirs(`${CWD}/${appName}`, function (err) {
      if (err) return console.error(err)
    });

    var stdout = exec("npm root -g", {stdio:[0]});
    var cliDirectory = `${stdout.toString().split('\n')[0]}/cerebral-cli`;

  //   fs.copySync(`${cliDirectory}/scaffold`, `${CWD}/${appName}`);
  //   console.log(`\n* Scaffolding new Cerebral application:\n`);
  //
  //   stdout = exec(`find ${appName} -type d -print`, {stdio: [0]});
  //   console.log(`${stdout.toString()}`);
  //
  //   process.chdir(appName);
  //
  //   stdout = exec('git init', {stdio: [0]});
  //   console.log(`* ${stdout.toString()}`);
  //
    pkg.name = dasherize(appName);

    var packages = {
      // Views
      'React': 'cerebral-view-react',
      'Angular': 'cerebral-view-angular',
      'Angular2': 'cerebral-view-angular2',
      'Snabbdom': 'cerebral-view-snabbdom',
      'Inferno': 'cerebral-view-inferno',
      // Models
      'Baobab': 'cerebral-model-baobab',
      'ImmutableJS': 'cerebral-model-immutable-js'
    }

    Object.keys(packages).forEach(name => {
      if (answers.view === name || answers.model === name) {
        httpGet('registry.npmjs.org', `/${packages[name]}`, (data) => {
          pkg.dependencies[packages[name]] = data['dist-tags'].latest;
          fs.writeFileSync(`${CWD}/${appName}/package.json`, JSON.stringify(pkg,null,2));
        });
      }
    });

    // Configue model and view imports in main.js
    // maybe use _main.js as a 'template' and insert selected packages

    // var data = fs.readFileSync(`${cliDirectory}/_main.js`, 'utf8');
    return;

    npm = spawn('npm', ['install'], {stdio: 'inherit'});
    console.log('* installing npm packages...\n');

    npm.on('close', function(code) {
      console.log('* All npm packages successfully installed!');
      console.log(`\n---------------------------------------------------------------------------`);
      console.log(`\n* SUCCESS: New application '${appName}' created at '${CWD}'.\n`);
    });
  });

  return;
};
