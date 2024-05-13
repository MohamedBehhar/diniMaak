-- Create a new database
CREATE DATABASE IF NOT EXISTS TODO_DB;

-- Connect to the newly created database
\c TODO_DB;

-- Car table
CREATE TABLE IF NOT EXISTS cars (
    car_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    brand VARCHAR (50) NOT NULL,
    year INT NOT NULL,
    plate VARCHAR (50),
    image VARCHAR (250),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create a table for most known car brands
CREATE TABLE IF NOT EXISTS cars_brands (
    id SERIAL PRIMARY KEY,
    label VARCHAR (50) NOT NULL
);

-- Create user roles enum
CREATE TYPE role AS ENUM ('driver', 'passenger');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (50) NOT NULL UNIQUE,
    phone_number VARCHAR (50) UNIQUE,
    password VARCHAR (250) NOT NULL,
    email VARCHAR (100) NOT NULL UNIQUE,
    refresh_token VARCHAR (250),
    profile_picture VARCHAR (250),
    rating INT,
    role role DEFAULT 'passenger',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create carpooling status enum
CREATE TYPE bookingStatus AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'canceled',
    'confirmed',
    'completed'
);

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

-- Create tables for carpooling
CREATE TABLE IF NOT EXISTS carpooling (
    id SERIAL PRIMARY KEY,
    publisher_id INT NOT NULL,
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
    FOREIGN KEY (publisher_id) REFERENCES users (id)
);

-- Create requesters table
CREATE TABLE IF NOT EXISTS requesters (
    id SERIAL PRIMARY KEY,
    carpooling_id INT NOT NULL,
    requester_id INT NOT NULL,
    number_of_seats INT NOT NULL,
    status bookingStatus DEFAULT 'pending',
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id),
    FOREIGN KEY (requester_id) REFERENCES users (id)
);

-- Create a table for notifications
CREATE TYPE notifications_type AS ENUM (
    'rating',
    'comment',
    'newBookingRequest',
    'bookingConfirmed',
    'bookingCanceled',
    'requestAccepted',
    'requestRejected',
    'requestCanceled',
    'chat',
    'carpoolingPublished'
);

CREATE TYPE notification_status AS ENUM ('unread', 'read');

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR(250) NOT NULL,
    notifications_type notifications_type NOT NULL,
    notification_status notification_status DEFAULT 'unread',
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Create a table for chat
CREATE TABLE IF NOT EXISTS chat (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR (250) NOT NULL,
    status notification_status DEFAULT 'unread',
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
);

-- Create a table for rating
CREATE TABLE IF NOT EXISTS rating (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    rating INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id)
);

-- Create a table for comment
CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    carpooling_id INT NOT NULL,
    comment VARCHAR (250) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (carpooling_id) REFERENCES carpooling (id)
);

-- Create a Moroccan cities table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    label VARCHAR (50) NOT NULL
);

-- Insert some Moroccan cities into the cities table only once
INSERT INTO
    cities (label)
SELECT
    label
FROM
    (
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
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            cities
    );

-- Insert some car brands into the cars_brands table only once
INSERT INTO
    cars_brands (label)
SELECT
    label
FROM
    (
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
WHERE
    NOT EXISTS (
        SELECT
            1
        FROM
            cars_brands
    );
