import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js/pure";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { getUser, reset as resetUser } from "../features/auth/authSlice";
import {
  getCheckoutStatus,
  makeEmbeddedPurchase,
  reset as resetPurchase,
} from "../features/purchace/purchaseSlice";
import { toast } from "react-toastify";
import SMLogo from "../images/Single-Maximizer-Package-Mockup-1024x616.png.webp";
import styles from "../css/checkout.module.css";
const pk_key = import.meta.env.VITE_STRIPE_PKKEY.toString();
const stripePromise = await loadStripe(pk_key);

const CheckoutForm = () => {
  const dispatch = useAppDispatch();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    dispatch(makeEmbeddedPurchase())
      .unwrap()
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
    return () => {
      dispatch(resetUser());
      dispatch(resetPurchase());
    };
  }, [dispatch]);

  return (
    <div
      id="checkout"
      className={styles.embedded}
    >
     {stripePromise && <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ clientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>}
    </div>
  );
};

const ProductDisplay = () => {
  const [showCheckout, setShowCheckout] = useState(false);

  // TODO: remove stripe link for demo
  // Fix allowance update
  const onSubmit = (e: any) => {
    e.preventDefault();
    setShowCheckout(true);
    // dispatch(makePurchase())
    //   .unwrap()
    //   .then((data) => {
    //     window.location.href = data;
    //   });
  };

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
      {showCheckout ? (
        <>
          <CheckoutForm />
          <button
            id={styles.submit}
            onClick={() => setShowCheckout(false)}
          >
            CANCEL
          </button>
        </>
      ) : (
        <>
          <div className={styles.div_item}>
            <img
              src={SMLogo}
              alt="Single Maximizer"
              id={styles.logo}
              loading="lazy"
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
                PURCHASE
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
};

function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then((data: any) => {
        if (data.trackAllowance > 0) {
          navigate("/profile/newrelease");
        } else {
          navigate("/profile/checkoutpage");
        }
      })
      .catch((err) => console.error(err));

    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    const session_id = query.get("session_id");

    session_id
      ? dispatch(getCheckoutStatus(session_id as string))
          .unwrap()
          .then((data) => {
            if (data.status === "complete") {
              toast.success("Purchase Successful");
              navigate("/profile/newrelease");
            } else {
              toast.error("Purchase Unsuccessful");
              navigate("/profile/checkoutpage");
            }
          })
      : null;

    return () => {
      dispatch(resetUser());
      dispatch(resetPurchase());
    };
  }, [dispatch, navigate, user?.trackAllowance]);

  return <ProductDisplay />;
}

export default CheckoutPage;
