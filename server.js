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
    userChoice();
}) 


//prompt for if user would like to add departments, roles, or employees, view departments roles, or employees, or update to departments, roles, or employees and call appropriate function

//build employee table

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