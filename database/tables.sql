CREATE DATABASE myDB
GO
USE myDB;

CREATE TABLE USERS
(
    username VARCHAR (20) Primary Key,
    password VARCHAR (20) NOT NULL,
);


CREATE TABLE fan
(
    national_id varchar(20) Primary Key,
    fan_name VARCHAR
 (20),
    birth_date DATEtime,
    fan_address VARCHAR
 (20),
    phone_number VARCHAR
 (20),
    fan_status BIT,
    username VARCHAR
 (20),
    FOREIGN KEY (username) REFERENCES USERS (username)

);


CREATE TABLE stadium
(
    stadium_id INT IDENTITY(1,1) Primary Key,
    stadium_name VARCHAR
 (20),
    stadium_location VARCHAR
 (20),
    stadium_capacity INT,
    stadium_status BIT
);


CREATE TABLE club
(
    club_id INT IDENTITY(1,1) Primary Key,
    club_name VARCHAR
 (20),
    club_location VARCHAR
 (20),
);

CREATE TABLE stadium_manager
(
    stadium_manger_id INT IDENTITY(1,1) Primary Key,
    stadium_manager_name VARCHAR
 (20),
    stadium_id INT,
    username VARCHAR
 (20),
    FOREIGN KEY (username) REFERENCES USERS (username),
    FOREIGN KEY (stadium_id) REFERENCES stadium (stadium_id)
);


CREATE TABLE club_representative
(
    representative_id INT IDENTITY(1,1) Primary Key,
    representative_name VARCHAR
 (20),
    club_id INT,
    username VARCHAR
 (20),
    FOREIGN KEY (username) REFERENCES USERS (username),
    FOREIGN KEY (club_id) REFERENCES club (club_id)
);

CREATE TABLE association_manger
(
    association_manger_id INT IDENTITY(1,1) Primary Key,
    association_manger_name VARCHAR
 (20),
    username VARCHAR
 (20),
    FOREIGN KEY (username) REFERENCES USERS (username)
);


CREATE TABLE system_admin
(
    admin_id INT IDENTITY(1,1) Primary Key,
    admin_name VARCHAR
 (20),
    username VARCHAR
 (20),
    FOREIGN KEY (username) REFERENCES USERS (username)
);


CREATE TABLE match
(
    match_id INT IDENTITY(1,1) Primary Key,
    start_time datetime,
    end_time datetime,
    host_club_id INT,
    guest_club_id INT,
    stadium_id INT,
    FOREIGN KEY (stadium_id) REFERENCES stadium (stadium_id),
    FOREIGN KEY (host_club_id) REFERENCES club (club_id),
    FOREIGN KEY (guest_club_id) REFERENCES club (club_id)
);

CREATE TABLE ticket
(
    ticket_id INT IDENTITY(1,1) Primary Key,
    ticket_status BIT,
    match_id INT,
    FOREIGN KEY (match_id) REFERENCES match (match_id)
);


CREATE TABLE host_request
(
    request_id INT IDENTITY(1,1) Primary Key,
    representative_id INT,
    manger_id INT,
    match_id INT,
    request_status varchar(20) default 'unhandled',
    FOREIGN KEY (representative_id) REFERENCES club_representative (representative_id),
    FOREIGN KEY (manger_id) REFERENCES stadium_manager (stadium_manger_id),
    FOREIGN KEY (match_id) REFERENCES match (match_id)
);



CREATE TABLE ticket_buying_transactions
(
    ticket_id INT,
    fan_id varchar(20),
    FOREIGN KEY (ticket_id) REFERENCES ticket (ticket_id) on  delete cascade,
    FOREIGN KEY (fan_id) REFERENCES fan (national_id)
);