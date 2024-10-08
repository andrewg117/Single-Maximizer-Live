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
        return { ...state, isLoading: true };
      })
      .addCase(makePurchase.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(makePurchase.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(makeEmbeddedPurchase.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(makeEmbeddedPurchase.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(makeEmbeddedPurchase.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getCheckoutStatus.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getCheckoutStatus.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          purchase: action.payload as any,
        };
      })
      .addCase(getCheckoutStatus.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      });
  },
});

export const { reset } = purchaseSlice.actions;
export default purchaseSlice.reducer;
