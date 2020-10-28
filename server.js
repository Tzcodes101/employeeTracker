//dependencies, mysql, express, inquirer, app
const mysql = require("mysql");
const consoleTable = require("console.table");
const inquirer = require("inquirer");

class Connection {
    constructor(config) {
        this.connection = mysql.createConnection(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

//create sever
const connection = new Connection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Wally17mane!",
    database: "employees_db"
})


userChoice();

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
                    editEmployeeChoices();
                    break;
                case "Edit Roles":
                    editRoleChoices();
                    break;
                case "Edit departments":
                    editDepartmentChoices();
                    break;
                case "None of the above":
                    console.log("You have chosen to end the application");
                    connection.end();
            }
        })
}

//build employee table
async function employeeTable() {
    console.log('employee table');
    await connection.query('SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, title AS Title, salary AS Salary, name AS Department, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        userChoice();
    });
};

//build row and department table
async function roleTable() {
    console.log('roleTable');
    await connection.query('SELECT r.id, title, salary, name AS department FROM role r LEFT JOIN department d ON department_id = d.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        userChoice();
    })
};

//build department table
async function departmentTable() {
    console.log('department table');
    await connection.query('SELECT id, name AS department FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        userChoice();
    })
};

//asks how a user would like to edit employee info
function editEmployeeChoices() {
    inquirer
        .prompt({
            name: "employeeChoice",
            type: "list",
            message: "What would you like to edit?",
            choices: [
                "Add a New Employee",
                "Remove an Employee",
                "Update a Current Employee's Manager",
                "Update a Current Employee's Role",
                "Return to main menu"
            ]
        }).then(answers => {
            switch (answers.employeeChoice) {
                case "Add a New Employee" :
                    addEmployee();
                    break;
                case "Remove an Employee":
                    removeEmployee();
                    break;
                case "Update a Current Employee's Manager":
                    updateEmpMan();
                    break;
                case "Update a Current Employee's Role":
                    updateEmpRole();
                    break;
                case "Return to main menu":
                    userChoice();
                    break;
            }
        })
} 

//asks how a user would like to edit role info
function editRoleChoices() {
    inquirer
        .prompt({
            name: "roleChoice",
            type: "list",
            message: "What would you like to edit?",
            choices: [
                "Add a New Role",
                "Update a Current Role's Info",
                "Remove a Role",
                "Return to main menu"
            ]
        }).then(answers => {
            switch (answers.roleChoice) {
                case "Add a New Role" :
                    addRole();
                    break;
                case "Update a Current Role's Info":
                    updateRole();
                    break;
                case "Remove a Role":
                    removeRole();
                    break;
                case "Return to main menu":
                    userChoice();
                    break;
            }
        })
} 

//asks how a user would like to edit department info
function editDepartmentChoices() {
    inquirer
        .prompt({
            name: "departmentChoice",
            type: "list",
            message: "What would you like to edit?",
            choices: [
                "Add a New Department",
                "Remove a Department",
                "Return to main menu"
            ]
        }).then(answers => {
            switch (answers.departmentChoice) {
                case "Add a New Department" :
                    addDepartment();
                    break;
                case "Remove a Department":
                    removeDepartment();
                    break;
                case "Return to main menu":
                    userChoice();
                    break;
            }
        })
} 

//add employee
async function addEmployee() {
    let jobs = await connection.query("SELECT id, title FROM role");
    let managers = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS Manager FROM employee');
    managers.unshift({ id: null, Manager: "None" });

    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is employee's first name?",
                validate: function(input) {
                    if (input != "" && input.length <= 30) {
                        return true;
                    }
                    return "Value cannot be empty and must be less than 30 characters. "
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "What is employee's last name?",
                validate: function(input) {
                    if (input != "" && input.length <= 30) {
                        return true;
                    }
                    return "Value cannot be empty and must be less than 30 characters. "
                }
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: jobs.map(obj => obj.title)
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: managers.map(obj => obj.Manager)
            },
        ]).then(answers => {
            let jobDetails = jobs.find(obj => obj.title === answers.role);
            let manager = managers.find(obj => obj.Manager === answers.manager);
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)", [[answers.firstName.trim(), answers.lastName.trim(), jobDetails.id, manager.id]]);
            console.log("\x1b[32m", `${answers.firstName} was successfuly added!`);
            userChoice();
    });
};

