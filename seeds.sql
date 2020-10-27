USE employees_db;

INSERT INTO department (name)
VALUES ("Marketing"), ("Accounting"), ("Human Resources");

INSERT INTO role (title, department_id)
VALUES ("Marketing Agent", 1), ("Accounting Lead", 2), ("HR Rep", 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Debra", "Blog", 1, 2), ("Justin", "Farnan", 3, 4), ("Sarah", "Epstein", 5, null);