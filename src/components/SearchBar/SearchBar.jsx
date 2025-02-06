import { useState } from "react";
import search_icon from "../../assets/search.png";
import more_icon from "../../assets/voice-search.png";
import "./SearchBar.css";
import { useNavigate } from "react-router";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
      //   setSearchTerm("");
    }
  };
  return (
    <div className="nav-middle flex-div">
      <form className="search-box flex-div" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <img src={search_icon} alt="Search" />
        </button>
      </form>
      <div className="voice-search flex-div">
        <img src={more_icon} alt="" />
      </div>
    </div>
  );
}
