import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import emailService from "./emailService";

const initialState = {
  email: <any>Array,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const sendNewTrackEmail = createAsyncThunk(
  "email/newTrack",
  async (emailData: any, thunkAPI: any) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.sendEmail(emailData, token);
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    reset: (state) => {
      state.email = <any>Array;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNewTrackEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendNewTrackEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.email.push(action.payload);
      })
      .addCase(sendNewTrackEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = emailSlice.actions;
export default emailSlice.reducer;
