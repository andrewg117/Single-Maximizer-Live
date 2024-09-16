import { Outlet, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NavBar from "./components/NavBar";
import NavBarLeft from "./components/NavBarLeft";
import styles from "./css/style.module.css";


function MaximizerApp() {
  const { user } = useAppSelector((state) => state.auth);
  // console.log(user);
  
  return (
    <>
      <section id={user !== null ? styles.profile_body_wrapper : styles.body_wrapper}>
        {user !== null ? <NavBarLeft /> : <NavBar />}

        {/* TODO: Find way to redirect if user is not logged in */}
        {/* {user === null ? (
              <Route
                path="*"
                element={<Home />}
              />
            ) : (
              <Route
                path="*"
                element={<Profile />}
              />
            )} */}
        <Navigate to={user ? "/profile" : "/home"} replace={true} />
        <Outlet />
      </section>
      <ToastContainer
        autoClose={3000}
        limit={1}
      />
    </>
  );
}

export default MaximizerApp;
