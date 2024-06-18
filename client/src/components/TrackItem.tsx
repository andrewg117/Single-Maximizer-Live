import { useDispatch } from "react-redux";
import { deleteTrack } from "../features/tracks/trackSlice";

function TrackItem({ track }) {
  const dispatch = useDispatch();

  const onClick = (e) => {
    e.preventDefault();

    dispatch(deleteTrack(track._id));
  };

  return (
    <div className="track">
      <h2>{track.trackTitle}</h2>
      <h3>{track.artist}</h3>
      <h3>{track.trackURL}</h3>
      <div>
        <h4>Delivery Date</h4>
        <p>{new Date(track.deliveryDate).toLocaleString("en-us")}</p>
      </div>
      <button
        onClick={onClick}
        className="close"
      >
        X
      </button>
    </div>
  );
}

export default TrackItem;
