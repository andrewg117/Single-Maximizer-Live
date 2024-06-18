import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  resetPass,
  emailData,
  reset as resetUser,
} from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signinImage from "../images/signinImage.png";
import styles from "../css/sign_in_style.module.css";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const { password, password2 } = formData;

  const [isReset, setIsReset] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const { token } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message, { id: message });
    }
    dispatch(emailData(token))
      .unwrap()
      .catch((error) => {
        toast.error("Login Expired", { id: error });
        toast.clearWaitingQueue();
        navigate("/home/signin");
      });

    return () => {
      dispatch(resetUser());
      toast.dismiss();
    };
  }, [isError, message, token, dispatch, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        token,
        password,
      };

      dispatch(resetPass(userData))
        .unwrap()
        .then(() => {
          setIsReset(true);
        })
        .catch((error) => console.error(error));
    }
  };

  const toSignIn = (e) => {
    e.preventDefault();
    navigate("/home/signin");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section id={styles.sign_in_wrapper}>
        <section id={styles.sign_in_content}>
          <div
            id={styles.block_left}
            style={{ backgroundImage: `url(${signinImage})` }}
          ></div>

          <div id={styles.block_right}>
            <img
              src={SMLogo}
              alt="Home"
              id={styles.logo}
            />
            <h1>Reset Password</h1>
            {isReset ? (
              <form
                id={styles.signin_form}
                onSubmit={toSignIn}
              >
                <div className={styles.signin_form_div}>
                  <h3>Password Reset Successful</h3>
                  <div className={styles.submit_div}>
                    <input
                      type="submit"
                      id={styles.signin_submit}
                      value="Login"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <form
                id={styles.signin_form}
                onSubmit={onSubmit}
              >
                <div className={styles.signin_form_div}>
                  <h3>Enter New Password</h3>
                  <label htmlFor="password">PASSWORD</label>
                  <input
                    type="password"
                    className={styles.signin_input}
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                  <label htmlFor="password2">CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    className={styles.signin_input}
                    id="password2"
                    name="password2"
                    value={password2}
                    onChange={onChange}
                  />
                  <div className={styles.submit_div}>
                    <button
                      type="submit"
                      id={styles.signin_submit}
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default ResetPassword;
