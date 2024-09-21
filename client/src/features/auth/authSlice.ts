import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user") as string);

interface initialStateType {
  user: any | null;
  googleUser: any;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: initialStateType = {
  user: user ? user : null,
  googleUser: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (
    user: {
      fname: string;
      lname: string;
      username: string;
      email: string;
      password: string;
    },
    thunkAPI
  ) => {
    try {
      return await authService.register(user);
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

export const emailUser = createAsyncThunk(
  "auth/emailUser",
  async (userData: { email: string; type: string }, thunkAPI) => {
    try {
      return await authService.emailUser(userData);
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

export const emailData = createAsyncThunk(
  "auth/emailData",
  async (token: string, thunkAPI) => {
    try {
      return await authService.emailData(token);
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

export const login = createAsyncThunk(
  "auth/login",
  async (
    user: { email: string; password: string; token: string },
    thunkAPI
  ) => {
    try {
      return await authService.login(user);
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

export const loginGoogle = createAsyncThunk(
  "auth/login/google",
  async (token: any, thunkAPI) => {
    try {
      return await authService.loginGoogle(token);
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

export const resetPass = createAsyncThunk(
  "auth/reset",
  async (userData: { token: string; password: string }, thunkAPI) => {
    try {
      return await authService.reset(userData);
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

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    return await authService.getUser();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk(
  "auth/update",
  async (
    userData: {
      fname?: string;
      lname?: string;
      username?: string;
      website?: string;
      scloud?: string;
      twitter?: string;
      igram?: string;
      fbook?: string;
      spotify?: string;
      ytube?: string;
      tiktok?: string;
      bio_text?: string;
      trackAllowance?: Number;
    },
    thunkAPI
  ) => {
    try {
      return await authService.update(userData);
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

export const getTokenResult = createAsyncThunk("auth/token", (_, thunkAPI) => {
  try {
    return authService.checkToken();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const wakeServer = createAsyncThunk("auth/wakeserver", (_, thunkAPI) => {
  try {
    return authService.wakeServer();
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", () => {
  return authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.googleUser = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(register.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          user: action.payload,
        };
      })
      .addCase(register.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          user: null,
        };
      })
      .addCase(emailUser.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(emailUser.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(emailUser.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(emailData.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(emailData.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(emailData.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(login.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(login.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          user: action.payload,
        };
      })
      .addCase(login.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          user: null,
        };
      })
      .addCase(loginGoogle.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(loginGoogle.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          googleUser: action.payload,
        };
      })
      .addCase(loginGoogle.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          googleUser: null,
        };
      })
      .addCase(resetPass.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(resetPass.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(resetPass.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })

      .addCase(getUser.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getUser.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          user: action.payload,
        };
      })
      .addCase(getUser.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          user: null,
        };
      })
      .addCase(updateUser.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
          user: action.payload,
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
        };
      })
      .addCase(getTokenResult.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(getTokenResult.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(getTokenResult.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          user: null,
        };
      })
      .addCase(logout.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(logout.fulfilled, (state) => {
        return {
          ...state,
          user: null,
        };
      })
      .addCase(wakeServer.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(wakeServer.fulfilled, (state) => {
        return {
          ...state,
          isLoading: false,
          isSuccess: true,
        };
      })
      .addCase(wakeServer.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          isError: true,
          message: action.payload as string,
          user: null,
        };
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
