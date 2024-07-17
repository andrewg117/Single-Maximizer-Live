import { useEffect, ReactNode } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

interface TokenCheckProps {
  children?: ReactNode;
}

const TokenCheck = ({ children}: TokenCheckProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

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
