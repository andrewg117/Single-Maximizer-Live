import { useEffect, ReactNode } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

interface TokenCheckProps {
  children?: ReactNode;
}

// TODO: fix expired token
const TokenCheck = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTokenResult())
      .unwrap()
      .catch(() => {
        toast.error("Session Expired");
        // localStorage.removeItem("user");
        navigate("/home/signin");
      });
    // if (user === null) {
    //   dispatch(logout())
    //     .unwrap()
    //     .then(() => navigate("/home/signin"));
    //   toast.error("Login Expired");
    //   navigate("/home/signin");
    // }
    // return () => {
    //   toast.clearWaitingQueue();
    // };
  }, [dispatch, navigate, user]);

  return user === null ? <Navigate to="/home/signin" /> : <Outlet />;
};

export default TokenCheck;
