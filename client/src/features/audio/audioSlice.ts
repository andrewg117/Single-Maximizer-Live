import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import audioService, { audioType } from "./audioService";

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
  async (audioData: FormData, thunkAPI) => {
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

export const getAudio = createAsyncThunk(
  "audio/get",
  async (id: string, thunkAPI) => {
    try {
      return await audioService.getAudio(id);
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

export const updateAudio = createAsyncThunk(
  "audio/put",
  async (audioData: FormData, thunkAPI) => {
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
  async (id: string, thunkAPI) => {
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
        return { ...state, isLoading: true };
      })
      .addCase(postAudio.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          audio: action.payload,
        };
      })
      .addCase(postAudio.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getAudio.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getAudio.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          audio: action.payload,
        };
      })
      .addCase(getAudio.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(updateAudio.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateAudio.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          audio: action.payload,
        };
      })
      .addCase(updateAudio.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(deleteAudio.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(deleteAudio.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          audio: null,
        };
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      });
  },
});

export const { reset } = audioSlice.actions;
export default audioSlice.reducer;
