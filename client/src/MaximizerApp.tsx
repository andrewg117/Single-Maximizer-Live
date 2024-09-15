import { Outlet, Route } from "react-router-dom";
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
  return (
    <>
      <section id={user ? styles.profile_body_wrapper : styles.body_wrapper}>
        {user ? <NavBarLeft /> : <NavBar />}
        
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
