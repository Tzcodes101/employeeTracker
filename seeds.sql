USE employees_db;

INSERT INTO department (name)
VALUES ("Marketing"), ("Accounting"), ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Agent", 200000, 1), ("Accounting Lead", 100000, 2), ("HR Rep", 90000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Debra", "Blog", 1, 2), ("Justin", "Farnan", 2, 4), ("Sarah", "Epstein", 3, null);