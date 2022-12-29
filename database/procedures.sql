USE myDB
GO

CREATE PROCEDURE FanRegister
    @name varchar(20),
    @username varchar(20),
    @password varchar(20),
    @national_id varchar(20),
    @birth_date datetime,
    @fan_address varchar(20),
    @phone_number INT
AS
if not exists (select username
from USERS
where @username = USERS.username)
begin
    INSERT INTO USERS
    VALUES(@username, @password)
    INSERT INTO fan
        (fan_name, national_id, birth_date, fan_address, phone_number, fan_status, username)
    VALUES(@name, @national_id, @birth_date, @fan_address, @phone_number, 1, @username)
end
else
begin
    RAISERROR('Email already exists', 16, 1)
end

GO

CREATE PROCEDURE FanViewMatchesWithAvailableTicketsStartingGivenDate
    @date datetime
AS
SELECT C1.club_name AS HostClub, C2.club_name AS GuestClub, S.stadium_name, S.stadium_location, M.start_time
FROM match M
    JOIN club C1 ON M.host_club_id = C1.club_id
    JOIN club C2 ON M.guest_club_id = C2.club_id
    JOIN stadium S ON M.stadium_id = S.stadium_id
WHERE M.start_time >= @date
    AND M.match_id IN (SELECT match_id
    FROM ticket
    WHERE ticket_status = 1)
GO





CREATE PROCEDURE clubfinder
    @club_name varchar(20),
    @club_id int output
AS
select @club_id = club.club_id
from club
where @club_name = club.club_name
go

CREATE PROCEDURE matchfinder
    @host_club_id int,
    @guest_club_id int,
    @start datetime,
    @match_id int output
AS
select @match_id = match.match_id
from match
where @host_club_id = match.host_club_id
    and @guest_club_id = match.guest_club_id
    and @start = match.start_time
go

CREATE PROCEDURE  FanPurchaseTicket
    @national_id varchar(20),
    @host_club varchar(20),
    @guest_club varchar(20),
    @start datetime
AS
DECLARE @h_id int
EXEC clubfinder @host_club, @h_id output
DECLARE @g_id int
EXEC clubfinder @guest_club, @g_id output
DECLARE @m_id int
EXEC matchfinder @h_id,@g_id,@start, @m_id output
Declare @t_id int
SET @t_id = (SELECT TOP(1)
    ticket_id
FROM ticket
WHERE match_id=@m_id and ticket_status = 1)
PRINT @t_id
DECLARE @fan varchar (20)
SET @fan = (select fan_name
from fan
where fan.national_id = @national_id and fan_status = 1)
PRINT @fan
if (@fan IS NOT NULL AND @t_id IS NOT null)

begin
    PRINT @t_id
    INSERT INTO ticket_buying_transactions
        (ticket_id,fan_id)
    VALUES
        (@t_id, @national_id)
    update ticket
set ticket_status = 0 where ticket_id = @t_id
end
go


CREATE PROCEDURE FanNationalIdFinder
    @username varchar(20),
    @national_id varchar(20) output
AS
select @national_id = fan.national_id
from fan
where @username = fan.username
go



CREATE PROCEDURE StadiumManagerRegister
    @name varchar(20),
    @username varchar(20),
    @password varchar(20),
    @stadium_name varchar(20)
AS
if not exists (select username
from USERS
where @username = USERS.username)
begin
    INSERT INTO USERS
    VALUES(@username, @password)
    INSERT INTO stadium_manager
        (stadium_manager_name,stadium_id, username)
    VALUES(@name, (SELECT stadium_id
            FROM stadium
            WHERE stadium_name= @stadium_name), @username)
end
else
begin
    RAISERROR('Email already exists', 16, 1)
end

go

CREATE PROCEDURE StadiumManagerViewRelatedInfoOfHisStadium
    @username varchar(20)
AS
SELECT *
FROM stadium
WHERE stadium_id = (SELECT stadium_id
FROM stadium_manager
WHERE username = @username)
go

-- View all requests he already received (in a form of name of the sending club representative, name
-- of the host club of the requested match, name of the guest club of the requested match ,start time
-- of the match, end time of the match and the staus of the request).
--  

CREATE PROCEDURE StadiumManagerViewRequestsHeReceived
    @username varchar(20)
