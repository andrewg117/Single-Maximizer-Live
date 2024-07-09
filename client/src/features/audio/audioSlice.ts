import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import audioService from "./audioService";

interface audioType extends Object {
  trackID: string;
  s3AudioURL: String;
  section: String;
  file: any;
}

interface initialType {
  audio: audioType | null;
  isError: Boolean;
  isSuccess: Boolean;
  isLoading: Boolean;
  message: string;
}

const initialState: initialType = {
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

export const getAudio = createAsyncThunk("audio/get", async (id: string, thunkAPI) => {
  try {
    return await audioService.getAudio(id);
  } catch (error: any) {
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

export const deleteAudio = createAsyncThunk(
  "audio/delete",
  async (id, thunkAPI) => {
    try {
      return await audioService.deleteAudio(id);
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

export const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    reset: (state) => {
      state.audio = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
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
        state.message = action.payload as string;
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
        state.message = action.payload as string;
      })
      .addCase(updateAudio.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.isExpired = false;
        state.audio = action.payload;
      })
      .addCase(updateAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
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
        state.message = action.payload as string;
      });
  },
});

export const { reset } = audioSlice.actions;
export default audioSlice.reducer;
