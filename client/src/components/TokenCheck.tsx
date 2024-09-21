import { useEffect } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getTokenResult } from "../features/auth/authSlice";
import { toast } from "react-toastify";

const TokenCheck = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTokenResult())
      .unwrap()
      .catch(() => {
        toast.error("Session Expired");
        navigate("/home/signin");
      });
  }, [dispatch, navigate, user]);

  return user === null ? <Navigate to="/home/signin" /> : <Outlet />;
};

export default TokenCheck;