AS
SELECT club_representative.representative_name, C1.club_name, C2.club_name, match.start_time, match.end_time, host_request.request_status
FROM host_request
    INNER JOIN match ON host_request.match_id = match.match_id
    INNER JOIN club_representative ON host_request.representative_id = club_representative.representative_id
    INNER JOIN club C1 ON match.host_club_id = C1.club_id
    INNER JOIN club C2 ON match.guest_club_id = C2.club_id
WHERE host_request.manager_id = (SELECT stadium_manager_id
FROM stadium_manager
WHERE username = @username)
go

CREATE PROCEDURE addticket
    @host_club varchar(20),
    @guest_club varchar(20),
    @start datetime
as
DECLARE @h_id int
EXEC clubfinder @host_club, @h_id output
DECLARE @g_id int
EXEC clubfinder @guest_club, @g_id output
DECLARE @m_id int
 = (select match_id
from match
where guest_club_id = @g_id and host_club_id = @h_id and start_time = @start)
insert into ticket
    (ticket_status,match_id)
VALUES
    (1, @m_id)
go

--  Accept an already sent unhandled request

create procedure StadiumManagerAcceptRequest
    @stadium_mang varchar(20),
    @host_club_name varchar(20),
    @guest_club_name varchar(20),
    @start datetime
as
declare @mang_id int, @h_id int, @g_id int, @m_id int,@s_id int

select @mang_id = stadium_manager.stadium_manager_id
from stadium_manager
where @stadium_mang = stadium_manager.username

exec clubfinder @host_club_name, @h_id output
exec clubfinder @guest_club_name, @g_id output

select @m_id = match.match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id and start_time = @start

select @s_id = stadium_id
from stadium_manager
where stadium_manager_id = @mang_id

declare @req_id int
select @req_id= h.request_id
from host_request h
where @mang_id = h.manager_id AND @m_id = h.match_id and h.request_status = 'pending'
update host_request 
set request_status = 'accepted'
where request_id = @req_id

update match
set match.stadium_id = @s_id
where match_id = @m_id
declare @i int = 0,@ticket_count int = (select stadium.stadium_capacity
from stadium
where @s_id = stadium_id)
while @i < @ticket_count
begin
    exec addticket @host_club_name ,@guest_club_name,@start
    set @i =@i+1
end

go


-- Reject an already sent unhandled request
create procedure StadiumManagerRejectRequest
    @stadium_mang varchar(20),
    @host_club_name varchar(20),
    @guest_club_name varchar(20),
    @start datetime
as
declare @mang_id int, @h_id int, @g_id int, @m_id int,@s_id int

select @mang_id = stadium_manager.stadium_manager_id
from stadium_manager
where @stadium_mang = stadium_manager.username

exec clubfinder @host_club_name, @h_id output
exec clubfinder @guest_club_name, @g_id output

select @m_id = match.match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id and start_time = @start

select @s_id = stadium_id
from stadium_manager
where stadium_manager_id = @mang_id

update host_request
set request_status = 'rejected'
where match_id = @m_id and manager_id = @mang_id
go

CREATE PROCEDURE ClubRepresentativeRegister
    @name varchar(20),
    @club_name varchar(20),
    @username varchar(20),
    @password varchar(20)
AS
if not exists (select username
from USERS
where @username = USERS.username)
begin
    INSERT INTO USERS
    VALUES(@username, @password)
    INSERT INTO club_representative
        (representative_name,club_id, username)
    VALUES(@name, (SELECT club_id
            FROM club
            WHERE club_name= @club_name), @username)
end
else
begin
    RAISERROR('Email already exists', 16, 1)
end

go

-- View All related info of his club
CREATE PROCEDURE ClubRepresentativeViewRelatedInfoOfHisClub
    @username varchar(20)
AS
SELECT *
FROM club
WHERE club_id = (SELECT club_id
FROM club_representative
WHERE username = @username)
go

-- View all upcoming matches for the club he is representing (in a form of host club name, guest club
-- name, start time and end time) with the stadium name that hosts the match (if available).
CREATE PROCEDURE ClubRepresentativeViewUpcomingMatchesForHisClub
    @username varchar(20)
