import { useParams } from "react-router";
import Recommended from "../../components/Recommended/Recommended";
import "./Video.css";
import PlayVideoS from "../../components/PlayVideo copy/PlayVideo";

export default function VideoS() {
  const { videoId, categoryId } = useParams();

  return (
    <div className="play-container">
      <PlayVideoS videoId={videoId} />
      <Recommended categoryId={categoryId} />
    </div>
  );
}
