import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { emailData, register, reset } from "../features/auth/authSlice";
import LazyBackground from "../components/LazyBackground";
import {
  passwordReqTypes,
  PasswordRequirementsList,
} from "../components/PasswordCheck";
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

  const [passwordReq, setPasswordReq] = useState<passwordReqTypes>({
    length: false,
    numbers: false,
    specialCharacters: false,
    uppercase: false,
    lowercase: false,
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, isError, message } = useAppSelector((state) => state.auth);

  const { token } = useParams();

  useEffect(() => {
    dispatch(emailData(token as string))
      .unwrap()
      .then((data: any) => {
        setFormData((prevState) => ({
          ...prevState,
          email: data?.id,
        }));
      })
      .catch((error) => {
        toast.error("Login Expired", error);
        toast.clearWaitingQueue();
        navigate("/home/emailsignup");
      });

    return () => {
      dispatch(reset());
    };
  }, [isError, message, token, dispatch, navigate]);

  const passwordRequirementCheck = (password: string) => {
    const numbers = /[0-9]/;
    const specialCharacters = /[$&+,:;=?@#|'<>%*^!]/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;

    setPasswordReq((prevState) => ({
      ...prevState,
      length: password.length < 8 || password.length > 12 ? false : true,
      numbers: !numbers.test(password) ? false : true,
      specialCharacters: !specialCharacters.test(password) ? false : true,
      uppercase: !uppercase.test(password) ? false : true,
      lowercase: !lowercase.test(password) ? false : true,
    }));
  };

  const onChange = (e: any) => {
    if (e.target.name === "password") {
      passwordRequirementCheck(e.target.value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

    if (Object.values(passwordReq).includes(false)) {
      toast.error("Password requirements not met");
    } else if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      const userData: {
        fname: string;
        lname: string;
        username: string;
        email: string;
        password: string;
      } = {
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
          <LazyBackground
            style={styles.block_left}
            imageUrl={signupImage}
          >
            <></>
          </LazyBackground>

          <div id={styles.block_right}>
            <img
              src={SMLogo}
              alt="Home"
              id={styles.logo}
              loading="lazy"
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
                      required
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
                      required
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
                  required
                  id="username"
                  name="username"
                  value={username}
                  onChange={onChange}
                />
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  className={styles.signin_input}
                  readOnly
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
                <section>
                  {password && (
                    <PasswordRequirementsList passwordReq={passwordReq} />
                  )}
                </section>
                <label htmlFor="password2">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  className={styles.signin_input}
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                />
                <p id={styles.password_match}>
                  {password2 && password !== password2
                    ? "Passwords Do Not Match"
                    : ""}
                </p>
                <section id={styles.signin_submit_section}>
                  <div className={styles.submit_div}>
                    <button
                      type="submit"
                      className={styles.signin_submit}
                    >
                      SUBMIT
                    </button>
                  </div>
                </section>
              </div>
            </form>
          </div>
        </section>
      </section>
    </>
  );
}

export default SignUp;
