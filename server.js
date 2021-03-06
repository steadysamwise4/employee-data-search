const db = require('./db/connection');
const inquirer = require('inquirer');
require('console.table');
const { printTable } = require('console-table-printer');

const Dept = require('./db/db');
// Dept.getDepartments().then(([rows]) => {
//     printTable(rows);
// })
db.connect(err => {
    if (err) throw err;    
});

// Give User a list of options
const promptMenu = async function() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please choose an option below.',
            choices: ['View all departments', 'View all job titles', 'View all employees', 'Create a department',
                      'Create a job title', 'Add an employee', "Update an employee's job title", "Update an employee's manager", 
                      "View employees by manager", 'View employees by department', 'Delete a department',
                      'Delete a job title', 'Remove employee', 'View total utilized budget by department', 'Exit']
        }
    ])
    .then(choice => {
        switch (choice.menu) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all job titles':
                viewJobs();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Create a department':
                addDepartment();
                break;
            case 'Create a job title':
                addJob();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case "Update an employee's job title":
                updateJob();
                break;
            case "Update an employee's manager":
                updateManager();
                break;
            case "View employees by manager":
                viewByManager();
                break;
            case 'View employees by department':
                viewByDepartment();
                break;
            case 'Delete a department':
                destroyDepartment();
                break;
            case 'Delete a job title':
                destroyjobTitle();
                break;
            case 'Remove employee':
                destroyEmployeeData();
                break;
            case 'View total utilized budget by department':
                viewDepartmentBudget();
                break;
            case 'Exit':
                console.log("Push 'Ctrl C' to disconnect from the server completely");
                process.exit;
                break;
    }
});
};

// Get all departments
const viewDepartments = function() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        printTable(rows);
        promptMenu();
        });
    };

    // Get all job_titles
const viewJobs = function() {
    const sql = `SELECT job_title.title AS job_title, job_title.id, department.department_name 
                 AS department_name, job_title.salary 
                 FROM job_title
                 LEFT JOIN department
                 ON job_title.department_id = department.id`;

    db.query(sql, (err, rows) => {
        printTable(rows);
        promptMenu();
        })
    };

    const viewEmployees = function() {
        const sql = `SELECT E.id, E.last_name, E.first_name, J.title AS job_title, D.department_name AS department, J.salary, CONCAT(M.first_name,' ',M.last_name) AS manager
         FROM employee E
         JOIN job_title J 
         ON E.job_title_id = J.id 
         JOIN department D ON J.department_id = D.id 
         LEFT JOIN employee M ON E.manager_id = M.id`;
    
         db.query(sql, (err, rows) => {
             printTable(rows);
             promptMenu();
             });
         }; 
// Add a department
const addDepartment = function() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'Enter the name of the department you wish to create:',
            validate: departmentName => {
                if (departmentName) {
                    return true;
                } else {
                    console.log('You must enter a department name!');
                    return false;
                }
            }
        }
    ]).then(answers => {
        Dept.addDepartment(answers.department_name).then(([rows]) => {
            console.log('Department created!');
            viewDepartments();
        })
    })
    // .then(answer => {
    //     const sql = `INSERT INTO department (department_name) VALUES (?)`;
    //     db.query(sql, answer.department_name);
    //     console.log("Department added to the database!");
    //     viewDepartments();
    // })
};

