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

export const makeEmbeddedPurchase = createAsyncThunk(
  "purchase/embedded",
  async (_, thunkAPI) => {
    try {
      return await purchaseService.makeEmbeddedPurchase();
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

export const getCheckoutStatus = createAsyncThunk(
  "purchase/get",
  async (session_id: string, thunkAPI) => {
    try {
      return await purchaseService.getCheckoutStatus(session_id);
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

export const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    reset: (state) => {
      state.purchase = {};
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
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
        state.message = action.payload as string;
      })
      .addCase(makeEmbeddedPurchase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeEmbeddedPurchase.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(makeEmbeddedPurchase.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getCheckoutStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCheckoutStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.purchase = action.payload;
      })
      .addCase(getCheckoutStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset } = purchaseSlice.actions;
export default purchaseSlice.reducer;
