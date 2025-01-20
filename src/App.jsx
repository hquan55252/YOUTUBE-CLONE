import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Video from "./pages/Video/Video";
import { useState } from "react";
import SearchFeed from "./components/SearchFeed/SearchFeed";

function App() {
  const [sidebar, setSidebar] = useState(true);
  return (
    <>
      <Navbar setSidebar={setSidebar} />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
      </Routes>
    </>
  );
}

export default App;
