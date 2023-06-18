const inquirer = require('inquirer');
const mysql = require('mysql2');

//Conecting to the database
class CLI {
  constructor(db) {
    this.db = db;
  }

  //Inquirer node to bring up command prompt
  run() {
    return inquirer
      .prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
          ],
        },
      ])
      .then((answers) => {
        const { action } = answers;
        switch (action) {
          case 'View All Departments':
            this.viewAllDepartments();
            break;
          case 'View All Roles':
            this.viewAllRoles();
            break;
          case 'View All Employees':
            this.viewAllEmployees();
            break;
          case 'Add a Department':
            this.addDepartment();
            break;
          case 'Add a Role':
            this.addRole();
            break;
          case 'Add an Employee':
            this.addEmployee();
            break;
          case 'Update an Employee Role':
            this.updateEmployeeRole();
            break;
          default:
            console.log('Invalid option');
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
  }

}

module.exports = CLI;
