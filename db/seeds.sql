INSERT INTO departments (name)
VALUES
  ('Marketing'),
  ('Human Resources'),
  ('Executive'),
  ('Sales'),
  ('IT');

INSERT INTO roles (job_title, salary, department_id)
VALUES
  ('CEO', '300000', 3),
  ('CFO', '200000', 3),
  ('Sales Associate', '100000', 4),
  ('Frontend Developer', '220000', 5),
  ('Backend Developer', '250000', 5),
  ('Acquisition Manager', '90000', 2),
  ('Cloud Engineer', '140000', 5),
  ('Advertising Associate', '95000', 1),
  ('System Adminstrator', '120000', 5),
  ('COO', '200000', 3),
  ('Maket Researcher', '250000', 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 3, NULL),
  ('Virginia', 'Woolf', 3, NULL),
  ('Piers', 'Gaveston', 3, NULL),
  ('Charles', 'LeRoi', 2, 1),
  ('Katherine', 'Mansfield', 2, 1),
  ('Dora', 'Carrington', 4, 0),
  ('Edward', 'Bellamy', 4, 0),
  ('Montague', 'Summers', 1, 1),
  ('Octavia', 'Butler', 5, 1),
  ('Unica', 'Zurn', 5, 1);    