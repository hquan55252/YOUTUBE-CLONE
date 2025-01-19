import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { useEffect, useState } from "react";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router";

export default function PlayVideo() {
  const { videoId } = useParams();
  const [apiData, setApiData] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((response) => response.json())
      .then((data) => setApiData(data.items[0]));
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const fetchOtherData = async () => {
    // Fetch channel data
    const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    await fetch(channelData_url)
      .then((response) => response.json())
      .then((data) => setChannelData(data.items[0]));

    // fetch comment data
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}`;
    await fetch(comment_url)
      .then((response) => response.json())
      .then((data) => setCommentData(data.items));
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      {/* Title */}
      <h3>{apiData ? apiData.snippet.title : "Title here"}</h3>

      <hr />
      {/* Publisher */}
      <div className="publisher-controller">
        <div className="publisher">
          <img
            src={channelData ? channelData.snippet.thumbnails.default.url : ""}
            alt=""
          />
          <div>
            <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
            <span>
              {channelData
                ? value_converter(channelData.statistics.subscriberCount)
                : ""}{" "}
              Subscribers
            </span>
          </div>
          <button>Subcribe</button>
        </div>
        {/* controller */}
        <div className="controller">
          <div className="like-btn">
            <span>
              <img src={like} alt="" />{" "}
              {apiData ? value_converter(apiData.statistics.likeCount) : ""}
            </span>
            <span>|</span>
            <span>
              <img src={dislike} alt="" />
            </span>
          </div>
          <div className="share-btn">
            <span>
              <img src={share} alt="" /> Share
            </span>
          </div>
          <div className="">
            <span>
              <img src={save} alt="" /> Save
            </span>
          </div>
        </div>
      </div>

      {/* Video Description */}
      <div className="vid-description">
        <div className="description">
          {/* Video Info */}
          <div className="play-video-info">
            <p>
              {apiData ? value_converter(apiData.statistics.viewCount) : ""}{" "}
              views{" "}
              {apiData
                ? moment(apiData.snippet.publishedAt).fromNow()
                : " days ago"}
            </p>
          </div>
          <p className={isDescriptionExpanded ? "expanded" : "collapsed"}>
            {apiData ? apiData.snippet.description : "Loading description..."}
          </p>
          {apiData && apiData.snippet.description.length > 100 && (
            <button onClick={toggleDescription} className="toggle-description">
              ...{isDescriptionExpanded ? "Show less" : "more"}
            </button>
          )}
        </div>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : ""}{" "}
          Comments
        </h4>
        {/* Comment */}
        {commentData.map((item, index) => {
          return (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt=""
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                  <span>1 days ago</span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="" />
                  <span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
