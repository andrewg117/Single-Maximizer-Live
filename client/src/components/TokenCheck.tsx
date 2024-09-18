import { useEffect, ReactNode } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

interface TokenCheckProps {
  children?: ReactNode;
}

// TODO: Create loader function

const TokenCheck = ({ children }: TokenCheckProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTokenResult());
    if (!user === null) {
      dispatch(logout())
        .unwrap()
        .then(() => navigate("/home"));
      // toast.error("Login Expired");
    }
    // toast.clearWaitingQueue()
  }, [user, navigate, dispatch]);

  return children ?? <Outlet />;
};

export default TokenCheck;
