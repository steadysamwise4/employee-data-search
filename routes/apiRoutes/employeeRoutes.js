` SELECT employee.id, employee.last_name, employee.first_name, job_title.title AS job_title, department.department_name AS department, job_title.salary AS salary, manager.name AS manager_name FROM employee LEFT JOIN job_title ON employee.job_title_id = job_title.id LEFT JOIN department ON job_title.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id ORDER BY employee.last_name;`