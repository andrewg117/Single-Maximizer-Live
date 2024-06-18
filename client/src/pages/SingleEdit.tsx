import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingle,
  updateSingle,
  deleteTrack,
  reset as resetSingle,
} from "../features/tracks/trackSlice";
import {
  postPress,
  getImage,
  getPress,
  updateImage,
  deleteImage,
  deletePress,
  reset as resetImage,
} from "../features/image/imageSlice";
import {
  getAudio,
  deleteAudio,
  reset as resetAudio,
  updateAudio,
} from "../features/audio/audioSlice";
import ImageUpload from "../components/ImageUpload";
import AudioUpload from "../components/AudioUpload";
import PressEdit from "../components/PressEdit";
import ConfirmAlert from "../components/ConfirmAlert";
import GenreCheckBox from "../components/GenreCheckBox";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { Buffer } from "buffer";
import styles from "../css/new_release_style.module.css";

function SingleEdit() {
  const { user } = useSelector((state) => state.auth);
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

  const [showPopup, setShowPopup] = useState(false);
  const [showDelPopup, setShowDelPopup] = useState(false);

  const { id } = useParams();

  const formRefData = useRef({});

  const [formState, setFormState] = useState({
    genres: [],
    trackCover: null,
    trackAudio: null,
    trackPress: [],
    newPressList: [],
    deletePressList: [],
  });

  const { genres, trackCover, trackAudio, newPressList, deletePressList } =
    formState;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const convertDate = (date) => {
    const d = new Date(date);

    const year = d.toLocaleString("default", {
      year: "numeric",
      timeZone: "UTC",
    });
    const month = d.toLocaleString("default", {
      month: "2-digit",
      timeZone: "UTC",
    });
    const day = d.toLocaleString("default", {
      day: "2-digit",
      timeZone: "UTC",
    });

    let returnDate = year + "-" + month + "-" + day;

    return returnDate;
  };

  const today = new Date();
  const graceDate = convertDate(today.setDate(today.getDate() + 1));

  const onSubmit = () => {
    if (genres.length && user) {
      dispatch(
        updateSingle({
          trackID: id,
          trackTitle: formRefData.current["trackTitle"].value,
          artist: formRefData.current["artist"].value,
          deliveryDate: formRefData.current["deliveryDate"].value,
          spotify: formRefData.current["spotify"].value,
          features: formRefData.current["features"].value,
          apple: formRefData.current["apple"].value,
          producer: formRefData.current["producer"].value,
          scloud: formRefData.current["scloud"].value,
          album: formRefData.current["album"].value,
          trackLabel: formRefData.current["trackLabel"].value,
          ytube: formRefData.current["ytube"].value,
          albumDate: formRefData.current["albumDate"].value,
          genres,
          trackSum: formRefData.current["trackSum"].value,
          pressSum: formRefData.current["pressSum"].value,
        })
      )
        .unwrap()
        .then(() => {
          if (trackCover instanceof FormData) {
            let imageData = new FormData();
            imageData.append("Image", trackCover.get("Image"));
            imageData.append("trackID", id);
            imageData.append("section", "cover");
            dispatch(updateImage(imageData));
          }

          if (trackAudio instanceof FormData) {
            let audioData = new FormData();
            audioData.append("trackAudio", trackAudio.get("trackAudio"));
            audioData.append("trackID", id);
            dispatch(updateAudio(audioData));
          }

          if (newPressList.length > 0) {
            let pressData = new FormData();
            newPressList.forEach((item) => {
              pressData.append("Press", item);
            });
            pressData.append("trackID", id);
            pressData.append("section", "press");
            dispatch(postPress(pressData));
          }
          if (deletePressList.length > 0) {
            deletePressList.forEach((item) => {
              dispatch(deletePress(item._id));
            });
          }

          toast.success("Update Successful");
          navigate("/profile/singles");
          setShowPopup(false);
        });
    } else {
      setShowPopup(false);
      toast.error("Update Fields");
    }
  };

  const closeConfirm = () => {
    setShowPopup(false);
    setShowDelPopup(false);
  };

  const deleteSingle = () => {
    dispatch(deleteAudio(id))
      .unwrap()
      .then(() => {
        dispatch(deleteImage(id))
          .unwrap()
          .then(() => {
            dispatch(deleteTrack(id))
              .unwrap()
              .then(() => {
                toast.success("Single Deleted");
                navigate("/profile/singles");
                setShowDelPopup(false);
              });
          });
      });
  };

  const goBackToSingles = (e) => {
    e.preventDefault();
    navigate("/profile/singles");
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
      .then((data) => {
        setFormState((prevState) => ({
          ...prevState,
          genres: data.genres,
        }));
      })
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
      setShowPopup(false);
    };
  }, [id, dispatch]);

  if (isLoading || imageLoading || audioLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id={styles.content_right}>
        <form
          ref={formRefData}
          id={styles.new_form}
          onSubmit={(e) => {
            setShowPopup(() => {
              e.preventDefault();
              return true;
            });
          }}
        >
          {showPopup && (
            <ConfirmAlert
              message="Do you want to save these changes?"
              onConfirm={onSubmit}
              onCancel={closeConfirm}
            />
          )}

          <div id={styles.new_form_div}>
            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label className={styles.required}>COVER ART</label>
                <ImageUpload
                  changeFile={setFormState}
                  file={image ? Buffer.from(image.file.buffer, "ascii") : null}
                  fieldname={"trackCover"}
                  altText={"Upload Track Cover"}
                />
                <p>
                  {trackCover instanceof FormData
                    ? `Size Limit: ${trackCover.get("size")} / 10 MB`
                    : null}
                </p>
              </div>
              <div className={styles.top_input_div}>
                <div>
                  <label
                    className={styles.required}
                    htmlFor="artist"
                  >
                    ARTIST NAME
                  </label>
                  <input
                    required
                    className={styles.new_input}
                    type="text"
                    id="artist"
                    name="artist"
                    placeholder="Enter your artist name"
                    defaultValue={single?.artist}
                  />
                </div>
                <div>
                  <label
                    className={styles.required}
                    htmlFor="trackTitle"
                  >
                    TRACK NAME
                  </label>
                  <input
                    required
                    className={styles.new_input}
                    type="text"
                    id="trackTitle"
                    name="trackTitle"
                    placeholder="Enter the name of your track"
                    defaultValue={single?.trackTitle}
                  />
                </div>
              </div>
            </div>
            <div className={styles.file_input_div}>
              <label className={styles.required}>AUDIO UPLOAD</label>
              <AudioUpload
                changeFile={setFormState}
                file={audio ? audio.file : null}
                fieldname={"trackAudio"}
              />
              <p>
                {trackAudio instanceof FormData
                  ? `Size Limit: ${trackAudio.get("size")} / 21 MB`
                  : null}
              </p>
            </div>
            <div className={styles.file_input_div}>
              <label className={styles.required}>PRESS PHOTOS</label>
              {isPressSuccess ? (
                <PressEdit
                  changeFile={setFormState}
                  trackPress={press ? press : []}
                  newPressList={newPressList}
                  deletePressList={deletePressList}
                />
              ) : (
                <></>
              )}
            </div>
            <div className={styles.input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="deliveryDate"
                >
                  DELIVERY DATE
                </label>

                <input
                  required
                  className={styles.new_input}
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  min={graceDate}
                  defaultValue={convertDate(single?.deliveryDate)}
                />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY TRACK URI</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="spotify"
                  name="spotify"
                  placeholder="Enter the URI of your track on Spotify"
                  defaultValue={single?.spotify}
                />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="features">FEATURES</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="features"
                  name="features"
                  placeholder="Enter the names of features"
                  defaultValue={single?.features}
                />
              </div>
              <div>
                <label htmlFor="applelink">APPLE MUSIC TRACK LINK</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="apple"
                  name="apple"
                  placeholder="Enter your Apple Music track link"
                  defaultValue={single?.apple}
                />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="producer"
                >
                  PRODUCER
                </label>
                <input
                  required
                  className={styles.new_input}
                  type="text"
                  id="producer"
                  name="producer"
                  placeholder="Who produced the track?"
                  defaultValue={single?.producer}
                />
              </div>
              <div>
                <label htmlFor="scloudlink">SOUNDCLOUD LINK</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter the track's Soundcloud link"
                  defaultValue={single?.scloud}
                />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="album">ALBUM</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="album"
                  name="album"
                  placeholder="Is this song part of an album?"
                  defaultValue={single?.album}
                />
              </div>
              <div>
                <label htmlFor="ytubelink">YOUTUBE LINK</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="ytube"
                  name="ytube"
                  placeholder="Enter the Youtube video link"
                  defaultValue={single?.ytube}
                />
              </div>
            </div>
            <div className={styles.input_div}>
              <div>
                <label htmlFor="albumDate">ALBUM RELEASE DATE</label>
                <input
                  className={styles.new_input}
                  type="date"
                  id="albumDate"
                  name="albumDate"
                  defaultValue={convertDate(single?.albumDate)}
                />
              </div>
              <div>
                <label htmlFor="trackLabel">LABEL</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="trackLabel"
                  name="trackLabel"
                  placeholder="What is the Label for the track?"
                  defaultValue={single?.trackLabel}
                />
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="genres"
                >
                  GENRES
                </label>
                <section id={styles.checkboxlist}>
                  <GenreCheckBox
                    changeList={setFormState}
                    list={genres}
                  />
                </section>
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="tracksum"
                >
                  TRACK SUMMARY
                </label>
                <textarea
                  required
                  name="trackSum"
                  id="trackSum"
                  cols="30"
                  rows="10"
                  placeholder="Enter your track details here"
                  defaultValue={single?.trackSum}
                ></textarea>
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label htmlFor="press">RECENT PRESS</label>
                <textarea
                  name="pressSum"
                  id="pressSum"
                  cols="30"
                  rows="10"
                  placeholder="Enter recent accomplishments"
                  defaultValue={single?.pressSum}
                ></textarea>
              </div>
            </div>
            <div id={styles.submit_div}>
              <button
                type="submit"
                className={styles.profile_btn}
              >
                SAVE
              </button>
              <button
                className={styles.profile_btn}
                onClick={(e) => {
                  setShowDelPopup(() => {
                    e.preventDefault();
                    return true;
                  });
                }}
              >
                DELETE
              </button>
              {showDelPopup && (
                <ConfirmAlert
                  message="Do you want to delete this Single?"
                  onConfirm={deleteSingle}
                  onCancel={closeConfirm}
                />
              )}
              <button
                className={styles.profile_btn}
                onClick={goBackToSingles}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SingleEdit;
