import { useEffect, useState } from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  createFirestore,
  readFirestore,
  updateFirestore,
} from "../lib/firebase/firestore";
import { useDataContext } from "./Hooks/DataProvider";
import { v4 as uuidV4 } from "uuid";
import { filterOnlyDocUsing2UsersID } from "../lib/firebase/msgFirestore";

/*
    Message ID: Unique identifier for each message.
    Sender ID: Reference to the user who sent the message.
    Receiver ID: Reference to the user(s) who received the message (could be single user or group).
    Message Content: Text, image, video, or other multimedia.
    Timestamp: Time when the message was sent.
    //Read Receipts: If the message has been seen by the receiver(s).
    Message Type: Text, image, file, or system-generated messages.
    //Message Status: Sent, delivered, seen, deleted, etc.
    Date: Seperate wise.
*/

const SendMsg = () => {
  const [input, setInput] = useState("");
  const [isSendLoading, setIsSendLoading] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [user2Profile, setUser2Profile] = useState(null);
  const [cachedProfiles, setCachedProfiles] = useState({});

  const { currentUser, selectedChat, seSelectedChat } = useDataContext();

  useEffect(() => {
    const fetchCurrentUserData = async () => {
      try {
        const data = await readFirestore("Users", currentUser.uid);
        setUserObj(data[0]);
      } catch (error) {
        console.error("error:", error);
        alert(error);
      }
    };

    fetchCurrentUserData();
  }, [userObj]);

  useEffect(() => {
    const fetchSelectedUserProfile = async () => {
      if (cachedProfiles[selectedChat?.selectedChatUID]) {
        setUser2Profile(cachedProfiles[selectedChat?.selectedChatUID]);
        return;
      }

      try {
        const fetchUser2Profile = await readFirestore(
          "Users",
          selectedChat.selectedChatUID
        );
        setUser2Profile(fetchUser2Profile[0]);
        setCachedProfiles((prevCaches) => {
          return {
            ...prevCaches,
            [selectedChat?.selectedChatUID]: fetchUser2Profile[0],
          };
        });
      } catch (error) {
        console.error("error:", error);
        alert(error);
      }
    };

    if (selectedChat?.selectedChatUID) {
      fetchSelectedUserProfile();
    }
  }, [selectedChat?.selectedChatUID]);

  // Alert: Update for both users
  async function updateChatListFirestoreData() {
    const userChatListArr1 = userObj.chatList || [];
    const user2ProfileChatListArr2 = user2Profile.chatList || [];
    if (!userChatListArr1.includes(user2Profile.docId)) {
      userChatListArr1.push(user2Profile.docId);
      user2ProfileChatListArr2.push(currentUser.uid);
      try {
        await updateFirestore("Users", currentUser.uid, {
          chatList: userChatListArr1,
        });
        await updateFirestore("Users", user2Profile.docId, {
          chatList: user2ProfileChatListArr2,
        });
      } catch (error) {
        console.error("error:", error);
        alert(error);
      }
    }
  }

  async function handleSend() {
    if (!input) {
      alert("Please enter a text to send!!!");
      return;
    }
    try {
      setIsSendLoading(true);

      updateChatListFirestoreData();
      const dataObj = {
        msgID: uuidV4(),
        senderID: currentUser.uid,
        txt: input,
        sendDate: new Date(),
        type: "text",
      };
      // ALERT: before store data we must check if id already exist(senderID+receiverID or receiverID+senderID)
      const combination1 = currentUser.uid + user2Profile.docId;
      const combination2 = user2Profile.docId + currentUser.uid;
      // Query to check if a conversation already exists with either combination of user IDs
      const existingChat = await filterOnlyDocUsing2UsersID(currentUser.uid);
      let isUsersAlreadyChat;
      if (existingChat && existingChat.length > 0) {
        // Note:Already exist
        for (const e of existingChat) {
          if (e.docId === combination1) {
            const m = e.msg || [];
            m.push(dataObj);
            await updateFirestore("messages", combination1, { msg: m });
            isUsersAlreadyChat = true;
            break;
          }
          if (e.docId === combination2) {
            const m = e.msg || [];
            m.push(dataObj);
            await updateFirestore("messages", combination2, { msg: m });
            isUsersAlreadyChat = true;
            break;
          }
        }
      }
      if (!isUsersAlreadyChat) {
        await createFirestore("messages", { msg: [dataObj] }, combination1);
      }

      // NOTE : If msg send successfully textbox need to be an empty.
      setInput("");
    } catch (error) {
      console.error("error:", error);
      alert(error);
    } finally {
      setIsSendLoading(false);
    }
  }

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message"
          value={input}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend}>
          {isSendLoading ? <CircularProgress color="#7fc4a1" /> : <SendIcon />}
        </IconButton>
      </Box>
    </div>
  );
};

export default SendMsg;
