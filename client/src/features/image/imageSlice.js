import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import imageService from "./imageService";

const initialState = {
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
  async (imageData, thunkAPI) => {
    try {
      return await imageService.postImage(imageData);
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

export const postPress = createAsyncThunk(
  "press/post",
  async (pressData, thunkAPI) => {
    try {
      return await imageService.postPress(pressData);
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

export const getImage = createAsyncThunk(
  "image/get",
  async (imageData, thunkAPI) => {
    try {
      return await imageService.getImage(imageData);
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

export const getPress = createAsyncThunk(
  "press/get",
  async (pressData, thunkAPI) => {
    try {
      return await imageService.getPress(pressData);
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

export const updateImage = createAsyncThunk(
  "image/put",
  async (imageData, thunkAPI) => {
    try {
      return await imageService.updateImage(imageData);
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

export const deleteImage = createAsyncThunk(
  "image/delete",
  async (trackID, thunkAPI) => {
    try {
      return await imageService.deleteImage(trackID);
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

export const deletePress = createAsyncThunk(
  "press/delete",
  async (trackID, thunkAPI) => {
    try {
      return await imageService.deletePress(trackID);
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

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.image = action.payload;
      })
      .addCase(postImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(postPress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postPress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.press = [...state.press, action.payload];
      })
      .addCase(postPress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.image = action.payload;
      })
      .addCase(getImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isPressSuccess = true;
        state.press = action.payload;
      })
      .addCase(getPress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExpired = false;
        state.image = action.payload;
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.image = null;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePress.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.image = null;
      })
      .addCase(deletePress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = imageSlice.actions;
export default imageSlice.reducer;
