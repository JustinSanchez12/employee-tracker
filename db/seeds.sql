INSERT INTO department(name)
VALUES 
    ("Engineering"),
    ("Finance"),
    ("Human Resources"),
    ("Sales"),
    ("Information Technology"),
    ("Manufacturing");

INSERT INTO role(department_id, title, salary)
VALUES
    (1, "Hardware Engineering", 125000.40),
    (2, "Senior Accountaant", 115400.50),
    (3, "HR Manaager", 95000),
    (4, "Jr Sales Associate", 85000),
    (5, "Network Engineer", 100000),
    (6, "Test Engineering Technician", 90000);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
    ("Jihyo", "Park", 1, 1),
    ("Nayeon", "Im", 2, 2),
    ("Momo", "Hirai", 3, 3),
    ("Mina", "Myoui", 4, 4);
    