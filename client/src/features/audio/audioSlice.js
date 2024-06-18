import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import audioService from "./audioService";

const initialState = {
  audio: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const postAudio = createAsyncThunk(
  "audio/post",
  async (audioData, thunkAPI) => {
    try {
      return await audioService.postAudio(audioData);
    } catch (error) {
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

export const getAudio = createAsyncThunk("audio/get", async (id, thunkAPI) => {
  try {
    return await audioService.getAudio(id);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const updateAudio = createAsyncThunk(
  "audio/put",
  async (audioData, thunkAPI) => {
    try {
      return await audioService.updateAudio(audioData);
    } catch (error) {
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

export const deleteAudio = createAsyncThunk(
  "audio/delete",
  async (id, thunkAPI) => {
    try {
      return await audioService.deleteAudio(id);
    } catch (error) {
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

export const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.audio = action.payload;
      })
      .addCase(postAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.audio = action.payload;
      })
      .addCase(getAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExpired = false;
        state.audio = action.payload;
      })
      .addCase(updateAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAudio.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.audio = null;
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = audioSlice.actions;
export default audioSlice.reducer;
