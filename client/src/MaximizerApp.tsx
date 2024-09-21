import {
  Outlet,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./app/store";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import EmailSignUp from "./pages/EmailSignUp";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Singles from "./pages/Singles";
import SingleEdit from "./pages/SingleEdit";
import SingleView from "./pages/SingleView";
import NewRelease from "./pages/NewRelease";
import TokenCheck from "./components/TokenCheck";
import Spinner from "./components/Spinner";
import NavBar from "./components/NavBar";
import NavBarLeft from "./components/NavBarLeft";
import styles from "./css/style.module.css";

const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <Navigate
        to={store.getState().auth.user === null ? "/home" : "/profile"}
        replace={true}
      />
    ),
    errorElement: <div>Error</div>,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <div>Error</div>,
    loader: () => store.getState().auth.user,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "home/aboutus",
        element: <AboutUs />,
      },
      {
        path: "home/faq",
        element: <FAQ />,
      },
      {
        path: "home/signup/:token",
        element: <SignUp />,
      },
      {
        path: "home/emailsignup",
        element: <EmailSignUp />,
      },
      {
        path: "home/signin",
        element: <SignIn />,
      },
      {
        path: "home/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "home/resetpassword/:token",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProfileLayout />,

    errorElement: <div>Error</div>,
    children: [
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/editprofile",
        element: <ProfileEdit />,
      },
      {
        path: "/profile/singles",
        element: <Singles />,
      },
      {
        path: "/profile/singleedit/:id",
        element: <SingleEdit />,
      },
      {
        path: "/profile/singleview/:id",
        element: <SingleView />,
      },
      {
        path: "/profile/checkoutpage",
        async lazy() {
          const { default: CheckoutPage } = await import(
            "./pages/CheckoutPage"
          );
          return {
            Component: CheckoutPage,
          };
        },
      },
      {
        path: "/profile/newrelease",
        element: <NewRelease />,
      },
    ],
  },
]);

function HomeLayout() {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <section id={styles.body_wrapper}>
        <NavBar />
        {user && (
          <Navigate
            to="/profile"
            replace={true}
          />
        )}
        <Outlet />
      </section>
      <ToastContainer
        autoClose={3000}
        limit={1}
      />
    </>
  );
}

function ProfileLayout() {
  return (
    <>
      <section id={styles.profile_body_wrapper}>
        <NavBarLeft />
        <TokenCheck />
      </section>
      <ToastContainer
        autoClose={3000}
        limit={1}
      />
    </>
  );
}

export default function MaximizerApp() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<Spinner />}
    />
  );
}
