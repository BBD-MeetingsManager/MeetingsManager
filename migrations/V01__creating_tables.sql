drop database if exists meetingmanager;
create database meetingmanager;
use meetingmanager;

drop table if exists MeetingMemebers;
drop table if exists FriendList;
drop table if exists `User`;
drop table if exists Meeting;

create table `User`(
	userID int auto_increment,
	email varchar(255) not null,
    username varchar(50),
    
    constraint pk_user primary key (userID),
    constraint uq_email unique (email),
    constraint uq_username unique (username)
);

create table Meeting(
	meetingID int auto_increment,
    title varchar(50) not null,
    `description` varchar(255),
    link varchar(255) not null,
    startTime datetime not null,
    endTime datetime not null,
    
    constraint pk_meeting primary key (meetingID),
    
    check (startTime < endTime)
);

create table MeetingMemebers(
	meetingMemberID int auto_increment,
    userID int not null,
    meetingID int not null,
    isAccepted bool default false,
    
    constraint pk_meeting_members primary key (meetingMemberID),
    constraint fk_user_id foreign key (userID) references `User`(userID),
    constraint fk_meeting_id foreign key (meetingID) references Meeting(meetingID),
    constraint uq_user_meeting unique (userID, meetingID)
);

create table FriendList(
	friendListID int auto_increment,
    requestUserID int not null,
    followerUserID int not null,
    isAccepted bool default false,
    
    constraint pk_friend_list primary key(friendListID),
    constraint fk_request_user_id foreign key(requestUserID) references `User`(userID),
    constraint fk_follower_user_id foreign key(followerUserID) references `User`(userID),
    constraint uq_request_follower unique(requestUserID, followerUserID)
);