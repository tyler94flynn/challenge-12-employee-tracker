INSERT INTO department (name)
VALUES 
    ("Director"),
    ("Art-Department"),
    ("Camera-Department");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Director", 34.46, 1),
    ("Dresser", 32.22, 2),
    ("Prop Maker", 22.00, 2),
    ("Makeup Artist", 24.79, 2),
    ("Camera Operator", 25.51,3),
    ("Digital Image Technician", 23.00, 3);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 

    ('Quentin', 'Tarantino', 1, NULL),
    ('Steven', 'Spielberg', 1, NULL),
    ('George', 'Lucas', 1, NULL),
    ('Clint', 'Eastwood', 5, 2),
    ('Tom', 'Hanks', 6, 3),
    ('Will', 'Smith', 2, 2),
    ('Scarlett', 'Johansson', 5, 2),
    ('Leonardo', 'DiCaprio', 4, 1),
    ('Tom', 'Cruise', 6, 2),
    ('Johnny', 'Depp', 3, 3),
    ('Bradd', 'Pitt', 3, 1),
    ('Harrison', 'Ford', 5 ,3),
    ('Samuel L', 'Jackson', 6, 1),
    ('Ellen', 'DeGeneres', 3, 2),
    ('Kim', 'Kardasian', 2, 2),
    ('George', 'Clooney', 4, 2),
    ('Keanu', 'Reeves', 6, 2),
    ('Ryan', 'Reynalds', 2, 1),
    ('Robert', 'Downey Jr.', 6, 1),
    ('Nicolas', 'Cage', 4, 3),
    ('John', 'Cena', 5, 3),
    ('Dwayne', 'Johnson', 5, 3),
    ('Jared', 'Leto', 4, 2),
    ('Joaquin', 'Pheonix', 4, 2),
    ('Heath', 'Ledger', 4, 3);
