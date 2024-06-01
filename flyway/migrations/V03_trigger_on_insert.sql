drop trigger if exists userUUID;
drop trigger if exists meetingUUID;
drop trigger if exists meetingMembersUUID;
drop trigger if exists friendListUUID;

DELIMITER //

CREATE TRIGGER userUUID
BEFORE INSERT ON `User`
FOR EACH ROW
BEGIN
    IF NEW.userID IS NULL OR NEW.userID = '' THEN
        SET NEW.userID = UUID();
    END IF;
END //

CREATE TRIGGER meetingUUID
BEFORE INSERT ON Meeting
FOR EACH ROW
BEGIN
    IF NEW.meetingID IS NULL OR NEW.meetingID = '' THEN
        SET NEW.meetingID = UUID();
    END IF;
END //

CREATE TRIGGER meetingMembersUUID
BEFORE INSERT ON MeetingMembers
FOR EACH ROW
BEGIN
    IF NEW.meetingMemberID IS NULL OR NEW.meetingMemberID = '' THEN
        SET NEW.meetingMemberID = UUID();
    END IF;
END //

CREATE TRIGGER friendListUUID
BEFORE INSERT ON FriendList
FOR EACH ROW
BEGIN
    IF NEW.friendListID IS NULL OR NEW.friendListID = '' THEN
        SET NEW.friendListID = UUID();
    END IF;
END //

DELIMITER ;