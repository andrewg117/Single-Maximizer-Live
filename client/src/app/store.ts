import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import trackReducer from "../features/tracks/trackSlice";
import emailReducer from "../features/email/emailSlice";
import imageReducer from "../features/image/imageSlice";
import audioReducer from "../features/audio/audioSlice";
import purchaseReducer from "../features/purchace/purchaseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracks: trackReducer,
    email: emailReducer,
    image: imageReducer,
    audio: audioReducer,
    purchase: purchaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