AS
SELECT C1.club_name, C2.club_name, M.start_time, M.end_time, M.stadium_id
FROM match M, club C1, club C2
WHERE M.host_club_id = C1.club_id AND M.guest_club_id = C2.club_id AND M.start_time >= CURRENT_TIMESTAMP AND
    (M.host_club_id = (SELECT club_id
    FROM club_representative
    WHERE username = @username) OR M.guest_club_id = (SELECT club_id
    FROM club_representative
    WHERE username = @username))
go

-- Get the stadium name of the match with match id = @match_id and stadium_id = @stadium_id
CREATE PROCEDURE ClubRepresentativeGetStadiumNameOfMatch
    @stadium_id int
AS
SELECT stadium_name
FROM stadium
WHERE stadium_id = @stadium_id
go

-- View all available stadiums starting at a certain date (in a form of stadium name, location and
-- capacity).

CREATE PROCEDURE ClubRepresentativeViewAvailableStadiumsStartingAtCertainDate
    @username varchar(20),
    @date datetime
AS
SELECT S.stadium_name, S.stadium_location, S.stadium_capacity
FROM stadium S
WHERE S.stadium_id NOT IN (
    SELECT m.stadium_id
FROM match m
WHERE m.start_time >= @date AND m.stadium_id IS NOT NULL
)
go

-- Send a request to a stadium manager requesting to host an upcoming match his club is hosting.
CREATE PROCEDURE ClubRepresentativeSendRequestToStadiumManager
    @username varchar(20),
    @stadium_mang varchar(20),
    @host_club_name varchar(20),
    @guest_club_name varchar(20),
    @start datetime,
    @success bit output
AS
declare @mang_id int, @h_id int, @g_id int, @m_id int,@s_id int

select @mang_id = stadium_manager.stadium_manager_id
from stadium_manager
where @stadium_mang = stadium_manager.username

exec clubfinder @host_club_name, @h_id output
exec clubfinder @guest_club_name, @g_id output

select @m_id = match.match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id and start_time = @start

select @s_id = stadium_id
from stadium_manager
where stadium_manager_id = @mang_id

if not exists (select *
from host_request
where match_id = @m_id and manager_id = @mang_id)
begin
    INSERT INTO host_request
        (representative_id, manager_id, match_id, request_status)
    VALUES
        ((SELECT representative_id
            FROM club_representative
            WHERE username = @username), @mang_id, @m_id, 'pending')
    set @success = 1
end
else
begin
    set @success = 0
end
go

-- Get the stadium manager name given the stadium name
CREATE PROCEDURE ClubRepresentativeGetStadiumManagerNameGivenStadiumName
    @stadium_name varchar(20)
AS
SELECT stadium_manager_name
FROM stadium_manager
WHERE stadium_id = (SELECT stadium_id
FROM stadium
WHERE stadium_name = @stadium_name)
go


CREATE PROCEDURE AssociationManagerRegister
    @name varchar(20),
    @username varchar(20),
    @password varchar(20)
AS
if not exists (select username
from USERS
where @username = USERS.username)
begin
    INSERT INTO USERS
    VALUES(@username, @password)
    INSERT INTO association_manager
        (association_manager_name, username)
    VALUES(@name, @username)
end
else
begin
    RAISERROR('Email already exists', 16, 1)
end

go

CREATE PROCEDURE AssociationManagerAddNewMatch
    @host_club varchar(20),
    @guest_club varchar(20),
    @start datetime,
    @end datetime
as
DECLARE @h_id int
EXEC clubfinder @host_club, @h_id output
DECLARE @g_id int
EXEC clubfinder @guest_club, @g_id output
insert into match
    (start_time,end_time,host_club_id,guest_club_id)
VALUES
    (@start, @end, @h_id, @g_id)

go

CREATE PROCEDURE AssociationManagerDeleteMatch
    @host_club varchar(20),
    @guest_club varchar(20),
    @start datetime,
    @end datetime
as
DECLARE @h_id int
EXEC clubfinder @host_club, @h_id output
DECLARE @g_id int
EXEC clubfinder @guest_club, @g_id output
delete from match
where host_club_id = @h_id and guest_club_id = @g_id and start_time = @start and end_time = @end

go

-- View All upcoming matches (in a form of host club name, guest club name ,start time and end
-- time).

