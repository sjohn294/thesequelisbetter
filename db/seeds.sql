INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");


INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

       INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, 1),
       ("Kevin", "Tupik", 4, 1),
       ("Kunal", "Singh", 5, 1),
       ("Malia", "Brown", 6, 1),
       ("Sarah", "Lourd", 7, 1);
       
