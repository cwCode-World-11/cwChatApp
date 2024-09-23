import { useState, useEffect } from "react";
// import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { useDataContext } from "./Hooks/DataProvider";

const SearchBar = () => {
  const [searchBarTxt, setSearchBarTxt] = useState("");

  const { setSearchTxt } = useDataContext();

  useEffect(() => {
    setSearchTxt(searchBarTxt);
  }, [searchBarTxt]);

  return (
    <div className="searchBarMainDiv">
      <input
        type="text"
        value={searchBarTxt}
        onChange={(e) => setSearchBarTxt(e.target.value)}
      />
      {/* <div
        className="searchIcon"
        onClick={() => {
          setSearchTxt(searchBarTxt);
        }}>
        <FaSearch />
      </div> */}
    </div>
  );
};

export default SearchBar;
