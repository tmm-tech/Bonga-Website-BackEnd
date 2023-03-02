

-- Create the database
CREATE DATABASE bonga_website;

-- Use the database
USE bonga_website;

-- CREATE SCHEMA
CREATE SCHEMA bonga

-- Create the users table
CREATE TABLE bonga.users (
    user_id INT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    profile_image_url VARCHAR(255) NOT NULL,
    passwords VARCHAR(255) NOT NULL,
);

-- Create the posts table
CREATE TABLE bonga.posts (
    post_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    post_content TEXT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES bonga.users(user_id)
);

-- Create the notifications table
CREATE TABLE bonga.notifications (
    notification_id INT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES bonga.users(user_id)
);

-- Create the messages table
CREATE TABLE bonga.messages (
    message_id INT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES bonga.users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES bonga.users(user_id)
);


