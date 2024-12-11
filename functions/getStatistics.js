const db = require('../db/db')

const getStatistics = async () => {
    let [rangeWiseCount] = await db.execute(
        `SELECT 
        CASE 
            WHEN salary <= 50000 THEN '0-50000'
            WHEN salary > 50000 AND salary <= 100000 THEN '50001-100000'
            ELSE '100000+'
        END AS salary_range, COUNT(*) AS count
    FROM Employees
    GROUP BY salary_range`
    )

    rangeWiseCount = rangeWiseCount.reduce(
        (acc, curr) => ({ ...acc, [curr.salary_range]: curr.count }),
        {},
    );

    const [departmentWiseHighestSalary] = await db.execute(
        `SELECT d.name AS department, MAX(e.salary) AS highest_salary
    FROM Employees e
    JOIN Departments d ON e.department_id = d.id
    GROUP BY d.name`
    );

    const [departmentWiseYougestEmployees] = await db.execute(
        `SELECT 
        d.name AS department_name,
        e.name,
        TIMESTAMPDIFF(YEAR, e.dob, NOW()) AS age
    FROM 
        Employees e
    INNER JOIN 
        Departments d
    ON 
        e.department_id = d.id
    WHERE 
        e.dob = (
            SELECT MAX(dob) 
            FROM Employees 
            WHERE department_id = e.department_id
        )
    ORDER BY 
        d.name;`
    );
    return {
        departmentWiseHighestSalary,
        departmentWiseYougestEmployees,
        rangeWiseCount
    }
}

module.exports = getStatistics