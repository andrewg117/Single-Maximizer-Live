import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trackService from "./trackService";

const initialState = {
  tracks: <any>Array,
  single: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createTrack = createAsyncThunk(
  "tracks/post",
  async (trackData, thunkAPI) => {
    try {
      return await trackService.createTrack(trackData);
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

export const getTracks = createAsyncThunk(
  "tracks/getAll",
  async (_, thunkAPI) => {
    try {
      return await trackService.getTrack();
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

export const getSingle = createAsyncThunk(
  "tracks/single",
  async (id, thunkAPI) => {
    try {
      return await trackService.getSingle(id);
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

export const updateSingle = createAsyncThunk(
  "tracks/putSingle",
  async (args: any, thunkAPI) => {
    try {
      const { trackID, ...trackData } = args;

      return await trackService.updateSingle(trackID, trackData);
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

export const deleteTrack = createAsyncThunk(
  "tracks/delete",
  async (id, thunkAPI) => {
    try {
      return await trackService.deleteTrack(id);
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

export const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    reset: (state) => {
      state.tracks = [];
      state.single = {};
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.single = action.payload;
        state.tracks.push(action.payload);
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getTracks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tracks = action.payload;
      })
      .addCase(getTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getSingle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.single = action.payload;
      })
      .addCase(getSingle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateSingle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSingle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.isExpired = false;
        // console.log(action.payload._id)
        state.single = {
          ...state.single,
          ...action.payload,
        };
      })
      .addCase(updateSingle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(deleteTrack.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tracks = state.tracks.filter(
          (track: any) => track._id !== action.payload
        );
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = trackSlice.actions;
export default trackSlice.reducer;