//remove employee after asking for proper info
async function removeEmployee() {
    let employee = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employee.push({ id: null, name: "Cancel" });

    inquirer
        .prompt([
            {
                name: "employeeName",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employee.map(obj => obj.name)
            }
        ]).then(answer => {
            if(answer.employeeName != "Cancel") {
                let removedEmployee = employee.find(obj => obj.name === answer.employeeName);
                connection.query("DELETE FROM employee WHERE id=?", removedEmployee.id);
                console.log("\x1b[32m", `${answer.employeeName} was removed`);
            }
            userChoice();
        });

}

//update employee manager
async function updateEmpMan() {
    let employee = await connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee");
    employee.push({ id: null, name: "Cancel" });

    inquirer
        .prompt([
            {
                name: "employName",
                type: "list",
                message: "Which employee would you like to update?",
                choices: employee.map(obj => obj.name)
            }
        ]).then(answer => {
            if (answer.employName === "Cancel") {
                userChoice();
                return;  
            }
            let manager = employee.filter(currentEmployee => currentEmployee.name != answer.employName);
            inquirer
            .prompt([
                {
                    name: "managerName",
                    type: "list",
                    message: "Who is the new manager?",
                    choices: manager.map(obj => obj.name)
                }
            ]).then(managerInfo => {
                let empID = employee.find(obj => obj.name === answer.employName).id
                let mgID = manager.find(obj => obj.name === managerInfo.managerName).id
                connection.query("UPDATE employee SET manager_id=? WHERE id=?", [mgID, empID]);
                console.log("\x1b[32m", `${answer.employName} now reports to ${managerInfo.managerName}`);
                userChoice();
            })
        });   
}

//update employee role
async function updateEmpRole() {
    let employee = await connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee');
    employee.push({ id: null, name: "Cancel" });
    console.log(employee);
    let roles = await connection.query('SELECT id, title FROM role');

    inquirer
        .prompt([
            {
                name: "nameEmp",
                type: "list",
                message: "Which employee would you like to change the role for?",
                choices: employee.map(obj => obj.name)
            },
            {
                name: "newRole",
                type: "list",
                message: "What is the new role?",
                choices: roles.map(obj => obj.title)
            }
        ]).then(answers => {
            if (answers.empName != "Cancel") {
            let employeeID = employee.find(obj => obj.name === answers.nameEmp).id
            let roleID = roles.find(obj => obj.title === answers.newRole).id
            connection.query("UPDATE employee SET role_id=? WHERE id=?", [roleID, employeeID]);
            console.log("\x1b[32m", `${answers.nameEmp}'s new role is ${answers.newRole}`);
        }
        userChoice();
    })
};

//addRole
async function addRole() {
   let department = await connection.query("SELECT id, name FROM department");

   inquirer 
    .prompt([
        {
            name: "roleName",
            type: "input",
            message: "What is the new role title?",
            validate: function(input) {
                if (input != "" && input.length <= 30) {
                    return true;
                }
                return "Value cannot be empty and must be less than 30 characters. "
            }
        },
        {
            name: "roleSalary",
            type: "input",
            message: "What is the new role's corresponding salary?",
            validate: input => {
                if (!isNaN(input)) {
                    return true;
                }
                return "Value must be a number";
            }   
        },
        {
            name: "roleDepartment",
            type: "list",
            message: "Choose the role's department:",
            choices: department.map(obj => obj.name)
        }

    ]).then(answers => {
            let depID = department.find(obj => obj.name === answers.roleDepartment).id
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?)", [[answers.roleName, answers.roleSalary, depID]]);
            console.log("\x1b[32m", `${answers.roleName} was added to the ${answers.roleDepartment} Department`);
            userChoice();
    });
};

//update role
async function updateRole() {
    let roles = connection.query("SELECT id, title FROM role");
    roles.push ({ id: null, title: "Cancel" });
}



//removeRole

//addDeparment

//removeDepartment

//make changes to specific emplpyees

//same for roles

//same for departments



//function viewSearch
//prompt for what want to search for (department, employee, or role)
//with