import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUser, reset as resetUser } from "../features/auth/authSlice";
import { getTracks, reset as resetTracks } from "../features/tracks/trackSlice";
import { toast } from "react-toastify";
import { FaEdit, FaEye } from "react-icons/fa";
import Spinner from "../components/Spinner";
import styles from "../css/singles_style.module.css";

function Singles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);
  const {
    tracks,
    isLoading: tracksLoading,
    isError,
    message,
  } = useSelector((state) => state.tracks);

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message });
    }

    return () => {
      toast.dismiss(message);
    };
  }, [isError, message]);

  useEffect(() => {
    dispatch(getUser());

    dispatch(getTracks())
      .unwrap()
      .catch((error) => console.error(error));

    return () => {
      dispatch(resetUser());
      dispatch(resetTracks());
    };
  }, [dispatch]);

  const editTrack = (e, id) => {
    e.preventDefault();

    navigate(`/profile/singleedit/${id}`);
  };
  
  const viewTrack = (e, id) => {
    e.preventDefault();

    navigate(`/profile/singleview/${id}`);
  };

  if (isLoading || tracksLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id={styles.content_right}>
        <div id={styles.table_div}>
          <table id={styles.singles_table}>
            <thead id={styles.singles_header}>
              <tr>
                <th className={styles.tblhide}>ARTIST</th>
                <th>TITLE</th>
                <th className={styles.tblhide}>DELIVERY DATE</th>
                <th>STATUS</th>
                <th>EDIT/VIEW</th>
              </tr>
            </thead>
            <tbody id={styles.singles_content}>
              {tracks.length ? (
                tracks?.map((track) => (
                  <tr key={track._id}>
                    <td className={styles.tblhide}>{track.artist}</td>
                    <td>{track.trackTitle}</td>
                    <td className={styles.tblhide}>
                      {new Date(track.deliveryDate).toLocaleDateString(
                        "en-US",
                        { timeZone: "UTC" }
                      )}
                    </td>
                    <td>
                      {track.deliveryDate ? (
                        <button
                          className={
                            track.isDelivered
                              ? styles.delivered
                              : styles.scheduled
                          }
                        >
                          {track.isDelivered ? "Delivered" : "Scheduled"}
                        </button>
                      ) : (
                        <button className={styles.pending}>{"Pending"}</button>
                      )}
                    </td>
                    <td>
                      {!track.isDelivered ? (
                        <FaEdit
                          onClick={(e) => editTrack(e, track._id)}
                          className={styles.edit_track}
                        />
                      ) : (
                        <FaEye
                          onClick={(e) => viewTrack(e, track._id)}
                          className={styles.edit_track}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No Tracks</td>
                </tr>
              )}
            </tbody>
          </table>
          {user && user.trackAllowance >= 1 ? (
            <Link
              id={styles.new_single}
              to={"/profile/newrelease"}
            >
              CREATE NEW SINGLE
            </Link>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Singles;
