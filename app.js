// Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connection to the database (add username & password here)
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '4Helloworld7!',
    database: 'tracker'
})
connection.connect(err => { if (err) throw err });

mainMenu()

// Main Menu function to display all choices
function mainMenu() {
    inquirer.prompt({
        name: "mainMenu",
        type: "list",
        message: "------Main Menu------",
        choices: [
            "View all employees", "View Employees by departments", "View Employees by roles",
            new inquirer.Separator(),
            "Add employee", "Add department", "Add role"
        ]
    }).then((answer) => {

        switch (answer.mainMenu) {
            case "View all employees":
                viewAllEmployee()
                break;

            case "View Employees by departments":
                viewByDepartment()
                break;

            case "View Employees by roles":
                viewByRole();
                break;

            case "Add employee":
                addEmployee();
                break;

            case "Add department":
                addDepartment();
                break;

            case "Add role":
                addRole();
                break;

        };
    });
};
// View all employees function
function viewAllEmployee() {
    connection.connect(err => { if (err) throw err });

    connection.query(`
    SELECT 
         employee.first_name, employee.last_name, 
         role.title, role.salary,
         department.name AS department, 
         concat(manager.first_name," ", manager.last_name) AS manager
    FROM
        employee
    LEFT JOIN
        role 
    ON
        employee.role_id = role.id
    LEFT JOIN
        department
    ON 
        role.department_id = department.id
    LEFT JOIN
        employee manager
    ON 
        manager.id = employee.manager_id
    ;

    `, (err, result) => {
        if (err) { console.log(err) }
        console.table(result);
        mainMenu();
    })

};

// View employees by department function
function viewByDepartment() {

    deptArry = [];

    connection.query(`SELECT department.id, department.name AS Department FROM department;`,
        function (err, result, fields) {

            result.forEach(function (item, index) {
                deptArry.push(item.Department)
            });
            deptQues();
        }
    )

    function deptQues() {
        inquirer.prompt({
            name: "deptMenu",
            type: "list",
            message: "Which department would you like to view by?",
            choices: deptArry
        }).then((answer) => {

            const sql = `
            SELECT 
                 employee.first_name, employee.last_name, 
                 role.title, role.salary,
                 department.name AS Department, 
                 concat(manager.first_name," ", manager.last_name) AS manager
            FROM
                employee
            LEFT JOIN
                role 
            ON
                employee.role_id = role.id
            LEFT JOIN
                department
            ON 
                role.department_id = department.id
            LEFT JOIN
                employee manager
            ON 
                manager.id = employee.manager_id
            WHERE
                department.name = (?)
            ;`
            const viewDept = answer.deptMenu;
            connection.query(sql, viewDept, (err, result) => {
                if (err) { console.log(err) }
                console.table(result);
                mainMenu()
            }
            )
        })
    }

};

function viewByRole() {
    roleArry = [];

    connection.query(`SELECT role.title FROM role;`,
        function (err, result, fields) {

            result.forEach(function (item, index) {
                roleArry.push(item.title)
            });
            roleQues();
        }
    )

    function roleQues() {
        inquirer.prompt({
            name: "roleMenu",
            type: "list",
            message: "Which roles would you like to view by?",
            choices: roleArry
        }).then((answer) => {

            const sql = `
            SELECT 
                 employee.first_name, employee.last_name, 
                 role.title, role.salary,
                 department.name AS Department, 
                 concat(manager.first_name," ", manager.last_name) AS manager
            FROM
                employee
            LEFT JOIN
                role 
            ON
                employee.role_id = role.id
            LEFT JOIN
                department
            ON 
                role.department_id = department.id
            LEFT JOIN
                employee manager
            ON 
                manager.id = employee.manager_id
            WHERE
                role.title = (?)
            ;`

            connection.query(sql, answer.roleMenu, (err, result) => {
                if (err) { console.log(err) }
                console.table(result);
                mainMenu()
            });
        });
    };
};



