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
      //User chooses the list of options and gets moved to a function
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
      // catches error if something goes wrong
      .catch((err) => {
        console.log(err);
        console.log('Oops. Something went wrong.');
      });
  }

  viewAllDepartments() {
    //calls to database and selects everything from department
    const query = 'SELECT * FROM department';
    this.db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      this.run();
    });
  }

  viewAllRoles() {
    const query = 'SELECT * FROM role';
    this.db.query(query, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.table(results);
      this.run();
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

  addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the department:',
        },
      ])
      .then((answers) => {
        const { name } = answers;
        const query = 'INSERT INTO department (name) VALUES (?)';
        this.db.query(query, [name], (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log('Department added successfully!');
          this.run();
        });
      });
  }

  addRole() {
    const departmentQuery = 'SELECT * FROM department';
    this.db.query(departmentQuery, (err, departments) => {
      if (err) {
        console.log(err);
        return;
      }
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
          },
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departments.map((department) => ({
              name: department.name,
              value: department.id,
            })),
          },
        ])
        .then((answers) => {
          const { title, salary, departmentId } = answers;
          const query =
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          this.db.query(query, [title, salary, departmentId], (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log('Role added successfully!');
            this.run();
          });
        });
    });
  }

  addEmployee() {
    const roleQuery = 'SELECT * FROM role';
    this.db.query(roleQuery, (err, roles) => {
      if (err) {
        console.log(err);
        return;
      }
      const employeeQuery = 'SELECT * FROM employee';
      this.db.query(employeeQuery, (err, employees) => {
        if (err) {
          console.log(err);
          return;
        }
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'firstName',
              message: 'Enter the first name of the employee:',
            },
            {
              type: 'input',
              name: 'lastName',
              message: 'Enter the last name of the employee:',
            },
            {
              type: 'list',
              name: 'roleId',
              message: 'Select the role for the employee:',
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
            {
              type: 'list',
              name: 'managerId',
              message: 'Select the manager for the employee:',
              choices: [
                ...employees.map((employee) => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id,
                })),
                { name: 'None', value: null },
              ],
            },
          ])
          .then((answers) => {
            const { firstName, lastName, roleId, managerId } = answers;
            const query =
              'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            this.db.query(
              query,
              [firstName, lastName, roleId, managerId],
              (err, result) => {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('Employee added successfully!');
                this.run();
              }
            );
          });
      });
    });
  }

  updateEmployeeRole() {
    const employeeQuery = 'SELECT * FROM employee';
    this.db.query(employeeQuery, (err, employees) => {
      if (err) {
        console.log(err);
        return;
      }
      const roleQuery = 'SELECT * FROM role';
      this.db.query(roleQuery, (err, roles) => {
        if (err) {
          console.log(err);
          return;
        }
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employeeId',
              message: 'Select the employee to update:',
              choices: employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            },
            {
              type: 'list',
              name: 'roleId',
              message: 'Select the new role for the employee:',
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
          ])
          .then((answers) => {
            const { employeeId, roleId } = answers;
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            this.db.query(query, [roleId, employeeId], (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log('Employee role updated successfully!');
              this.run();
            });
          });
      });
    });
  }
}

module.exports = CLI;
