import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import purchaseService from "./purchaseService";

const initialState = {
  purchase: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const makePurchase = createAsyncThunk(
  "purchase/post",
  async (_, thunkAPI) => {
    try {
      return await purchaseService.makePurchase();
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

export const getPurchase = createAsyncThunk(
  "purchase/get",
  async (_, thunkAPI) => {
    try {
      return await purchaseService.getPurchase();
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

export const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(makePurchase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makePurchase.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(makePurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPurchase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPurchase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchase = action.payload;
      })
      .addCase(getPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = purchaseSlice.actions;
export default purchaseSlice.reducer;
