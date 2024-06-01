delete from FriendList;
delete from MeetingMembers;
delete from Meeting;
delete from `User`;
delete from `Status`;

alter table `User` auto_increment = 1;
alter table MeetingMembers auto_increment = 1;
alter table Meeting auto_increment = 1;
alter table FriendList auto_increment = 1;

insert into `Status` values
    ('pending'),
    ('accepted'),
    ('rejected');

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
	Meeting(title, adminUserID, link, startTime, endTime)
values 
	(
		'Meeting Manager Stand Up',
        @katlegoUserID,
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-05-31 15:30:00',
        '2024-05-31 16:00:00'
	),
    (
		'Client Demo',
        @katlegoUserID,
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-06-02 12:00:00',
        '2024-06-02 16:00:00'
	),
    (
		'Online Voting Day',
        @walterUserID,
        'https://teams.microsoft.com/l/meetup-join/19%3ameeting_NTFjYjA3ODQtMWE0Yy00NGU0LThkZGMtY2IzMjU4NThlNDI0%40thread.v2/0?context=%7b%22Tid%22%3a%22cccbf502-6b91-40d6-be02-5ffa0eb711d6%22%2c%22Oid%22%3a%22fbdc2644-647b-494d-9ba5-7e4ec65049fa%22%7d',
        '2024-05-29 08:00:00',
        '2024-05-29 12:00:00'
	);

select meetingID into @standUpMeetingID from Meeting where title = 'Meeting Manager Stand Up';
select meetingID into @demoMeetingID from Meeting where title = 'Client Demo';
select meetingID into @votingMeetingID from Meeting where title = 'Online Voting Day';
    
insert into 
	MeetingMembers (userID, meetingID, `status`)
values 
	(@katlegoUserID, @standUpMeetingID, 'accepted'),
    (@walterUserID, @standUpMeetingID, 'accepted'),
    (@keatonUserID, @standUpMeetingID, 'pending'),
    (@timoUserID, @standUpMeetingID, 'rejected'),

    (@katlegoUserID, @demoMeetingID, 'accepted'),
    (@timoUserID, @demoMeetingID, 'pending'),

    (@walterUserID, @votingMeetingID, 'accepted'),
    (@keatonUserID, @votingMeetingID, 'rejected'),
    (@timoUserID, @votingMeetingID, 'pending');
    
insert into 
	FriendList (targetUserID, senderUserID, `status`)
values 
	(@katlegoUserID, @timoUserID, 'accepted'), 
    (@katlegoUserID, @walterUserID, 'accepted'), 
    (@katlegoUserID, @keatonUserID, 'rejected'), 
    (@timoUserID, @keatonUserID, 'pending'), 
    (@timoUserID, @walterUserID, 'rejected')