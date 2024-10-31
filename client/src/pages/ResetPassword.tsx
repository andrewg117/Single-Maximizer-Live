import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  resetPass,
  emailData,
  reset as resetUser,
} from "../features/auth/authSlice";
import LazyBackground from "../components/LazyBackground";
import {
  passwordReqTypes,
  PasswordRequirementsList,
} from "../components/PasswordCheck";
import Spinner from "../components/Spinner";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signinImage from "../images/signinImage.png";
import styles from "../css/sign_in_style.module.css";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const [passwordReq, setPasswordReq] = useState<passwordReqTypes>({
    length: false,
    numbers: false,
    specialCharacters: false,
    uppercase: false,
    lowercase: false,
  });

  const { password, password2 } = formData;

  const [isReset, setIsReset] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, message } = useAppSelector((state) => state.auth);

  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(emailData(token as string))
      .unwrap()
      .catch((error) => {
        toast.error("Login Expired", error);
        toast.clearWaitingQueue();
        navigate("/home/signin");
      });

    return () => {
      dispatch(resetUser());
      toast.dismiss();
    };
  }, [isError, message, token, dispatch, navigate]);

  // COMPLETE: Add password restrictions (8-12 characters, numbers, special characters, etc.)
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
    // Check password target

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
    } else if (
      Object.values(passwordReq).includes(false) ||
      password !== password2
    ) {
      toast.error("Passwords do not match");
    } else {
      const userData: { token: string | any; password: string } = {
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

  const toSignIn = (e: any) => {
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
                      className={styles.signin_submit}
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
                  <div className={styles.submit_div}>
                    <button
                      type="submit"
                      className={styles.signin_submit}
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
