const db = require('./db/connection');
const inquirer = require('inquirer');
require('console.table');

// const { promptMenu } = require('./prompts/promptMenu');
// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    
});

const promptMenu = async function() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please choose an option below.',
            choices: ['View all departments', 'View all job titles', 'View all employees', 'Create a department', 'Create a job title', 'Exit']
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
            case 'Create a job title':
                addJob();
            case 'Exit':
                process.exit;
                break;
    }
});
};

// Get all departments
const viewDepartments = function() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        console.table(rows);
        promptMenu();
        });
    };

    // Get all job_titles
const viewJobs = function() {
    const sql = `SELECT job_title.title, job_title.id, department.department_name 
                 AS department_name, job_title.salary 
                 FROM job_title
                 LEFT JOIN department
                 ON job_title.department_id = department.id`;

    db.query(sql, (err, rows) => {
        console.table(rows);
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
             console.table(rows);
             promptMenu();
             });
         }; 

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
    ])
    .then(answer => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        db.query(sql, answer.department_name);
        viewDepartments();
    })
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
            }
        )
    }).then(() => viewJobs())
})
};


promptMenu();