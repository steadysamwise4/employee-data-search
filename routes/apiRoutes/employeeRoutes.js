const db = require('../../db/connection');
const { promptMenu } = require('../../prompts/promptMenu');
const inputCheck = require('../../utils/inputCheck');

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



module.exports = { viewEmployees };