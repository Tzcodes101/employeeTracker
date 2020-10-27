//dependencies, mysql, express, inquirer, app
const mysql = require("mysql");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

//create sever
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wally17mane!",
    database: "employees_db"
})

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    userChoice();
}) 


//prompt for if user would like to add departments, roles, or employees, view departments roles, or employees, or update to departments, roles, or employees and call appropriate function
function userChoice() {
    inquirer
        .prompt({
                name: "menu",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View All Employees",
                    "View All Roles",
                    "View All Departments",
                    "Edit Employee Information",
                    "Edit Roles",
                    "Edit departments",
                    "None of the above"
                ]
        }).then(answer => {
            switch(answer.menu) {
                case "View All Employees":
                    employeeTable();
                    break;
                case "View All Roles":
                    roleTable();
                    break;
                case "View All Departments":
                    departmentTable();
                    break;
                case "Edit Employee Information":
                    editEmployee();
                    break;
                case "Edit Roles":
                    editRoles();
                    break;
                case "Edit departments":
                    editDepartments();
                    break;
                case "None of the above":
                    connection.end;
            }
        })
}

//build employee table
function employeeTable() {
    console.log('employee table');
    connection.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        userChoice();
    });
};



//build row and department table

//build department table

//prevent empty strings

//adds new employees after asking for proper info

//remove employee after asking for proper info

//update manader

//update employee role

//addRole

//updateRole

//removeRole

//addDeparment

//removeDepartment

//make changes to specific emplpyees

//same for roles

//same for departments



//function viewSearch
//prompt for what want to search for (department, employee, or role)
//with