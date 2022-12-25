USE myDB

INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Ahly', 'Cairo')
INSERT INTO club
    ( club_name, club_location)
VALUES
    ('Zamalek', 'Cairo')

INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Cairo Stadium', 'Cairo', 10000, 1)
INSERT INTO stadium
    ( stadium_name, stadium_location, stadium_capacity, stadium_status)
VALUES
    ('Alex Stadium', 'Alex', 10000, 1)

INSERT INTO match
    (start_time, end_time, host_club_id, guest_club_id, stadium_id)
VALUES
    ('2019-01-01 12:00:00', '2019-01-01 13:00:00', 1, 2, 1)

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


