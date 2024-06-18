import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  updateUser,
  reset as resetUser,
} from "../features/auth/authSlice";
import {
  postImage,
  getImage,
  updateImage,
  reset as resetImage,
} from "../features/image/imageSlice";
import ImageUpload from "../components/ImageUpload";
import ConfirmAlert from "../components/ConfirmAlert";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import styles from "../css/profile_style.module.css";

function ProfileEdit() {
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const formRefData = useRef({});

  const { image, isLoading: imageLoading } = useSelector(
    (state) => state.image
  );

  const [formState, setFormState] = useState({
    profileImage: image ? Buffer.from(image.file.buffer, "ascii") : null,
  });

  const { profileImage } = formState;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message });
    }

    return () => {
      toast.dismiss(message);
    };
  }, [isError, message]);

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .catch((error) => console.error(error));

    dispatch(getImage({ section: "avatar" }))
      .unwrap()
      .catch((error) => console.error(error));

    return () => {
      dispatch(resetUser());
      dispatch(resetImage());
    };
  }, [dispatch]);

  const onSubmit = () => {
    if (isError) {
      toast.error(message);
    }

    if (profileImage !== null && user) {
      dispatch(
        updateUser({
          fname: formRefData.current["fname"].value,
          lname: formRefData.current["lname"].value,
          username: formRefData.current["username"].value,
          website: formRefData.current["website"].value,
          scloud: formRefData.current["scloud"].value,
          twitter: formRefData.current["twitter"].value,
          igram: formRefData.current["igram"].value,
          fbook: formRefData.current["fbook"].value,
          spotify: formRefData.current["spotify"].value,
          ytube: formRefData.current["ytube"].value,
          tiktok: formRefData.current["tiktok"].value,
          bio_text: formRefData.current["bio_text"].value,
        })
      )
        .unwrap()
        .then(() => {
          if (image === null) {
            let imageData = new FormData();
            imageData.append("Image", profileImage.get("Image"));
            imageData.append("section", "avatar");
            dispatch(postImage(imageData)).catch((error) =>
              console.error(error)
            );
          } else if (profileImage instanceof FormData) {
            let imageData = new FormData();
            imageData.append("Image", profileImage.get("Image"));
            imageData.append("section", "avatar");
            dispatch(updateImage(imageData)).catch((error) =>
              console.error(error)
            );
          }
        })
        .catch((error) => console.error(error));

      toast.success("Update Successful");
      navigate("/profile");
      setShowPopup(false);
    } else {
      setShowPopup(false);
      toast.error("Upload Avatar");
    }
  };

  const closeConfirm = () => {
    setShowPopup(false);
  };

  if (isLoading || imageLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id={styles.edit_profile_content_right}>
        <form
          ref={formRefData}
          id={styles.profile_form}
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
          <div id={styles.profile_form_div}>
            <div id={styles.top_div}>
              <div id={styles.image_div}>
                <label>PROFILE AVATAR</label>
                <ImageUpload
                  changeFile={setFormState}
                  file={profileImage}
                  fieldname={"profileImage"}
                  altText={"Upload Profile Image"}
                />
                <p>
                  {profileImage instanceof FormData
                    ? `Size Limit: ${profileImage.get("size")} / 10 MB`
                    : null}
                </p>
              </div>
              <div></div>
            </div>

            <div className={styles.profile_input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="fname"
                >
                  FIRST NAME
                </label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id="fname"
                  name="fname"
                  placeholder="Enter your first name"
                  defaultValue={user?.fname}
                />
              </div>
              <div>
                <label
                  className={styles.required}
                  htmlFor="lname"
                >
                  LAST NAME
                </label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id="lname"
                  name="lname"
                  placeholder="Enter your last name"
                  defaultValue={user?.lname}
                />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label
                  className={styles.required}
                  htmlFor="username"
                >
                  USERNAME
                </label>
                <input
                  required
                  type="text"
                  className={styles.profile_input}
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  defaultValue={user?.username}
                />
              </div>
              <div>
                <label htmlFor="email">EMAIL</label>
                <p
                  className={styles.profile_input}
                  type="email"
                  id="email"
                  name="email"
                  style={{ border: "none" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="website">WEBSITE</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="website"
                  name="website"
                  placeholder="Enter your website starting with http://"
                  defaultValue={user?.website}
                />
              </div>
              <div>
                <label htmlFor="scloud">SOUNDCLOUD</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="scloud"
                  name="scloud"
                  placeholder="Enter your soundcloud link"
                  defaultValue={user?.scloud}
                />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="twitter">TWITTER</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="twitter"
                  name="twitter"
                  placeholder="Enter your twitter handle"
                  defaultValue={user?.twitter}
                />
              </div>
              <div>
                <label htmlFor="igram">INSTAGRAM</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="igram"
                  name="igram"
                  placeholder="Enter your instagram username"
                  defaultValue={user?.igram}
                />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="fbook">FACEBOOK</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="fbook"
                  name="fbook"
                  placeholder="Enter your facebook handle"
                  defaultValue={user?.fbook}
                />
              </div>
              <div>
                <label htmlFor="spotify">SPOTIFY</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="spotify"
                  name="spotify"
                  placeholder="Enter your spotify URI"
                  defaultValue={user?.spotify}
                />
              </div>
            </div>
            <div className={styles.profile_input_div}>
              <div>
                <label htmlFor="ytube">YOUTUBE</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="ytube"
                  name="ytube"
                  placeholder="Enter your youtube profile link"
                  defaultValue={user?.ytube}
                />
              </div>
              <div>
                <label htmlFor="tiktok">TIKTOK</label>
                <input
                  className={styles.profile_input}
                  type="url"
                  id="tiktok"
                  name="tiktok"
                  placeholder="Enter your tiktok username"
                  defaultValue={user?.tiktok}
                />
              </div>
            </div>
            <div
              className={styles.profile_input_div}
              id={styles.profile_textarea_div}
            >
              <div>
                <label
                  className={styles.required}
                  htmlFor="bio_text"
                >
                  BIO
                </label>
                <textarea
                  required
                  name="bio_text"
                  id="bio_text"
                  cols="30"
                  rows="10"
                  placeholder="Enter your artist bio here"
                  defaultValue={user?.bio_text}
                ></textarea>
              </div>
            </div>
            <div id={styles.profile_submit_div}>
              <button
                type="submit"
                className={styles.profile_btn}
              >
                SAVE
              </button>
              <button
                onClick={() => navigate("/profile")}
                className={styles.profile_btn}
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

export default ProfileEdit;
