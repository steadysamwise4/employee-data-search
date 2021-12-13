const connection = require('./connection');
class Dept {
    constructor(connection) {
        this.connection = connection 
    }

    getDepartments() {
        return this.connection.promise().query(
            `SELECT * FROM department`
        )
    }

    addDepartment(name) {
        return this.connection.promise().query(
            `INSERT INTO department (department_name) VALUES (?)`,
            name
        )
    }
}

module.exports = new Dept(connection)