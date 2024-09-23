import React, { useEffect, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import { useDataContext } from "./Hooks/DataProvider";
import { readFirestore } from "../lib/firebase/firestore";
const UserProfile = () => {
  const [user2Profile, setUser2Profile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedProfiles, setCachedProfiles] = useState({});

  const { paletteColor, selectedChat, currentUser } = useDataContext();

  useEffect(() => {
    const fetchUser2Profile = async () => {
      setIsLoading(true);

      if (cachedProfiles[selectedChat.selectedChatUID]) {
        setUser2Profile(cachedProfiles[selectedChat.selectedChatUID]);
        setIsLoading(false);
        return;
      }

      try {
        const user2Profile = await readFirestore(
          "Users",
          selectedChat.selectedChatUID
        );
        setUser2Profile(user2Profile[0]);
        setCachedProfiles((prevCache) => ({
          ...prevCache,
          [selectedChat.selectedChatUID]: user2Profile[0],
        }));
      } catch (error) {
        console.log("error:", error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedChat?.selectedChatUID) {
      fetchUser2Profile();
    }
  }, [selectedChat?.selectedChatUID]);

  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: paletteColor.paletteColor1,
        width: "70vw",
        height: "10vh",
        padding: ".5em 1em",
      }}>
      {!isLoading && (
        <React.Fragment>
          <Avatar src={user2Profile?.profilePhotoUrl} />
          <Typography ml={2} color="white">
            {(user2Profile && user2Profile.displayName) || "Anonymous"}
            {user2Profile?.docId === currentUser.uid && <b> (You)</b>}
          </Typography>
        </React.Fragment>
      )}
    </section>
  );
};

export default UserProfile;
