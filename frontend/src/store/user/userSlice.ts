import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      console.log("setUser", action.payload);
      state.user = action.payload;
	  console.log(state.user);
    },
  },
});

export default userSlice.reducer;
