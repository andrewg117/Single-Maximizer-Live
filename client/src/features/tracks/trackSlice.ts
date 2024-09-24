import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trackService, { singleType } from "./trackService";

interface initialType {
  tracks: Array<singleType>;
  single: singleType;
  isError: Boolean;
  isSuccess: Boolean;
  isLoading: Boolean;
  message: string;
}

const initialState: initialType = {
  tracks: [],
  single: {
    user: "",
    trackTitle: "",
    artist: "",
    deliveryDate: new Date(Date.now()),
    genres: [],
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createTrack = createAsyncThunk(
  "tracks/post",
  async (
    trackData: {
      trackTitle: string;
      artist: string;
      trackURL?: string;
      deliveryDate?: string;
      spotify?: string;
      features?: string;
      apple?: string;
      producer?: string;
      scloud?: string;
      album?: string;
      trackLabel?: string;
      ytube?: string;
      albumDate?: Date;
      genres?: Array<string>;
      trackSum?: string;
      pressSum?: string;
    },
    thunkAPI
  ) => {
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
  async (id: string, thunkAPI) => {
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
  async (
    args: {
      trackID: string;
      trackTitle: string;
      artist: string;
      deliveryDate?: string;
      spotify?: string;
      features?: string;
      apple?: string;
      producer?: string;
      scloud?: string;
      album?: string;
      trackLabel?: string;
      ytube?: string;
      albumDate?: Date;
      genres?: Array<any>;
      trackSum?: string;
      pressSum?: string;
    },
    thunkAPI
  ) => {
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
  async (id: string, thunkAPI) => {
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
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTrack.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          single: action.payload,
          tracks: [...state.tracks, action.payload],
        };
      })
      .addCase(createTrack.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getTracks.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getTracks.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          tracks: action.payload,
        };
      })
      .addCase(getTracks.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getSingle.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getSingle.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          single: action.payload,
        };
      })
      .addCase(getSingle.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(updateSingle.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateSingle.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          single: {
            ...state.single,
            ...action.payload,
          },
        };
      })
      .addCase(updateSingle.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(deleteTrack.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          tracks: state.tracks.filter(
            (track: any) => track._id !== action.payload
          ),
        };
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      });
  },
});

export const { reset } = trackSlice.actions;
export default trackSlice.reducer;
