import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const TokenCheck = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTokenResult());
    if (!user) {
      dispatch(logout());
      toast.error("Login Expired");
      navigate("/home/signin");
    }
    // toast.clearWaitingQueue()
  }, [user, navigate, dispatch]);

  return children ?? <Outlet />;
};

export default TokenCheck;
