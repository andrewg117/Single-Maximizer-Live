import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTrack } from "../features/tracks/trackSlice";

function TrackForm() {
  const [trackTitle, setTrackTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [trackURL, setURL] = useState("");

  const minDate = () => {
    const date = new Date();
    const graceDate = new Date(date.setDate(date.getDate() + 7));

    const year = graceDate.toLocaleString("default", { year: "numeric" });
    const month = graceDate.toLocaleString("default", { month: "2-digit" });
    const day = graceDate.toLocaleString("default", { day: "2-digit" });

    return year + "-" + month + "-" + day + "T00:00";
  };

  const [deliveryDate, setDeliveryDate] = useState(minDate());

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(createTrack({ trackTitle, artist, trackURL, deliveryDate }));
    setTrackTitle("");
    setArtist("");
    setURL("");
    setDeliveryDate("");
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="trackTitle">Track</label>
          <input
            type="text"
            name="trackTitle"
            id="trackTitle"
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
          />
          <label htmlFor="artist">Artist</label>
          <input
            type="text"
            name="artist"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <label htmlFor="trackURL">URL</label>
          <input
            type="url"
            name="trackURL"
            id="trackURL"
            defaultValue={"http://"}
            onChange={(e) => setURL(e.target.value)}
          />
          <label htmlFor="deliveryDate">Delivery Date</label>
          <input
            type="datetime-local"
            name="deliveryDate"
            id="deliveryDate"
            min={minDate()}
            defaultValue={minDate()}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button
            className="btn btn-block"
            type="submit"
          >
            Add Track
          </button>
        </div>
      </form>
    </section>
  );
}

export default TrackForm;
