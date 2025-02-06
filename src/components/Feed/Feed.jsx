import { Link } from "react-router";
import "./Feed.css";
import { API_KEY, value_converter } from "../../data";
import { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";

export default function Feed({ category }) {
  const [data, setData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const fetchData = useCallback(
    async (pageToken = "") => {
      setLoading(true);
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=10&regionCode=US&videoCategoryId=${category}&pageToken=${pageToken}&key=${API_KEY}`;
      try {
        const response = await fetch(videoList_url);
        const result = await response.json();
        setTimeout(() => {
          setData((prevData) => [...prevData, ...result.items]);
          setNextPageToken(result.nextPageToken || null);
          setLoading(false);
        }, 1000); // Delay added to make spinner visible
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    },
    [category]
  );

  useEffect(() => {
    setData([]); // Reset data when category changes
    fetchData();
  }, [category, fetchData]);

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextPageToken) {
          fetchData(nextPageToken);
        }
      });
      if (node) observer.current.observe(node);
    },
    [nextPageToken, fetchData]
  );

  return (
    <div className="feed">
      {data.map((item, index) => {
        const isLastItem = index === data.length - 1;
        return (
          <Link
            key={item.id}
            to={`video/${item.snippet.categoryId}/${item.id}`}
            className="card"
            ref={isLastItem ? lastElementRef : null}
          >
            <img src={item.snippet.thumbnails.medium.url} alt="" />
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {value_converter(item.statistics.viewCount)} views &bull;{" "}
              {moment(item.snippet.publishedAt).fromNow()}
            </p>
          </Link>
        );
      })}
      {loading && <div className="spinner"></div>}
    </div>
  );
}
