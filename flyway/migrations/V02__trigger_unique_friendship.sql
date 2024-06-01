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
    WHERE targetUserID = NEW.senderUserID
      AND senderUserID = NEW.targetUserID;
    IF cnt > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The pair (targetUserID, senderUserID) must be unique in any order';
    END IF;
END; //

DELIMITER ;