// ----------------------Question-Divider-----------------------------
function addEmployee() {

    // Information to be placed into question array
    connection.connect(err => { if (err) throw err });

    const sqlRole = `SELECT * FROM role;`;
    const sqlManager = `SELECT * FROM employee;`

    const roleArry = []
    const managerArry = []

    connection.query((sqlRole),
        function (err, result, fields) {
            if (err) {
                throw (err)
                return;
            }
            result.forEach((item) => {
                roleArry.push(item.title)
            })
            // console.log(roleArry)
        }
    )
    connection.query((sqlManager),
        function (err, result, fields) {
            if (err) {
                throw (err)
                return;
            }
            result.forEach((item) => {
                managerArry.push(item.first_name)
            })
            // console.log(managerArry)
        }
    )

    const employeeQues = [
        {
            name: "first",
            type: "input",
            message: "What is the first name of this employee?",
            validate: function (emptyCheck) {
                if (emptyCheck) {
                    return true;
                } else {
                    console.log('Please enter a first name!');
                    return false;
                }
            }
        },
        {
            name: "last",
            type: "input",
            message: "What is the last name of this employee?",
            validate: function (emptyCheck) {
                if (emptyCheck) {
                    return true;
                } else {
                    console.log('Please enter a last name!');
                    return false;
                }
            }
        },
        {
            name: "role",
            type: "list",
            message: "What is the role of this employee",
            choices: roleArry
        },
        {
            name: "manager",
            type: "list",
            message: "Who is this employees manager?",
            choices: managerArry
        }]

    function init() {
        inquirer.prompt(employeeQues)
            .then((answer) => {

                // To convert back into ID's
                const sqlConvRole = `SELECT role.id FROM role WHERE role.title = (?);`;
                const sqlConvMana = `SELECT employee.id FROM employee WHERE employee.first_name = (?);`;

                const roleAns = answer.role;
                const manAns = answer.manager;

                const newArry = [answer.first, answer.last]

                firstStep()
                function firstStep() {
                    connection.query(sqlConvRole, roleAns,
                        function (err, result) {
                            if (err) {
                                throw (err)
                                return;
                            }
                            result.forEach((itemOne) => {
                                newArry.push(itemOne.id)
                            })
                            secondStep()
                        }

                    )
                }

                function secondStep() {
                    connection.query(sqlConvMana, manAns,
                        function (err, result) {
                            if (err) {
                                throw (err)
                                return;
                            }
                            result.forEach((itemTwo) => {
                                newArry.push(itemTwo.id)
                            })
                            thirdStep()
                        }
                    )
                }

                function thirdStep() {
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, newArry, (err, result) => {
                        if (err) {
                            throw (err)
                            return;
                        }
                        console.log("Success!")
                        mainMenu()
                    })
                }
            })

    }
    init()
};

function addDepartment() {
    connection.connect(err => { if (err) throw err });

    inquirer.prompt({
        name: "addDptMenu",
        type: "input",
        message: "What will the department be called?",
        validate: function (emptyCheck) {
            if (emptyCheck) {
                return true;
            } else {
                console.log('Please enter a Department Name!');
                return false;
            }
        }
    }).then((answer) => {
        const sql = `INSERT INTO department(name) VALUES(?)`;
        const departAdd = answer.addDptMenu

        connection.query(sql, departAdd, (err, result) => {
            if (err) {
                throw (err)
                return;
            }
            console.log("success");
            connection.query(`SELECT department.id, department.name AS Department FROM department; `,
                (err, result) => {
                    if (err) { console.log(err) }
                    console.table(result);
                    mainMenu()
                });
        });
    });
};

function addRole() {
    connection.connect(err => { if (err) throw err });

    deptArry = [];

    connection.query(`SELECT department.id, department.name AS Department FROM department;`,
        function (err, result, fields) {

            result.forEach(function (item, index) {
                deptArry.push(item.Department);
            });
            roleMenu();
        }
    )

    const roleQues = [
        {
            name: "title",
            type: "input",
            message: "What is the title of this role?",
            validate: function (emptyCheck) {
                if (emptyCheck) {
                    return true;
                } else {
                    console.log('Please enter a title!');
                    return false;
                }
            }
        }, {
            name: "salary",
            type: "number",
            message: "What is the annual salary? Example: 50000",
        }, {
            name: "department",
            type: "list",
            message: "What department is this employee from?",
            choices: deptArry
        },
    ];

    function roleMenu() {
        inquirer.prompt(roleQues)
            .then((answer) => {

                const sqlDept = `SELECT * FROM department WHERE department.name = (?)`;
                const deptNumArry = [];
                connection.query(sqlDept, answer.department, (err, result) => {
                    if (err) {
                        throw (err)
                        return;
                    }
                    deptNumArry.push(result[0].id)
                    const array = [answer.title, answer.salary, deptNumArry.toString()]

                    connection.query(sql, array, (err, result) => {
                        if (err) {
                            throw (err)
                            return;
                        }
                        connection.query(`
                        SELECT 
                            role.title, role.salary,
                            department.name AS department 
                        FROM 
                            role
                        LEFT JOIN
                            department
                        ON
                            role.department_id = department.id
                        ; `,
                            (err, result) => {
                                if (err) { console.log(err) }
                                console.table(result);
                                mainMenu()
                            });
                    })
                })
                //To add into role
                const sql = `INSERT INTO role(title, salary, department_id) VALUES(?,?,?)`;
            })
    }
}