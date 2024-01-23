import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser } from "../features/auth/authSlice";
import {
  makePurchase,
  getPurchase,
  reset as resetPurchase,
} from "../features/purchace/purchaseSlice";
import { toast } from "react-toastify";
import SMLogo from "../images/Single-Maximizer-Package-Mockup-1024x616.png.webp";
import styles from "../css/checkout.module.css";

const ProductDisplay = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: remove stripe link for demo
  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(makePurchase())
      .unwrap()
      .then((data) => {
        window.location.href = data
      })
  }

  // Demo Submit
  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(makePurchase())
  //     .unwrap()
  //     .then(() => {
  //       toast.success("Purchase Successful");
  //       navigate("/profile/newrelease");
  //     })
  //     .catch((err) => console.error(err));
  // };

  return (
    <section id={styles.profile_content_right}>
      <div className={styles.div_item}>
        <img
          src={SMLogo}
          alt="Single Maximizer"
          id={styles.logo}
        />
      </div>
      <div className={styles.div_item}>
        <form
          id={styles.checkout_form}
          onSubmit={onSubmit}
        >
          <div id={styles.description}>
            <h1>Purchase New Single</h1>
            <h5>
              {
                "The Single Maximizer is $50. When you click ‘Purchase’ you will be taken to a checkout page to complete payment."
              }
            </h5>
          </div>
          <button
            type="submit"
            id={styles.submit}
          >
            Purchase
          </button>
        </form>
      </div>
    </section>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then((data) => {
        if (data.trackAllowance > 0) {
          navigate("/profile/newrelease");
        }
      })
      .catch((err) => console.error(err));

    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      dispatch(getPurchase());
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      toast.info("Order canceled");
    }
    return () => {
      dispatch(resetPurchase());
    };
  }, [dispatch, navigate, user?.trackAllowance]);

  return message ? <Message message={message} /> : <ProductDisplay />;
}

export default CheckoutPage;
