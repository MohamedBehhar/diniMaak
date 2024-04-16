-- Create a new database
CREATE DATABASE TODO_DB;

-- Connect to the newly created database
\c TODO_DB;

-- Create tables
CREATE TABLE
IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR
(50) NOT NULL,
    password VARCHAR
(250) NOT NULL,
	refresh_token VARCHAR
(250)
    rating INT
);

--  create a table for carpooling when each user can create many carpooling
CREATE TABLE
IF NOT EXISTS carpooling
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    departure VARCHAR
(50) NOT NULL,
    destination VARCHAR
(50) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    number_of_seats INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- create a table for booking when each user can book many carpooling
CREATE TABLE
IF NOT EXISTS booking
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling(id)
);

-- create a table for rating when each user can rate many carpooling
CREATE TABLE
IF NOT EXISTS rating
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling(id)
);

-- create a table for comment when each user can comment many carpooling
CREATE TABLE
IF NOT EXISTS comment
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    comment VARCHAR
(250) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling(id)
);

-- create a table for notification when each user can have many notifications
CREATE TABLE
IF NOT EXISTS notification
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR
(250) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- create a table for chat when each user can chat with another user
CREATE TABLE
IF NOT EXISTS chat
(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR
(250) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- create a moroccan cities table
CREATE TABLE
IF NOT EXISTS cities
(
    id SERIAL PRIMARY KEY,
    name VARCHAR
(50) NOT NULL
);

-- insert some moroccan cities into the cities table only once
INSERT INTO cities (name) VALUES ('Casablanca'), ('Rabat'), ('Tanger'), ('Fes'), ('Marrakech'), ('Agadir'), ('Oujda'),
('Kenitra'), ('Tetouan'), ('Safi'), ('El Jadida'), ('Nador'), ('Beni Mellal'), ('Khouribga'), ('Taza'), ('Mohammedia'),
('Khemisset'), ('Taourirt'), ('Berrech'), ('Ouarzazate'), ('Larache'), ('Settat'), ('Ksar El Kebir'), ('Guelmim'),
('Tiznit'), ('Lagouira'), ('Dakhla'), ('Tantan'), ('Sidi Ifni')