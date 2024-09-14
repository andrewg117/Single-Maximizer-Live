import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Spinner from "./components/Spinner";
import "./css/style.module.css";
// TODO: Add ErrorBoundary
// Migrate to RouterProvider

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);
const router = createBrowserRouter([
  {
    path: "*",
    element: <MaximizerApp />,
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "home/aboutus",
        element: <AboutUs />
      },
      {
        path: "home/faq",
        element: <FAQ />
      },
      {
        path: "home/signup/:token",
        element: <SignUp />
      },
      {
        path: "home/emailsignup",
        element: <EmailSignUp />
      },
      {
        path: "home/signin",
        element: <SignIn />
      },
      {
        path: "home/forgotpassword",
        element: <ForgotPassword />
      },
      {
        path: "home/resetpassword/:token",
        element: <ResetPassword />
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={<Spinner />} />
    </Provider>
  </React.StrictMode>
);
