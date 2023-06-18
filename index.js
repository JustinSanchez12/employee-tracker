const inquirer = require('inquirer');

class CLI {
  run() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee',
          message: 'What would you like to do?',
          choices: ['View All Employees', 'Add Employee', 'Update Employee Role'],
        },
      ])
      .then((answers) => {
        console.info(answers.employee);
      })
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }
}

module.exports = CLI;
