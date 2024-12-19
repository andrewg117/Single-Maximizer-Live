import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toast } from "react-toastify";
import { emailUser } from "../features/auth/authSlice";
import LazyBackground from "../components/LazyBackground";
import Spinner from "../components/Spinner";
import signupVal from "../validation/signupVal";
import SMLogo from "../images/single-maximizer-logo-white-text-1024x717.png.webp";
import signupImage from "../images/signupImage.png"; // TODO: replace image before deployment
import styles from "../css/sign_in_style.module.css";

// TODO: Implement Vest form testing

function EmailSignUp() {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { email } = formData;

  const [emailSent, setEmailSent] = useState(false);

  const [validationError, setValidationError] = useState<any>({});

  const dispatch = useAppDispatch();

  const { isLoading, isError, message } = useAppSelector((state) => state.auth);

  

  const onChange = (e: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    const validationResult = signupVal({...formData, ...{[e.target.name]: e.target.value}});

    if (validationResult.hasErrors()) {
      setValidationError(validationResult.getErrors()); 
    } else {
      setValidationError({}); 
    }
    
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const validationResult = signupVal(formData);

    if (isError) {
      toast.error(message);
    } else if (validationResult.hasErrors()) {
      toast.error("Add Valid Email");
    } else {
      dispatch(emailUser({ email, type: "register" }))
        .unwrap()
        .then(() => {
          setEmailSent(true);
        })
        .catch(() =>
          toast.error("User exists, use a different email or login")
        );
    }
  };

  const resendEmail = (e: any) => {
    e.preventDefault();

    dispatch(emailUser({ email, type: "register" }))
      .unwrap()
      .then(() => {
        setEmailSent(true);
      })
      .catch((error) => console.error(error));
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
            {/* <h1>Sign In</h1> */}
            {emailSent === false ? (
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
                  />
                  <p>{validationError.email && validationError.email}</p>
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
            ) : (
              <form
                id={styles.signin_form}
                onSubmit={resendEmail}
              >
                <div className={styles.signin_form_div}>
                  <h1>Check your email to register your account:</h1>
                  <h3>{email}</h3>
                  <section id={styles.signin_submit_section}>
                    <div className={styles.submit_div}>
                      <button
                        type="submit"
                        className={styles.signin_submit}
                      >
                        RESEND EMAIL
                      </button>
                    </div>
                  </section>
                </div>
              </form>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default EmailSignUp;
