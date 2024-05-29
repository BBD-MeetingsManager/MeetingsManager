drop database if exists meetingmanager;
create database meetingmanager;
use meetingmanager;

drop table if exists MeetingMembers;
drop table if exists FriendList;
drop table if exists `User`;
drop table if exists Meeting;
drop table if exists `Status`;

create table `Status`(
	`status` varchar(10) not null,
    
    constraint pk_status primary key(`status`)
);

create table `User`(
	userID varchar(36),
	email varchar(255) not null,
    username varchar(50),
    
    constraint pk_user primary key (userID),
    constraint uq_email unique (email),
    constraint uq_username unique (username)
);

create table Meeting(
	meetingID varchar(36),
    adminUserID varchar(36) not null,
    title varchar(50) not null,
    `description` varchar(255),
    link varchar(255) not null,
    startTime datetime not null,
    endTime datetime not null,
    isCancelled bool default false,
    
    constraint pk_meeting primary key (meetingID),
    constraint fk_admin_user_id foreign key (adminUserID) references `User`(userID),
    
    check (startTime < endTime)
);

create table MeetingMembers(
	meetingMemberID varchar(36),
    userID varchar(36) not null,
    meetingID varchar(36) not null,
    `status` varchar(10) default 'pending',
    
    constraint pk_meeting_members primary key (meetingMemberID),
    constraint fk_user_id foreign key (userID) references `User`(userID),
    constraint fk_meeting_id foreign key (meetingID) references Meeting(meetingID),
    constraint fk_status foreign key (`status`) references `Status`(`status`),
    constraint uq_user_meeting unique (userID, meetingID)
);

create table FriendList(
	friendListID varchar(36),
    targetUserID varchar(36) not null,
    senderUserID varchar(36) not null,
    `status` varchar(10) default 'pending',
    
    constraint pk_friend_list primary key(friendListID),
    constraint fk_request_user_id foreign key(targetUserID) references `User`(userID),
    constraint fk_follower_user_id foreign key(senderUserID) references `User`(userID),
    constraint fk_friend_list_status foreign key (`status`) references `Status`(`status`),
    constraint uq_request_follower unique(targetUserID, senderUserID)
);