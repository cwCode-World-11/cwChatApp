import { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useDataContext } from "./Hooks/DataProvider";
import { findMsgDocID } from "../lib/firebase/msgFirestore";
import { readFirestore } from "../lib/firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { firestoreFirebase } from "../firebase/firebaseConfig";
import { timeConversion } from "../lib/timeConversion";

const Chat = () => {
  // const msgObj = [
  //   {
  //     txt: "Hello World",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "Hi",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "Welcome",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "How are you?",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "Fine.",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "You?",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "Fine, how was your day today?",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "Etho pochi",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "unnaku?",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "okay thaan",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "Thalapathy vijay nadicha GOAT movie paarthutiya?",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "illa da nee?",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "Paakula,But eppadiyo paakama irukka maaten.",
  //     isSendMsg: true,
  //   },
  //   {
  //     txt: "What is HELLO WORLD?",
  //     isSendMsg: false,
  //   },
  //   {
  //     txt: "'Hello, World!' is a simple program often used as the first step in learning a new programming language. It typically outputs the text 'Hello, World!' to the screen and demonstrates the basic syntax and functionality of the language. It's a way for beginners to confirm that their programming environment is set up correctly and to get a basic sense of how coding works. ",
  //     isSendMsg: true,
  //   },
  // ];

  const { currentUser, selectedChat } = useDataContext();
  const [msgDocID, setMsgDocId] = useState("");
  const chatContainerRef = useRef();
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    const fetchMsgDocId = async () => {
      const docID = await findMsgDocID(
        selectedChat.selectedChatUID,
        currentUser.uid
      );
      if (docID) {
        setMsgDocId(docID);
      } else {
        setMsgDocId(null);
        setMsg([]);
      }
    };
    fetchMsgDocId();
  }, [selectedChat?.selectedChatUID, currentUser.uid]);

  useEffect(() => {
    if (!msgDocID) {
      return;
    }
    const unsub = onSnapshot(
      doc(firestoreFirebase, "messages", msgDocID),
      (doc) => {
        setMsg(doc.data().msg);
      },
      (error) => {
        console.log("error:", error);
        alert(error);
      }
    );

    return () => unsub();
  }, [msgDocID]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [msg]);

  return (
    <section>
      <div
        className="area"
        style={{ backgroundColor: "#87ceeb", height: "73vh", overflow: "auto" }}
        ref={chatContainerRef}>
        {msg.length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <span>Send message to start the conversation &#128516;!</span>
          </div>
        ) : (
          msg.length > 0 &&
          msg.map((obj, index) => (
            <ChatUI key={index} msgObj={obj} currentUser={currentUser} />
          ))
        )}
      </div>
    </section>
  );
};

function ChatUI({ msgObj, currentUser }) {
  const { senderID, txt } = msgObj;
  const isSendMsg = senderID === currentUser.uid ? true : false;

  return (
    <section>
      <div>
        <Box
          style={{
            display: "flex",
            // backgroundColor: "red",
            justifyContent: isSendMsg ? "flex-end" : "flex-start",
          }}>
          <Box
            sx={{
              bgcolor: isSendMsg ? "gray" : "blue",
              width: "fit-content",
              maxWidth: "35vw",
              height: "fit-content",
              padding: ".5em",
              borderRadius: "10px",
              color: "white",
              wordWrap: "break-word",
              margin: ".5em 1em",
            }}>
            <Typography>{txt}</Typography>
            <p
              style={{
                fontSize: "xx-small",
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}>
              <span>
                {timeConversion(
                  msgObj.sendDate.seconds,
                  msgObj.sendDate.nanoseconds
                ).date +
                  " " +
                  timeConversion(
                    msgObj.sendDate.seconds,
                    msgObj.sendDate.nanoseconds
                  ).time}
              </span>
            </p>
          </Box>
        </Box>
      </div>
    </section>
  );
}

export default Chat;
