import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  profile_picture: string;
  isAuth?: boolean;
}

interface UserState {
  user: User ;
  loading: boolean;
  test: string;
  error: string | null;
  value: number;
  obj: any;

}

const initialState: UserState = {
  user: {
    id: 0,
    username: "",
    email: "",
    phone_number: "",
    profile_picture: "../assets/user.png",
    isAuth: false,
  },
  loading: false,
  error: null,
  test: "",
  value: 10,
  obj: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.obj = action.payload;
      state.user = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        phone_number: action.payload.phone_number,
        profile_picture: action.payload.profile_picture,
        isAuth: true,
      }
      console.log("state.user === ", state.user);
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    resetUserInfos: (state) => {    
      state.user = {
        id: 0,
        username: "",
        email: "",
        phone_number: "",
        profile_picture: "../assets/user.png",
        isAuth: false,
      }
    }
  },
});
export const { setUserInfo, incrementByAmount, resetUserInfos } = userSlice.actions;
export default userSlice.reducer;
