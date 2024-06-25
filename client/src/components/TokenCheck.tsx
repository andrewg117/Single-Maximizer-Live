import React, { useEffect, ReactNode } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

interface Props {
  children?: ReactNode
  // any props that come into the component
}

const TokenCheck = ({ children, ...props }: Props) => {
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

  return <React.Fragment {...props}>{children} </React.Fragment> ?? <Outlet />;
};

export default TokenCheck;
