const inquirer = require('inquirer');

class CLI {
  constructor(db){
    this.db = db;
  }
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
        const { employees } = answers;
        switch(employees) {
          case 'View All Employees':
            this.viewAllEmployees();
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }
  viewAllEmployees() {
    const query = `
      SELECT 
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM 
        employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `;
    this.db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      this.run();
    });
  };
}



  

module.exports = CLI;
