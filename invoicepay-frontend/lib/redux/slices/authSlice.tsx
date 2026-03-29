import { AuthState, User } from "@/types/auth";
import Cookies from "js-cookie";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axois";

export const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? Cookies.get("token") || null : null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  message: null,
};

//  Helpers

const cookieOptions = {
  expires: 30,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

const clearTokenCookie = () => Cookies.remove("token");

const setTokenCookie = (token: string) =>
  Cookies.set("token", token, cookieOptions);

//  Thunks

/** POST /auth/register */
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    credentials: {
      name: string;
      email: string;
      password: string;
      business_name?: string;
      phone?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/register", credentials);
      const { token, user } = response.data;

      setTokenCookie(token);

      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

/** POST /auth/login */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user, message } = response.data;

      setTokenCookie(token);

      return { token, user, message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  },
);

/** POST /auth/logout */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout");

      clearTokenCookie();

      return response.data.message as string;
    } catch (error: any) {
      // Even if the server call fails, clear local state
      clearTokenCookie();
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

/** GET /auth/me */
export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data as User;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

/** PUT /auth/profile/{user} */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    payload: {
      userId: number | string;
      data: {
        name?: string;
        business_name?: string | null;
        phone?: string | null;
        address?: string | null;
        paystack_secret_key?: string | null;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(
        `/auth/profile/${payload.userId}`,
        payload.data,
      );
      const { user, message } = response.data;
      return { user, message } as { user: User; message: string };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

/** POST /auth/logo  (multipart/form-data) */
export const uploadLogo = createAsyncThunk(
  "auth/uploadLogo",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await api.post("/auth/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Returns { message, path }; fetch fresh user or patch logo locally
      return response.data as { message: string; path: string };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Logo upload failed",
      );
    }
  },
);



//  Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers(builder) {
    //  Register 
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    //  Login 
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    //  Logout 
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {

        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    //  Fetch Me 
    builder
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        clearTokenCookie();
      });

    //  Update Profile 
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    //  Upload Logo 
    builder
      .addCase(uploadLogo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadLogo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;

        if (state.user) {
          state.user.business_logo = action.payload.path;
        }
      })
      .addCase(uploadLogo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessage, setToken, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;