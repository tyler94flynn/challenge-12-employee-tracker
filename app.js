//dependencies
const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');

//set up connection with app & mysql
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "4Helloworld7!",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});

//main function
function startPrompt() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: [
                "View All Employees?",
                "View All Employee's By Roles?",
                "View all Emplyees By Deparments",
                "Update Employee",
                "Add Employee?",
                "Add Role?",
                "Add Department?"
            ]
        }
    ]).then(function (val) {
        switch (val.choice) {
            case "View All Employees?":
                viewAllEmployees();
                break;

            case "View All Employee's By Roles?":
                viewAllRoles();
                break;
            case "View all Emplyees By Deparments":
                viewAllDepartments();
                break;

            case "Add Employee?":
                addEmployee();
                break;

            case "Update Employee":
                updateEmployee();
                break;

            case "Add Role?":
                addRole();
                break;

            case "Add Department?":
                addDepartment();
                break;

        }
    })
}

//show employees
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

//show roles
function viewAllRoles() {
    connection.query('SELECT * FROM role',
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

//show employees by department
function viewAllDepartments() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
        function (err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

//select role for new employee
var roleArr = [];
function selectRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

//select manager for new employee
var managersArr = [];
function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}

//add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name: "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name: "
        },
        {
            name: "role",
            type: "list",
            message: "Enter their role: ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Enter their manager's name: ",
            choices: selectManager()
        }
    ]).then(function (val) {
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: val.firstName,
                last_name: val.lastName,
                manager_id: managerId,
                role_id: roleId

            }, function (err) {
                if (err) throw err
                console.table(val)
                startPrompt()
            })

    })
}