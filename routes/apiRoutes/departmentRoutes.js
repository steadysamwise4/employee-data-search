require('console.table');
const db = require('../../db/connection');
const { promptMenu } = require('../../prompts/promptMenu');
const inputCheck = require('../../utils/inputCheck');

// Get all departments
const viewDepartments = function() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        console.table(rows);
        promptMenu();
        });
    };


module.exports = { viewDepartments };