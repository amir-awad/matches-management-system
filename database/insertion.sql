USE myDB

GO

-- Inert data into all tables in the myDB database
INSERT INTO USERS
VALUES
    ('Amir', 'Amir1234')
INSERT INTO USERS
VALUES
    ('Ahmed', 'Ahmed1234')
INSERT INTO USERS
VALUES
    ('Mohamed', 'Mohamed1234')
INSERT INTO USERS
VALUES
    ('Ali', 'Ali1234')
INSERT INTO USERS
VALUES
    ('Hassan', 'Hassan1234')


INSERT INTO fan
VALUES
    ('123456789', 'Ahmed', '1999-01-01', 'Cairo', '01000000000', 1, 'Ahmed')
INSERT INTO fan
VALUES
    ('987654321', 'Ali', '1999-01-01', 'Cairo', '01000000000', 1, 'Ali')
INSERT INTO fan
VALUES
    ('123456789', 'Mohamed', '1999-01-01', 'Cairo', '01000000000', 1, 'Mohamed')
INSERT INTO fan
VALUES
    ('987654321', 'Hassan', '1999-01-01', 'Cairo', '01000000000', 1, 'Hassan')
INSERT INTO fan
VALUES
    ('123456789', 'Amir', '1999-01-01', 'Cairo', '01000000000', 1, 'Amir')

INSERT INTO stadim
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Cairo Stadium', 'Cairo', 10000, 1)
INSERT INTO stadim
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Alex Stadium', 'Alex', 10000, 1)
INSERT INTO stadim
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Giza Stadium', 'Giza', 10000, 1)
INSERT INTO stadim
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Aswan Stadium', 'Aswan', 10000, 1)
INSERT INTO stadim
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Luxor Stadium', 'Luxor', 10000, 1)

INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Ahly', 'Cairo')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Zamalek', 'Cairo')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Al Ahly', 'Alex')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Al Masry', 'Alex')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Al Ittihad', 'Giza')

INSERT INTO stadium_manager
    ( stadium_manager_name, stadium_id, username)
VALUES
    ('Ahmed', 1, 'Ahmed')
INSERT INTO stadium_manager
    ( stadium_manager_name, stadium_id, username)
VALUES
    ('Ali', 2, 'Ali')
INSERT INTO stadium_manager
    ( stadium_manager_name, stadium_id, username)
VALUES
    ('Mohamed', 3, 'Mohamed')
INSERT INTO stadium_manager
    ( stadium_manager_name, stadium_id, username)
VALUES
    ('Hassan', 4, 'Hassan')
INSERT INTO stadium_manager
    ( stadium_manager_name, stadium_id, username)
VALUES
    ('Amir', 5, 'Amir')

INSERT INTO club_representative
    ( representative_name, club_id, username)
VALUES
    ('Ahmed', 1, 'Ahmed')
INSERT INTO club_representative
    ( representative_name, club_id, username)
VALUES
    ('Ali', 2, 'Ali')
INSERT INTO club_representative
    ( representative_name, club_id, username)
VALUES
    ('Mohamed', 3, 'Mohamed')
INSERT INTO club_representative
    ( representative_name, club_id, username)
VALUES
    ('Hassan', 4, 'Hassan')
INSERT INTO club_representative
    ( representative_name, club_id, username)
VALUES
    ('Amir', 5, 'Amir')

INSERT INTO association_manger
    ( association_manger_name, username)
VALUES
    ('Ahmed', 'Ahmed')
INSERT INTO association_manger
    ( association_manger_name, username)
VALUES
    ('Ali', 'Ali')
INSERT INTO association_manger
    ( association_manger_name, username)
VALUES
    ('Mohamed', 'Mohamed')
INSERT INTO association_manger
    ( association_manger_name, username)
VALUES
    ('Hassan', 'Hassan')
INSERT INTO association_manger
    ( association_manger_name, username)
VALUES
    ('Amir', 'Amir')

INSERT INTO system_admin
    ( system_admin_name, username)
VALUES
    ('Ahmed', 'Ahmed')
INSERT INTO system_admin
    ( system_admin_name, username)
VALUES
    ('Ali', 'Ali')

INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2020-01-01 12:00:00', '2020-01-01 13:00:00', 1, 2, 1)
INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2020-01-01 12:00:00', '2020-01-01 13:00:00', 3, 4, 2)

INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 1)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 1)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 1)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 1)

INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 2)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 2)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 2)

INSERT INTO host_request
    (representative_id, manger_id, match_id, request_status)
VALUES
    (1, 1, 1, 'unhandled')
INSERT INTO host_request
    (representative_id, manger_id, match_id, request_status)
VALUES
    (2, 2, 2, 'unhandled')

