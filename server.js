const db = require('./db/connection');
const inquirer = require('inquirer');
require('console.table');

// const { promptMenu } = require('./prompts/promptMenu');
// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
});

const promptMenu = async function() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please choose an option below.',
            choices: ['View all departments', 'View all job titles', 'View all employees', 'Exit']
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
            case 'Exit':
                console.log('Ok, cool');
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

promptMenu();