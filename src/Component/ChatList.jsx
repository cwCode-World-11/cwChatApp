import { useEffect, useState } from "react";
import { Avatar, Box, Badge, Typography } from "@mui/material";
import { useDataContext } from "./Hooks/DataProvider";
import stringAvatar from "../lib/StringAvatar";
import { readFirestore } from "../lib/firebase/firestore";
import filterSearchTxt from "../lib/filterSearchTxt";

const ChatList = () => {
  // Alert:Oru component la irunthu innoru component ku data pass pannanum na rendu vazhi irukku. 1. props , 2. context.
  const { paletteColor, searchTxt, currentUser } = useDataContext();
  const [userObj, setUserObj] = useState(null);
  const [userChatList, setUserChatList] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  //   [
  //     {
  //         "docId": "VSq2tX1vIOWmKFt08WH1snGwOjj2",
  //         "emailID": "ccc@gmail.com",
  //         "displayName": "ccc"
  //     },
  // ]

  useEffect(() => {
    const fetchSavedChatList = async () => {
      try {
        const data = await readFirestore("Users", currentUser.uid);
        setUserObj(data[0]);
        const docIDsArr = data[0].chatList;
        if (docIDsArr) {
          const promises = docIDsArr.map((id) => {
            return readFirestore("Users", id); //returns [{}]
          });
          const p = await Promise.all(promises);
          const makeSingleArr = p.map((ele) => ele[0]); //[Array(1), Array(1), Array(1)]
          setUserChatList(makeSingleArr);
        }
      } catch (error) {
        console.error("error:", error);
        alert(error);
      }
    };

    if (!searchTxt) {
      fetchSavedChatList();
    }
  }, [searchTxt]);

  useEffect(() => {
    setSearchResult(null);
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const coll = await readFirestore("Users");
        const searchedArr = coll.filter((ele) => {
          const name = filterSearchTxt(ele.displayName, searchTxt);
          const docId = filterSearchTxt(ele.docId, searchTxt);

          return name || docId;
        });
        setSearchResult(searchedArr);
      } catch (error) {
        console.log("error:", error);
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    if (searchTxt) {
      fetchUserData();
    }
  }, [searchTxt]);
  return (
    <main>
      <section>
        <div
          className="chatList"
          style={{
            height: "81.6vh",
            overflow: "auto",
            backgroundColor: paletteColor.paletteColor2,
          }}>
          {loading ? (
            <p>Loading...</p>
          ) : searchTxt ? (
            searchResult && searchResult.length > 0 ? (
              searchResult.map((ele, index) => {
                return <ChatName key={index} userObj={ele} />;
              })
            ) : (
              <p>No result found</p>
            )
          ) : userChatList.length > 0 ? (
            userChatList.map((ele, index) => {
              return <ChatName key={index} userObj={ele} />;
            })
          ) : (
            <p>
              Currently, you don't have any chat list.{userObj?.displayName}!
              Please search for a user and start a chat.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

// "Saved chat list or no list message(Currently, you don't have any chat list. Please search for a user and start a chat.)"

const ChatName = ({ userObj }) => {
  const { selectedChat, setSelectedChat, currentUser } = useDataContext();
  const { profilePhotoUrl } = userObj;

  const isUserOnline = false;
  const avatarStyle = { width: 50, height: 50, backgroundColor: "purple" };
  const selectedChatStyle =
    selectedChat.selectedChatUID === userObj.docId
      ? { backgroundColor: "#136207", color: "white" }
      : { backgroundColor: "#E4C0BE", color: "black" };

  function handleChatSelect() {
    setSelectedChat({ isSelected: true, selectedChatUID: userObj.docId });
  }

  return (
    <section onClick={handleChatSelect}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: ".5em",
          cursor: "default",
          ...selectedChatStyle,
        }}>
        <Badge
          variant="dot"
          color="success"
          overlap="circular"
          invisible={!isUserOnline}>
          {userObj ? (
            userObj?.profilePhotoUrl !== "" ||
            userObj?.profilePhotoUrl !== undefined ? (
              <Avatar src={profilePhotoUrl} style={avatarStyle} />
            ) : (
              <Avatar
                {...stringAvatar(userObj?.displayName || ".")}
                sx={{ bgcolor: "teal", ...avatarStyle }}
              />
            )
          ) : (
            <Avatar style={avatarStyle} />
          )}
        </Badge>
        <Typography
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            maxWidth: "100%",
            overflow: "hidden",
          }}
          ml={1}>
          {userObj.displayName || "Anonymous"}
          {currentUser.uid === userObj.docId && <b> (You)</b>}
        </Typography>
      </Box>
      <Box sx={{ height: "1px", bgcolor: "black" }} />
    </section>
  );
};

export default ChatList;
