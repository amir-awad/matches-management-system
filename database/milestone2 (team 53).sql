CREATE DATABASE test_db

USE test_db

GO
--1a
CREATE PROCEDURE createAllTables
AS

CREATE TABLE "system_user"
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
	FOREIGN KEY (username) REFERENCES "system_user" (username)

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
	FOREIGN KEY (username) REFERENCES "system_user" (username),
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
	FOREIGN KEY (username) REFERENCES "system_user" (username),
	FOREIGN KEY (club_id) REFERENCES club (club_id)
);

CREATE TABLE association_manger
(
	association_manger_id INT IDENTITY(1,1) Primary Key,
	association_manger_name VARCHAR
 (20),
	username VARCHAR
 (20),
	FOREIGN KEY (username) REFERENCES "system_user" (username)
);


CREATE TABLE system_admin
(
	admin_id INT IDENTITY(1,1) Primary Key,
	admin_name VARCHAR
 (20),
	username VARCHAR
 (20),
	FOREIGN KEY (username) REFERENCES "system_user" (username)
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
go
--end 1a

--1b
CREATE PROCEDURE dropAllTables
AS
DROP TABLE ticket_buying_transactions
DROP TABLE ticket
DROP Table fan
DROP TABLE host_request
DROP TABLE club_representative
DROP TABLE match
DROP TABLE club
DROP TABLE association_manger
DROP TABLE system_admin
DROP TABLE stadium_manager
DROP Table stadium
DROP Table "system_user"
go
--end 1b

--1c
go;
CREATE PROCEDURE dropAllProceduresFunctionsViews
AS
--2.1
drop procedure createAllTables;
drop procedure dropAllTables;
drop procedure clearAllTables;
--2.2
drop view allAssocManagers;
drop view allClubRepresentatives;
drop view allStadiumManagers;
drop view allFans;
drop view allMatches;
drop view allTickets;
drop view allClubs;
drop view allStadiums;
drop view allRequests;
--2.3
drop procedure matchfinder
drop procedure clubfinder
drop procedure addAssociationManager;
drop procedure addNewMatch;
drop view clubsWithNoMatches;
drop procedure deleteMatch;
drop procedure deleteMatchesOnStadium;
drop procedure addClub;
drop procedure addTicket;
drop procedure deleteClub;
drop procedure addStadium;
drop procedure deleteStadium;
drop procedure blockFan;
drop procedure unblockFan;
drop procedure addRepresentative;
drop function viewAvailableStadiumsOn;
drop procedure addHostRequest;
drop function allUnassignedMatches;
drop procedure addStadiumManager;
drop procedure allPendingRequests;
drop procedure acceptRequest;
drop procedure rejectRequest;
drop procedure addFan;
drop function upcomingMatchesOfClub;
drop function availableMatchesToAttend;
drop procedure purchaseTicket;
drop procedure updateMatchHost;
drop view matchesPerTeam;
drop view clubsNeverMatched;
drop function clubsNeverPlayed;
drop function matchWithHighestAttendance;
drop function matchesRankedByAttendance;
drop function requestsFromClub;


go
--end 1c

--1d
CREATE PROCEDURE clearAllTables
AS
DELETE ticket_buying_transactions
DELETE ticket
DELETE fan
DELETE host_request
DELETE club_representative
DELETE match
DELETE club
DELETE association_manger
DELETE system_admin
DELETE stadium_manager
DELETE stadium
DELETE "system_user"

go
--end 1d

--finders
CREATE PROCEDURE clubfinder
	@name varchar(20),
	@ID int output
as
select @ID=club_id
from club
where club_name = @name

go

CREATE PROCEDURE matchfinder
	@host_c varchar(20),
	@guest_c varchar(20),
	@starttime datetime,
	@ID INT OUTPUT
AS
SELECT @ID=m.match_id
FROM match m
WHERE m.host_club_id = @host_c and m.guest_club_id=@guest_c and m.start_time=@starttime
go
--end finders

--(i)
CREATE PROCEDURE addAssociationManager
	@name varchar(20),
	@username varchar(20),
	@password varchar(20)
AS
if not exists (select username
from "system_user"
where @username = "system_user".username)
begin
	INSERT INTO "system_user"
	VALUES(@username, @password)
	INSERT INTO association_manger
		(association_manger_name, username)
	VALUES(@name, @username)
end
go
--end (i)


--(ii)
CREATE PROCEDURE addNewMatch
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
--end(ii)

--(iii)
CREATE VIEW clubsWithNoMatches
AS
	SELECT club_name
	from club left join match on club_id = match.host_club_id or club_id=match.guest_club_id
	where match_id is null
go
--end(iii)

--(iv)
CREATE PROCEDURE deleteMatch
	@host_club varchar(20),
	@guest_club varchar(20)
as

DECLARE @h_id int
EXEC clubfinder @host_club, @h_id output
DECLARE @g_id int
EXEC clubfinder @guest_club, @g_id output

delete from ticket
where ticket.match_id = (select match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id)

delete from host_request where match_id = (select match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id)
DELETE from match where host_club_id = @h_id AND guest_club_id = @g_id
go
--end (iv)

--(v)
create procedure deleteMatchesOnStadium
	@stad_name varchar(20)
as
declare @ticket_id int
select @ticket_id=ticket_id
from ticket
where ticket.match_id in (select match.match_id
from match
where match.stadium_id in
(select s1.stadium_id
	from match m1 inner join stadium s1 on s1.stadium_id = m1.stadium_id
	where stadium_name = @stad_name )AND end_time > GETDATE())

delete from ticket_buying_transactions
where @ticket_id = ticket_id
delete from ticket
where @ticket_id = ticket_id

delete from host_request where match_id in (select match.match_id
from match
where match.stadium_id in
(select s1.stadium_id
	from match m1 inner join stadium s1 on s1.stadium_id = m1.stadium_id
	where stadium_name = @stad_name )AND end_time > GETDATE())
delete from match where match_id in (select match.match_id
from match
where match.stadium_id in
(select s1.stadium_id
	from match m1 inner join stadium s1 on s1.stadium_id = m1.stadium_id
	where stadium_name = @stad_name )AND end_time > GETDATE())
go
--end (v)

--(vi)
CREATE PROCEDURE addClub
	@name varchar(20),
	@c_location varchar(20)
AS
INSERT INTO club
	(club_name,club_location)
VALUES(@name, @c_location)
go
--end (vi)

--(vii)
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
--end(vii)

--(viii)
CREATE PROCEDURE deleteClub
	@name varchar(20)
AS
declare @id int
exec clubfinder @name, @id output
declare @username varchar(20) = (select username
from club_representative
where club_representative.club_id = @id)

delete from club_representative
where club_representative.club_id = @id
delete from "system_user"
where
"system_user".username = (@username)

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
--end(viii)

--(ix)
CREATE PROCEDURE addStadium
	@name varchar(20),
	@location varchar(20),
	@capacity INT
AS
INSERT INTO stadium
	(stadium_name, stadium_location, stadium_capacity,stadium_status)
VALUES(@name, @location, @capacity, 1)
go
--end(ix)

--x
CREATE PROCEDURE deleteStadium
	@name varchar(20)
AS
declare @stadium_id int
select @stadium_id = stadium_id
from stadium
where @name = stadium_name

declare @username varchar(20) = (select username
from stadium_manager
where stadium_manager.stadium_id = @stadium_id)
declare @mang int = (select stadium_manager.stadium_manger_id
from stadium_manager
where stadium_manager.stadium_id = @stadium_id)
delete from host_request where host_request.manger_id = @mang
delete from stadium_manager
where stadium_manager.stadium_id = @stadium_id
delete from "system_user"
where
"system_user".username = (@username)

update match
set stadium_id = null where match.stadium_id = @stadium_id

DELETE  FROM stadium WHERE stadium_name=@name
go
--end(x)

--(xi)
CREATE PROCEDURE blockFan
	@national_id varchar(20)
AS
UPDATE fan SET fan_status = 1 WHERE national_id=@national_id;

go
--end(xi)

--(xii)
CREATE PROCEDURE unblockFan
	@national_id varchar(20)
AS
UPDATE fan SET fan_status = 0 WHERE national_id=@national_id;
go
--end(xii)

--(xiii)
CREATE PROCEDURE addRepresentative
	@name varchar(20),
	@club_name varchar(20),
	@username varchar(20),
	@password varchar(20)
AS
if not exists (select username
from "system_user"
where @username = "system_user".username)
begin
	INSERT INTO "system_user"
	VALUES(@username, @password)
	INSERT INTO club_representative
		(representative_name,club_id, username)
	VALUES(@name, (SELECT club_id
			FROM club
			WHERE club_name= @club_name), @username)
end
go
--end(xiii)

--(xiv)
create function viewAvailableStadiumsOn
(@date datetime)
returns table
as
return(
        select stadium_name, stadium.stadium_location, stadium.stadium_capacity
from stadium left join match on match.stadium_id = stadium.stadium_id
where stadium_status = 1 AND @date<>start_time)
go
--end(xiv)

--(xv)
create procedure addHostRequest
	@club_name varchar(20),
	@stadium_name varchar(20),
	@start datetime
as
declare @s_rep_id int,@c_rep_id int, @m_id int,@s_id int,@c_id int

select @s_id = stadium.stadium_id
from stadium
where @stadium_name = stadium_name

exec clubfinder @club_name,@c_id output

select @s_rep_id = stadium_manager.stadium_manger_id
from stadium_manager
where @s_id = stadium_manager.stadium_id

select @c_rep_id = club_representative.representative_id
from club_representative
where @c_id = club_representative.club_id

select @m_id = match_id
from match
where @c_id = host_club_id and @start = start_time

insert into host_request
	(representative_id,manger_id,match_id)
values(@c_rep_id, @s_rep_id, @m_id)
go
--end(xv)

--(xvi)
create function allUnassignedMatches
(@host varchar(20))

returns table
as

return(
        select c2.club_name, m1.start_time
from club c2 inner join match m1 on c2.club_id = m1.guest_club_id inner join club c1 on c1.club_id = m1.host_club_id
where m1.stadium_id is null)
go		
--end(xvi)

--(xvii)
CREATE PROCEDURE addStadiumManager
	@name varchar(20),
	@stadium_name varchar(20),
	@username varchar(20),
	@password varchar(20)
AS
if not exists (select username
from "system_user"
where @username = "system_user".username)
begin
	INSERT INTO "system_user"
	VALUES(@username, @password)
	INSERT INTO stadium_manager
		(stadium_manager_name,stadium_id, username)
	VALUES(@name, (SELECT stadium_id
			FROM stadium
			WHERE stadium_name= @stadium_name), @username)
end
go
--end(xvii)

--(xviii)
create function allPendingRequests
(@man_name varchar(20))
returns table
as
return(
        select cr1.representative_name, c2.club_name, m1.start_time
from club c2 inner join match m1 on c2.club_id = m1.guest_club_id inner join host_request on m1.match_id = host_request.match_id
	inner join club_representative cr1 on cr1.representative_id = host_request.representative_id inner join
	stadium_manager on stadium_manager.stadium_manger_id=host_request.manger_id
where request_status is null and @man_name = stadium_manager.username)
go
--end(xviii)

--(xix)
create procedure acceptRequest
	@stadium_mang varchar(20),
	@host_club_name varchar(20),
	@guest_club_name varchar(20),
	@start datetime
as
declare @mang_id int, @h_id int, @g_id int, @m_id int,@s_id int

select @mang_id = stadium_manager.stadium_manger_id
from stadium_manager
where @stadium_mang = stadium_manager.username

exec clubfinder @host_club_name, @h_id output
exec clubfinder @guest_club_name, @g_id output

select @m_id = match.match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id and start_time = @start

select @s_id = stadium_id
from stadium_manager
where stadium_manger_id = @mang_id

declare @req_id int
select @req_id= h.request_id
from host_request h
where @mang_id = h.manger_id AND @m_id = h.match_id and h.request_status = 'unhandled'
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
--end(xix)

--(xx)
create procedure rejectRequest
	@stadium_mang varchar(20),
	@host_club_name varchar(20),
	@guest_club_name varchar(20),
	@start datetime
as
declare @mang_id int, @h_id int, @g_id int, @m_id int,@s_id int

select @mang_id = stadium_manager.stadium_manger_id
from stadium_manager
where @stadium_mang = stadium_manager.username

exec clubfinder @host_club_name, @h_id output
exec clubfinder @guest_club_name, @g_id output

select @m_id = match.match_id
from match
where host_club_id = @h_id AND guest_club_id = @g_id and start_time = @start

select @s_id = stadium_id
from stadium_manager
where stadium_manger_id = @mang_id

update host_request
set request_status = 'rejected'
where match_id = @m_id and manger_id = @mang_id
go
--end(xx)

--(xxi)
CREATE PROCEDURE addFan
	@name varchar(20),
	@username varchar(20),
	@password varchar(20),
	@national_id varchar(20),
	@birth_date datetime,
	@fan_address varchar(20),
	@phone_number INT
AS
if not exists (select username
from "system_user"
where @username = "system_user".username)
begin
	INSERT INTO "system_user"
	VALUES(@username, @password)
	INSERT INTO fan
		(fan_name, national_id, birth_date, fan_address, phone_number, fan_status, username)
	VALUES(@name, @national_id, @birth_date, @fan_address, @phone_number, 1, @username)
end
go
--end(xxi)

--(xxii)
create function upcomingMatchesOfClub
(@given_club_name varchar(20))
RETURNS TABLE
AS
return(
        select c.club_name, m.start_time, m.end_time, s.stadium_name
from club c
	inner join match m on (c.club_id =m.host_club_id or c.club_id=m.guest_club_id)
	inner join stadium s on m.stadium_id=s.stadium_id
where m.start_time > CURRENT_TIMESTAMP and c.club_name=@given_club_name)
go
--end(xxii)

--(xxiii)
create function availableMatchesToAttend
(@date datetime)
returns table
return(select c1.club_name as "host_name", c2.club_name as guest_name, m1.start_time, s1.stadium_name
from club c1 inner join match m1 on c1.club_id = m1.host_club_id
	inner join club c2 on c2.club_id = m1.guest_club_id
	inner join stadium s1 on s1.stadium_id = m1.stadium_id
	inner join ticket t1 on t1.match_id =m1.match_id
where @date <= start_time and t1.ticket_status=1)
go
--end(xxiii)

--(xxiv)
CREATE PROCEDURE  purchaseTicket
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
--end(xxiv)

--(xxv)
CREATE PROCEDURE updateMatchHost
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
delete from host_request where match_id = @m_id
update match set stadium_id = null where match_id = @m_id
UPDATE match SET guest_club_id=h_id WHERE match_id=@m_id
UPDATE match SET host_club_id=g_id WHERE match_id=@m_id
GO
--end(xxv)

--(xxvi)
create view matchesPerTeam
as
	select club_name, count(m.match_id) as match_count
	from club c left join match m on c.club_id in(m.host_club_id,m.guest_club_id) and m.end_time<CURRENT_TIMESTAMP
	group by c.club_id,c.club_name
go
--end(xxvi)

--(xxvii)
create view clubsNeverMatched
as
			select c1.club_name as first_club , c2.club_name as second_club
		from club c1, club c2
		where c1.club_id<c2.club_id
	except
	(
			(
				select c1.club_name , c2.club_name
		from club c1
			inner join match m on c1.club_id=m.host_club_id
			inner join club c2 on c2.club_id=m.guest_club_id
		)
	intersect
	(
			select c1.club_name as first_club, c2.club_name as second_club
		from club c1, club c2
	except
		(
		select c1.club_name, c2.club_name
		from club c1 inner join match m on c1.club_id=m.guest_club_id
			inner join club c2 on c2.club_id=m.host_club_id)))
go
--end(xxvii)

--(xxviii)
create function clubsNeverPlayed
(@club_name varchar(20))
returns table 
return(
												select c2.club_name
	from club c2
	where c2.club_name <> @club_name
except
	(
	select c2.club_name
	from club c1 inner join match m on c1.club_id = m.guest_club_id or c1.club_id = m.host_club_id
		inner join club c2 on c2.club_id = m.guest_club_id or c2.club_id = m.host_club_id
	where c1.club_name = @club_name 
)
)
go
--end(xxviii)

--xxix
CREATE function matchWithHighestAttendance
()
returns table
return(
select c1.club_name as host_club, c2.club_name as guest_club
from match m
	inner join club c1 on c1.club_id = m.host_club_id
	inner join club c2 on c2.club_id = m.guest_club_id
	left outer join ticket t on t.match_id=m.match_id and t.ticket_status=0
group by t.match_id ,c1.club_name,c2.club_name
having count(t.id) >= all(
select count(t.id)
from match m
	left outer join ticket t on t.match_id=m.match_id and t.ticket_status=0
group by m.match_id
)
)
go
--end(xxix)

--(xxx)
CREATE function matchesRankedByAttendance
()
returns table
return(
select c1.club_name as host_club, c2.club_name as guest_club
from match m
	inner join club c1 on c1.club_id = m.host_club_id
	inner join club c2 on c2.club_id = m.guest_club_id
	left outer join ticket t on t.match_id=m.match_id and t.ticket_status=0
group by t.match_id ,c1.club_name,c2.club_name
order by count(t.id) desc offset 0 row
)
go
--end(xxx)

--xxxi
create function requestsFromClub 
( @stadium_name varchar(20),@h_club_name varchar(20))
returns table 
return(
select c1.club_name as host_club , c2.club_name as guest_club
from
	club c1 inner join match m on m.host_club_id = c1.club_id
	inner join club c2 on c2.club_id = m.guest_club_id
	inner join host_request h on m.match_id = h.match_id
	inner join stadium_manager sm on sm.stadium_manger_id = h.manger_id
	inner join stadium s on s.stadium_id = sm.stadium_id
	inner join club_representative cr on cr.club_id = c1.club_id
where @h_club_name = c1.club_name AND @stadium_name = s.stadium_name)
go
--end(xxxi)





CREATE VIEW allAssocManagers
AS
	SELECT am.username, su.password, am.association_manger_name
	FROM association_manger AS am , "system_user" AS su
	WHERE am.username = su. username
go

CREATE VIEW allClubRepresentatives
AS
	SELECT cr.username, su.password, cr.representative_name, c.club_name
	FROM club AS c, club_representative AS cr, "system_user" AS su
	WHERE cr.club_id=c.club_id AND cr.username=su.username
go

CREATE VIEW allStadiumManagers
AS
	SELECT sm.username, su.password, sm.stadium_manager_name, s.stadium_name
	FROM stadium AS s, stadium_manager AS sm, "system_user" AS su
	WHERE s.stadium_id=sm.stadium_id AND sm.username=su.username
go

CREATE VIEW allFans
AS
	SELECT username, su.password , fan_name, national_id, birth_date, fan_status
	FROM fan , "system_user" AS su
	WHERE sm.username=su.username
go

CREATE VIEW allMatches
AS
	SELECT c1.club_name as host_club, c2.club_name as guest_club, m.start_time
	from club c1
		inner join match m on c1.club_id=m.host_club_id
		inner join club c2 on c2.club_id=m.guest_club_id

go

CREATE VIEW allTickets
AS
	SELECT c1.club_name as host_club, c2.club_name AS guest_club, s.stadium_name , m.start_time
	from club c1
		inner join match m on c1.club_id=m.host_club_id
		inner join club c2 on c2.club_id=m.guest_club_id
		inner join ticket t on t.match_id=m.match_id
		inner join stadium s on m.stadium_id=s.stadium_id

go
CREATE VIEW allCLubs
AS
	SELECT club_name, club_location
	FROM club
go

CREATE VIEW allStadiums
AS
	SELECT stadium_name, stadium_location, stadium_capacity, stadium_status
	FROM stadium
go
CREATE VIEW allRequests
AS
	select club_representative.username , stadium_manager.username , host_request.request_status
	from host_request hr
		inner join club_representative cr on cr.representative_id=hr.representative_id
		inner join stadium_manager sm on sm.stadium_manger_id=hr.manger_id
go

-- functions














