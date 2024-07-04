-- Create the database
CREATE DATABASE TODO_DB;

-- Connect to the newly created database
\c TODO_DB;

-- Create user roles enum
CREATE TYPE role AS ENUM ('driver', 'passenger');

-- Create carpooling status enum
CREATE TYPE bookingStatus AS ENUM ('pending', 'accepted', 'rejected', 'canceled', 'confirmed', 'completed');

-- Create notifications type enum
CREATE TYPE notifications_type AS ENUM ('rating', 'comment', 'newBookingRequest', 'bookingConfirmed', 'bookingCanceled', 'requestAccepted', 'requestRejected', 'requestCanceled', 'chat', 'carpoolingPublished', 'carpoolingDeleted');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (50) NOT NULL UNIQUE,
    phone_number VARCHAR (50) NOT NULL UNIQUE,
    password VARCHAR (250) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    refresh_token VARCHAR (250),
    profile_picture VARCHAR (250),
    rating INT,
    role role DEFAULT 'passenger',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    car_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    brand VARCHAR (50) NOT NULL,
    year INT NOT NULL,
    plate VARCHAR (50),
    image VARCHAR (250),
    FOREIGN KEY (user_id) REFERENCES users (id)
);


-- Create cars_brands table
CREATE TABLE IF NOT EXISTS cars_brands (
    id SERIAL PRIMARY KEY,
    label VARCHAR (50) NOT NULL
);

-- Create carpooling table
CREATE TABLE IF NOT EXISTS carpooling (
    id SERIAL PRIMARY KEY,
    publisher_id INT NOT NULL,
    car_id INT NOT NULL,
    departure VARCHAR (50) NOT NULL,
    destination VARCHAR (50) NOT NULL,
    departure_day TIMESTAMP,
    departure_time TIME NOT NULL,
    number_of_seats INT NOT NULL,
    available_seats INT NOT NULL,
    price INT NOT NULL,
    driver_name VARCHAR (50) NOT NULL,
    confirmed_passengers INTEGER [],
    booking_requests_ids INTEGER [],
    FOREIGN KEY (publisher_id) REFERENCES users (id),
    FOREIGN KEY (car_id) REFERENCES cars (car_id)
);


-- REMAINDERS TABLE 
CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    destination VARCHAR (50) NOT NULL,
    departure VARCHAR (50) NOT NULL,
    is_reminded BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

ALTER TABLE reminders ADD CONSTRAINT reminders_unique_constraint UNIQUE (user_id, destination, departure);

-- Create booking table
CREATE TABLE IF NOT EXISTS booking (
    booking_id SERIAL PRIMARY KEY,
    publisher_id INT NOT NULL,
    requester_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    requested_seats INT NOT NULL,
    status bookingStatus DEFAULT 'pending',
    FOREIGN KEY (publisher_id) REFERENCES users (id),
    FOREIGN KEY (requester_id) REFERENCES users (id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id)
);


-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR(250) NOT NULL,
    carpooling_id INT,
    notifications_type notifications_type NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Create conversations table without the foreign key constraint on last_message_id
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    carpooling_id INT REFERENCES carpooling(id),
    user1_id INT REFERENCES users(id),
    user2_id INT REFERENCES users(id),
    last_message_id INT -- This will be added as a foreign key later
);

-- Create messages table with the foreign key constraint on conversation_id
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    is_read BOOLEAN DEFAULT FALSE,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    conversation_id INT REFERENCES conversations(id)
);

-- Alter conversations table to add the foreign key constraint on last_message_id
ALTER TABLE conversations
ADD CONSTRAINT fk_last_message
FOREIGN KEY (last_message_id) REFERENCES messages(id);


-- Create user_conversations table
CREATE TABLE IF NOT EXISTS user_conversations (
    user_id INT REFERENCES users(id),
    conversation_id INT REFERENCES conversations(id),
    PRIMARY KEY (user_id, conversation_id)
);

-- Create rating table
CREATE TABLE IF NOT EXISTS rating (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id)
);

-- Create comment table
CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    comment VARCHAR (250) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id)
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    label VARCHAR (50) NOT NULL
);

-- Insert some Moroccan cities into the cities table only once
INSERT INTO cities (label)
SELECT label
FROM (
    VALUES
        ('Casablanca'),
        ('Rabat'),
        ('Tanger'),
        ('Fes'),
        ('Marrakech'),
        ('Agadir'),
        ('Oujda'),
        ('Kenitra'),
        ('Tetouan'),
        ('Safi'),
        ('El Jadida'),
        ('Nador'),
        ('Beni Mellal'),
        ('Khouribga'),
        ('Taza'),
        ('Mohammedia'),
        ('Khemisset'),
        ('Taourirt'),
        ('Berrech'),
        ('Ouarzazate'),
        ('Larache'),
        ('Settat'),
        ('Ksar El Kebir'),
        ('Guelmim'),
        ('Tiznit')
) AS cities(label)
WHERE NOT EXISTS (
    SELECT 1
    FROM cities
    WHERE cities.label = cities.label
);

-- Insert some car brands into the cars_brands table only once
INSERT INTO cars_brands (label)
SELECT label
FROM (
    VALUES
        ('Audi'),
        ('BMW'),
        ('Chevrolet'),
        ('Citroen'),
        ('Dacia'),
        ('Fiat'),
        ('Ford'),
        ('Honda'),
        ('Hyundai'),
        ('Jeep'),
        ('Kia'),
        ('Land Rover'),
        ('Mazda'),
        ('Mercedes'),
        ('Mitsubishi'),
        ('Nissan'),
        ('Opel'),
        ('Peugeot'),
        ('Renault'),
        ('Seat'),
        ('Skoda'),
        ('Suzuki'),
        ('Toyota'),
        ('Volkswagen'),
        ('Volvo')
) AS cars_brands(label)
WHERE NOT EXISTS (
    SELECT 1
    FROM cars_brands
    WHERE cars_brands.label = cars_brands.label
);

