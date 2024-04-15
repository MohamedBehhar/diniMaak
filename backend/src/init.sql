-- Create a new database
CREATE DATABASE TODO_DB;

-- Connect to the newly created database
\c TODO_DB;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250) NOT NULL,
	refresh_token VARCHAR(250)
);