CREATE PROCEDURE AssociationManagerViewUpcomingMatches
AS
SELECT C1.club_name as host_club_name, C2.club_name as guest_club_name, M.start_time, M.end_time
FROM match M, club C1, club C2
WHERE M.host_club_id = C1.club_id AND M.guest_club_id = C2.club_id and M.start_time > CURRENT_TIMESTAMP
go

-- View already played matches (in a form of host club name, guest club name, start time and end
-- time).

CREATE PROCEDURE AssociationManagerViewPlayedMatches
AS
SELECT C1.club_name as host_club_name, C2.club_name as guest_club_name, M.start_time, M.end_time
FROM match M, club C1, club C2
WHERE M.host_club_id = C1.club_id AND M.guest_club_id = C2.club_id and M.start_time < CURRENT_TIMESTAMP
go

-- View pair of club names who never scheduled to play with each other

CREATE PROCEDURE AssociationManagerViewPairOfClubNamesWhoNeverScheduledToPlayWithEachOther
AS
SELECT C1.club_name as host_club_name, C2.club_name as guest_club_name
FROM club C1, club C2
WHERE C1.club_id <> C2.club_id and not exists (select *
    from match M
    where M.host_club_id = C1.club_id and M.guest_club_id = C2.club_id)
go


CREATE PROCEDURE AdminAddNewClub
    @name varchar(20),
    @c_location varchar(20)
AS
INSERT INTO club
    (club_name,club_location)
VALUES(@name, @c_location)
go


CREATE PROCEDURE AdminDeleteClub
    @name varchar(20)
AS
declare @id int
exec clubfinder @name, @id output
declare @username varchar(20) = (select username
from club_representative
where club_representative.club_id = @id)

delete from club_representative
where club_representative.club_id = @id
delete from USERS
where
USERS.username = (@username)

delete from ticket
where ticket.match_id = (select match_id
from match
where host_club_id = @id or guest_club_id = @id)


delete from host_request where match_id = (select match_id
from match
where host_club_id = @id or guest_club_id = @id)
delete from match where match_id = (select match_id
from match
where host_club_id = @id or guest_club_id = @id)

DELETE  FROM club WHERE club_name=@name

go


CREATE PROCEDURE AdminAddNewStadium
    @name varchar(20),
    @location varchar(20),
    @capacity INT
AS
INSERT INTO stadium
    (stadium_name, stadium_location, stadium_capacity,stadium_status)
VALUES(@name, @location, @capacity, 1)
go

CREATE PROCEDURE AdminDeleteStadium
    @name varchar(20)
AS
declare @stadium_id int
select @stadium_id = stadium_id
from stadium
where @name = stadium_name

declare @username varchar(20) = (select username
from stadium_manager
where stadium_manager.stadium_id = @stadium_id)
declare @mang int = (select stadium_manager.stadium_manager_id
from stadium_manager
where stadium_manager.stadium_id = @stadium_id)
delete from host_request where host_request.manager_id = @mang
delete from stadium_manager
where stadium_manager.stadium_id = @stadium_id
delete from USERS
where
USERS.username = (@username)

update match
set stadium_id = null where match.stadium_id = @stadium_id

DELETE  FROM stadium WHERE stadium_name=@name
go

CREATE PROCEDURE AdminBlockFan
    @national_id varchar(20)
AS
UPDATE fan SET fan_status = 0 WHERE national_id=@national_id;

go


CREATE PROCEDURE Login
    @username varchar(20),
    @password varchar(20)
AS
if exists (select username
from USERS
where @username = USERS.username and @password = USERS.password)
begin
    SELECT *
    FROM USERS
    WHERE @username = USERS.username and @password = USERS.password
end
else
begin
    RAISERROR('Wrong username or password', 16, 1)
end

go

CREATE PROCEDURE TypeOfUser
    @username varchar(20),
    @type INT OUTPUT
AS
if exists (select username
from fan
where @username = fan.username)
begin
    SET @type = 1
end
else if exists (select username
from stadium_manager
where @username = stadium_manager.username)
begin
    SET @type = 2
end
else if exists (select username
from club_representative
where @username = club_representative.username)
begin
    SET @type = 3
end
else if exists (select username
from association_manager
where @username = association_manager.username)
begin
    SET @type = 4
end
else
begin
    SET @type = 0
end

go
