import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { FaRightFromBracket } from "react-icons/fa6";
import { signOutAuthFirebase } from "../lib/firebase/auth";
import { readFirestore } from "../lib/firebase/firestore";
import { useDataContext } from "./Hooks/DataProvider";
import { useNavigate } from "react-router-dom";
import stringAvatar from "../lib/StringAvatar";

const AppBar = () => {
  const [userObj, setUserObj] = useState(null);

  const { currentUser } = useDataContext();
  const navigate = useNavigate();

  useEffect(() => {
    const a = async () => {
      if (currentUser && currentUser.uid) {
        try {
          const u = await readFirestore("Users", currentUser.uid);
          setUserObj(u[0] || {});
        } catch (error) {
          console.log("error:", error);
          alert(error);
        }
      }
    };
    a();
  }, [currentUser]);

  async function handleLogOut() {
    try {
      await signOutAuthFirebase();
      navigate("/login");
    } catch (err) {
      console.error("err:", err);
    }
  }

  return (
    <main>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "tomato",
          padding: "0 5em",
          height: "8vh",
          cursor: "default",
        }}>
        <div className="title">
          Welcome{" "}
          <strong>
            {(currentUser && userObj && userObj?.displayName) || "Guest"}
          </strong>
          !
        </div>
        <div
          className="iconsBtn"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "5em",
          }}>
          {userObj ? (
            userObj.profilePhotoUrl ? (
              <Avatar src={userObj?.profilePhotoUrl} />
            ) : (
              <Avatar
                {...stringAvatar(userObj?.displayName || ".")}
                sx={{ bgcolor: "teal" }}
              />
            )
          ) : (
            <Avatar />
          )}
          <FaRightFromBracket
            color="gray"
            style={{ cursor: "pointer" }}
            onClick={handleLogOut}
          />
        </div>
      </section>
    </main>
  );
};

export default AppBar;
