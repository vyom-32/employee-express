CREATE TABLE `Departments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `status` ENUM('Active', 'InActive'),
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO `Departments` (`name`, `status`) VALUES
('Human Resources', 'Active'),
('Finance', 'Active'),
('Engineering', 'Active'),
('Sales', 'Active'),
('Marketing', 'Active');


CREATE TABLE `Employees` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `department_id` INT,
    `dob` DATE,
    `phone` VARCHAR(255),
    `email` VARCHAR(255),
    `salary` INT,
    `photo` VARCHAR(255),
    `status` ENUM('Active', 'InActive'),
    `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`department_id`) REFERENCES `Departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);


