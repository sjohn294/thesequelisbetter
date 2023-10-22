
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mike4mike!",
  database: "business_db"
});

connection.connect();

function startApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query("SELECT id, department_name FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, role.salary, department.department_name AS department 
    FROM role 
    JOIN department ON role.department_id = department.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllEmployees() {
  const query = `
    SELECT e.id, e.first_name, e.last_name, role.title, department.department_name AS department, role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role ON e.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}


function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Enter the name of the new department:"
    })
    .then(function (answer) {
      connection.query("INSERT INTO department SET ?", {
        department_name: answer.department
      }, function (err) {
        if (err) throw err;
        console.log("Department added successfully!");
        startApp();
      });
    });
}

async function addRole() {
  const [departments] = await connection.promise().query("select * from department");
  const departmentArray = departments.map(({ id, department_name }) => (
    {
      name: department_name,
      value: id
    }
  ))
  console.log(departmentArray);
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter the title of the new role:"
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for the new role:",
          validate: value => !isNaN(value) ? true : "Please enter a valid number"
        },
        {
          name: "department",
          type: "list",
          choices: departmentArray,
          message: "Which department does this role belong to?"
        }
      ])
      .then(function (answer) {
        console.log(answer)
        connection.query("INSERT INTO role SET ?", {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department,
        }, function (err) {
          if (err) throw err;
          console.log("Role added successfully!");
          startApp();
        });
      });
}

async function addEmployee() {
  const [roles] = await connection.promise().query("select * from role");
  const roleArray = roles.map(({ id, title}) => (
    {
      name: title,
      value: id
    }
  ))
  const [employees] = await connection.promise().query("select * from employee");
  const managerArray1 = managers.map(({ id, first_name, last_name}) => (
    {
      name: first_name + " " + last_name,
      value: id
    }
  ))
  const managerArray = [...managerArray1, {name: "none", value: null}]
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter the first name of the employee:"
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the last name of the employee:"
        },
        {
          name: "role",
          type: "list",
          choices: roleArray,
          message: "What is the employee's role?"
        },
        {
          name: "manager",
          type: "list",
          message: "Select Manager From List",
          choices: managerArray,
        }
      ])
      .then(function (answer) {
        // const role = roles.find(r => r.title === answer.role);
        connection.query("INSERT INTO employee SET ?", {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role,
          manager_id: answer.manager
        }, function (err) {
          if (err) throw err;
          console.log("Employee added successfully!");
          startApp();
        });
      });
}

async function updateEmployeeRole() {
  const [employees] = await connection.promise().query("select * from employee");
  const employeeArray = employees.map(({ id, first_name, last_name}) => (
    {
      name: first_name + " " + last_name,
      value: id
    }
  ))
  const [roles] = await connection.promise().query("select * from role");
  const roleArray = roles.map(({ id, title}) => (
    {
      name: title,
      value: id
    }
  ))
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          choices: employeeArray,
          message: "Which employee's role do you want to update?"
        },
        {
          name: "newRole",
          type: "list",
          message: "Select Role",
          choices: roleArray,
        }
      ])
      .then(function (answer) {
        connection.query("UPDATE employee SET ? WHERE ?", [
          {
            role_id: answer.newRole
          },
          {
            id: answer.employee
          }
        ], function (err) {
          if (err) throw err;
          console.log("Employee's role updated successfully!");
          startApp();
        });
      });
}
startApp();

// ... [previous code]


