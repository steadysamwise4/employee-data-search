const inquirer = require('inquirer');
const db = require('../db/connection');
const { viewDepartments } = require('../routes/apiRoutes/departmentRoutes');
const { viewJobs } = require('../routes/apiRoutes/job_titleRoutes');
const { viewEmployees } = require('../routes/apiRoutes/employeeRoutes');

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

module.exports = { promptMenu };