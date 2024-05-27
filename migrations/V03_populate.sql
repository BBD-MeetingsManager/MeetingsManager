delete from FriendList;
delete from MeetingMemebers;
delete from `User`;
delete from Meeting;

alter table `User` auto_increment = 1;
alter table MeetingMemebers auto_increment = 1;
alter table Meeting auto_increment = 1;
alter table FriendList auto_increment = 1;

insert into 
	`User`(email) 
values
	('katlegok.chess@gmail.com'),
    ('keaton@bbd.co.za'),
    ('walter.magagula@bbd.co.za'),
    ('timo.vdmerwe@bbd.co.za');
    
select userID into @katlegoUserID from `User` where email = 'katlegok.chess@gmail.com';
select userID into @keatonUserID from `User` where email = 'keaton@bbd.co.za';
select userID into @walterUserID from `User` where email = 'walter.magagula@bbd.co.za';
select userID into @timoUserID from `User` where email = 'timo.vdmerwe@bbd.co.za';

insert into 
	Meeting(title, link, startTime, endTime)
values 
	(
		'Meeting Manager Stand Up',
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-05-31 15:30:00',
        '2024-05-31 16:00:00'
	),
    (
		'Client Demo',
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-06-02 12:00:00',
        '2024-06-02 16:00:00'
	),
    (
		'Online Voting Day',
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-05-29 08:00:00',
        '2024-05-29 12:00:00'
	);

select meetingID into @standUpMeetingID from Meeting where title = 'Meeting Manager Stand Up';
select meetingID into @demoMeetingID from Meeting where title = 'Client Demo';
select meetingID into @votingMeetingID from Meeting where title = 'Online Voting Day';
    
insert into 
	MeetingMemebers (userID, meetingID, isAccepted)
values 
	(@katlegoUserID, @standUpMeetingID, true),
    (@walterUserID, @standUpMeetingID, true),
    (@keatonUserID, @standUpMeetingID, false),
    (@timoUserID, @standUpMeetingID, true),

    (@katlegoUserID, @demoMeetingID, true),
    (@timoUserID, @demoMeetingID, true),

    (@walterUserID, @votingMeetingID, true),
    (@keatonUserID, @votingMeetingID, false),
    (@timoUserID, @votingMeetingID, false);
    
insert into 
	FriendList (requestUserID, followerUserID, isAccepted)
values 
	(@katlegoUserID, @timoUserID, true), 
    (@katlegoUserID, @walterUserID, true), 
    (@katlegoUserID, @keatonUserID, false), 
    (@timoUserID, @keatonUserID, true), 
    (@timoUserID, @walterUserID, false)