import React from "react";
import AppBar from "./Component/AppBar.jsx";
import ChatList from "./Component/ChatList.jsx";
import SearchBar from "./Component/SearchBar.jsx";
import ChatArea from "./Component/ChatArea.jsx";
import { useDataContext } from "./Component/Hooks/DataProvider.jsx";
import "./Home.css";

function Home() {
  const { selectedChat } = useDataContext();
  return (
    <main>
      <AppBar />
      <div className="mainDiv">
        <section className="leftSec">
          <SearchBar />
          <ChatList />
        </section>
        <section className="rightSec">
          {selectedChat.isSelected ? (
            <ChatArea />
          ) : (
            <h1
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "70vw",
                height: "92vh",
                color: "white",
              }}>
              Select a chat
            </h1>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;
