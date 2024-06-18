import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { emailData, register, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signupImage from "../images/signupImage.png";
import styles from "../css/sign_in_style.module.css";

function SignUp() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const { fname, lname, username, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const { token } = useParams();

  useEffect(() => {
    dispatch(emailData(token))
      .unwrap()
      .then((data) => {
        setFormData((prevState) => ({
          ...prevState,
          email: data.id,
        }));
      })
      .catch((error) => {
        toast.error("Login Expired", { id: error });
        toast.clearWaitingQueue();
        navigate("/home/emailsignup");
      });

    return () => {
      dispatch(reset());
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
        fname,
        lname,
        username,
        email,
        password,
      };

      dispatch(register(userData))
        .unwrap()
        .then(() => {
          navigate("/profile");
        })
        .catch((error) => toast.error(error));
    }
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
            style={{ backgroundImage: `url(${signupImage})` }}
          ></div>

          <div id={styles.block_right}>
            <img
              src={SMLogo}
              alt="Home"
              id={styles.logo}
            />
            <form
              id={styles.signin_form}
              onSubmit={onSubmit}
            >
              <div className={styles.signin_form_div}>
                <div id={styles.f_lname_div}>
                  <div>
                    <label htmlFor="fname">FIRST NAME</label>
                    <input
                      className={styles.signin_input}
                      type="text"
                      id="fname"
                      name="fname"
                      value={fname}
                      onChange={onChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lname">LAST NAME</label>
                    <input
                      className={styles.signin_input}
                      type="text"
                      id="lname"
                      name="lname"
                      value={lname}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <label htmlFor="username">USERNAME</label>
                <input
                  type="text"
                  className={styles.signin_input}
                  id="username"
                  name="username"
                  value={username}
                  onChange={onChange}
                />
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  className={styles.signin_input}
                  id="email"
                  name="email"
                  defaultValue={email}
                  onChange={onChange}
                />
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
          </div>
        </section>
      </section>
    </>
  );
}

export default SignUp;
