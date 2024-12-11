const express = require('express');
const db = require('../db/db');
const getStatistics = require('../functions/getStatistics');

const router = express.Router();

router.post('/employee-count', async (_, res) => {
    try {
        const [count] = await db.execute('SELECT COUNT(*) as count FROM Employees');
        res.json(count[0].count);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee count', error });
    }
});

router.post('/employee-list', async (req, res) => {
    const { skip, limit } = req.body;
    try {
        const [result] = await db.execute(
            `SELECT 
          e.id,
          e.name AS name,
          d.name AS department_name,
          DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob ,
          e.phone,
          e.email,
          e.salary,
          e.photo,
          e.status,
          e.created,
          e.modified
      FROM 
          Employees e
      LEFT JOIN 
          Departments d ON e.department_id = d.id
      LIMIT ${limit} OFFSET ${skip}`
        );
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee list', error });
    }
});

router.post('/create-employee', async (req, res) => {
    const { name, dob, phone, email, salary, department_id, photo } = req.body;
    if (!name || !dob || !phone || !email || !salary || !department_id) {
        return res.status(400).json({
            message: 'Name, DOB, phone, email, department_id and salary are required.',
        });
    }
    try {
        await db.execute(
            `INSERT INTO Employees (name, dob, phone, email, salary, status, department_id, photo) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, dob, phone, email, salary, 'Active', department_id, photo || null]
        );
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error });
    }
});

router.get('/employee-details/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        const [result] = await db.execute(`SELECT 
          e.id,
          e.name AS name,
          d.name AS department_name,
          e.department_id,
          DATE_FORMAT(e.dob, '%Y-%m-%d') AS dob ,
          e.phone,
          e.email,
          e.salary,
          e.photo,
          e.status,
          e.created,
          e.modified
      FROM 
          Employees e
      LEFT JOIN 
          Departments d ON e.department_id = d.id
      WHERE e.id = ${id}`);
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee details', error });
    }
});

router.post('/update-employee', async (req, res) => {
    const { id, name, dob, phone, email, salary, status, department_id, photo } = req.body;
    const updateData = {};
    if (salary) updateData.salary = salary;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (dob) updateData.dob = dob;
    if (department_id) updateData.department_id = department_id;
    if (photo) updateData.photo = photo;
    if (!id) {
        return res.status(400).json({ message: 'Id is required' });
    }

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: 'Invalid data to update' });
    }

    const setClause = Object.keys(updateData)
        .map(key => `${key} = ?`)
        .join(', ');

    try {
        await db.execute(`UPDATE Employees SET ${setClause} WHERE id = ?`, [
            ...Object.values(updateData),
            id
        ]);
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error });
    }
});

router.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    try {
        await db.execute('DELETE FROM Employees WHERE id = ?', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
});

router.get('/statistics', async (req, res) => {
    const statistics = await getStatistics()

    res.json(statistics);
});

router.get('/department-list', async (req, res) => {
    const [result] = await db.execute('SELECT * FROM Departments');
    res.json(result);
});


module.exports = router;