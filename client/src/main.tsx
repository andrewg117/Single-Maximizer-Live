import React, { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { store } from "./app/store";
import MaximizerApp from "./MaximizerApp";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import EmailSignUp from "./pages/EmailSignUp";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
const Profile = lazy(() => import("./pages/Profile"));
import ProfileEdit from "./pages/ProfileEdit";
import Singles from "./pages/Singles";
import SingleEdit from "./pages/SingleEdit";
import SingleView from "./pages/SingleView";
import NewRelease from "./pages/NewRelease";
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
import TokenCheck from "./components/TokenCheck";
import Spinner from "./components/Spinner";
import "./css/style.module.css";
// TODO: Add ErrorBoundary
// Create redirect for incorrect urls

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

const elementRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<MaximizerApp />}
      errorElement={<div>Error</div>}
    >
      <Route
        path="/home"
        element={<Home />}
      />
      <Route
        path="/home/aboutus"
        element={<AboutUs />}
      />
      <Route
        path="/home/faq"
        element={<FAQ />}
      />
      <Route
        path="/home/signup/:token"
        element={<SignUp />}
      />
      <Route
        path="/home/emailsignup"
        element={<EmailSignUp />}
      />
      <Route
        path="/home/signin"
        element={<SignIn />}
      />
      <Route
        path="/home/forgotpassword"
        element={<ForgotPassword />}
      />
      <Route
        path="/home/resetpassword/:token"
        element={<ResetPassword />}
      />
      <Route element={<TokenCheck />}>
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Spinner />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/profile/editprofile"
          element={<ProfileEdit />}
        />
        <Route
          path="/profile/singles"
          element={<Singles />}
        />
        <Route
          path="/profile/singleedit/:id"
          element={<SingleEdit />}
        />
        <Route
          path="/profile/singleview/:id"
          element={<SingleView />}
        />
        <Route
          path="/profile/newrelease"
          element={<NewRelease />}
        />
        <Route
          path="/profile/checkoutpage"
          element={
            <Suspense fallback={<Spinner />}>
              <CheckoutPage />
            </Suspense>
          }
        />
      </Route>
    </Route>
  )
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MaximizerApp />,
    errorElement: <div>Error</div>,
    children: [
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
      {
        path: "/profile",
        element: <Profile />,
        loader: () => <TokenCheck />,
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
        element: <CheckoutPage />,
      },
      {
        path: "/profile/newrelease",
        element: <NewRelease />,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider
        router={elementRouter}
        fallbackElement={<Spinner />}
      />
    </Provider>
  </React.StrictMode>
);
