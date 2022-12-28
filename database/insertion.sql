USE myDB

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
    ('Real Madrid', 'Madrid')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Barcelona', 'Barcelona')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Manchester United', 'Manchester')

INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Cairo Stadium', 'Cairo', 10000, 1)
INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Alex Stadium', 'Alex', 10000, 1)
INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Madrid Stadium', 'Madrid', 10000, 1)
INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Barcelona Stadium', 'Barcelona', 10000, 1)
INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Manchester Stadium', 'Manchester', 10000, 1)


Insert INTO users
    (username,password)
VALUES
    ("admin", "admin")
Insert INTO system_admin
VALUES
    ("admin", "admin")

INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2019-01-01 12:00:00', '2019-01-01 13:00:00', 1, 2, 1)
INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2020-01-01 12:00:00', '2020-01-01 13:00:00', 3, 4, 3)
INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2023-01-01 12:00:00', '2023-01-01 13:00:00', 5, 1, NULL)
INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2023-01-01 12:00:00', ' 2023-01-01 13:00:00', 2, 3, NULL)


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


INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 3)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 3)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 3)


INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 4)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 4)
INSERT INTO ticket
    (ticket_status, match_id)
VALUES
    (1, 4)




