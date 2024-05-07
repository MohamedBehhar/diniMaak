import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  test: string;
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
    setUserInfo: (state, action) => {
      console.log("action.payload", action.payload);
      console.log("state", state.user);
      state.test = action.payload.username
      state.user = {
        id: action.payload.id,
        name: action.payload.username,
      };
    },
  },
});
export const { setUserInfo } = userSlice.actions;
export default userSlice.reducer;
