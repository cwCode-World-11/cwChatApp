import React, { useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { authFirebase } from "../../firebase/firebaseConfig";

const DataContextProvider = React.createContext();

function useDataContext() {
  return useContext(DataContextProvider);
}

const DataProvider = ({ children }) => {
  const paletteColor = {
    /* Custom Variables */
    paletteColor1: "#315098",
    paletteColor2: "#8CA8BE",
    paletteColor3: "#AFBDB0",
    paletteColor4: "#E4C0BE",
    paletteColor5: "#FBD0E0",
  };
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTxt, setSearchTxt] = useState("");
  const [selectedChat, setSelectedChat] = useState({
    isSelected: false,
    selectedChatUID: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(authFirebase, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);

  const values = {
    currentUser,
    paletteColor,
    searchTxt,
    setSearchTxt,
    selectedChat,
    setSelectedChat,
  };

  return (
    <DataContextProvider.Provider value={values}>
      {!loading && children}
    </DataContextProvider.Provider>
  );
};

export { useDataContext };
export default DataProvider;
