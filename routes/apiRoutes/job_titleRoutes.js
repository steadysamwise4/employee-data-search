const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all job_titles
router.get('/job_titles', (req, res) => {
    const sql = `SELECT job_title.title, job_title.id, department.department_name 
                 AS department_name, job_title.salary 
                 FROM job_title
                 LEFT JOIN department
                 ON job_title.department_id = department.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = router;