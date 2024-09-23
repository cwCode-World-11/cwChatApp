import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpAuthFirebase } from "../../lib/firebase/auth";
import { uploadFile, getImageUrl } from "../../lib/firebase/storage";
import { createFirestore } from "../../lib/firebase/firestore";
import { Avatar, CircularProgress } from "@mui/material";
import extensionExtractor from "../../lib/extensionExtractor";
import ReactLoading from "react-loading";
import "./Signup.css";

function Signup() {
  const [profilePic, setProfilePic] = useState(null);
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle Signup logic here
    const { email, password, confirmPassword, userName } = event.target;

    if (password.value !== confirmPassword.value) {
      console.log("password:", password);
      console.log("confirmPassword:", confirmPassword);
      alert("Password does not match");
    } else {
      setIsLoading(true);
      // NOTE:Authentication
      const user = await signUpAuthFirebase(email.value, password.value);
      if (user) {
        try {
          let getUrl = "";
          const userUID = user.user.uid;

          if (profilePic) {
            // NOTE:Storage
            const isUploadFileSuccess = await uploadFile(
              "User Profile Picture",
              `${userUID}.${extensionExtractor(profilePic.name)}`,
              profilePic
            );
            if (isUploadFileSuccess) {
              getUrl = await getImageUrl(
                "User Profile Picture",
                `${userUID}.${extensionExtractor(profilePic.name)}`
              );
              //setUrl(getUrl);
              // setIsLoading(false);
            } else {
              alert("Failed to upload user profile file");
              return;
            }
          }

          // NOTE:Firestore
          const dataObj = {
            emailID: email.value,
            displayName: userName.value || "Anonymous",
            profilePhotoUrl: getUrl === "" ? null : getUrl,
          };
          await createFirestore("Users", dataObj, userUID);
          navigate("/");
        } catch (error) {
          console.log("error:", error);
          alert(error);
        } finally {
          setIsLoading(false);
        }
      }
      setIsLoading(false);
    }
  };

  function handleOnChange(e) {
    const imgType = ["image/jpeg", "image/png", "image/jpg"];
    const selectedFile = e.target.files[0];

    if (selectedFile && imgType.includes(selectedFile.type)) {
      setProfilePic(null);
      setProfilePic(e.target.files[0]);
      setUrl(URL.createObjectURL(selectedFile));
    } else {
      alert("Please select a valid image format!");
      return;
    }
  }

  return (
    <>
      {isLoading && (
        <div
          className="loadingScreen"
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#8CA8BE",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <ReactLoading
            type="spinningBubbles"
            color="#0056B3"
            height="400px"
            width="400px"
          />
        </div>
      )}
      <div className="Signup-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit} className="Signup-form">
          <div
            className="profilePicture"
            style={{
              margin: "auto",
              textAlign: "center",
              position: "relative",
            }}>
            <Avatar
              style={{ width: "100px", height: "100px" }}
              src={url || ""}
            />
            <input
              type="file"
              name="profilePic"
              id="profilePic"
              accept="image/*"
              onChange={handleOnChange}
              style={{
                width: "100px",
                height: "100px",
                opacity: "0",
                position: "absolute",
                top: 0,
                left: 0,
                cursor: "pointer",
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmation Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input type="text" id="userName" name="userName" required />
          </div>
          <button type="submit" className="Signup-button" disabled={isLoading}>
            Signup
          </button>
          <div className="descLink">
            <p>
              Already have an account?<Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

/*
  blank
  balls
  bars
  bubbles
  cubes
  cylon
  spin
  spinningBubbles
  spokes
*/

export default Signup;
