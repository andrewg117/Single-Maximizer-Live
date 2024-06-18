import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingle, reset as resetSingle } from "../features/tracks/trackSlice";
import {
  getImage,
  getPress,
  reset as resetImage,
} from "../features/image/imageSlice";
import { getAudio, reset as resetAudio } from "../features/audio/audioSlice";
// import PressEdit from "../components/PressEdit";
import AudioPlayer from "react-h5-audio-player";
import PressView from "../components/PressView";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { Buffer } from "buffer";
import styles from "../css/singleview_style.module.css";
import "react-h5-audio-player/lib/styles.css";

const SingleDiv = ({ labelID, text, data }) => {
  return (
    <div>
      <label htmlFor={labelID}>{text}</label>
      <p
        id={labelID}
        name={labelID}
      >
        {data}
      </p>
    </div>
  );
};

function SingleView() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { single, isLoading, isError, message } = useSelector(
    (state) => state.tracks
  );

  const {
    image,
    isLoading: imageLoading,
    press,
    isPressSuccess,
  } = useSelector((state) => state.image);

  const { audio, isLoading: audioLoading } = useSelector(
    (state) => state.audio
  );

  const { id } = useParams();

  const checkDate = (date) => {
    const check = new Date(date).getUTCFullYear();
    if (check === 1970) {
      return null;
    }

    return new Date(date).toLocaleDateString("en-US", { timeZone: "UTC" });
  };

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message });
    }

    return () => {
      toast.dismiss(message);
    };
  }, [isError, message]);

  useEffect(() => {
    dispatch(getSingle(id))
      .unwrap()
      .catch((error) => console.error(error));

    dispatch(
      getImage({
        trackID: id,
        section: "cover",
      })
    )
      .unwrap()
      .catch((error) => console.error(error));

    dispatch(
      getPress({
        trackID: id,
      })
    )
      .unwrap()
      .catch((error) => console.error(error));

    dispatch(getAudio(id))
      .unwrap()
      .catch((error) => console.error(error));

    return () => {
      dispatch(resetSingle());
      dispatch(resetImage());
      dispatch(resetAudio());
    };
  }, [id, dispatch]);

  const goBackToSingles = (e) => {
    e.preventDefault();
    navigate("/profile/singles");
  };

  if (isLoading || imageLoading || audioLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id={styles.content_right}>
        <form id={styles.view_form}>
          <div id={styles.view_form_div}>
            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>COVER ART</label>
                <img
                  src={`data:image/*;base64,${
                    image ? Buffer.from(image.file.buffer, "ascii") : null
                  }`}
                  alt="Cover"
                />
              </div>
            </div>
            <div className={styles.file_input_div}>
              <label>AUDIO UPLOAD</label>
              <AudioPlayer
                src={audio?.s3AudioURL}
                controls
                layout="horizontal"
                autoPlayAfterSrcChange={false}
                volume={0.2}
              />
              <br />
            </div>
            <div className={styles.file_input_div}>
              <label>PRESS PHOTOS</label>
              {isPressSuccess ? (
                <PressView trackPress={press ? press : []} />
              ) : (
                <></>
              )}
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="artist"
                text="ARTIST NAME"
                data={single?.artist}
              />

              <SingleDiv
                labelID="trackTitle"
                text="TRACK NAME"
                data={single?.trackTitle}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="deliveryDate"
                text="DELIVERY DATE"
                data={checkDate(single?.deliveryDate)}
              />
              <SingleDiv
                labelID="spotify"
                text="SPOTIFY TRACK URI"
                data={single?.spotify}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="features"
                text="FEATURES"
                data={single?.features}
              />
              <SingleDiv
                labelID="applelink"
                text="APPLE MUSIC TRACK LINK"
                data={single?.apple}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="producer"
                text="PRODUCER"
                data={single?.producer}
              />
              <SingleDiv
                labelID="scloudlink"
                text="PRODSOUNDCLOUD LINKUCER"
                data={single?.scloud}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="album"
                text="ALBUM"
                data={single?.album}
              />
              <SingleDiv
                labelID="ytubelink"
                text="YOUTUBE LINK"
                data={single?.ytube}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="albumDate"
                text="ALBUM RELEASE DATE"
                data={checkDate(single?.albumDate)}
              />
              <SingleDiv
                labelID="trackLabel"
                text="LABEL"
                data={single?.trackLabel}
              />
            </div>
            <div className={styles.input_div}>
              <SingleDiv
                labelID="genres"
                text="GENRES"
                data={single?.genres?.join(", ")}
              />
            </div>
            <div className={styles.full_input_div}>
              <SingleDiv
                labelID="trackSum"
                text="TRACK SUMMARY"
                data={single?.trackSum}
              />
            </div>
            <div className={styles.full_input_div}>
              <SingleDiv
                labelID="pressSum"
                text="RECENT PRESS"
                data={single?.pressSum}
              />
            </div>
            <div id={styles.submit_div}>
              <button
                className={styles.profile_btn}
                onClick={goBackToSingles}
              >
                SINGLES
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SingleView;
