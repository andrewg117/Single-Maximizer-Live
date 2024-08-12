import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useImageState } from "../customHooks/imageHooks";
import { useSingleGenres } from "../customHooks/trackHooks";
import {
  getUser,
  updateUser,
  reset as resetUser,
} from "../features/auth/authSlice";
import {
  createTrack,
  reset as resetTracks,
} from "../features/tracks/trackSlice";
import {
  postImage,
  postPress,
  reset as resetImage,
} from "../features/image/imageSlice";
import { postAudio, reset as resetAudio } from "../features/audio/audioSlice";
import ImageUpload from "../components/ImageUpload";
import AudioUpload from "../components/AudioUpload";
import PressUpload from "../components/PressUpload";
import ConfirmAlert from "../components/ConfirmAlert";
import GenreCheckBox from "../components/GenreCheckBox";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import styles from "../css/new_release_style.module.css";

const convertDate = (date: Date | number) => {
  const d = new Date(date);

  const year = d.toLocaleString("default", {
    year: "numeric",
    timeZone: "UTC",
  });
  const month = d.toLocaleString("default", {
    month: "2-digit",
    timeZone: "UTC",
  });
  const day = d.toLocaleString("default", { day: "2-digit", timeZone: "UTC" });

  let returnDate = year + "-" + month + "-" + day;

  return returnDate;
};

function NewRelease() {
  const today = new Date();
  const graceDate = convertDate(today.setDate(today.getDate() + 1));

  const { imageState: trackCover, changeImageFile } = useImageState();

  const { genres, changeGenreList } = useSingleGenres();

  interface stateType {
    trackAudio: any;
    trackPress: Array<any>;
    s3ImageURL: string;
    s3AudioURL: string;
  }

  const [formState, setFormState] = useState<stateType>({
    trackAudio: null,
    trackPress: [],
    s3ImageURL: "",
    s3AudioURL: "",
  });

  const { trackAudio, trackPress } = formState;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { isLoading, isError, message } = useAppSelector(
    (state) => state.tracks
  );
  const [showPopup, setShowPopup] = useState(false);

  const formRefData = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    return () => {
      toast.dismiss(message);
    };
  }, [isError, message]);

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then((data) => {
        if (data.trackAllowance === 0) {
          navigate("/profile/checkoutpage");
        }
      })
      .catch((err) => console.error(err));

    return () => {
      dispatch(resetUser());
      dispatch(resetTracks());
      dispatch(resetImage());
      dispatch(resetAudio());
    };
  }, [dispatch, navigate]);

  const onSubmit = async () => {
    if (isError) {
      toast.error(message);
    }

    if (
      trackCover instanceof FormData &&
      trackAudio !== null &&
      trackPress.length &&
      genres.length &&
      user &&
      formRefData.current
    ) {
      let audioData = new FormData();
      audioData.append("trackAudio", trackAudio.get("trackAudio") as Blob);

      let imageData = new FormData();
      imageData.append("Image", trackCover.get("Image") as Blob);
      imageData.append("section", "cover");

      let pressData = new FormData();
      trackPress.forEach((item) => {
        pressData.append("Press", item);
      });
      pressData.append("section", "press");

      dispatch(
        createTrack({
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
        .then((data) => {
          const trackID = data._id;

          audioData.append("trackID", trackID);
          dispatch(postAudio(audioData));

          imageData.append("trackID", trackID);
          dispatch(postImage(imageData));

          pressData.append("trackID", trackID);
          dispatch(postPress(pressData));

          dispatch(updateUser({ trackAllowance: user.trackAllowance - 1 }));
        });

      setFormState((prevState) => ({
        ...prevState,
        trackAudio: null,
      }));
      toast.success("Single Created");
      navigate("/profile/singles");
      setShowPopup(false);
    } else {
      setShowPopup(false);
      toast.error("Update Fields");
    }
  };

  const closeConfirm = () => {
    setShowPopup(false);
  };

  if (isLoading) {
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
                  changeFile={changeImageFile}
                  file={trackCover}
                  altText={"Upload Track Cover"}
                />
                <p>
                  Size Limit:{" "}
                  {trackCover instanceof FormData
                    ? trackCover.get("size")?.toString()
                    : "0"}{" "}
                  / 10 MB
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
                  />
                </div>
              </div>
            </div>
            <div className={styles.file_input_div}>
              <div>
                <label className={styles.required}>AUDIO UPLOAD</label>
                <AudioUpload
                  changeFile={setFormState}
                  file={trackAudio}
                  fieldname={"trackAudio"}
                />
                <p>
                  Size Limit: {trackAudio ? trackAudio.get("size") : 0} / 21 MB
                </p>
              </div>
            </div>
            <div className={styles.file_input_div}>
              <div>
                <label className={styles.required}>PRESS PHOTOS</label>
                <PressUpload
                  changeFile={setFormState}
                  trackPress={trackPress}
                />
              </div>
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
                  defaultValue={graceDate}
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
                />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD LINK</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter the track's Soundcloud link"
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
                />
              </div>
              <div>
                <label htmlFor="ytube">YOUTUBE LINK</label>
                <input
                  className={styles.new_input}
                  type="text"
                  id="ytube"
                  name="ytube"
                  placeholder="Enter the Youtube video link"
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
                    changeList={changeGenreList}
                    list={genres}
                  />
                </section>
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="trackSum"
                >
                  TRACK SUMMARY
                </label>
                <textarea
                  required
                  name="trackSum"
                  id="trackSum"
                  cols={30}
                  rows={10}
                  placeholder="Enter your track details here"
                />
              </div>
            </div>
            <div className={styles.full_input_div}>
              <div>
                <label htmlFor="pressSum">RECENT PRESS</label>
                <textarea
                  name="pressSum"
                  id="pressSum"
                  cols={30}
                  rows={10}
                  placeholder="Enter recent accomplishments"
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
              <Link
                to={"/profile"}
                className={styles.profile_btn}
              >
                CANCEL
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewRelease;
