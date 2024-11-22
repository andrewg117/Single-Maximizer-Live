import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageService, { imageType } from "./imageService";

interface initialType {
  image: imageType | null;
  press: Array<any>;
  isError: Boolean;
  isSuccess: Boolean;
  isPressSuccess: Boolean;
  isLoading: Boolean;
  message: string;
}

const initialState: initialType = {
  image: null,
  press: [],
  isError: false,
  isSuccess: false,
  isPressSuccess: false,
  isLoading: false,
  message: "",
};

export const postImage = createAsyncThunk(
  "image/post",
  async (imageData: FormData, thunkAPI) => {
    try {
      return await imageService.postImage(imageData);
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

export const postPress = createAsyncThunk(
  "press/post",
  async (pressData: FormData, thunkAPI) => {
    try {
      return await imageService.postPress(pressData);
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

export const getImage = createAsyncThunk(
  "image/get",
  async (imageData: { trackID?: string; section: string }, thunkAPI) => {
    try {
      return await imageService.getImage(imageData);
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

export const getPress = createAsyncThunk(
  "press/get",
  async (pressData: { trackID: string }, thunkAPI) => {
    try {
      return await imageService.getPress(pressData);
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

export const updateImage = createAsyncThunk(
  "image/put",
  async (imageData: FormData, thunkAPI) => {
    try {
      return await imageService.updateImage(imageData);
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

export const deleteImage = createAsyncThunk(
  "image/delete",
  async (trackID: string, thunkAPI) => {
    try {
      return await imageService.deleteImage(trackID);
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

export const deletePress = createAsyncThunk(
  "press/delete",
  async (trackID: string, thunkAPI) => {
    try {
      return await imageService.deletePress(trackID);
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

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    reset: (state) => {
      state.image = null;
      state.press = [];
      state.isError = false;
      state.isSuccess = false;
      state.isPressSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postImage.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(postImage.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          image: action.payload,
        };
      })
      .addCase(postImage.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(postPress.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(postPress.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          press: [...state.press, action.payload],
        };
      })
      .addCase(postPress.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getImage.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getImage.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          image: action.payload,
        };
      })
      .addCase(getImage.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getPress.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getPress.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isPressSuccess: true,
          press: action.payload,
        };
      })
      .addCase(getPress.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(updateImage.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          image: action.payload,
        };
      })
      .addCase(updateImage.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(deleteImage.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(deleteImage.fulfilled, (state) => {
        return { ...state, isLoading: false, isSuccess: true, image: null };
      })
      .addCase(deleteImage.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(deletePress.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(deletePress.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isPressSuccess: true,
          image: null,
          press: state.press.filter((item: any) => item._id !== action.payload),
        };
      })
      .addCase(deletePress.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      });
  },
});

export const { reset } = imageSlice.actions;
export default imageSlice.reducer;
