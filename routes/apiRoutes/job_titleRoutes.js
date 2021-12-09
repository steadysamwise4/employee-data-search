const db = require('../../db/connection');
const { promptMenu } = require('../../prompts/promptMenu');
const inputCheck = require('../../utils/inputCheck');
require('console.table');
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


module.exports = { viewJobs };