// add a new job title
const addJob = function() {
    const sql = `SELECT * FROM department`;
    return db.promise().query(sql)
    .then(([departments]) => {
        let departmentChoices = departments.map(({
            id,
            department_name
        }) => ({
            name: department_name,
            value: id
        }));
    
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the job title you wish to create:',
            validate: jobName => {
                if (jobName) {
                    return true;
                } else {
                    console.log('You must enter a job title!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this job: (formatted example: 100000.00)',
            validate: salary => {
                if (salary) {
                    return true;
                } else {
                    console.log('You must enter a salary (ex. 100000.00)!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does this job title belong to?',
            choices: departmentChoices  
        }
    ])
    .then(({ name, salary, department }) => {
        const sql = `INSERT INTO job_title SET ?`;
        const params = { title: name, salary: salary, department_id: department };

        db.query(sql, params, (err, res) => {
                if (err) throw err;
                console.log("Job title added to the database!");
            }
        )
    }).then(() => viewJobs())
})
};
// Add an employee
const addEmployee = () => {
    const sql = `SELECT job_title.id, job_title.title FROM job_title`;
    return db.promise().query(sql)
    .then(([jobs]) => {
        let jobChoices = jobs.map(({
            id,
            title 
        }) => ({
            value: id,
            name: title 
        }))

        const sql = `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name)
                     AS manager
                     FROM employee`;
        db.promise().query(sql)
        .then(([managers]) => {
            let managerChoices = managers.map(({
                id,
                manager 
            }) => ({
                value: id,
                name: manager 
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter the employee's first name:",
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log('You must enter a first name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter the employee's last name:",
                    validate: firstName => {
                        if (firstName) {
                            return true;
                        } else {
                            console.log('You must enter a last name!');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'job',
                    message: "Choose the employee's job title:",
                    choices: jobChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Choose the employee's manager:",
                    choices: managerChoices
                }
            ])
            .then(({ firstName, lastName, job, manager}) => {
                const sql = `INSERT INTO employee SET ?`;
                const params = {first_name: firstName,
                                last_name: lastName,
                                job_title_id: job,
                                manager_id: manager };
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log("Employee added to the database!");
                    promptMenu();
                })
            })
        })
    })
};
// Change an employee's job title
const updateJob = () => {
    const sql = `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) 
                 AS employee_name, job_title.title AS job_title
                 FROM employee LEFT JOIN job_title 
                 ON employee.job_title_id = job_title.id`;
    db.promise().query(sql)
    .then(([employees]) => {
        let employeeChoices = employees.map(({
            id,
            employee_name
        }) => ({
            value: id,
            name: employee_name 
        }));

        const sql = `SELECT job_title.id, job_title.title FROM job_title`;
        db.promise().query(sql)
        .then(([jobs]) => {
            let jobChoices = jobs.map(({
                id,
                title 
            }) => ({
                value: id,
                name: title 
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'job',
                    message: 'Choose a new job title for this employee:',
                    choices: jobChoices
                }
            ])
            .then(({ employee, job }) => {
                const sql = `UPDATE employee SET job_title_id = ? WHERE id = ?`;
                const params = [job, employee];
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log("Employee's job title changed!");
                    promptMenu();
                })
            })
            
        })
    })
};
// Change an employee's manager
const updateManager = () => {
    const sql = `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) 
                 AS employee_name, job_title.title AS job_title
                 FROM employee LEFT JOIN job_title 
                 ON employee.job_title_id = job_title.id`;
    db.promise().query(sql)
    .then(([employees]) => {
        let employeeChoices = employees.map(({
            id,
            employee_name
        }) => ({
            value: id,
            name: employee_name 
        }));

        const sql = `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name)
                     AS manager
                     FROM employee`;
        db.promise().query(sql)
        .then(([managers]) => {
            let managerChoices = managers.map(({
                id,
                manager 
            }) => ({
                value: id,
                name: manager 
            }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: 'Choose a new manager for this employee:',
                    choices: managerChoices
                }
            ])
            .then(({ employee, manager }) => {
                const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
                const params = [manager, employee];
                db.query(sql, params, (err, row) => {
                    if (err) throw err;
                    console.log('Manager changed!');
                    promptMenu();
                })
            })
        })
    })
};
// View a list employees for each manager
const viewByManager = () => {
    const sql = `SELECT employee.id, CONCAT(first_name,' ',last_name)
                 AS manager 
                 FROM employee 
                 WHERE find_in_set
                 (job_title_id,'1,2,3,4,7,8,9,10,13,14,15,16,19,20,21,22,25')`;
    db.promise().query(sql)
    .then(([managers]) => {
        let managerChoices = managers.map(({
            id,
            manager
        }) => ({
            value: id,
            name: manager 
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: "Choose to view the employees of which manager?",
                choices: managerChoices
            }
        ])
        .then(({ manager }) => {
            const sql = `SELECT E.id, E.last_name, E.first_name, J.title AS job_title, D.department_name AS department, J.salary, CONCAT(M.first_name,' ',M.last_name) AS manager
            FROM employee E
            JOIN job_title J 
            ON E.job_title_id = J.id 
            JOIN department D ON J.department_id = D.id 
            LEFT JOIN employee M ON E.manager_id = M.id
            WHERE E.manager_id = ?`;
            const params = [manager];
            db.query(sql,params, (err, rows) => {
                if (err) throw err;
                printTable(rows);
                promptMenu();
            })
        })
        
    })
};
// View a list of employees in each department
const viewByDepartment = () => {
    const sql = `SELECT * FROM department`;
    return db.promise().query(sql)
    .then(([departments]) => {
        let departmentChoices = departments.map(({
            id,
            department_name
        }) => ({
            name: department_name,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "Choose to view the employees of which department?",
                choices: departmentChoices
            }
        ])
        .then(({ department }) => {
            const sql = `SELECT E.id, E.last_name, E.first_name, J.title AS job_title, D.department_name AS department, J.salary, CONCAT(M.first_name,' ',M.last_name) AS manager
            FROM employee E
            JOIN job_title J 
            ON E.job_title_id = J.id 
            JOIN department D ON J.department_id = D.id 
            LEFT JOIN employee M ON E.manager_id = M.id
            WHERE J.department_id = ?`;
            const params = [department];
            db.query(sql,params, (err, rows) => {
                if (err) throw err;
                printTable(rows);
                promptMenu();
            })
        })
    })
};
// Remove a department from the database
const destroyDepartment = () => {
    const sql = `SELECT * FROM department`;
    return db.promise().query(sql)
    .then(([departments]) => {
        let departmentChoices = departments.map(({
            id,
            department_name
        }) => ({
            name: department_name,
            value: id
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "Choose to delete which department?",
                choices: departmentChoices
            }
        ])
        .then(({ department }) => {
            const sql = `DELETE FROM department WHERE id = ?`;
            const params = [department];
            db.query(sql,params, (err, rows) => {
                if (err) throw err;
                console.log('Department deleted!');
                promptMenu();
            })
        })
    })
};
// Remove a job title from the database
const destroyjobTitle = () => {
    const sql = `SELECT job_title.id, job_title.title FROM job_title`;
    db.promise().query(sql)
    .then(([jobs]) => {
        let jobChoices = jobs.map(({
            id,
            title 
        }) => ({
            value: id,
            name: title 
        }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'job',
                message: "Choose to delete which job title?",
                choices: jobChoices
            }
        ])
        .then(({ job }) => {
            const sql = `DELETE FROM job_title WHERE id = ?`;
            const params = [job];
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log('Job title deleted!');
                promptMenu();
            })
        })
    })
};
// Remove an employee from the database
const destroyEmployeeData = () => {
    const sql = `SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) 
                 AS employee_name
                 FROM employee `;
    db.promise().query(sql)
    .then(([employees]) => {
        let employeeChoices = employees.map(({
            id,
            employee_name
        }) => ({
            value: id,
            name: employee_name 
        }));
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Choose to remove which employee from the database?",
                choices: employeeChoices
            }
        ])
        .then(({ employee }) => {
            const sql = `DELETE FROM employee WHERE id = ?`;
            const params = [employee];
            console.log(employee);
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log('Employee data deleted!');
                promptMenu();
            })
        })
    })
};
// View each departments total utilized budget
const viewDepartmentBudget = () => {
    const sql = `SELECT * FROM department`;
    return db.promise().query(sql)
    .then(([departments]) => {
        let departmentChoices = departments.map(({
            id,
            department_name
        }) => ({
            name: department_name,
            value: id
        }));   
    
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'budget',
                    message: "Choose to a department to view it's total utilized budget?",
                    choices: departmentChoices
                }
            ])
            .then(({ budget }) => {
                const sql = `SELECT D.department_name AS department, SUM(J.salary) AS Total_utilized_budget FROM employee E
                JOIN job_title J ON E.job_title_id = J.id JOIN department D ON J.department_id = D.id
                WHERE J.department_id = ?`;
                const params = [budget];
                db.query(sql, params, (err, rows) => {
                    if (err) throw err; 
                    printTable(rows);                   
                    promptMenu();
                })
            })
        })
    };    

promptMenu();