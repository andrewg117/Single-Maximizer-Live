import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";
import LazyBackground from "../components/LazyBackground";
import ReCAPTCHA from "react-google-recaptcha";
import { login, loginGoogle, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signinImage from "../images/signinImage.png";
import styles from "../css/sign_in_style.module.css";

const CAPT_SITEKEY = import.meta.env.VITE_CAPT_SITEKEY.toString();
// const CAPT_SITEKEY = process.env["VITE_CAPT_SITEKEY"] as string;

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const captchaRef = useRef<any>(null);

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaExpired, setCaptchaExpired] = useState(true);

  const { isLoading, isError, message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(reset());
      toast.clearWaitingQueue();
    };
  }, [isError, message, navigate, dispatch]);

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onCheck = () => {
    setCaptchaChecked(true);
    setCaptchaExpired(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    const userData: { email: string; password: string; token: string } = {
      email,
      password,
      token,
    };

    if (!captchaExpired && captchaChecked) {
      dispatch(login(userData))
        .unwrap()
        .then(() => navigate("/profile"))
        .catch(() => {
          toast.error("Login Failed");
          setCaptchaChecked(false);
          setCaptchaExpired(true);
        });
    } else {
      console.log("Captcha Invalid");
      setCaptchaChecked(false);
      setCaptchaExpired(true);
    }
  };

  const googleButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const tokenData = { token: captchaRef.current.getValue() };
    captchaRef.current.reset();

    if (!captchaExpired && captchaChecked) {
      dispatch(loginGoogle(tokenData))
        .unwrap()
        .then((data: any) => {
          window.location.href = data;
        })
        .catch(() => toast.error("Login Failed"));
    } else {
      toast.error("Captcha Invalid");
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
            imageUrl={signinImage}
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
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  className={styles.signin_input}
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required={true}
                />
                <label htmlFor="pword">PASSWORD</label>
                <input
                  type="password"
                  className={styles.signin_input}
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required={true}
                />
                <Link
                  to={"/home/forgotpass"}
                  className={styles.signin_link}
                >
                  Forgot Password?
                </Link>
                <div className={styles.submit_div}>
                  <ReCAPTCHA
                    sitekey={CAPT_SITEKEY as string}
                    ref={captchaRef}
                    onChange={onCheck}
                    onExpired={() => {
                      setCaptchaExpired(true);
                    }}
                    // size="compact"
                  />
                </div>

                <div className={styles.submit_div}>
                  <button
                    type="submit"
                    className={styles.signin_submit}
                    disabled={captchaExpired || !captchaChecked}
                  >
                    SUBMIT
                  </button>
                </div>
                <div
                  className={styles.submit_div}
                  id={styles.signin_google}
                >
                  <button
                    type="button"
                    className={styles.signin_submit}
                    onClick={googleButton}
                    disabled={captchaExpired || !captchaChecked}
                  >
                    GOOGLE ACCOUNT
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

export default SignIn;
