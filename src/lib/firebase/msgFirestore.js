import { useDataContext } from "../../Component/Hooks/DataProvider";
import { readFirestore } from "./firestore";

const filterOnlyDocUsing2UsersID = async (uid) => {
  const data = [];
  try {
    const allMsg = await readFirestore("messages");
    allMsg.forEach((dataObj) => {
      if (dataObj.docId.includes(uid)) {
        data.push(dataObj);
      }
    });
  } catch (error) {
    console.error("error:", error);
    alert(error);
  }
  return data;
};

const findMsgDocID = async (currentUserID, user2ProfileID) => {
  let isUsersAlreadyChatIdExists;
  try {
    const combination1 = currentUserID + user2ProfileID;
    const combination2 = user2ProfileID + currentUserID;
    // Query to check if a conversation already exists with either combination of user IDs
    const existingChat = await filterOnlyDocUsing2UsersID(currentUserID);
    if (existingChat && existingChat.length > 0) {
      // Note:Already exist
      for (const e of existingChat) {
        if (e.docId === combination1) {
          isUsersAlreadyChatIdExists = e.docId;
          break;
        }
        if (e.docId === combination2) {
          isUsersAlreadyChatIdExists = e.docId;
          break;
        }
      }
    }
  } catch (error) {
    console.error("error:", error);
    alert(error);
  }
  return isUsersAlreadyChatIdExists;
};

export { filterOnlyDocUsing2UsersID, findMsgDocID };
