drop trigger if exists beforeInsertFriendList;

DELIMITER //

CREATE TRIGGER beforeInsertFriendList
BEFORE INSERT ON FriendList
FOR EACH ROW
BEGIN
    DECLARE cnt INT;
    -- Check for the reverse pair
    SELECT COUNT(*) INTO cnt
    FROM FriendList
    WHERE requestUserID = NEW.followerUserID
      AND followerUserID = NEW.requestUserID;
    IF cnt > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The pair (requestUserID, followerUserID) must be unique in any order';
    END IF;
END; //

DELIMITER ;