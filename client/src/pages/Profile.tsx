import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUser, reset as resetUser } from "../features/auth/authSlice";
import { getImage, reset as resetImage } from "../features/image/imageSlice";
import { Buffer } from "buffer";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import Spinner from "../components/Spinner";
import styles from "../css/profile_style.module.css";

const ProfileDiv = ({ labelID, text, userData }) => {
  return (
    <div>
      <label htmlFor={labelID}>{text}</label>
      <p
        id={labelID}
        name={labelID}
      >
        {userData}
      </p>
    </div>
  );
};

const Profile = () => {
  const { user, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );
  const { image, isLoading: imageLoading } = useSelector(
    (state) => state.image
  );

  const profileImage = image ? Buffer.from(image.file.buffer, "ascii") : null;

  const dispatch = useDispatch();

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

  if (isLoading || imageLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id={styles.profile_content_right}>
        <div id={styles.profile_view_div}>
          <div id={styles.top_div}>
            <div id={styles.image_div}>
              {profileImage ? (
                <img
                  src={`data:image/*;base64,${profileImage}`}
                  alt="Edit for Avatar"
                />
              ) : (
                <FaUser id={styles.defaultAvatar} />
              )}
            </div>
            <div id={styles.username_div}>{user?.username}</div>
          </div>
          <div id={styles.profile_body_div}>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="fname"
                text="FIRST NAME"
                userData={user?.fname}
              />
              <ProfileDiv
                labelID="lname"
                text="LAST NAME"
                userData={user?.lname}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="username"
                text="USERNAME"
                userData={user?.username}
              />
              <ProfileDiv
                labelID="email"
                text="EMAIL"
                userData={user?.email}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="website"
                text="WEBSITE"
                userData={user?.website}
              />
              <ProfileDiv
                labelID="scloud"
                text="SOUNDCLOUD"
                userData={user?.scloud}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="twitter"
                text="TWITTER"
                userData={user?.twitter}
              />
              <ProfileDiv
                labelID="igram"
                text="INSTAGRAM"
                userData={user?.igram}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="fbook"
                text="FACEBOOK"
                userData={user?.fbook}
              />
              <ProfileDiv
                labelID="spotify"
                text="SPOTIFY"
                userData={user?.spotify}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="ytube"
                text="YOUTUBE"
                userData={user?.ytube}
              />
              <ProfileDiv
                labelID="tiktok"
                text="TIKTOK"
                userData={user?.tiktok}
              />
            </div>
            <div className={styles.profile_data_div}>
              <ProfileDiv
                labelID="bio_text"
                text="BIO"
                userData={user?.bio_text}
              />
            </div>
            <div id={styles.profile_submit_div}>
              <Link
                to={"/profile/editprofile"}
                className={styles.profile_btn}
              >
                EDIT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
